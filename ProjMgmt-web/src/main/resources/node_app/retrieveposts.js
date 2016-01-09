/**
 * Created by jigar on 7/15/2015.
 */



var env = 'local';

console.log('Connected ENV [' + env + ']');

var MongoClient = require('mongodb').MongoClient
    , format = require('util').format
    , Server = require('mongodb').Server
    , ObjectId = require('mongodb').ObjectID
    , mongoRef = require('./server.js')
    , postsRef = require('./postscommonfns.js')
    , http = require('http')
    , request = require('request');


//    , request = require('request-json');


var retrievePostsByOrganizationAndProduct = function (req, res) {

    var jsonString;
    var jsonData;

    jsonString = JSON.stringify(req.query.valueOf());
    jsonData = JSON.parse(jsonString);

    var query_clause = {
        "organization": jsonData.organization,
        "product": jsonData.product
    };

    var sort_order = {
        created_date: -1
    };


    postsRef.retrievePostsByOrganizationAndProduct('post', query_clause, sort_order, res);

};


var retrievePostsByOrganizationAndUserId = function (req, res) {

    var jsonString;
    var jsonData;

    jsonString = JSON.stringify(req.query.valueOf());
    jsonData = JSON.parse(jsonString);

    var query_clause = {
        "organization": jsonData.organization,
        "user_id": jsonData.user_id
    };

    var sort_order = {
        created_date: -1
    };

    postsRef.retrievePostsByOrganizationAndUserId('post', query_clause, sort_order, res);

};


var retrievePostByPostId = function (req, res) {

    var jsonString;
    var jsonData;

    jsonString = JSON.stringify(req.query.valueOf());
    jsonData = JSON.parse(jsonString);

    var query_clause = {
        "post_id": parseInt(jsonData.id)
    };

    postsRef.retrievePostByPostId('post', query_clause, res);

};

var retrievePostsForDashboardActvityByOrganization = function (req, res) {

    var jsonString;
    var jsonData;

    jsonString = JSON.stringify(req.query.valueOf());
    jsonData = JSON.parse(jsonString);

    var query_clause = {

        "email_id": jsonData.email_id
    };
    console.log(query_clause);

    var required_fields = {
        user_id: 1,
        product: 1,
        attribute: 1,
        deal_type: 1,
        priImageUrl: 1,
        secImageUrl: 1,
        created_date: 1,
        comment: 1,
        post_id: 1,
        activities: 1,
        updated_date: 1,
        "commentLength": {"$size": {"$ifNull": ["$comment", []]}}
    };
    var sort_order = {
        updated_date: -1
    };

    postsRef.retrievePostsForDashboardActvityByOrganization('post', query_clause, required_fields, sort_order, res);

};

var retrievePostsForFilterationAndDashBoardByAttributesAndProduct = function (req, res) {

    var body = ""; // request body
    var jsonData, jsonString,methodType;

    var required_fields = {
        user_id: 1,
        product: 1,
        attribute: 1,
        deal_type: 1,
        priImageUrl: 1,
        secImageUrl: 1,
        created_date: 1,
        comment: 1,
        post_id: 1,
        activities: 1,
        updated_date: 1,
        "commentLength": {"$size": {"$ifNull": ["$comment", []]}}
    };

    var sort_order = {
        updated_date: -1
    };



    if (req.method == 'GET') {

        methodType = 'GET';
        jsonString = JSON.stringify(req.query.valueOf());
        jsonData = JSON.parse(jsonString);
        console.log(jsonData);

        var query_clause = {

            "email_id": jsonData.email_id
        };

        console.log(query_clause);
        postsRef.retrievePostsForFilterationAndDashBoardByAttributesAndProduct('post', query_clause, required_fields, sort_order, res,methodType);

    } else if (req.method == 'POST') {

        methodType = 'POST';
        req.on('data', function (data) {

            //body += data.toString(); // convert data to string and append it to request body
            body += JSON.stringify(JSON.parse(data).data)
        });

        req.on('end', function () {


            jsonData = JSON.parse(body); // request is finished receiving data, parse it

            var query_clause = {

                "email_id": jsonData.email_id
            };
            console.log("query_clause: "+query_clause);

            var keys = [];

            if (jsonData.hasOwnProperty("attribute")){
                keys = Object.keys(jsonData.attribute);
            }
            console.log(keys);

            postsRef.retrievePostsForFilterationAndDashBoardByAttributesAndProduct('post',query_clause, required_fields, sort_order, res,methodType,keys,jsonData);
        });

    }

};

var retrieveProductBrandFromPostsForFilterationByProduct = function (req, res) {

    var jsonString;
    var jsonData;

    jsonString = JSON.stringify(req.query.valueOf());
    jsonData = JSON.parse(jsonString);

    var query_clause = {

        "product": jsonData.product
    };
    console.log(query_clause);

    postsRef.retrieveProductBrandFromPostsForFilterationByProduct('post', res, query_clause);


};

var retrievePostsForFirstLevelFilter = function (req, res) {
    var jsonString;
    var jsonData;

    jsonString = JSON.stringify(req.query.valueOf());
    jsonData = JSON.parse(jsonString);


    var query_clause = {
        "product": jsonData.product,
        "email_id": jsonData.email_id
    };
    var required_fields = {
    		   user_id: 1,
    	        product: 1,
    	        attribute: 1,
    	        deal_type: 1,
    	        priImageUrl: 1,
    	        secImageUrl:1,
    	        created_date: 1,
    	        comment:1,
    	        post_id:1,
    	        activities:1,
    	        updated_date:1,
    	        "commentLength": {"$size": {"$ifNull": ["$comment", []]}}

    };
    var sort_order = {
        created_date: -1
    };

    postsRef.retrievePostsForFirstLevelFilter('post', query_clause, required_fields, sort_order, res);

};

module.exports = function () {
    var express = require('express');
    var app = express();

    // Router mapping.
    app.get('/retrievePostsByOrganizationAndProduct',
        retrievePostsByOrganizationAndProduct);

    app.get('/myactivities',
        retrievePostsByOrganizationAndUserId);

    app.get('/retrievePostByPostId', retrievePostByPostId);

    app.get('/retrievePostsForDashboardActvityByOrganization', retrievePostsForDashboardActvityByOrganization);

    app.post('/retrievePostsForFilterationAndDashBoard', retrievePostsForFilterationAndDashBoardByAttributesAndProduct);

    app.get('/retrievePostsForFilterationAndDashBoard', retrievePostsForFilterationAndDashBoardByAttributesAndProduct);

    app.get('/retrieveProductBrandFromPostsForFilterationByProduct', retrieveProductBrandFromPostsForFilterationByProduct);

    app.get('/firstLevelFilter', retrievePostsForFirstLevelFilter);

    return app;

}();


