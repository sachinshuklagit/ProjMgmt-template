exports.config = {
    db_config : {
        host : 'ds031962.mongolab.com',
        port : 31962,
        dbname : 'sachintestdb',
        username : 'sachin',
        password : '123456',
        authRequired : true

    },
    server_ip:8086,
    email : {
                'user' : 'triconinfotech.bg@gmail.com',
                'password' : 'tricon*$123',
                'host' : 'smtp.gmail.com',
                'ssl' : true
            },

    registration_res_flag :{
        'existinguser' : 'true'

    },

    s3credentials:{
        'AWSAccessKeyId':'AKIAIMUOOWPCOHAQUFPA',
        'AWSSecretKey':'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',
        'bucket':'jigarbucket',
        'expires':600
    }

}
