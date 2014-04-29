
/**
 * Module dependencies
 */

const express = require('express');
const http = require('http');
const path = require('path');

const app = module.exports = express();



/**
* Middleware
*/
const morgan = require('morgan');
const errorHandler = require('errorhandler');



/**
* Configuration
*/

if (app.get('env') === 'development') {
	app.use(errorHandler({ dumpExceptions: true, showStack: true }));
	app.locals.pretty = true;
	app.use(morgan('dev'));
}
else {
	app.use(errorHandler());
	app.use(morgan());
}

// all environments
app.set('port', process.env.PORT || 31415);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));



/**
* Routes
*/
const routes = require('./routes');
const pie = require('./routes/pie');

app.get('/', routes.index);
app.get('/favicon.ico', function(req, res) {res.status(404).send('Not found');});
app.get('/:size/:values', pie.draw);
app.get('/:values', pie.draw);



/**
* Start Server
*/

console.log(Date.now(), 'Running Node.js ' + process.version + ' with flags "' + process.execArgv.join(' ') + '"');
http.createServer(app).listen(app.get('port'), function() {
  console.log(Date.now(), 'Express server listening on port ' + app.get('port'));
});
