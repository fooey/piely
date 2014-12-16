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
