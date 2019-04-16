/**
* Import Modules
*/
const AWS = require('aws-sdk');


/**
* Local Modules
*/
const config = require('../../constants/config');




/**
* AWS Configuration
*/
AWS.config = new AWS.Config({
    region: config.AWS.REGION,
    accessKeyId: config.AWS.ACCESS_KEY_ID,
    secretAccessKey: config.AWS.SECRET_ACCESS_KEY    
});


// Create the DynamoDB service object
const dynamo = new AWS.DynamoDB({apiVersion: config.AWS.API_VERSION});



/**
* Exports Module
*/
const fn = module.exports = {};




fn.get = function(table, key, callback) {

    dynamo.getItem(
    {
        Key: key,
        TableName: table
    },
    (error, data) => {
        
        if(error) {

            console.log(error);
        
        } else {

            callback(data);
        }
    });
}




fn.create = function(table, item, callback) {

    dynamo.putItem(
    {
        Item: item,
        TableName: table
    },
    (error, data) => {

        if(error) {
            
            console.log(error);

        } else {

            callback(true);
        }
    });
}