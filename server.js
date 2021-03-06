"use strict";

require('babel/register');

const nodeEnv = process.env.NODE_ENV || 'production';
const serverPort = process.env.PORT || 31415;

if (nodeEnv !== 'development') {
	require('newrelic');
}



/**
 * Module dependencies
 */

const express = require('express');
const app = express();



/**
* Middleware
*/

const morgan = require('morgan');
const errorHandler = require('errorhandler');



/**
* Configuration
*/


// all environments
app.set('port', serverPort);
app.set('env', nodeEnv);
app.set('view engine', 'jade');
app.set('view engine', 'jade');


if (app.get('env') === 'development') {
	app.use(errorHandler({ dumpExceptions: true, showStack: true }));
	app.locals.pretty = true;
	app.use(morgan('dev'));
	app.set('view cache', false);
}
else {
	app.use(errorHandler());
	app.use(morgan('common'));
	app.set('view cache', true);
}

app.use(express.static('./public'));

app.use(require('cookie-parser')());
app.use(function(req, res, next) {
	let uaUUID = req.cookies.uaUUID;

	if (!uaUUID) {
    	uaUUID = require('uuid').v4();

		const cookieMaxAge = 1000 * 60 * 60 * 24 * 356 * 2; // 2 years
		res.cookie('uaUUID', uaUUID, { maxAge: cookieMaxAge, httpOnly: true});
	}

	next();
});



/**
* Routes
*/
const routes = require('./routes');
const pie = require('./routes/pie');

app.get('/', routes.index);
app.get('/favicon.ico', function(req, res) {res.redirect('/img/icon.png');});
app.get('/:size?/:values', pie.draw);



/**
* Start Server
*/

app.listen(serverPort, function() {
	console.log('');
	console.log('**************************************************');
	console.log('Express server started');
	console.log('Time:     %d', Date.now());
	console.log('Port:     %d', serverPort);
	console.log('Mode:     %s', nodeEnv);
	console.log('PID:      %s', process.pid);
	console.log('Platform: %s', process.platform);
	console.log('Arch:     %s', process.arch);
	console.log('Node:     %s', process.versions.node);
	console.log('V8:       %s', process.versions.v8);
	console.log('Express: ', JSON.stringify(app.locals.settings));
	console.log('**************************************************');
	console.log('');
});
