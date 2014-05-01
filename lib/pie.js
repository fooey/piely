"use strict";

const util = require('util');
const zlib = require('zlib');

const async = require('async');
const SVGO = require('svgo');


exports.createSvg = function(sliceValues, chartOptions, callback) {

	var INSTANCE = {};

	INSTANCE.sum = sliceValues.reduce(function(prev, cur) {return prev + cur;});
	INSTANCE.angles = sliceValues.map(function(val) {return 360 * val / INSTANCE.sum;});
 	INSTANCE.slices = calcSlices(INSTANCE.angles);




	/*
	*
	*	Generate, Optimize, Compress and Return
	*
	*/

	async.waterfall([
		generateSvg,
		// optimizeSvg, // strips viewport; not using for now
		zlib.gzip,
	], function(err, result) {
		callback(null, result);
	});







	/*
	*	Private Methods
	*/


	function generateSvg(callback) {
		callback(null, [
			getSvgStyle(),
			'<desc>Created at http://piely.net</desc>',
			getSvgRect(),
			getSvgPaths().join(''),
			'</svg>'
		].join(''));
	}



	// function optimizeSvg(svg, callback) {
	// 	const svgo = new SVGO();

	// 	svgo.optimize(svg, function(result) {
	// 		callback(null, result.data);
	// 	});
	// }










	/*
	*	SVG Generation Helpers
	*/

	function calcSlices(angles) {
		var slices = [];

		angles.forEach(function(thisAngle, i) {
			let startAngle = (i) ? slices[i - 1].endAngle : 0;
			let endAngle = startAngle + thisAngle;
			let isLargeAngle = (endAngle - startAngle > 180) ? 1 : 0;

			slices.push({
				startAngle: startAngle,
				endAngle: endAngle,
				isLargeAngle: isLargeAngle,
			});
		});

		return slices;
	}


	function getSvgStyle() {
		return util.format(
			'<svg height="%d" width="%d" viewport="0 0 %d %d" xmlns="http://www.w3.org/2000/svg" class="piely-chart">',
			chartOptions.size,
			chartOptions.size,
			chartOptions.size,
			chartOptions.size
		);
	}


	function getSvgRect() {
		// return util.format('<rect x="0" y="0" width="%d" height="%d" fill="%s" stroke="none"/>', chartOptions.size, chartOptions.size, chartOptions.bgColor);
		var rect = (chartOptions.bgColor !== 'none')
			? util.format('<path fill="%s" d="M0 0h%dv%dh-%dz"/ class="piely-background">', chartOptions.bgColor, chartOptions.size, chartOptions.size, chartOptions.size)
			: '';
		return rect;
	}


	function getSvgPaths() {
		var shapes = [];

		var radius = chartOptions.size / 2;
		var pieWidth = Math.round(radius - (chartOptions.padding / 2));

		INSTANCE.slices.forEach(function(slice, sliceIndex) {
	        let coords = getCoords(slice, radius, pieWidth);

			let pathAttribs = getPathAttribs(sliceIndex);
			let path = util.format(
				"M%d,%d L%d,%d A%d,%d 0 %d,1 %d,%d z",
				radius, radius,
				coords.start.x, coords.start.y,
				pieWidth, pieWidth,
				slice.isLargeAngle,
				coords.end.x, coords.end.y
			);

			let shape = util.format('<path %s d="%s" class="piely-slice piely-slice-%d"/>', pathAttribs, path, sliceIndex);

			shapes.push(shape);

		});

		return shapes;
	}


	function getCoords(slice, radius, pieWidth) {
		let startRadians = (Math.PI * slice.startAngle / 180);
		let endRadians = (Math.PI * slice.endAngle / 180);

		return {
			start: {
				x: Math.round(radius + pieWidth * Math.cos(startRadians)),
				y: Math.round(radius + pieWidth * Math.sin(startRadians))
			},
			end: {
				x: Math.round(radius + pieWidth * Math.cos(endRadians)),
				y: Math.round(radius + pieWidth * Math.sin(endRadians))
			}
	};
	}


	function getPathAttribs(index) {
		var attribs = [];
		if (chartOptions.strokeWidth !== '0' && chartOptions.strokeWidth !== '0%') {
			attribs.push(util.format('stroke="%s"', chartOptions.strokeColor));
			attribs.push(util.format('stroke-width="%s"', chartOptions.strokeWidth));
		}

		attribs.push(util.format('fill="%s"', getFillColor(index)));

		return attribs.join(' ');
	}


	function getFillColor(index) {
		return chartOptions.fillColors[index % chartOptions.fillColors.length];
	}

};
