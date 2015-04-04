'use strict';

require('babel/polyfill');

var $ = require('jquery');

var Builder = React.createFactory(require('./jsx/Builder.jsx'));

$(function() {
	React.render(
		Builder(),
		document.getElementById('builder')
	);
});

