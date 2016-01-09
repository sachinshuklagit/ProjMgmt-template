/**
 *
 */

/**
 * It will insert user details into the database
 */

var env = 'local';

var mongoRef = require('./server.js');
var util = require('./util.js');

var product_fn = function(req, res) {
    var json = {
        "label" : req.params.name
    };
    mongoRef.findOne('product', json, function (err, doc) {
        if (err) {
            //throw err;
            var obj = {};
            obj.code = err.appCode;
            obj.data = err;
            util.sendResponse(res, obj);
        } else {
            var obj = {};
            obj.code = 201;
            obj.data = doc;
            util.sendResponse(res, obj);

        }

    });
};

var product_brands_fn = function(req, res) {
    var json = {
        "label" : req.params.name
    };

    var required_filed = {
        "attribute.brand.value":1
    };

    mongoRef.findRequiredFields('product', json,required_filed, function (err, docs) {
        if (err) {
            var obj = {};
            obj.code = err.appCode;
            obj.data = err;
            util.sendResponse(res, obj);
        } else {

            var obj = {};
            obj.code = 201;
            obj.data = docs;
            util.sendResponse(res, obj);

        }

    });
};

var product_filter_fn = function(req, res) {
    var json = {
        "label" : req.params.name
    };

    var required_fields = {
        "filter":1
    };

    mongoRef.findRequiredFields('product', json,required_fields, function (err, doc) {
        if (err) {
            //throw err;
            var obj = {};
            obj.code = err.appCode;
            obj.data = err;
            util.sendResponse(res, obj);
        } else {
            var obj = {};
            obj.code = 201;
            obj.data = doc;
            util.sendResponse(res, obj);

        }

    });
};

module.exports = function() {
    var express = require('express');
    var app = express();

    // Router mapping.
    app.get('/getProduct/:name', product_fn);
    app.get('/product/brands/:name', product_brands_fn)
    app.get('/product/filter/:name', product_filter_fn)

    return app;
}();