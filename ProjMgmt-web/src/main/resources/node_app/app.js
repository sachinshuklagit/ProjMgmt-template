/**
 * Auth
 * app.js javascript
 */
var env = 'local';
var express = require('express');
var app = express();
var conf = require('./config/nodeappconfig-'+env+'.js');

// Organizing routes.

app.use('/bidprojservices', require('./register'));
app.use('/bidprojservices', require('./post'));
app.use('/bidprojservices', require('./product'));
app.use('/bidprojservices', require('./retrieveposts'));
app.use('/bidprojservices', require('./organization'));
app.use('/bidprojservices', require('./s3uploads'));

console.log('App is listening to port - '+conf.config.server_ip);
app.listen(conf.config.server_ip);
