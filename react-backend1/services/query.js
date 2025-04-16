const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const musicTable = 'music'; // Replace with your actual table name
const util = require('../utils/util');

async function queryMusic(queryParams) {
    // deconstrcut query params
    const { title, artist, year } = queryParams;

     // ensure that at least one of the params is provided in search
    if (!title && !artist && !year) {
        return util.buildResponse(401, { message: 'At least one query param is needed' });
    }

    // declare dynamic filter expressions
    // here placeholders for attribute names are held
    let filterExpression = '';
    let expressionAttributeNames = {}; 
    let expressionAttributeValues = {};

    if (title) {
        filterExpression += '#title = :title';
        expressionAttributeNames['#title'] = 'title';
        expressionAttributeValues[':title'] = title;
    }
    // AND is crucial for item matching
    if (artist) {
        if (filterExpression) filterExpression += ' AND ';
        filterExpression += '#artist = :artist';
        expressionAttributeNames['#artist'] = 'artist';
        expressionAttributeValues[':artist'] = artist;
    }
    if (year) {
        if (filterExpression) filterExpression += ' AND ';
        filterExpression += '#year = :year'; // Use a placeholder for 'year'
        expressionAttributeNames['#year'] = 'year'; // Define placeholder in attribute names
        expressionAttributeValues[':year'] = year.toString();
    }

    // now setup a scan of the dynamoDB
    const params = {
        TableName: musicTable,
        FilterExpression: filterExpression,
        ExpressionAttributeNames: expressionAttributeNames, 
        ExpressionAttributeValues: expressionAttributeValues
    };

    try {
        // execute scan
        const data = await dynamodb.scan(params).promise();
        // Use the util.buildResponse function to include CORS headers
        // SUCCESSFUL!
        return util.buildResponse(201, data.Items);
    } catch (error) {
        console.error('Query Music Error', error);
        // Use the util.buildResponse function to include CORS headers
        // FAILURE!
        return util.buildResponse(501, { message: 'Failed to query music' });
    }
}

module.exports = {
    queryMusic
};
