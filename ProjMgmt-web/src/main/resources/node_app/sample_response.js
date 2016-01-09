var express = require('express');
var app = express();
var util = require('./util.js');

app.get('/sample_success_01', function(req, res){
    var obj = {};
    obj.data='This is sample response text';
    util.sendResponse(res,obj);
});

app.get('/sample_success_02', function(req, res){
    var obj = {};
    obj.code = 201;
    obj.data='This is sample Create Obj Response';
    util.sendResponse(res,obj);
});


app.get('/sample_err_01', function(req, res){
    var obj = {};
    obj.err = {};
    obj.err.responseHeaderCode = 500;
    obj.err.appCode='user_already_existing';
    obj.err.detailedMessage='user with id 123 does not exists in the system';
    util.sendResponse(res,obj);
});

app.get('/sample_err_02', function(req, res){
    var err = {};
    err.appCode='app_error';
    err.detailedMessage='This is generic exception custom detailed message.';
    util.send_failure(res, err);
});


app.listen(9091);