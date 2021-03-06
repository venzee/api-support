var client = require("request");

var URL_API    = "https://api-qa.venzee.com"
var APP_KEY    = process.env.APP_KEY    || null;  // Set the environement variable at the command line
var APP_SECRET = process.env.APP_SECRET || null;



// get token with user credentials and app keys
var getToken = function(next){
 
  var credentials = {
    id: APP_KEY,
    secret : APP_SECRET,
  };

  var options = {
    url : URL_API + "/api/app/token",
    form: credentials
  };

  var callback = function (err, response, body){    
    
    if (!err && response.statusCode === 200){
      var resp = JSON.parse(body);
      console.log("==== OAUTH TOKEN ====");
      console.log(JSON.stringify(resp, null, 4));
      next(null, resp);
    } 
    else {
      console.log("ERROR: " + err);
      next(true);
    }
  };

  if (APP_KEY == null || APP_SECRET == null) {
    console.log('Please set your APP_KEY & APP_SECRET as environment variables');
    return next(true); // error
  }

  client.post(options, callback);
};



// get CurrentUser
var getCurrentUserInfo  = function(token){

  var options = {
    url: URL_API + "/api/user",
    auth: {
      bearer: token
    }
  };

  var callback = function (err, response, body){    
    if (!err && response.statusCode === 200){
      console.log("==== CURRENT USER ====");
      console.log(JSON.stringify(JSON.parse(body), null, 4));
    }
    else {
      console.log("ERROR: " + err.toString());
    }
  };

  client.get(options, callback);
}



// get CurrentOrg
var getCurrentOrgs  = function(token){
  
  var options = {
    url: URL_API + "/api/user/orgs",
    auth: {
      bearer: token
    }
  };
  
  var callback = function (err, response, body){    
    if (!err && response.statusCode === 200){
      console.log("==== CURRENT ORGS ====");
      console.log(JSON.stringify(JSON.parse(body), null, 4));
    }
    else {
      console.log("ERROR: " + err.toString());
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

      if (!err) {
        getCurrentUserInfo(resp.access_token);
        getCurrentOrgs(resp.access_token);
      }

    });
}




