const AWS = require('aws-sdk');
AWS.config.update({
    region: 'ap-southeast-2'
})
const util = require('../utils/util');
const bcrypt = require('bcryptjs');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const loginTable = 'login';

async function register(userInfo) {
    // first lets get the info from the users input
    const email = userInfo.email;
    const password = userInfo.password;
    const username = userInfo.user_name;
    // VALIDATE thats all fields are required!
    if (!username || !password || !email){
        return util.buildResponse(405, {
            message: 'Error! All input fields are required'
        })
    }
    // check if user exists already in the login table
    const dynamoUser = await getUser(email);
    if (dynamoUser && dynamoUser.email){
        return util.buildResponse(406, {
            message: 'Error! User already exists!'
        }) 
    }
    
    // if the email is unique lets ecnrypt their password using the library bcrypt
    const encryptedPassword = bcrypt.hashSync(password.trim(), 10);
    const user = {
        email: email,
        username: username.toLowerCase().trim(),
        password: encryptedPassword
    }
    // after encyprting user and ensuring the users email is unique save the user to the dynamo database
    const saveUserResponse = await saveUser(user);
    if (!saveUserResponse) {
        return util.buildResponse(503, {message: 'SERVER ERROR! Could Not Save User'})
    }
    // successful addition to the database
    return util.buildResponse(201, {username: username});

}

//DynamoDB OPERATIONS -----------------------------------------------------------------------------------------

// get user from table to check if they exist by using email as the unique identifier
async function getUser(email) {
    const params = {
        TableName: loginTable,
        Key: {
            email: email
        }
    }

    return await dynamodb.get(params).promise().then(response => {
        return response.Item;
    }, error => {
        console.error('Error! getUser Not Working!', error);
    })
}

// save all of the users details to the dynamo db using the user object
async function saveUser(user) {
    const params = {
        TableName: loginTable,
        Item: user
    }
    // put operation
    return await dynamodb.put(params).promise().then(() => {
        return true;
    }, error => {
        console.error('There Is An Error With saveUser() code better!:', error)
    });
}

module.exports.register = register;

