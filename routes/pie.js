"use strict";

const _ = require('lodash');

const pie = require('../lib/pie')


const defaultOptions = {
	size: 256,
	padding: '5',

	bgColor: 'none',
	fillColors: '#a94442,#31708f,#3c763d,#a6cee3,#b2df8a,#fb9a99,#e31a1c,#fdbf6f,#ff7f00,#cab2d6,#6a3d9a,#ffff99,#b15928'.split(','),

	strokeColor: '#fff',
	strokeWidth: '1%',
};


exports.draw = function(req, res) {

	var urlOptions = {
		size: (req.params.size) ? parseInt(req.params.size) : undefined,
		padding: (req.query.padding) ? parseInt(req.query.padding) : undefined,

		bgColor: (req.query.bgColor) ? req.query.bgColor.replace('$', '#') : undefined,
		fillColors: (req.query.fill) ? req.query.fill.replace(/\$/g, '#').split(',') : undefined,

		strokeColor: (req.query.stroke) ? req.query.stroke.replace(/\$/g, '#') : undefined,
		strokeWidth: (req.query.strokeWidth) ? req.query.strokeWidth.replace(/\$/g, '%') : undefined,
	};


	var values = cleanValues(req.params.values.split(','));
	var chartOptions = _.defaults(urlOptions, defaultOptions);




	/*
	*
	*	Serve the SVG
	*
	*/

	pie.createSvg(values, chartOptions, function(err, svg) {
		const cacheTime = 60 * 60 * 24 * 7; // 7 Days

		res.writeHead(200, {
			'Content-Type': 'image/svg+xml',
			'Content-Encoding': 'gzip',
			'Cache-Control': 'public, max-age=' + (cacheTime),
			'Expires': new Date(Date.now() + (cacheTime * 1000)).toUTCString(),
		});

		res.end(svg);

		process.nextTick(reportToGA);

	});








	function cleanValues(dirty) {
		var clean = [];

		dirty.forEach(function(val) {
			var n = parseFloat(val);
			if (!isNaN(n)) {
				clean.push(n)
			};
		});

		return clean;
	}


	function reportToGA() {
		const referer = req.get('referer');
		const ua = require('universal-analytics');
		const uaUUID = (req.cookies && req.cookies.uaUUID) ? req.cookies.uaUUID : null;
		const visitor = ua('UA-51384-41', uaUUID);

		// Visitor#event(category, action, label, value)
		visitor.event('piechart-hotlink', referer, values.join(','), chartOptions.size).send();
	};

};
