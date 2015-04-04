"use strict";

const zlib = require('zlib');

const async = require('async');
// const SVGO = require('svgo');


exports.createSvg = function(sliceValues, chartOptions, callback) {

	let INSTANCE = {};

	INSTANCE.sum = sliceValues.reduce((total, val) => total + val);
	INSTANCE.angles = sliceValues.map((val) => 360 * val / INSTANCE.sum);
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
		].join('\n'));
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
		let slices = [];

		angles.forEach((thisAngle, i) => {
			let startAngle = (i) ? slices[i - 1].endAngle : 0;
			let endAngle = startAngle + thisAngle;
			let isLargeAngle = (endAngle - startAngle > 180) ? 1 : 0;

			slices.push({startAngle, endAngle, isLargeAngle});
		});

		return slices;
	}


	function getSvgStyle() {
		const height = chartOptions.size;
		const width = chartOptions.size;
		const viewport = `0 0 ${height} ${width}`;

		return `<svg height="${height}" width="${width}" viewport="${viewport}" xmlns="http://www.w3.org/2000/svg" class="piely-chart">`;
	}


	function getSvgRect() {
		if (!chartOptions.bgColor || chartOptions.bgColor === 'none') {
			return '';
		}

		const fill = chartOptions.bgColor;
		const d = `M0 0h${chartOptions.size}v${chartOptions.size}h-${chartOptions.size}z`;

		return `<path fill="${fill}" d="${d}" class="piely-background" />`;
	}


	function getSvgPaths() {
		let shapes = [];

		const radius = chartOptions.size / 2;
		const pieWidth = Math.round(radius - (chartOptions.padding / 2));

		if (INSTANCE.slices.length === 1) {
			shapes[0] = `<circle ${getPathAttribs(0)} cx="${radius}" cy="${radius}" r="${pieWidth}" />`;
		}
		else {
			INSTANCE.slices.forEach((slice, sliceIndex) => {
				const coords = getCoords(slice, radius, pieWidth);

				const path = [
					`M${radius},${radius}`,
					`L${coords.start.x},${coords.start.y}`,
					`A${pieWidth},${pieWidth}`,
					`0`,
					`${slice.isLargeAngle},1`,
					`${coords.end.x},${coords.end.y}`,
					`z`,
				].join(' ');

				shapes.push(`<path ${getPathAttribs(sliceIndex)} d="${path}" class="piely-slice piely-slice-${sliceIndex+1}"/>`);

			});
		}

		return shapes;
	}


	function getCoords(slice, radius, pieWidth) {
		const startRadians = (Math.PI * slice.startAngle / 180);
		const endRadians = (Math.PI * slice.endAngle / 180);

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
		let attribs = [];
		if (chartOptions.strokeWidth !== '0' && chartOptions.strokeWidth !== '0%') {
			attribs.push(`stroke="${chartOptions.strokeColor}"`);
			attribs.push(`stroke-width="${chartOptions.strokeWidth}"`);
		}

		attribs.push(`fill="${getFillColor(index)}"`);

		return attribs.join(' ');
	}


	function getFillColor(index) {
		return chartOptions.fillColors[index % chartOptions.fillColors.length];
	}

};
