exports.error = function (code, detailedMessage) {
    var e = new Error(detailedMessage);
    e.code = code;
    return e;
};


exports.sendResponse = function(res, obj) {

    if(obj.err){
        send_failure_fn(res, obj.err);
    }else{
        var code = obj.code ? obj.code : 200;
        var contentType = obj.contentType ? obj.contentType : "application/json";
        res.writeHead(code, {"Content-Type": contentType});
        var output = {};
        if(contentType == 'text/html'){
            //Need to check
            res.send(obj.data);
        }else{
            output = { error: null, data: obj.data };
            res.end(JSON.stringify(output) + "\n");
        }

    }
}


exports.send_failure = function(res, err){
    send_failure_fn(res, err);
};

var send_failure_fn = function(res, err) {
    var resHeader = err.responseHeaderCode ? err.responseHeaderCode : err_codes[err.appCode].responseHeaderCode;
    res.writeHead(resHeader, { "Content-Type" : "application/json" });
    res.end(JSON.stringify({ error: err.appCode, shortMessage: err_codes[err.appCode].shortMessage, detailedMessage:err.detailedMessage }) + "\n");
}

var err_codes = {
    'user_already_existing' : {
                shortMessage : 'User is already existing in the system',
                responseHeaderCode : 302
            },
    'app_error' : {
                    shortMessage : 'Unknown System Exception occured',
                    responseHeaderCode : 404
                }

};

