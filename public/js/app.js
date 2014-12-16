'use strict';

var $ = require('jquery');

var Builder = React.createFactory(require('./jsx/Builder.jsx'));

$(function() {
	React.render(
		Builder(),
		document.getElementById('builder')
	);
});

