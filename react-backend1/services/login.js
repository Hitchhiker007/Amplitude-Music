const AWS = require('aws-sdk');
AWS.config.update({
    region: 'ap-southeast-2'
})
const util = require('../utils/util');
// im using bcryptjs for hashing  passwords
const bcrypt = require('bcryptjs');
// using utilities for token generation
const auth = require('../utils/auth');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const loginTable = 'login';

async function login(user) {
    const email = user.email;
    const password = user.password;
    // both email and password must be provided!
    if (!user || !email || !password){
        return util.buildResponse(401, {
            message: 'Email and Password Are Required!'
        })
    }
    // now retrieve the user data from DynamoDB with the provided email
    const dynamoUser = await getUser(email);
    if (!dynamoUser || !dynamoUser.email) {
        return util.buildResponse(403, { message: 'Error! User with this email does not exist'});
    }
    // using bcrypt to compare  password with the current stored hashed password in the login table
    // this is why when adding users manually or through scripts they exist in the table but there passwords are not hashed!
    if(!bcrypt.compareSync(password, dynamoUser.password)) {
        return util.buildResponse(403, { message: 'Password Does Not Match Email'});
    }

    // create user info for resposne
    const userInfo = {
        email: dynamoUser.email,
        // for displaying user when they log in
        username: dynamoUser.username,
        lastFmUsername: dynamoUser.lastFmUsername
    }
    // now genearate a token 
    const token = auth.generateToken(userInfo);
    const response = {
        user: userInfo,
        token: token
    }
    return util.buildResponse(200, response);
}

// function for fetching user email to be used for logging in the user
async function getUser(email) {
    const params = {
        TableName: loginTable,
        Key: {
            email: email
        }
    }

    // attempt to get user data!
    return await dynamodb.get(params).promise().then(response => {
        return response.Item;
    }, error => {
        console.error('Error! getUser Not Working!', error);
    })
}

module.exports.login = login;