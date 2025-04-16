const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const util = require('../utils/util');
const subscriptionTable = 'subscription';  

AWS.config.update({
    region: 'ap-southeast-2' 
  });

  exports.handler = async (event) => {
    // extract user email from the query string parameters in the incoming event
    const userEmail = event.queryStringParameters && event.queryStringParameters.email;
    // check is userEmail exists in the qeury params
    if (!userEmail) {
        return util.buildResponse(401, { message: "userEmail is required" });
    }

    // declare params for dynamoDB query
    // https://docs.aws.amazon.com/sdk-for-net/v3/developer-guide/dynamodb-expressions.html
    const params = {
        TableName: subscriptionTable,
        KeyConditionExpression: "userEmail = :email",
        ExpressionAttributeValues: {
            ":email": userEmail
        }
    };

    try {
        // finally perform the query
        const data = await dynamodb.query(params).promise();
        // return 201 if succesful
        return util.buildResponse(201, data.Items);
    } catch (error) {
        // otherwise display error
        console.error("Error fetching subscriptions ", error);
        return util.buildResponse(500, { message: "Cannot fetch subscriptions" });
    }
};