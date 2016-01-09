/**
 * Author: Munirathinavel C
 * 
 * This file is used for handling all DB actions (insert, update, read, delete)
 * on organization collection.
 */

var env = 'local';

var mongoRef = require('./server.js');

var organization = function(req, res) {

	var body = ""; // request body
	var jsonData;

	req.on('data', function(data) {
		body += data.toString(); // convert data to string and append it to
		// request body
	});

	req.on('end', function() {
		console.log(body);
		jsonData = JSON.parse(body); // request is finished receiving data,
		// parse it
		console.log("jsonData on Organization JS===>>"
				+ JSON.stringify(jsonData));

		jsonData.organization_id = mongoRef.nextSequence("organization_seq");

		console.log("jsonData on Organization JS= after sequence==>>"
				+ JSON.stringify(jsonData));

		mongoRef.insert(jsonData, 'organization', res);
	});

};

module.exports = function() {
	var express = require('express');
	var app = express();

	// Router mapping.
	app.post('/organization', organization);

	return app;
}();