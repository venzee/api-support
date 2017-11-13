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

  //curl -X POST -u "9f0fa703f25f049c1fa9a44fc798294e:a2015ed7f6e05ba0016f90ebbddf625f1c2dd693" --data 'refresh_token=DCyyCyOXp0FHMMeAkeuknFrqZetQBnHX&grant_type=refresh_token' -i https://api-qa.venzee.com/oauth/token

  //curl -X POST --data 'refresh_token=DCyyCyOXp0FHMMeAkeuknFrqZetQBnHX&grant_type=refresh_token' -i https://9f0fa703f25f049c1fa9a44fc798294e:a2015ed7f6e05ba0016f90ebbddf625f1c2dd693@api-qa.venzee.com/oauth/token
 
  var currentToken = {
    refresh_token: token,
    grant_type: "refresh_token"
  };

  var options = {
    url : "https://" + APP_KEY + ":" + APP_SECRET + "@api-qa.venzee.com/oauth/token",
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
