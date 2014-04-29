"use strict";

const util = require('util');
const async = require('async');


const defaultSize = 256;
const defaultPadding = '5';

const defaultBg = 'none';
const defaultFills = '#a94442,#31708f,#3c763d,#a6cee3,#b2df8a,#fb9a99,#e31a1c,#fdbf6f,#ff7f00,#cab2d6,#6a3d9a,#ffff99,#b15928'.split(',');

const defaultStroke = '#fff';
const defaultStrokeWidth = '1%';


exports.draw = function(req, res) {


	/*
	*	Determine Chart Options
	*/

	var size = (req.query.size)
		? parseInt(req.query.size)
		: defaultSize;

	var padding = (req.query.padding)
		? parseInt(req.query.padding)
		: defaultPadding;

	var bgColor = (req.query.bgColor)
		? req.query.bgColor.replace('$', '#')
		: defaultBg;

	var fillColors = (req.query.fill)
		? req.query.fill.replace(/\$/g, '#').split(',')
		: defaultFills;

	var strokeColor = (req.query.stroke)
		? req.query.stroke.replace(/\$/g, '#')
		: defaultStroke;

	var strokeWidth = (req.query.strokeWidth)
		? req.query.strokeWidth.replace(/\$/g, '%')
		: defaultStrokeWidth;


	var urlValues = req.params.values.split(',');
	var values = [];

	urlValues.forEach(function(val) {
		var n = parseFloat(val);
		if (!isNaN(n)) values.push(n);
	});


	var sum = values.reduce(function(prev, cur) {return prev + cur;});
	var angles = values.map(function(val) {return 360 * val / sum;});




	/*
	*
	*	Create and Serve the SVG
	*
	*/

	async.waterfall([
		generateSvg,
		optimizeSvg,
		compressSvg,
		serveSvg,
	], function(err, result) {
		process.nextTick(reportToGA);
	});







	/*
	*	Private Methods
	*/


	function generateSvg(callback) {
		callback(null, [
			getSvgStyle(size),
			'<desc>Created at http://piely.net</desc>',
			getSvgRect(size, bgColor),
			getSvgPaths(size, angles).join(''),
			'</svg>'
		].join(''));
	}



	function optimizeSvg(svg, callback) {
		const svgo = new (require('svgo'));

		svgo.optimize(svg, function(result) {
			callback(null, result.data);
		});
	}



	function compressSvg(svg, callback) {
		require('zlib').gzip(svg, callback);
	}



	function serveSvg(svg, callback) {
		const cacheTime = 60 * 60 * 24 * 7; // 7 Days

		res.writeHead(200, {
			'Content-Type': 'image/svg+xml',
			'Content-Encoding': 'gzip',
			'Cache-Control': 'public, max-age=' + (cacheTime),
			'Expires': new Date(Date.now() + (cacheTime * 1000)).toUTCString(),
		});

		res.end(svg);

		callback(null);
	}



	function reportToGA() {
		const referer = req.get('referer');
		const ua = require('universal-analytics');
		const uaUUID = (req.cookies && req.cookies.uaUUID) ? req.cookies.uaUUID : null;
		const visitor = ua('UA-51384-41', uaUUID);

		// Visitor#event(category, action, label, value)
		console.log('reportToGA()');
		visitor.event('piechart-hotlink', referer, values.join(','), size).send();
	};










	/*
	*	SVG Generation Helpers
	*/


	function getSvgPaths(size, angles) {
		var shapes = [];

		var radius = size / 2;
		var pieWidth = Math.round(radius - (padding / 2));

		var startAngle;
		var endAngle = 0;

		for (let i = 0; i < angles.length; i++) {
	        startAngle = endAngle;
	        endAngle = startAngle + angles[i];

	        let coords = getCoords(startAngle, endAngle, radius, pieWidth);

			let pathAttribs = getPathAttribs(i);
			let path = util.format(
				"M%d,%d L%d,%d A%d,%d 0 %d,1 %d,%d z",
				radius, radius,
				coords[0].x, coords[0].y,
				pieWidth, pieWidth,
				isLargeAngle(startAngle, endAngle),
				coords[1].x, coords[1].y
			);

			let shape = util.format('<path %s d="%s"></path>', pathAttribs, path);

			shapes.push(shape);
		}

		return shapes;
	}


	function getCoords(startAngle, endAngle, radius, pieWidth) {
		let startRadians = (Math.PI * startAngle / 180);
		let endRadians = (Math.PI * endAngle / 180);

		return [{
			x: Math.round(radius + pieWidth * Math.cos(startRadians)),
			y: Math.round(radius + pieWidth * Math.sin(startRadians))
		}, {
			x: Math.round(radius + pieWidth * Math.cos(endRadians)),
			y: Math.round(radius + pieWidth * Math.sin(endRadians))
		}];
	}


	function getPathAttribs(i) {
		var attribs = [];
		if (strokeWidth !== '0' && strokeWidth !== '0%') {
			attribs.push(util.format('stroke="%s"', strokeColor));
			attribs.push(util.format('stroke-width="%s"', strokeWidth));
		}

		attribs.push(util.format('fill="%s"', getFillColor(i)));

		return attribs.join(' ');
	}


	function isLargeAngle(startAngle, endAngle) {
		return (endAngle - startAngle > 180) ? 1 : 0;
	}


	function getSvgStyle(size) {
		return util.format('<svg height="%d" width="%d" version="1.1" xmlns="http://www.w3.org/2000/svg">', size, size);
	}


	function getSvgRect(size, bgColor) {
		return util.format('<rect x="0" y="0" width="%d" height="%d" fill="%s" stroke="none"></rect>', size, size, bgColor);
	}


	function getFillColor(i) {
		return fillColors[i % fillColors.length];
	}

};
