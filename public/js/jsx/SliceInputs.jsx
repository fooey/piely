'use strict';


/*
*	Module Globals
*/

var PureRenderMixin = React.addons.PureRenderMixin;





/*
*	Module Export
*/

module.exports = React.createClass({
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

	return <div id="slice-inputs">
		{_.map(slices, function(sliceValue, ixSlice) {return (
			<div className="form-group" key={ixSlice}>
				<div className="input-group">

					<input
						className="form-control slice"
						type="number"
						min="0"
						required="required"
						value={sliceValue}
						onChange={sliceControls.update.bind(null, ixSlice)}
					/>

					<span className="input-group-addon">
						<i
							className="sliceDeleter fa fa-times"
							title="Remove Slice"
							onClick={sliceControls.remove.bind(null, ixSlice)}
						/>
					</span>

				</div>
			</div>
		);})}

		<div className="form-group">
			<div className="button btn btn-success btn-block" onClick={sliceControls.append}>
				<div className="fa fa-plus"> &nbsp; Add Slice</div>
			</div>
		</div>
	</div>;
}
