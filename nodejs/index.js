var client = require("request");


var URL_API = "sandbox.venzee.com"
var USERNAME = "<SET USERNAME>";
var PASSWORD = "<SET PASSWORD>";
var APP_KEY = "<SET APP_ID>";
var APP_SECRET = "<SET APP_PASSWORD>";


var DOMAIN = "https://" + APP_KEY + ':' + APP_SECRET + "@" + URL_API;

// get token with user credentials and app keys
var getToken = function(next){
 
  var data = {
    "username": USERNAME,
    "password" : PASSWORD,
    "grant_type" : "password"
  };

  var options = {
    url : DOMAIN + "/oauth/token",
    form: data
  };

  var callback = function (err, response, body){    
    if (!err && response.statusCode === 200){
      var resp = JSON.parse(body);
      console.log("==== OAUTH TOKEN ====");
      console.log(JSON.stringify(resp, null, 4));
      next(null, resp);
    } else {
      next(true);
    }
  };

  client.post(options, callback);
};

// get CurrentUser
var getCurrentUserInfo  = function(token){
  var options = {
    url: DOMAIN + "/api/user",
    auth: {
      bearer: token
    }
  };
  var callback = function (err, response, body){    
    if (!err && response.statusCode === 200){
      console.log("==== CURRENT USER ====");
      console.log(JSON.stringify(JSON.parse(body), null, 4));
    }
  };
  client.get(options, callback);
}

// get CurrentOrg
var getCurrentOrgs  = function(token){
  var options = {
    url: DOMAIN + "/api/user/orgs",
    auth: {
      bearer: token
    }
  };
  var callback = function (err, response, body){    
    if (!err && response.statusCode === 200){
      console.log("==== CURRENT ORGS ====");
      console.log(JSON.stringify(JSON.parse(body), null, 4));
    }
  };
  client.get(options, callback);
}


// ## MAIN
var main = function(){
  login()
}

if (require.main === module) {
    // Get authentication token
    getToken(function(err, resp){

      // getCurrentUser 
      getCurrentUserInfo(resp.access_token);
      getCurrentOrgs(resp.access_token);
    });
}