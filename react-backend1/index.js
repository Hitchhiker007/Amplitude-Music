const registrationService = require('./services/registration');
const loginService = require('./services/login');
const util = require('./utils/util');
const musicService = require('./services/query');
const subscribeService = require ('./services/subscribe');
const getSubscriptionService = require ('./services/getSubscription');
const deleteSubscriptionService = require ('./services/deleteSubscription');
const loginLastFmAccountService = require ('./services/lastFmService');

const healthPath = '/health';
const registerPath = '/register';
const loginPath = '/login';
const musicQueryPath = '/query';
const subscriptionPath = '/subscribe';
const getSubscriptionPath = '/getSubscription';
const deleteSubscriptionPath = '/deleteSubscription';
const loginLastFmAccountPath = '/loginLastFm';

// here we import all of the services with functions
// and below using switch case event to see which http method is required
// then using the path to invoke which service function required to handle the users reuqest
// or handle their need in their current user flow

// main switch case which is the backbone of this lambda function
exports.handler = async (event) => {
    console.log('Request Event: ', event);
    let response;
    switch(true){
      case event.httpMethod === 'GET' && event.path === healthPath:
        response = util.buildResponse(200);
        break;
      case event.httpMethod === 'POST' && event.path === registerPath:
        // extract registration body from the event
        const registerBody = JSON.parse(event.body);
        // need await to be defined as an async function because this will be using dynamoDB
        response = await registrationService.register(registerBody);
        break;
      case event.httpMethod === 'POST' && event.path === loginPath:
        const loginBody = JSON.parse(event.body);
        response = await loginService.login(loginBody);
        break;
       // query case
      case event.httpMethod === 'POST' && event.path === musicQueryPath:
      const queryBody = JSON.parse(event.body);
      response = await musicService.queryMusic(queryBody);
      break;
      // subscribe case
      case event.httpMethod === 'POST' && event.path === subscriptionPath:
      const subscribeBody = JSON.parse(event.body);
      response = await subscribeService.subscribe(subscribeBody);
      break;
      // get subscribe case
      case event.httpMethod === 'GET' && event.path === getSubscriptionPath:
      response = await getSubscriptionService.handler(event);
      break;
      // delete subscriptuion case
      case event.httpMethod === 'DELETE' && event.path === deleteSubscriptionPath:
      response = await deleteSubscriptionService.handler(event);
      break;
      // connect last fm case
      case event.httpMethod === 'PUT' && event.path === loginLastFmAccountPath:
      const lastFmBody = JSON.parse(event.body);
      response = await loginLastFmAccountService.lastFmAccountCheck(lastFmBody);
      break;
      // default case
      default:
        response = util.buildResponse(404, '404 Not Found');
    }
    return response;
};