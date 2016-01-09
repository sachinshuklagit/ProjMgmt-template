/**
 * It will insert user details into the database
 */

var app = app || {};

app.mailOptions = {
    "from": "Tricon <triconinfotech.bg@gmail.com>",
    "subject": "Security Token"
};

var env = 'local';
var conf = require('./config/nodeappconfig-' + env + '.js');


console.log('Connected ENV [' + env + ']');
var mongoRef = require('./server.js'), securityTokenEmail = require('./mail.js'), moment = require('moment');
var util = require('./util.js');

// db.t1.insert(JSON.parse(JSON.stringify(record)), {w:1, safe:false});

var get_organizations = function (req, res) {
    var query_clause = {
        "supported": "Y"
    };
    mongoRef.find('organization', query_clause, function (err, result) {
//		console.log('final result is : '+JSON.stringify(result)+', err='+err);

    	var obj = {};
    	if (err) {
    		obj.err.responseHeaderCode = 500;
        	obj.err = err;
        }
        else {
            obj.code = 201;
            obj.data = result;
        }
        util.sendResponse(res, obj);
    });
};

var create_collection = function (req, res) {
    // getDummyResponse(res);
    mongoRef.createCollection('TestCollection', res);
};

var activate_user = function (req, res) {

    var body = ""; // request body
    var jsonData;

    req.on('data', function (data) {
        body += data.toString(); // convert data to string and append it to
        console.log("activate user: " + body);
        // request body
    });

    req.on('end', function () {
        //console.log(body);
        jsonUser = JSON.parse(body); // request is finished receiving data,
        // parse it
        jsonData = jsonUser.authentication;

        var json = {
            "email_id": jsonData.email_id,
            "security_code": jsonData.security_code
        };
        req.params.email = json.email_id;
        var userDetails=null;
        mongoRef.find('user', json, function (err, result) {
            if (err) {
                throw err;
            } else {

                if (result.data.length != 0) {
                    userDetails=result.data;
                    var criteria = {
                        "email_id": jsonData.email_id

                    };
                    var fields = {
                        is_active: true
                    }
                    mongoRef.update('user', criteria, fields, res,function(err,result){
                    	var obj = {};
                    	if (err) {
                    		obj.err.responseHeaderCode = 500;
            	        	obj.err = err;
                        } else {
                        	
                        	//var userDetails=get_user_fn(req,res);
                        	//console.log(userDetails);
                        	result.msg="User has been activated";
                        	result.user=userDetails;
                            obj.code = 200;
                            obj.data = result; 
                        }
                    	util.sendResponse(res, obj);
                    });
                } else {
                    //res.json({"data": false});
                    var obj = {};
                    obj.code = 200;
                    obj.data = {"isSuccess": false,"msg":"We do not have any user matching to this email address"};
                    util.sendResponse(res, obj);
                }
            }

        });
    });

};


var get_user_by_email_code = function (req, res) {

    var body = ""; // request body
    var jsonData;

    req.on('data', function (data) {
        body += data.toString(); // convert data to string and append it to
        console.log("activate user: " + body);
        // request body
    });

    req.on('end', function () {
        //console.log(body);
        jsonUser = JSON.parse(body); // request is finished receiving data,
        // parse it
        jsonData = jsonUser.authentication;

        var json = {
            "email_id": jsonData.email_id,
            "security_code": jsonData.security_code
        };
        req.params.email = json.email_id;
        var userDetails=null;
        mongoRef.find('user', json, function (err, result) {
            if (err) {
            	obj.err.responseHeaderCode = 500;
	        	obj.err = err;
            } else {
                var obj = {};
                obj.code = 200;
                if (result.data.length != 0) {
                    obj.data = {"isSuccess": true,"msg":result.data};
                } else {
                    //res.json({"data": false});
                    obj.data = {"isSuccess": false,"msg":"We do not have any user matching to this email address"};
                }
            }
            util.sendResponse(res, obj);

        });
    });

};


var update_user_profile = function (req, res) {

    var body = ""; // request body
    var jsonData;

    req.on('data', function (data) {
        body += data.toString(); // convert data to string and append it to
        console.log("activate user: " + body);
        // request body
    });

    req.on('end', function () {
        //console.log(body);
    	jsonData = JSON.parse(body); // request is finished receiving data,
        // parse it
       // jsonData = jsonUser;
        var criteria = {
            "email_id": jsonData.email_id,
        };
        
        
        var userDetails=null;
        
        var fields=jsonData;
        
       
        
       console.log(criteria);
       console.log(fields);
        
        mongoRef.update('user', criteria, fields, res,function(err,result){
        	var obj = {};
        	if(err){
        		obj.err.responseHeaderCode = 500;
	        	obj.err = err;
        	}else{
        		obj.code = 200;
	            obj.data = {"msg":"user is successfully updated"};
        	}
        	util.sendResponse(res,obj);
        });
    });

};

var get_user_fn = function (req, res) {
	var query_clause = {
			"email_id": req.param("email")
	    };

	console.log("params:-"+ req.param("email_id"));
	console.log("params:-"+ req.param("email"));
	mongoRef.find('user', query_clause, function (err, result) {
		
	        var obj = {};
	        if (err) {
	            obj.err.responseHeaderCode = 500;
	        	obj.err = err;
	        }
	        else {
	        	if (result.data.length == 0) {
	        		res.json({"user":"invalid"});
	        		return;
                }
	            var jsonData = result.data[0];
	            obj.code = 200;
	            obj.data = jsonData;
	        }
	        util.sendResponse(res,obj);
	    });
};

