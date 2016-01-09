/**
 * Created by jigar on 7/15/2015.
 */

var env = 'local';

console.log('Connected ENV [' + env + ']');
var Connection = require('mongodb').Connection,
    Server = require('mongodb').Server,
    conf = require('./config/nodeappconfig-' + env + '.js');
mongose = require('mongoose'),
    mongoDb = require('./db.js'),
    util = require('./util.js');


var db = mongoDb.getDb();

module.exports = {

    retrievePostsByOrganizationAndProduct: function (collectionName, query_clause, sort_order, res) {

        var cursor = db.collection(collectionName).find(query_clause).sort(sort_order).toArray(function (err, docs) {

            if (err) {
                // throw err;
                var obj = {};
                obj.code = err.appCode;
                obj.data = err;
                util.sendResponse(res, obj);
            }
            else {
                //res.json(docs);
                var obj = {};
                obj.code = 201;
                obj.data = docs;
                util.sendResponse(res, obj);

            }

        })
    },

    retrievePostsByOrganizationAndUserId: function (collectionName, query_clause, sort_order, res) {

        var cursor = db.collection(collectionName).find(query_clause).sort(sort_order).toArray(function (err, docs) {
            if (err) {
                //throw err;
                var obj = {};
                obj.code = err.appCode;
                obj.data = err;
                util.sendResponse(res, obj);
            }
            else {
                // res.json({"data": docs});
                var obj = {};
                obj.code = 201;
                obj.data = docs;
                util.sendResponse(res, obj);
            }

        })
    },

    retrievePostByPostId: function (collectionName, query_clause, res) {

        var cursor = db.collection(collectionName).find(query_clause).toArray(function (err, docs) {
            if (err) {
                // throw err;
                var obj = {};
                obj.code = err.appCode;
                obj.data = err;
                util.sendResponse(res, obj);
            }
            else {
                //res.json({"data": docs});
                var obj = {};
                obj.code = 201;
                obj.data = docs;
                util.sendResponse(res, obj);
            }

        })
    },

    retrievePostsForDashboardActvityByOrganization: function (collectionName, query_clause, required_fields, sort_order, res) {

        var cursor = db.collection('user').findOne(query_clause, function (err, doc) {

            if (err) {
                //  throw err;
                var obj = {};
                obj.code = err.appCode;
                obj.data = err;
                util.sendResponse(res, obj);
            }
            else {

                console.log("organization: " + doc.organization);

                var organization = {
                    "organization": doc.organization
                }

                db.collection('post').aggregate(
                    {$match: organization},
                    {
                        $project: required_fields

                    }
                    , {$sort: sort_order}, function (err, docs) {
                        if (err) {
                            //throw err;
                            var obj = {};
                            obj.code = err.appCode;
                            obj.data = err;
                            util.sendResponse(res, obj);
                        }
                        else {
                            var userIds = new Array();
                            for (var i = 0; i < docs.length; i++) {
                                var document = docs[i];
                                if (typeof document.comment !== 'undefined') {
                                    for (var commentIndex in document.comment) {
                                        var comment = document.comment[commentIndex];
                                        userIds.push(comment.user_id);
                                    }
                                }
                                if (typeof document.activities !== 'undefined') {
                                    for (var activityIndex in document.activities) {
                                        var activity = document.activities[activityIndex];
                                        userIds.push(activity.done_by);
                                    }
                                }
                                userIds.push(docs[i].user_id);
                            }
                            var cursor = db.collection('user').find({"user_id": {$in: userIds}}).toArray(function (err, users) {
                                if (err) {
                                    //throw err;
                                    var obj = {};
                                    obj.code = err.appCode;
                                    obj.data = err;
                                    util.sendResponse(res, obj);
                                }
                                else {
                                    var userObj = {};
                                    for (var user in users) {
                                        var key = users[user];
                                        userObj[key.user_id] = users[user];
                                    }
                                    for (var doc in docs) {
                                        var document = docs[doc];
                                        var user = userObj[docs[doc].user_id];
                                        if (typeof user !== 'undefined') {
                                            docs[doc].user_name = user.first_name + " " + user.last_name;
                                        }
                                        if (typeof document.comment !== 'undefined') {
                                            for (var commentIndex in document.comment) {
                                                var comment = document.comment[commentIndex];
                                                var commentedUser = userObj[comment.user_id];
                                                if (typeof commentedUser !== 'undefined') {
                                                    comment.user_name = commentedUser.first_name + " " + commentedUser.last_name;
                                                }
                                            }
                                        }
                                        if (typeof document.activities !== 'undefined') {
                                            for (var activityIndex in document.activities) {
                                                var activity = document.activities[activityIndex];
                                                var activityUser = userObj[activity.done_by];
                                                if (typeof activityUser !== 'undefined') {
                                                    activity.user_name = activityUser.first_name + " " + activityUser.last_name;
                                                }
                                            }
                                        }
                                    }
                                    // res.json(docs);
                                    var obj = {};
                                    obj.code = 201;
                                    obj.data = docs;
                                    util.sendResponse(res, obj);
                                }

                            })

                        }

                    })
            }
        })
    },

    retrievePostsForFilterationAndDashBoardByAttributesAndProduct: function (collectionName, query_clause, required_fields, sort_order, res, methodType, attributeKeys, jsonData) {

        var attributes = {};
        var attribute = "attribute.";

        var cursor = db.collection('user').findOne(query_clause, function (err, doc) {

            if (err) {
                //  throw err;
                var obj = {};
                obj.code = err.appCode;
                obj.data = err;
                util.sendResponse(res, obj);
            }
            else {

                var matchQuery = {};

                if (methodType == 'GET') {
                    /*var organization = {
                        "organization": doc.organization
                    };*/
                    matchQuery["organization"] = doc.organization;
                }
                else if (methodType == 'POST') {


                    matchQuery["organization"] = doc.organization;
                    matchQuery["product"] = jsonData.product;


                    var startPrice = jsonData.startPrice;
                    var endPrice = jsonData.endPrice;

                    if (startPrice != undefined && endPrice != undefined) {
                        matchQuery[attribute + "price"] = {$gt: jsonData.startPrice, $lt: jsonData.endPrice}
                    }


                    attributeKeys.forEach(function (key) {
                        var keyValue = jsonData.attribute[key];

                        if (key == 'brand') {
                            var keyValues = new Array();

                            console.log(keyValue.length);
                            for (var j = 0; j < keyValue.length; j++) {
                                keyValues[j] = new RegExp(keyValue[j], 'i');
                            }
                            console.log(keyValues);
                            matchQuery[attribute + key] = {$in: keyValues};
                        }


                    });
                }


                console.log(matchQuery);
                db.collection('post').aggregate(
                    {$match: matchQuery},
                    {
                        $project: required_fields

                    }
                    , {$sort: sort_order}, function (err, docs) {
                        if (err) {
                            //throw err;
                            var obj = {};
                            obj.code = err.appCode;
                            obj.data = err;
                            util.sendResponse(res, obj);
                        }
                        else {
                            var userIds = new Array();
                            for (var i = 0; i < docs.length; i++) {
                                var document = docs[i];
                                if (typeof document.comment !== 'undefined') {
                                    for (var commentIndex in document.comment) {
                                        var comment = document.comment[commentIndex];
                                        userIds.push(comment.user_id);
                                    }
                                }
                                if (typeof document.activities !== 'undefined') {
                                    for (var activityIndex in document.activities) {
                                        var activity = document.activities[activityIndex];
                                        userIds.push(activity.done_by);
                                    }
                                }
                                userIds.push(docs[i].user_id);
                            }
                            var cursor = db.collection('user').find({"user_id": {$in: userIds}}).toArray(function (err, users) {
                                if (err) {
                                    //throw err;
                                    var obj = {};
                                    obj.code = err.appCode;
                                    obj.data = err;
                                    util.sendResponse(res, obj);
                                }
                                else {
                                    var userObj = {};
                                    for (var user in users) {
                                        var key = users[user];
                                        userObj[key.user_id] = users[user];
                                    }
                                    for (var doc in docs) {
                                        var document = docs[doc];
                                        var user = userObj[docs[doc].user_id];
                                        if (typeof user !== 'undefined') {
                                            docs[doc].user_name = user.first_name + " " + user.last_name;
                                        }
                                        if (typeof document.comment !== 'undefined') {
                                            for (var commentIndex in document.comment) {
                                                var comment = document.comment[commentIndex];
                                                var commentedUser = userObj[comment.user_id];
                                                if (typeof commentedUser !== 'undefined') {
                                                    comment.user_name = commentedUser.first_name + " " + commentedUser.last_name;
                                                }
                                            }
                                        }
                                        if (typeof document.activities !== 'undefined') {
                                            for (var activityIndex in document.activities) {
                                                var activity = document.activities[activityIndex];
                                                var activityUser = userObj[activity.done_by];
                                                if (typeof activityUser !== 'undefined') {
                                                    activity.user_name = activityUser.first_name + " " + activityUser.last_name;
                                                }
                                            }
                                        }
                                    }
                                    // res.json(docs);
                                    var obj = {};
                                    obj.code = 201;
                                    obj.data = docs;
                                    util.sendResponse(res, obj);
                                }

                            })

                        }

                    })
            }
        })

    },

    retrieveProductBrandFromPostsForFilterationByProduct: function (collectionName, res, query_clause) {

        db.collection(collectionName).distinct("attribute.brand", query_clause, function (err, docs) {

            if (err) {

                var obj = {};
                obj.code = err.appCode;
                obj.data = err;
                util.sendResponse(res, obj);
            }
            else {

                var obj = {};
                obj.code = 201;
                obj.data = docs;
                util.sendResponse(res, obj);

            }

        })

    },

    retrievePostsForFirstLevelFilter: function (collectionName, query_clause, required_fields, sort_order, res) {

        var email_id = {"email_id": query_clause.email_id};

        var cursor = db.collection('user').findOne(email_id, function (err, doc) {

            if (err) {
                //  throw err;
                var obj = {};
                obj.code = err.appCode;
                obj.data = err;
                util.sendResponse(res, obj);
            }
            else {
                var matchQuery = {};
                console.log("organization: " + doc.organization);

                matchQuery["product"] = query_clause.product;
                matchQuery["organization"] = doc.organization;


                db.collection('post').aggregate(
                    {$match: matchQuery},
                    {
                        $project: required_fields

                    }
                    , {$sort: sort_order}, function (err, docs) {
                        if (err) {
                            //throw err;
                            var obj = {};
                            obj.code = err.appCode;
                            obj.data = err;
                            util.sendResponse(res, obj);
                        }
                        else {
                            var userIds = new Array();
                            for (var i = 0; i < docs.length; i++) {
                                var document = docs[i];
                                if (typeof document.comment !== 'undefined') {
                                    for (var commentIndex in document.comment) {
                                        var comment = document.comment[commentIndex];
                                        userIds.push(comment.user_id);
                                    }
                                }
                                if (typeof document.activities !== 'undefined') {
                                    for (var activityIndex in document.activities) {
                                        var activity = document.activities[activityIndex];
                                        userIds.push(activity.done_by);
                                    }
                                }
                                userIds.push(docs[i].user_id);
                            }
                            var cursor = db.collection('user').find({"user_id": {$in: userIds}}).toArray(function (err, users) {
                                if (err) {
                                    //throw err;
                                    var obj = {};
                                    obj.code = err.appCode;
                                    obj.data = err;
                                    util.sendResponse(res, obj);
                                }
                                else {
                                    var userObj = {};
                                    for (var user in users) {
                                        var key = users[user];
                                        userObj[key.user_id] = users[user];
                                    }
                                    for (var doc in docs) {
                                        var document = docs[doc];
                                        var user = userObj[docs[doc].user_id];
                                        if (typeof user !== 'undefined') {
                                            docs[doc].user_name = user.first_name + " " + user.last_name;
                                        }
                                        if (typeof document.comment !== 'undefined') {
                                            for (var commentIndex in document.comment) {
                                                var comment = document.comment[commentIndex];
                                                var commentedUser = userObj[comment.user_id];
                                                if (typeof commentedUser !== 'undefined') {
                                                    comment.user_name = commentedUser.first_name + " " + commentedUser.last_name;
                                                }
                                            }
                                        }
                                        if (typeof document.activities !== 'undefined') {
                                            for (var activityIndex in document.activities) {
                                                var activity = document.activities[activityIndex];
                                                var activityUser = userObj[activity.done_by];
                                                if (typeof activityUser !== 'undefined') {
                                                    activity.user_name = activityUser.first_name + " " + activityUser.last_name;
                                                }
                                            }
                                        }
                                    }
                                    // res.json(docs);
                                    var obj = {};
                                    obj.code = 201;
                                    obj.data = docs;
                                    util.sendResponse(res, obj);
                                }

                            })

                        }

                    })
            }
        })


    },


};
