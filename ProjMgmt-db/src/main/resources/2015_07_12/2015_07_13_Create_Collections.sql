-- This is the sample script created to make sure that we have data to start our tasks.
--Collection: Product:

db.getCollection('product').insert({"name":"mobile", "label":"Mobile", "attribute":[
    {"brand":{"label":"Brand", "example":"Ex LG"}}
    ,{"internal_memory":{"label":"Internal Memory", "example":"Ex 2GB"}}
    ,{"model":{"label":"Model", "example":"Ex Nexus 5"}}
    ,{"price":{"label":"Price", "example":"Ex 2000"}}]});
	
db.getCollection('product').insert({"name":"car", "label":"Car", "attribute":[
    {"brand":{"label":"Brand", "example":"Ex Ford"}}
    ,{"model":{"label":"Model", "example":"Ex Ikon"}}
    ,{"odometer_reading":{"label":"Odometer Reading", "example":"Ex 5000KM"}}
    ,{"year":{"label":"Year", "example":"Ex 2004"}}
    ,{"price":{"label":"Price", "example":"Ex 20000 INR"}}]});
	
db.getCollection('product').insert({"name":"laptop", "label":"Laptop", "attribute":[
    {"brand":{"label":"Brand", "example":"Ex Dell"}}
    ,{"model":{"label":"Model", "example":"Ex Latitude"}}
    ,{"ram":{"label":"RAM", "example":"Ex 4GB"}}
	,{"hard_disk":{"label":"Hard Disk", "example":"Ex 1TB"}}
    ,{"processor":{"label":"Processor", "example":"Ex Intel Core I7"}}
    ,{"price":{"label":"Price", "example":"Ex 25000 INR"}}]});

db.getCollection('product').insert({"name":"bike", "label":"Bike", "attribute":[
    {"brand":{"label":"Brand", "example":"Ex Honda"}}
    ,{"model":{"label":"Model", "example":"Ex CBR 150R"}}
    ,{"odometer_reading":{"label":"Odometer Reading", "example":"Ex 6500KM"}}
    ,{"year":{"label":"Year", "example":"Ex 2014"}}
    ,{"price":{"label":"Price", "example":"Ex 120000 INR"}}]});
	
db.getCollection('product').insert({"name":"tablet", "label":"Tablet", "attribute":[
    {"brand":{"label":"Brand", "example":"Ex Apple"}}
    ,{"model":{"label":"Model", "example":"Ex IPad Mini"}}
    ,{"ram":{"label":"RAM", "example":"Ex 2GB"}}
	,{"internal_memory":{"label":"Internal Memory", "example":"Ex 64GB"}}
    ,{"processor":{"label":"Processor", "example":"Ex ARM Cortex-A8 "}}
    ,{"price":{"label":"Price", "example":"Ex 9000 INR"}}]});


--Collection: Organization:

    db.getCollection('organization').insert({
    "name" : "Tata Consultancy Services",
    "short_name" : "TCS",
    "url" : "www.tcs.com",
    "supported" : "Y",
    "domain" : [ 
        "tcs.com", 
        "tcs.co.in"
    ],
    "organization_id" : NumberLong(18)
});
    db.getCollection('organization').insert({
    "name" : "Tricon Infotech",
    "short_name" : "Tricon",
    "url" : "www.triconinfotech.com",
    "supported" : "Y",
    "domain" : [ 
        "triconinfotech.com"
    ],
    "organization_id" : NumberLong(19)
});
    db.getCollection('organization').insert({
    "name" : "SAP Labs",
    "short_name" : "SAP",
    "url" : "www.sap.com",
    "supported" : "Y",
    "domain" : [ 
        "sap.com"
    ],
    "organization_id" : NumberLong(20)
});
    db.getCollection('organization').insert({
    "name" : "Infosys Pvt Ltd",
    "short_name" : "Infosys",
    "url" : "www.infosys.com",
    "supported" : "N",
    "domain" : [ 
        "infosys.com"
    ],
    "organization_id" : NumberLong(21)
});
    db.getCollection('organization').insert({
    "name" : "Sample Infotech",
    "short_name" : "sample",
    "url" : "www.sample123.com",
    "supported" : "true",
    "domain" : [ 
        "sample123.com"
    ],
    "organization_id" : NumberLong(22)
});
    db.getCollection('organization').insert({
    "name" : "Sample Infotech",
    "short_name" : "sample",
    "url" : "www.sample123.com",
    "supported" : "true",
    "domain" : [ 
        "sample123.com"
    ],
    "organization_id" : NumberLong(23)
});
    


--Collection: User


db.getCollection('user').insert({
    "organization" : "Tricon Infotech",
    "email_id" : "sachin@triconinfotech.com",
    "user_id" : "",
    "first_name" : "Sachin",
    "last_name" : "Shukla",
    "url" : "",
    "country" : "India",
    "city" : "Bangalore",
    "security_code" : "5886",
    "is_active" : false,
    "timestamp" : 1437402305886.0000000000000000,
    "sold_post" : []
});

db.getCollection('user').insert({
    "userInfo" : {
        "organization" : "Tricon Infotech",
        "email_id" : "shankarm@triconinfotech.com",
        "user_id" : "",
        "first_name" : "s",
        "last_name" : "m",
        "url" : "",
        "country" : "India",
        "city" : "Bangalore",
        "security_code" : "",
        "is_active" : false,
        "timestamp" : "",
        "sold_post" : []
    },
    "security_code" : 1437141726129.0000000000000000,
    "timestamp" : 1437141726130.0000000000000000
});

--Collection: Post

/* 1 */
{
    "organization" : "TCS",
    "user_id" : "10004",
    "product" : "Mobile",
    "attribute" : {
        "brand" : "LG",
        "model" : "Nexus-5",
        "internal_memory" : "32gb",
        "ram" : "4gb"
    },
    "status" : "hidden",
    "created_date" : "",
    "updated_date" : "",
    "comment_visibility" : "private",
    "comment" : [ 
        {
            "message" : "sample comment",
            "created_date" : "",
            "user_id" : "10001",
            "user_name" : "Sachin Shukla",
            "reply" : [ 
                {
                    "message" : "sample reply",
                    "created_date" : "",
                    "user_id" : "10002",
                    "user_name" : "Ajay Vijayan"
                }, 
                {
                    "message" : "sample reply-2",
                    "created_date" : "",
                    "user_id" : "10001",
                    "user_name" : "Sachin Shukla"
                }
            ]
        }, 
        {
            "message" : "sample comment-3",
            "created_date" : "",
            "user_id" : "10001",
            "user_name" : "Sachin Shukla"
        }
    ]
}
