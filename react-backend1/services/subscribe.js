const AWS = require('aws-sdk'); 
AWS.config.update({ region: 'ap-southeast-2' }); 
const util = require('../utils/util'); 
// to interact with the DynamoDB service
const dynamodb = new AWS.DynamoDB.DocumentClient(); 
// using the new subscription table for this section of the implementation
const subscriptionTable = 'subscription'; 

async function subscribe(songInfo) {
    // first deconstruct
    const { userEmail, title, artist, img_url } = songInfo;

    // validate that none of the fields are empty
    if (!userEmail.trim() || !title.trim() || !artist.trim()) {
        return util.buildResponse(400, {
            message: 'a field is missing'
        });
    }

    // ESSENTIAL!
    // its a must to create a new unique subscriptionID based on the users Email, the artist and title of the song
    // spaces are replaced with underscore and all strings are converted to lowercase
    // the use of the userEmail ensures that there can be no duplicates in the subscription table which is important for deletion
    // as when creating a user there a verification check to see whther or not a user with the same email address already exists!
    const subscriptionId = `${userEmail}:${artist}:${title}`.replace(/\s+/g, '_').toLowerCase();

    // prepare submission for injection into dynamodb
    const subscription = {
        subscriptionId: subscriptionId,
        userEmail: userEmail,
        title: title,
        artist: artist,
        // img_url is already assinged no need for id
        img_url: img_url
    };

    const params = {
        TableName: subscriptionTable,
        Item: subscription,
        ConditionExpression: 'attribute_not_exists(SubscriptionId)'
    };

    // using the dynamo put()
    try {
        await dynamodb.put(params).promise();
        return util.buildResponse(201, {
            // success!
            message: 'successfully subscribed to the song',
            subscriptionId: subscriptionId,
            data: subscription
        });
    } catch (error) {
        console.error('Error subscribing to the song', error);
        return util.buildResponse(501, {
            message: 'Server Error: Could not subscribe to the song!'
        });
    }
}

module.exports = { subscribe };
