var client    = require("request");

const URL_API = "https://api-qa.venzee.com"
const ORGNAME = "payonscombule";


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.getCurrentOrg = function(token, next) {

  /* DOCUMENTATION - //getAuthenticatedUser
  *
  *  - Work as expected
  *  
  */

  var options = {
    url: URL_API + "/api/user/orgs",
    auth: {
      bearer: token
    }
  };
  
  var callback = function (err, response, body){    
  
    console.log("==== CURRENT ORGS ====");

    if (!err && response.statusCode === 200){
      console.log(JSON.stringify(JSON.parse(body), null, 4));
      next();
    }
    else {
      console.log("ERROR: " + err);
      console.log("BODY: \n" + JSON.stringify(JSON.parse(response.body), null, 4));
      next(true);
    }
  };
  
  client.get(options, callback);
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.getCurrentUser = function(token, next) {

  /* DOCUMENTATION
  *
  *  - Work as expected
  *  
  */

  var options = {
    url: URL_API + "/api/user",
    auth: {
      bearer: token
    }
  };

  var callback = function (err, response, body){    
    
    console.log("==== CURRENT USER ====");    

    if (!err && response.statusCode === 200){
      console.log(JSON.stringify(JSON.parse(body), null, 4));
      next();
    }
    else {
      console.log("ERROR: " + err);
      console.log("BODY: \n" + JSON.stringify(response, null, 4));
      next(true);
    }
  };

  client.get(options, callback);
}
