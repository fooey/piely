'use strict';


/*
*	Module Globals
*/

const PureRenderMixin = React.addons.PureRenderMixin;





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
	let component = this;
	let props = component.props;

	const src = props.src;
	const size = props.size;

	return <div className="panel panel-primary">
		<div id="exampleUrl" className="panel-heading">
			<a href={src}>http://piely.net{src}</a>
		</div>
		<div id="examplePie" className="panel-body">
			<img src={src} width={size} height={size} />
		</div>
	</div>;
}
