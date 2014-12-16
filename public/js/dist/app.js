(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

var $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);

var Builder = React.createFactory(require('./jsx/Builder.jsx'));

$(function() {
	React.render(
		Builder(),
		document.getElementById('builder')
	);
});


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./jsx/Builder.jsx":2}],2:[function(require,module,exports){
(function (global){
'use strict';


/*
*	Module Globals
*/

var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

var SliceInputs = require('./SliceInputs.jsx');
var Example = require('./Example.jsx');


var defaults = {
	size: 256,
	padding: 5,

	bgColor: '#ffffff',
	bgEnabled: false,
	fills: '#a94442,#31708f,#3c763d,#a6cee3,#b2df8a,#fb9a99,#e31a1c,#fdbf6f,#ff7f00,#cab2d6,#6a3d9a,#ffff99,#b15928',

	stroke: '#ffffff',
	strokeWidth: 1,
	strokeMode: '%',
};





/*
*
*	Module Export
*
*/

module.exports = React.createClass({displayName: 'exports',
	mixins: [
		require('./lib/builder-sliceInputs.js'),
	],
	getInitialState: getInitialState,
	render: render,
	componentDidUpdate: componentDidUpdate,

	getSrc: getSrc,

	setGeneric: setGeneric,
	toggleBgEnabled: toggleBgEnabled,
});





/*
*
*	Component Lifecycle
*
*/

function getInitialState() {
	var initialState = _.defaults(
		{slices: [4,5,6]},
		defaults
	);

	return initialState;
}



function render() {
	var component = this;
	var state = component.state;

	var sliceControls = {
		update: component.sliceUpdate,
		append: component.sliceAppend,
		remove: component.sliceRemove,
	};

	// console.log('slices', state);

	return React.createElement("form", {className: "form-horizontal"}, 
		React.createElement("div", {className: "row"}, 
			React.createElement("div", {className: "col-sm-6"}, 
				React.createElement("div", {className: "panel panel-info"}, 
					React.createElement("div", {className: "panel-heading"}, "Pie Slices"), 
					React.createElement("div", {className: "panel-body"}, 

						React.createElement(SliceInputs, {
							slices: state.slices, 
							sliceControls: sliceControls}
						)

					)
				)
			), 
			React.createElement("div", {className: "col-sm-6"}, 
				React.createElement("div", {className: "panel panel-info"}, 
					React.createElement("div", {className: "panel-heading"}, "Display Options"), 
					React.createElement("div", {className: "panel-body"}, 

						React.createElement("div", {className: "form-group"}, 
							React.createElement("label", {htmlFor: "size", className: "control-label col-sm-4"}, 
								"Size"
							), 
							React.createElement("div", {className: "col-sm-4"}, 
								React.createElement("input", {
									className: "form-control", 
									name: "size", 
									id: "size", 
									type: "number", 
									min: "0", 
									required: "required", 
									value: state.size, 
									onChange: component.setGeneric.bind(component, 'size', _.parseInt)}
								)
							)
						), 

						React.createElement("div", {className: "form-group"}, 
							React.createElement("label", {htmlFor: "bgColor", className: "control-label col-sm-4"}, 
								"BG Color"
							), 
							React.createElement("div", {className: "col-sm-8"}, 
								React.createElement("div", {className: "input-group"}, 
									React.createElement("span", {className: "input-group-addon"}, 
										React.createElement("input", {
											type: "checkbox", 
											checked: state.bgEnabled, 
											onChange: component.toggleBgEnabled}
										)
									), 
									React.createElement("input", {
										className: "form-control", 
										name: "bgColor", 
										id: "bgColor", 
										type: "color", 
										required: "required", 
										value: state.bgColor, 
										onChange: component.setGeneric.bind(component, 'bgColor', _.identity), 
										disabled: !state.bgEnabled}
									)
								)
							)
						), 

						React.createElement("div", {className: "form-group"}, 
							React.createElement("label", {htmlFor: "stroke", className: "control-label col-sm-4"}, 
								"Border Color"
							), 
							React.createElement("div", {className: "col-sm-8"}, 
								React.createElement("input", {
									className: "form-control", 
									name: "stroke", 
									id: "stroke", 
									type: "color", 
									required: "required", 
									value: state.stroke, 
									onChange: component.setGeneric.bind(component, 'stroke', _.identity)}
								)
							)
						), 

						React.createElement("div", {className: "form-group"}, 
							React.createElement("label", {htmlFor: "strokeWidth", className: "control-label col-sm-4"}, 
								"Border Size"
							), 
							React.createElement("div", {className: "col-sm-4 col-xs-6"}, 
								React.createElement("input", {
									className: "form-control", 
									name: "strokeWidth", 
									id: "strokeWidth", 
									type: "number", 
									min: "0", 
									required: "required", 
									value: state.strokeWidth, 
									onChange: component.setGeneric.bind(component, 'strokeWidth', _.parseInt)}
								)
							), 
							React.createElement("div", {className: "col-sm-4 col-xs-6"}, 
								React.createElement("label", {className: "radio-inline"}, 
									React.createElement("input", {
										name: "strokeMode", 
										id: "strokeModePct", 
										required: "required", 
										value: "%", 
										type: "radio", 
										checked: state.strokeMode === '%', 
										onChange: component.setGeneric.bind(component, 'strokeMode', _.identity)}
									), "%"
								), 

								React.createElement("label", {className: "radio-inline"}, 
									React.createElement("input", {
										name: "strokeMode", 
										id: "strokeModePx", 
										required: "required", 
										value: "px", 
										type: "radio", 
										checked: state.strokeMode === 'px', 
										onChange: component.setGeneric.bind(component, 'strokeMode', _.identity)}
									), "px"
								)

							)
						), 

						React.createElement("div", {className: "form-group"}, 
							React.createElement("label", {htmlFor: "fills", className: "control-label col-sm-4"}, 
								"Slice Colors"
							), 
							React.createElement("div", {className: "col-sm-8"}, 
								React.createElement("input", {
									className: "form-control", 
									name: "fills", 
									id: "fills", 
									type: "text", 
									required: "required", 
									value: state.fills, 
									onChange: component.setGeneric.bind(component, 'fills', _.identity)}
								)
							)
						)


					)
				)
			)
		), 

		React.createElement(Example, {
			src: component.getSrc(), 
			size: state.size}
		)

	);
}



function componentDidUpdate(prevProps, prevState) {
	var component = this;
	var state = component.state;
}





/*
*
*	Event Handlers
*
*/

function setGeneric(key, fn, event) {
	var component = this;
	var state = component.state;

	var toSet = {};
	toSet[key] = fn(event.target.value);

	component.setState(toSet);
}



function toggleBgEnabled(event) {
	var component = this;
	var state = component.state;

	component.setState({bgEnabled: event.target.checked});
}




/*
*
*	Component Helpers
*
*/

function getSrc() {
	var component = this;
	var state = component.state;

	var src = 'http://www.piely.net/';
	var params = [];

	if (state.size !== defaults.size) {
		src += state.size + '/';
	}

	src += state.slices.join(',') + '.svg';

	if (state.bgEnabled) {
		params.push('bgColor=' + state.bgColor.replace(/#/g, '$'));
	}

	if (state.stroke !== defaults.stroke) {
		params.push('stroke=' + state.stroke.replace(/#/g, '$'));
	}

	if (state.strokeWidth !== defaults.strokeWidth || state.strokeMode !== '%') {
		var strokeWidth = state.strokeWidth;
		if (state.strokeMode === '%') {
			strokeWidth += '$';
		}
		params.push('strokeWidth=' + strokeWidth);
	}

	if (state.fills !== defaults.fills) {
		params.push('fills=' + state.fills.replace(/#/g, '$'));
	}


	if (params.length) {
		src += '?' + params.join('&');
	}

	return src;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Example.jsx":3,"./SliceInputs.jsx":4,"./lib/builder-sliceInputs.js":5}],3:[function(require,module,exports){
'use strict';


/*
*	Module Globals
*/

var PureRenderMixin = React.addons.PureRenderMixin;





/*
*	Module Export
*/

module.exports = React.createClass({displayName: 'exports',
	mixins: [PureRenderMixin],

	render: render,
});





/*
*	React Lifecycle
*/

function render() {
	var component = this;
	var props = component.props;

	var src = props.src;
	var size = props.size;

	return React.createElement("div", {className: "panel panel-primary"}, 
		React.createElement("div", {id: "exampleUrl", className: "panel-heading"}, 
			React.createElement("a", {href: src}, src)
		), 
		React.createElement("div", {id: "examplePie", className: "panel-body"}, 
			React.createElement("img", {src: src, width: size, height: size})
		)
	);
}

},{}],4:[function(require,module,exports){
'use strict';


/*
*	Module Globals
*/

var PureRenderMixin = React.addons.PureRenderMixin;





/*
*	Module Export
*/

module.exports = React.createClass({displayName: 'exports',
	mixins: [PureRenderMixin],

	render: render,
});





/*
*	React Lifecycle
*/

function render() {
	var sliceControls = this;
	var props = sliceControls.props;

	var slices = props.slices;
	var sliceControls = props.sliceControls;

	return React.createElement("div", {id: "slice-inputs"}, 
		_.map(slices, function(sliceValue, ixSlice) {return (
			React.createElement("div", {className: "form-group", key: ixSlice}, 
				React.createElement("div", {className: "input-group"}, 

					React.createElement("input", {
						className: "form-control slice", 
						type: "number", 
						min: "0", 
						required: "required", 
						value: sliceValue, 
						onChange: sliceControls.update.bind(null, ixSlice)}
					), 

					React.createElement("span", {className: "input-group-addon"}, 
						React.createElement("i", {
							className: "sliceDeleter fa fa-times", 
							title: "Remove Slice", 
							onClick: sliceControls.remove.bind(null, ixSlice)}
						)
					)

				)
			)
		);}), 

		React.createElement("div", {className: "form-group"}, 
			React.createElement("div", {className: "button btn btn-success btn-block", onClick: sliceControls.append}, 
				React.createElement("div", {className: "fa fa-plus"}, "   Add Slice")
			)
		)
	);
}

},{}],5:[function(require,module,exports){
'use strict';


module.exports = {
	componentDidUpdate: componentDidUpdate,
	sliceUpdate: sliceUpdate,
	sliceAppend: sliceAppend,
	sliceRemove: sliceRemove,
};



function componentDidUpdate(prevProps, prevState) {
	var component = this;
	var state = component.state;

	if (prevState.slices.length < state.slices.length) {
		$('.slice:last')
			.closest('.form-group')
				.hide()
				.slideDown()
			.end()
			.trigger('focus')
			.trigger('select');
	}
}


function sliceUpdate(sliceIndex, event) {
	var component = this;
	var state = component.state;

	var newSlices = _.cloneDeep(state.slices);

	newSlices[sliceIndex] = _.parseInt(event.target.value);

	component.setState({slices: newSlices});
}



function sliceRemove(sliceIndex, event) {
	var component = this;
	var state = component.state;

	var newSlices = _.cloneDeep(state.slices);

	newSlices.splice(sliceIndex, 1);
	component.setState({slices: newSlices});
}



function sliceAppend(sliceIndex, event) {
	var component = this;
	var state = component.state;

	var newSlices = _.cloneDeep(state.slices);

	newSlices.push(0);

	component.setState({slices: newSlices});
}

},{}]},{},[1]);
