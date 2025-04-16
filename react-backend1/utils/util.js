// construct http response object
function buildResponse(statusCode, body){
    return {
      // http status for debugging
      statusCode: statusCode,
      headers:{
        // allow all domains to access the aws resource
        // enabling CORS
        'Access-Control-Allow-Origin': '*',
        // specify JSON for response content
        'Content-Type': 'application/json'
      },
      // concert body into json string 
      body: JSON.stringify(body)
    }
  }
// exported and used many times in the index.js 
module.exports.buildResponse = buildResponse;