var get_user_activity_fn = function (req, res) {
	var query_clause = {
			"organization": req.param("organisation"),
			"user_id": req.param("userId")
	    };

	console.log(query_clause);
	mongoRef.find('post', query_clause, function (err, result) {
		
	        var obj = {};
	        if (err) {
	            obj.err.responseHeaderCode = 500;
	        	obj.err = err;
	        }
	        else {
	        	obj.code = 200;
	        	if (result.data.length == 0) {
	        		obj.data={"msg":"We dont have any record marching this profile"};
                }else{
                	var jsonData = result.data[0];
     	            obj.data = jsonData;
                }
	           
	        }
	        util.sendResponse(res,obj);
	    });
};


var user_Info_function = function (req, res) {

    var jsonString;
    var jsonData;

    jsonString = JSON.stringify(req.query.valueOf());
    jsonData = JSON.parse(jsonString);

    var query_clause = {
        "user_id": parseInt(jsonData.user_id)
    };

    
	
	mongoRef.find('user', query_clause, function (err, result) {
		
	        var obj = {};
	        if (err) {
	            obj.err.responseHeaderCode = 500;
	        	obj.err = err;
	        }
	        else {
	        	if (result.data.length == 0) {
	        		res.json({"user":"invalid"});
	        		return;
                }
	            var jsonData = result.data[0];
	            obj.code = 200;
	            obj.data = jsonData;
	        }
	        util.sendResponse(res,obj);
	    });
	
};

var user_login_fn = function (req, res) {
	var query_clause = {
			"email_id": req.param("email")
	    };

	console.log("params:-"+ req.param("email"));
	mongoRef.find('user', query_clause, function (err, result) {
	        if (err) {
	        	throw err;
	        }
	        else {
	        	if (result.data.length == 0) {
	        		var obj = {};
	        		obj.code = 200;
		            obj.data = {"user":"invalid"};
		            util.sendResponse(res,obj);
		            return;
                }
	            var jsonData = result.data[0];
	            var token = JSON.stringify(moment().valueOf());
	            var sec_token = token.slice(9, 13);
	            jsonData.timestamp = moment().valueOf();
                
                var criteria = {
                        "email_id": jsonData.email_id

                    };
                
                var fields={
                	
                		"security_code":sec_token
                };
                
               
                
                app.mailOptions.to = jsonData.email_id;
                app.mailOptions.text = "Dear " + jsonData.first_name
                    + " , \nYour security token is " + sec_token;
                console.log(jsonData);
                console.log(app.mailOptions);
                
                mongoRef.update('user', criteria, fields, res,function(err,result){
                	var obj = {};
                	if(err){
                		obj.err.responseHeaderCode = 500;
        	        	obj.err = err;
                	}else{
                		securityTokenEmail.send(app.mailOptions);
                		obj.code = 200;
    		            obj.data = {"user":"valid"};
                	}
                	util.sendResponse(res,obj);
                });
                
                
                
               // res.send(JSON.stringify(result.data[0]));
	        }
	    });
};

var register_fn = function(req, res) {
	
	var man=mongoRef.nextSequence('user_seq',function(err,result){
		 req.params.user_id = result;
		 register(req,res);
	});
	
   
     
};

var register = function (req, res) {

    var body = ""; // request body
    var jsonData;

    req.on('data', function (data) {
        body += data.toString(); // convert data to string and append it to
        // request body
    });

    req.on('end', function () {
        console.log(body);
        jsonUser = JSON.parse(body); // request is finished receiving data,
        // parse it
        jsonData = jsonUser.userInfo;

        var json = {
            "email_id": jsonData.email_id
        };
        mongoRef.find('user', json, function (err, result) {
            if (err) {
                throw err;
            }
            else {

                if (result.data.length == 1) {
                   // res.json({"existinguser":conf.config.registration_res_flag.existinguser});
                    var obj = {};
                    obj.err = {};
                    obj.err.responseHeaderCode = 500;
                    obj.err.appCode='user_already_existing';
                    util.sendResponse(res,obj);
                }
                else {
                    securityToken = jsonData.security_code;

                    var token = JSON.stringify(moment().valueOf());

                    securityToken = token.slice(9, 13);
                    jsonData.security_code = securityToken;
                    // console.log("securityToken: "+securityToken);
                    jsonData.timestamp = moment().valueOf();
                    jsonData.user_id = req.params.user_id;
                    app.mailOptions.to = jsonData.email_id;
                    app.mailOptions.text = "Dear " + jsonData.first_name + " , \nYour security token is " + securityToken;
                    // console.log(jsonData);
                    mongoRef.insert(jsonData, 'user', res, function (err, result) {
                    	var obj = {};
                        if (err) {
                            obj.err.responseHeaderCode = 500;
                        	obj.err = err;
                        }
                        else {
                            console.log(app.mailOptions);

                            securityTokenEmail.send(app.mailOptions);
                            
                            obj.code = 201;
                            obj.data = {"status":true,'msg': 'user has been successfully registered','result':jsonData};
                        }
                        util.sendResponse(res,obj);

                    });

                }
            }


        });
    });

};


module.exports = function () {
    var express = require('express');
    var app = express();

    // Router mapping.
    app.post('/register', register_fn);
    app.get('/user/:email', get_user_fn);
    app.get('/userInfo', user_Info_function);
    app.get('/login/:email',user_login_fn);
    app.post('/activateUser', activate_user);
    app.post('/validateUser',get_user_by_email_code);
    app.get('/createCollection', create_collection);
    app.get('/organizations', get_organizations);
    //app.get('/activity/:organisation/:userId',get_user_activity_fn);
    app.post('/user',update_user_profile);

    return app;
}();

