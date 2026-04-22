const AWS = require('aws-sdk');
AWS.config.update({
    region: 'ap-southeast-2'
})
const util = require('../utils/util');
// im using bcryptjs for hashing  passwords
const dynamodb = new AWS.DynamoDB.DocumentClient();
const loginTable = 'login';

const axios = require('axios');
const lastFmApiKey = process.env.LASTFM_API_KEY;

async function lastFmAccountCheck(user) {
    const email = user.email;
    const lastFmUsername = user.lastFmUsername;
    const lastFmConnectionUrl = `http://ws.audioscrobbler.com/2.0/?method=user.getInfo&user=${lastFmUsername}&api_key=${lastFmApiKey}&format=json`
    // both email and password must be provided!
    if (!user || !email || !lastFmUsername){
        return util.buildResponse(403, { message: 'Error! User does not have a connected last fm account!'});
        
    }

    try {
        const response = await axios.get(lastFmConnectionUrl);

        if (response.data.error) {
            return util.buildResponse(403, { message: 'Last.fm username does not exist!' });
        }

        await updateCurrentUser(email, lastFmUsername);
        return util.buildResponse(200, { message: 'Last.fm account connected successfully!' });

    } catch (error) {
        console.error('Error connecting Last.fm account:', error);
        return util.buildResponse(503, { message: 'Could not connect to Last.fm, please try again!' });
    }
}

async function updateCurrentUser(email, lastFmUsername) {
    const params = {
        TableName: loginTable,
        Key: {
            email: email
        },
        UpdateExpression: 'set lastFmUsername = :lastFmUsername',
        ExpressionAttributeValues: {
            ':lastFmUsername': lastFmUsername
        }
    };

    return await dynamodb.update(params).promise().then(response => {
        return response;
    }, error => {
        console.error('Error! Could not update user!', error);
    });
}

module.exports.lastFmAccountCheck = lastFmAccountCheck;