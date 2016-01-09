/**
 * Created by jigar on 7/16/2015.
 */

var env = 'local';
var Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server,
    conf = require('./config/nodeappconfig-' + env + '.js'),
    util = require('./util.js');

var db = new Db(conf.config.db_config.dbname,
    new Server(conf.config.db_config.host, conf.config.db_config.port,
        {
            auto_reconnect: true,
            poolSize: 1
        }),
    {w: 1});

module.exports = {

    getDb: function () {

        if (db == null) {
            db.open(function (err, client) {

                if (conf.config.db_config.authRequired) {
                    db.authenticate(conf.config.db_config.username, conf.config.db_config.password, function (err, result) {
                        console.log('err=' + err);
                        if (err) {
                            //throw err;

                            var obj = {};
                            obj.code = err.appCode;
                            obj.data = err;
                            util.sendResponse(res, obj);

                        } else {
                            console.log('Mongo DB authentication successful....');
                        }
                    });
                }
            });

        }
        return db;
    },

};



