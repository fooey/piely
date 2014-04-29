/*!
*
*	app
*
!*/

angular.module('pieApp', ['ngAnimate'])
	.controller('AppCtrl', ['$scope', function($scope) {
		'use strict';

		var defaultSize = 256;
		var defaultPadding = '5';

		var defaultBg = 'none';
		var defaultFills = '#a94442,#31708f,#3c763d,#a6cee3,#b2df8a,#fb9a99,#e31a1c,#fdbf6f,#ff7f00,#cab2d6,#6a3d9a,#ffff99,#b15928'.split(',');

		var defaultStroke = '#fff';
		var defaultStrokeWidth = 1;
		var defaultStrokeMode = '%';



		$scope.extension = '.svg';
		$scope.pieSlices = [4, 5, 6];

		$scope.size = defaultSize;
		$scope.padding = defaultPadding;

		$scope.bgColor = defaultBg;
		$scope.fillColors = defaultFills;

		$scope.strokeColor = defaultStroke;
		$scope.strokeWidth = defaultStrokeWidth;
		$scope.strokeMode = defaultStrokeMode;


		$scope.pieSrc = function() {
			var src = '/';
			var params = [];

			if ($scope.size !== defaultSize) {
				src += $scope.size + '/';
			}

			src += $scope.pieSlices + $scope.extension;

			// params = setSize(params);
			params = setBg(params);
			params = setStrokeWidth(params);
			params = setStrokeColor(params);
			params = setFillColers(params);

			if (params.length) {
				src += '?' + params.join('&');
			}

			return src;
		};



		function setBg(params) {
			if ($scope.bgColor.length && $scope.bgColor !== defaultBg) {
				var bgColor = $scope.bgColor.replace(/#/, '$');
				params.push('bgColor=' + bgColor);
			}

			return params;
		}



		function setFillColers(params) {
			if ($scope.bgColor.length && $scope.bgColor !== defaultBg) {
				var bgColor = $scope.bgColor.replace(/#/, '$');
				params.push('bgColor=' + bgColor);
			}

			return params;
		}


		function setStrokeColor(params) {
			if ($scope.fillColors !== defaultFills) {
				var fillColors = $scope.fillColors.replace(/#/g, '$');
				params.push('fill=' + fillColors);
			}
			return params;
		}


		function setStrokeWidth(params) {
			if ($scope.strokeWidth !== defaultStrokeWidth || $scope.strokeMode !== defaultStrokeMode) {
				var strokeWidth = $scope.strokeWidth;
				if ($scope.strokeMode === '%') {
					strokeWidth += '$';
				}

				params.push('strokeWidth=' + strokeWidth);
			}
			return params;
		}




		function reduceArray(array, toSize) {
			while (array.length > toSize) {
				array.pop();
			}
			return array;
		}

		function expandArray(array, toSize) {
			while (array.length < toSize) {
				array.push(0);
			}
			return array;
		}


	}]);
