var env = 'local';
var email = require('emailjs');

var conf = require('./config/nodeappconfig-'+env+'.js');

var emailServer = email.server.connect({
    user: conf.config.email.user,
    password: conf.config.email.password,
    host: conf.config.email.host,
    ssl: conf.config.email.ssl
});


module.exports = {

    send:function(mailOptions) {
        emailServer.send({
            text: mailOptions.text ,
            from: mailOptions.from,
            to: mailOptions.to,
            cc: mailOptions.cc,
            subject: mailOptions.subject
        }, function (err, message) {
            if (err){
                throw err;
            }
            else{
                console.log(message);

            }
        });
    }
};
