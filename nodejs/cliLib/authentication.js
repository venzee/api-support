var client = require("request");

const URL_API    = "https://api-qa.venzee.com"
const APP_KEY    = process.env.APP_KEY    || "";  // Set the environement variable at the command line
const APP_SECRET = process.env.APP_SECRET || "";



//////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.getToken = function(next){

  /* DOCUMENTATION
  *
  *  - Work as expected
  *  
  */

  var credentials = {
    id: APP_KEY,
    secret : APP_SECRET,
  };

  var options = {
    url : URL_API + "/api/app/token",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
  };

  var callback = function (err, response, body){    

    console.log("==== OAUTH TOKEN ====");    

    if (!err && response.statusCode === 200){
      var resp = JSON.parse(body);
      console.log(JSON.stringify(resp, null, 4));
      next(null, resp.access_token);
    } 
    else {
      console.log("ERROR: " + err);
      console.log("BODY: \n" + JSON.stringify(JSON.parse(response.body), null, 4));
      next(true);
    }
  };

  if (APP_KEY == null || APP_SECRET == null) {
    console.log('Please set your APP_KEY & APP_SECRET as environment variables');
    return next(true); // error
  }

  client.post(options, callback);
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.refreshToken = function(token, next){

  /* DOCUMENTATION
  *
  *  - TBD
  *  
  */

 
  var currentToken = {
    refresh_token: token
  };

  var options = {
    url : URL_API + "/api/refresh",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(currentToken)
  };

  var callback = function (err, response, body){    

    console.log("==== OAUTH TOKEN ====");    

    if (!err && response.statusCode === 200){
      var resp = JSON.parse(body);
      console.log(JSON.stringify(resp, null, 4));
      next(null, resp.refresh_token);
    } 
    else {
      console.log("ERROR: " + err);
      console.log("BODY: \n" + JSON.stringify(JSON.parse(response.body), null, 4));
      next(true);
    }
  };

  client.post(options, callback);
};
