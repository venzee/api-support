var client = require("request");

var URL_API    = "https://api-qa.venzee.com"

module.exports.getToken = function(next){

  /* DOCUMENTATION
  *
  *  - Work as expected
  *  
  */

  var APP_KEY    = process.env.APP_KEY    || "9f0fa703f25f049c1fa9a44fc798294e";  // Set the environement variable at the command line
  var APP_SECRET = process.env.APP_SECRET || "a2015ed7f6e05ba0016f90ebbddf625f1c2dd693";
 
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

module.exports.createList = function(token, listName, next) {
  
  /* DOCUMENTATION - //createCollectionViaPost
  *  
  *  - Creating product list work but it's incomplete, and need cleanup
  *  - ADD : ImageColumn & ImageType
  *    + Need to refactor the endpoint to pass the ImageColumn and ImageType.  They are currently ignored.  
  *      This could only be specified when 'mapping a spreadsheet' right now, which need an SWF taskId...
  *  - REMOVE : Currency & Map
  *    + If removing the field are too risky, at least, make the currency optional, not mandatory
  */


  var orgname         = "payonscombule";
  var productListInfo = { 
    name: listName,
    orgname : orgname, 
    currency: "USD",
    recordSrcMapping: {"sku": "recordId"},
    recordSrcAttributes: ["sku", "name", "cost", "status", "inventory", "brand", "image"],
    imageColumns: ["image"],
    imageType: "imagesURL"
  };


  var options = {
    url: URL_API + '/api/orgs/' + orgname + '/collections',
    auth: { bearer: token },
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productListInfo)
  };
  
  var callback = function (err, response, body){    

    console.log("==== CREATE PRODUCT LIST ====");

    if (!err && response.statusCode === 200){
      console.log(JSON.stringify(JSON.parse(body), null, 4));
      next();
    }
    else {
      console.log("ERROR: " + err);
      if (response) 
        console.log("BODY: \n" + (JSON.stringify(JSON.parse(response.body), null, 4)));
      next(true);
    }
  };

  client.post(options, callback);  

}

module.exports.updateList = function(token, listName, next) {

  /* DOCUMENTATION - //updateOrgCollection
  *  
  *  - Update product list works fine
  *  - ADD : ImageType.  You should be able to update the type (probably only if there's no transfo) 
  *
  */


  var orgname    = "payonscombule";
  var collection = listName

  var productListInfo = { 
    name: listName + "-updateName",
    orgname : "payonscombule", 
    currency: "CAD",
    recordSrcMapping: {"sku": "recordId"},
    recordSrcAttributes: ["sku", "name", "cost", "status", "inventory", "brand", "image", "myNewField1", "myNewField2"],
    imageColumns: ["image"],
    imageType: "imagesURL"
  };


  var options = {
    url: URL_API + '/api/collections/' + orgname + '/' + collection,
    auth: { bearer: token },
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productListInfo)
  };
  
  var callback = function (err, response, body){    

    console.log("==== UPDATE PRODUCT LIST ====");

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

  client.put(options, callback);  

}

module.exports.deleteList = function(token, listName, next) {

  /* DOCUMENTATION - //deleteOrgCollection
  *  
  *  - Update product list works fine
  *
  */


  var orgname    = "payonscombule";
  var collection = listName;

  var productListInfo = { 
    name: collection,
    uploadingErrorExists: true
  };


  var options = {
    url: URL_API + '/api/collections/' + orgname + '/' + collection,
    auth: { bearer: token },
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productListInfo)
  };
  
  var callback = function (err, response, body){    

    console.log("==== DELETE PRODUCT LIST ====");

    if (!err && response.statusCode === 200){
      console.log(JSON.stringify(JSON.parse(body), null, 4));
    }
    else {
      console.log("ERROR: " + err);
      console.log("BODY: \n" + JSON.stringify(JSON.parse(response.body), null, 4));
    }
  };

  client.delete(options, callback);  

}