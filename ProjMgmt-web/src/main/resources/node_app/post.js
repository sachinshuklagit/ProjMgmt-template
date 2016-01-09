/**
 * Created by jigar on 7/13/2015.
 */

var env = 'local';

console.log('Connected ENV [' + env + ']');


var MongoClient = require('mongodb').MongoClient
    , format = require('util').format
    , Server = require('mongodb').Server
    , ObjectId = require('mongodb').ObjectID
    , mongoRef = require('./server.js');


var postAddAndComments = function (req, res) {

    var body = ""; // request body
    var jsonData;

    req.on('data', function (data) {
        body += data.toString(); // convert data to string and append it to request body
    });

    req.on('end', function () {

        jsonData = JSON.parse(body); // request is finished receiving data, parse it
        console.log(jsonData._id);
        if (jsonData._id != undefined) {
            jsonData._id = ObjectId(jsonData._id);
        }
        jsonData.created_date = new Date();
        jsonData.updated_date = new Date();
        jsonData.post_id=req.params.post_id;
        mongoRef.save(jsonData, 'post', res);

    });


};

var get_post_by_id_fn = function(req, res) {
	var json = {
		"post_id" : parseInt(req.params.post_id)
	};
	mongoRef.find('post', json, function (err, result) {
		var obj = {};
    	if (err) {
    		obj.err.responseHeaderCode = 500;
        	obj.err = err;
        } else {
        	
            if (result.data.length != 0) {
            	obj.code = 200;
                obj.data = result.data; 
            } else {
            	obj.data = {"data":false}; 
            }
        }
    	util.sendResponse(res, obj);
    });
};


var postComments = function(req, res) {
	
	var man=mongoRef.nextSequence('post_comment_seq',function(err,result){
		req.params.comment_id = result;
		postComments_fn(req, res);
	});
	
   
     
};

var postComments_fn = function (req, res) {

    var body = ""; // request body
    var jsonData;

    req.on('data', function (data) {
        body += data.toString(); // convert data to string and append it to request body
    });

    req.on('end', function () {

        jsonData = JSON.parse(body); // request is finished receiving data, parse it
        jsonData.detail.created_date = new Date();
        
        jsonData.detail.comment_id = req.params.comment_id;
        console.log(jsonData.detail.comment_id);
        var criteria = null;
        if(!jsonData.criteria.isParent){
        	
        	criteria = {
        			"post_id": jsonData.criteria.post_id,
        			"comment.comment_id": jsonData.criteria.parent_id
                };
        }else{
        	criteria = {
                    "post_id": jsonData.criteria.post_id
                };
        }
        var fields =jsonData.detail;
        
      mongoRef.pushToComments('post','comment',criteria,jsonData,function(err,result){
    	var obj = {};
      	if (err) {
      		obj.err.responseHeaderCode = 500;
          	obj.err = err;
          } else {
          	
              if (result.isSuccess) {
              	obj.code = 200;
                obj.data = {"pushed":true,"comment":jsonData.detail};
              } else {
              	obj.data = {"pushed":false}; 
              }
          }
      	util.sendResponse(res, obj);
      });

    });


};


var post_add_fn = function(req, res) {
	
	var man=mongoRef.nextSequence('post_seq',function(err,result){
		 req.params.post_id = result;
		 postAddAndComments(req,res);
	});
	
   
     
};

module.exports = function () {

    var express = require('express');
    var app = express();
    app.post('/postAdd', post_add_fn);
	app.get('/post/:post_id', get_post_by_id_fn);
	app.post('/comment', postComments);
    return app;

}();

