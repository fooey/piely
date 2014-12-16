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
	var component = this;
	var props = component.props;

	var src = props.src;
	var size = props.size;

	return <div className="panel panel-primary">
		<div id="exampleUrl" className="panel-heading">
			<a href={src}>{src}</a>
		</div>
		<div id="examplePie" className="panel-body">
			<img src={src} width={size} height={size} />
		</div>
	</div>;
}
