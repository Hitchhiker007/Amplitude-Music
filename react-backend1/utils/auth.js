// using the jwt module for json webtokens
const jwt = require('jsonwebtoken');

// first check if jwt env variable is set in aws 
if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not defined');
}

// function top generate jwt with provided userInfo
function generateToken(userInfo) {
    // check if userInfo is provided
    if (!userInfo) {
        console.log('Error: attempted to generate JWT failed as userInfo is null');
        return null;
    }
    // sign JWT with the users info, set 2 hour expiration
    return jwt.sign(userInfo, process.env.JWT_SECRET, {
        expiresIn: '2h'
    })
}

// verify jwt and then compare with email for match check
function verifyToken(email, token) {
    // verify token with the secret key set in aws
    return jwt.verify(token, process.env.JWT_SECRET, (error, response) => {
        // error showcasing specific error
        if(error) {
            return {
                verified: false,
                message: error instanceof jwt.TokenExpiredError ? 'token expired' : 'invalid token'
            }
        }
        // email to jwt check
        if (response.email !== email) {
            return{
              verified: false,
              message: 'invalid user'  
            }
        }
        // if email and token match return verified true / success
        return {
            verified: true,
            message: 'user has been successfully verified!'
        }
    })
}
//export generated token and functions
module.exports = { generateToken, verifyToken };