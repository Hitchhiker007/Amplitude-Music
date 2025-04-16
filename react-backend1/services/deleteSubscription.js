// declare  AWS SDK and create a DynamoDB object to interact with DynamoDB
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
// import util functions for authentication
const util = require('../utils/util');
// created a seperate subscription table storing subscriptions 
const subscriptionTable = 'subscription'; 

AWS.config.update({
    region: 'ap-southeast-2' 
});

// define ansync handler function to process incoming events
exports.handler = async (event) => {
    // parse JSON body from event object
    const body = JSON.parse(event.body);
    // deconstruct
    const { userEmail, subscriptionId } = body;
    // userEmail and sub id NEED to be provided!
    if (!userEmail || !subscriptionId) {
        // if not return error
        return util.buildResponse(401, { message: "Both user email and subscription ID are required." });
    }
    // create params for DynamoDB to delete
    const params = {
        TableName: subscriptionTable,
        Key: {
            userEmail: userEmail,
            subscriptionId: subscriptionId
        }
    };

    try {
        // delete the item from the database
        await dynamodb.delete(params).promise();
        // return verification that delete was succesful
        return util.buildResponse(200, { message: "Subscription successfully deleted." });
    } catch (error) {
        // or display error if item could not be deleted
        console.error("Error deleting subscription:", error);
        return util.buildResponse(501, { message: "Failed to delete subscription." });
    }
};
