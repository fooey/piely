'use strict';


/*
*	Module Globals
*/

var _ = require('lodash');

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

module.exports = React.createClass({
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

	return <form className="form-horizontal">
		<div className="row">
			<div className="col-sm-6">
				<div className="panel panel-info">
					<div className="panel-heading">Pie Slices</div>
					<div className="panel-body">

						<SliceInputs
							slices={state.slices}
							sliceControls={sliceControls}
						/>

					</div>
				</div>
			</div>
			<div className="col-sm-6">
				<div className="panel panel-info">
					<div className="panel-heading">Display Options</div>
					<div className="panel-body">

						<div className="form-group">
							<label htmlFor="size" className="control-label col-sm-4">
								Size
							</label>
							<div className="col-sm-4">
								<input
									className="form-control"
									name="size"
									id="size"
									type="number"
									min="0"
									required="required"
									value={state.size}
									onChange={component.setGeneric.bind(component, 'size', _.parseInt)}
								/>
							</div>
						</div>

						<div className="form-group">
							<label htmlFor="bgColor" className="control-label col-sm-4">
								BG Color
							</label>
							<div className="col-sm-8">
								<div className="input-group">
									<span className="input-group-addon">
										<input
											type="checkbox"
											checked={state.bgEnabled}
											onChange={component.toggleBgEnabled}
										/>
									</span>
									<input
										className="form-control"
										name="bgColor"
										id="bgColor"
										type="color"
										required="required"
										value={state.bgColor}
										onChange={component.setGeneric.bind(component, 'bgColor', _.identity)}
										disabled={!state.bgEnabled}
									/>
								</div>
							</div>
						</div>

						<div className="form-group">
							<label htmlFor="stroke" className="control-label col-sm-4">
								Border Color
							</label>
							<div className="col-sm-8">
								<input
									className="form-control"
									name="stroke"
									id="stroke"
									type="color"
									required="required"
									value={state.stroke}
									onChange={component.setGeneric.bind(component, 'stroke', _.identity)}
								/>
							</div>
						</div>

						<div className="form-group">
							<label htmlFor="strokeWidth" className="control-label col-sm-4">
								Border Size
							</label>
							<div className="col-sm-4 col-xs-6">
								<input
									className="form-control"
									name="strokeWidth"
									id="strokeWidth"
									type="number"
									min="0"
									required="required"
									value={state.strokeWidth}
									onChange={component.setGeneric.bind(component, 'strokeWidth', _.parseInt)}
								/>
							</div>
							<div className="col-sm-4 col-xs-6">
								<label className="radio-inline">
									<input
										name="strokeMode"
										id="strokeModePct"
										required="required"
										value='%'
										type="radio"
										checked={state.strokeMode === '%'}
										onChange={component.setGeneric.bind(component, 'strokeMode', _.identity)}
									/>%
								</label>

								<label className="radio-inline">
									<input
										name="strokeMode"
										id="strokeModePx"
										required="required"
										value='px'
										type="radio"
										checked={state.strokeMode === 'px'}
										onChange={component.setGeneric.bind(component, 'strokeMode', _.identity)}
									/>px
								</label>

							</div>
						</div>

						<div className="form-group">
							<label htmlFor="fills" className="control-label col-sm-4">
								Slice Colors
							</label>
							<div className="col-sm-8">
								<input
									className="form-control"
									name="fills"
									id="fills"
									type="text"
									required="required"
									value={state.fills}
									onChange={component.setGeneric.bind(component, 'fills', _.identity)}
								/>
							</div>
						</div>


					</div>
				</div>
			</div>
		</div>

		<Example
			src={component.getSrc()}
			size={state.size}
		/>

	</form>;
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
