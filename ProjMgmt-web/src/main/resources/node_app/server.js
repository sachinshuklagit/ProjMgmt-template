var env = 'local';

console.log('Connected ENV [' + env + ']');

var
    conf = require('./config/nodeappconfig-' + env + '.js'),
    mongoDb = require('./db.js'),
    util = require('./util.js');

var db = mongoDb.getDb();


module.exports = {
    insert: function (data, collection, res, callback) {

        var user = db.collection(collection);

        user.insert(data, function (err, result) {
            if (err) {
               // callback(err, 'Exception in registration');

                var obj = {};
                obj.code = err.appCode;
                obj.data = err;
                util.sendResponse(res, obj);
            } else {
                //res.send('user has been successfully registered');
                db.close();
                callback(null, 'user has been successfully registered');
            }

        });

    },

    createCollection: function (name, res) {


        db.createCollection(name, function (err, col) {
            if (err) {
                throw err;
            } else {
                res.send('Collection ' + name + ' has been created');
                db.close();
            }
        });

    },

    save: function (data, collectionName, res) {


        db.collection(collectionName).save(data, function (err, result) {
            if (err) {
                //throw err;

                var obj = {};
                obj.code = err.appCode;
                obj.data = err;
                util.sendResponse(res, obj);
            } else {
                //res.json({"result":JSON.parse(JSON.stringify(result.valueOf()))._id});

                var obj = {};
                obj.code = 201;
                obj.data = JSON.parse(JSON.stringify(result.valueOf())).post_id;
                util.sendResponse(res, obj);
                //res.send('Collection '+collectionName+' has been saved');
                db.close();
            }
        });


    },
    nextSequence: function (name,callback) {

        // var t = db.collection("sequences").findOne({_id : name},
        // {_id:0, increment_by:1});

        /*
         * var cursor = ""; db.collection("sequences").findAndModify({ _id:
         * name}, [], {$set: { $inc: { seq: 1 } }}, {}, function(err,
         * object) { if (err) console.warn(err.message); else
         * console.dir(object); cursor = object;// undefined if no matching
         * object exists. console.log("cursor1==="+JSON.stringify(cursor))
         * });
         */

        /*var cursor = db.collection("sequences").findAndModify({
            query: {'_id': name},
            update: {$inc: {'seq': 1}},
            new:true
        });*/
    	
    	db.eval("getNextSequence('"+name+"');", function(err, result) {
    		var seq=null;
    	    console.log(result.floatApprox);
    	    callback(null, result.floatApprox);
    	  });
    	
    	/*db.collection('counters').findAndModify({_name:name}, {$inc : {"sequence_value":1}}, {upsert:true, new:true},function(err, object) {
    	       if (err) console.warn(err.message);
    	       else
    	        console.log(object.sequence_value);
    	 });
        
        var cursor2 =db.collection('counters').findAndModify(name, {$inc: {sequence_value:1}}, function (err, data) {

        	console.log(data);
        });*/
       // console.log("cursor=====>>" + JSON.stringify(cursor));
        
    },
    find: function (collectionName, query_clause, callback) {


        db.collection(collectionName).find(query_clause).toArray(function (err, result) {
            if (err) {
                db.close();
                //throw err;
                var obj = {};
                obj.code = err.appCode;
                obj.data = err;
                util.sendResponse(res, obj);
            }
            else {
                console.log("result: " + result);
                callback(null, {"data": result});
                //console.log("result: "+result);
                // res.json({"data":result});
                // client.close();

            }

        })
        // });


    },

    update: function (collectionName, criteria, fields, res, callback) {


        db.collection(collectionName).update(criteria, {$set: fields}, function (err, result) {
            if (err) {
                //throw err;

                var obj = {};
                obj.code = err.appCode;
                obj.data = err;
                util.sendResponse(res, obj);
            } else {
                //res.json({"isSuccess":true});
                db.close();
                if (callback != null) {
                    callback(null, {"isSuccess": true});
                }
            }
        });


    },
    
    pushToComments: function (collectionName,arrayName,criteria, data, callback) {
    	var commentDetail=null;
    	var currentDate = new Date();
    	var postUpdateInfo = {};
    	postUpdateInfo.type = 'comment';
    	postUpdateInfo.done_by = data.detail.user_id;
    	postUpdateInfo.created_date = currentDate;
    	if(data.criteria.isParent){
    		commentDetail= {"comment": data.detail, "activities": postUpdateInfo}
    	}else{
    		commentDetail= {"comment.$.reply": data.detail}
    	}
    	var postUpdateInfo = {};
    	postUpdateInfo.type = 'comment';
    	console.log(criteria);
    	db.collection(collectionName).update(criteria, {$push: commentDetail, $set: {"updated_date": currentDate}}, function (err, result) {
            if (err) {
                throw err;
            } else {
                console.log(result);
                db.close();
                if (callback != null) {
                    callback(null, {"isSuccess": true});
                }
            }
        });


    },
    findRequiredFields: function (collectionName, query_clause, required_fields,callback) {


        db.collection(collectionName).find(query_clause,required_fields).toArray(function (err, result) {
            if (err) {
                db.close();
                //throw err;
                var obj = {};
                obj.code = err.appCode;
                obj.data = err;
                util.sendResponse(res, obj);
            }
            else {
                console.log("result: " + result);
                callback(null, result);
                //console.log("result: "+result);
                // res.json({"data":result});
                // client.close();

            }

        })
        // });


    },

    findOne : function(collectionName, query_clause, callback) {
        db.collection(collectionName).findOne(query_clause, function (err, doc) {

            if (err){
                db.close();
                //throw err;
                var obj = {};
                obj.code = err.appCode;
                obj.data = err;
                util.sendResponse(res, obj);

            }
            else{
                console.log("result: " + doc);
                callback(null, {"data": doc});
            }

        })
    }


};
console.log('--->' + JSON.stringify(db));
