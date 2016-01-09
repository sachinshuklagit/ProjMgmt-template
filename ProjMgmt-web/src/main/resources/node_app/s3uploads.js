/**
 * Created by jigar on 7/21/2015.
 */



var env = 'local';
var conf = require('./config/nodeappconfig-' + env + '.js');
var moment = require('moment');
var mime = require('mime');
var AWS = require('aws-sdk');
var fs = require('fs');

var util = require('./util.js');

var s3=null;
var params=null;

var init=function(){
	AWS.config.update({
	    accessKeyId: conf.config.s3credentials.AWSAccessKeyId,
	    secretAccessKey: conf.config.s3credentials.AWSSecretKey
	});
	//AWS.config.update({region: 'us-west-2'});

	 s3 = new AWS.S3({computeChecksums: true}); // this is the default setting

	 params = {
	        Bucket: conf.config.s3credentials.bucket,
	        ACL: 'public-read',
	        Expires: conf.config.s3credentials.expires
	    };
};


var upload_s3_fn = function (req, res) {

    var jsonString;
    var jsonData;

    jsonString = JSON.stringify(req.query.valueOf());
    jsonData = JSON.parse(jsonString);
    console.log(jsonData.organization);

    var mimetype = mime.lookup(jsonData.key);
    console.log(jsonData.key.split('.'));

    jsonData.key = jsonData.key.split('.')[0]+"_"+JSON.stringify(moment().valueOf())+"."+jsonData.key.split('.')[1];
    console.log(jsonData.key);

    // var credentials = new AWS.SharedIniFileCredentials({profile: 'jigarbucket'});
    //AWS.config.credentials = credentials;

    

    var filePath = "organizations/"+ jsonData.organization + "/" + jsonData.user_id + "/" + jsonData.product + "/" + jsonData.key;
    params.ContentType=mimetype;
    params.Key=filePath;
    var url = s3.getSignedUrl('putObject', params);
    //res.json({'presignedurl': url, 'contentType': mimetype, 'filePath':"/"+filePath});
    console.log("The URL is", url);
   // res.json({'presignedurl': url, 'contentType': mimetype, 'filePath':"/"+filePath});
    var obj = {};
    obj.code = 201;
    obj.data = {'presignedurl': url, 'contentType': mimetype, 'filePath':"/"+filePath};
    util.sendResponse(res, obj);
    //console.log("The URL is", url);

};

var upload_s3_user_image_fn = function (req, res) {

	var jsonString;
    var jsonData;

    jsonString = JSON.stringify(req.query.valueOf());
    jsonData = JSON.parse(jsonString);
    console.log(jsonData.organization);

    var mimetype = mime.lookup(jsonData.key);
    console.log(jsonData.key.split('.'));

    jsonData.key = jsonData.key.split('.')[0]+"_"+JSON.stringify(moment().valueOf())+"."+jsonData.key.split('.')[1];
    console.log(jsonData.key);

    // var credentials = new AWS.SharedIniFileCredentials({profile: 'jigarbucket'});
    //AWS.config.credentials = credentials;


    var filePath = "user/"+ jsonData.organization + "/" + jsonData.user_id + "/" + jsonData.user_name + "/" + jsonData.key;
    
    params.ContentType=mimetype;
    params.Key=filePath;
    
    console.log(params);
    var url = s3.getSignedUrl('putObject', params);
    //res.json({'presignedurl': url, 'contentType': mimetype, 'filePath':"/"+filePath});
    console.log("The URL is", url);
    
    var obj = {};
    obj.code = 201;
    obj.data = {'presignedurl': url, 'contentType': mimetype, 'filePath':"/"+filePath};
    util.sendResponse(res, obj);

};

var delete_s3_image_fn = function (req, res) {

    var jsonString;
    var jsonData;

    jsonString = JSON.stringify(req.query.valueOf());
    jsonData = JSON.parse(jsonString);

    AWS.config.update({
        accessKeyId: conf.config.s3credentials.AWSAccessKeyId,
        secretAccessKey: conf.config.s3credentials.AWSSecretKey
    });
    //AWS.config.update({region: 'us-west-2'});

    var s3 = new AWS.S3({computeChecksums: true}); // this is the default setting

    var filePath = jsonData.key;
    console.log("filePath: "+jsonData.key);
    var params = {
        Bucket: conf.config.s3credentials.bucket,
        Key:filePath ,


        Expires: conf.config.s3credentials.expires
    };
    var url = s3.getSignedUrl('deleteObject', params);

    console.log("The URL is", url);


    var obj = {};
    obj.code = 201;
    obj.data = {'presignedurl': url};
    util.sendResponse(res, obj);


};

module.exports = function () {
	init();
    var express = require('express');
    var app = express();
    app.get('/presignedurl', upload_s3_fn);
    app.get('/userS3ImageUrl', upload_s3_user_image_fn);
    app.get('/deleteS3Image', delete_s3_image_fn);

    return app;

}();