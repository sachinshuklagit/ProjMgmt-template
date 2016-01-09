exports.config = {
    db_config : {
        host : '192.168.1.115',
        port : 27017,
        dbname : 'test',
        username : 'jenkins',
        password : '123456',
        authRequired : false

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
