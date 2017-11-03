var client    = require("request");

const URL_API = "https://api-qa.venzee.com"
const ORGNAME = "payonscombule";


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.createList = function(token, listName, next) {
  
  /* DOCUMENTATION - //createCollectionViaPost
  *  
  *  - Creating product list work but it's incomplete, and need cleanup
  *  - ADD : ImageColumn & ImageType
  *    + Need to refactor the endpoint to pass the ImageColumn and ImageType.  They are currently ignored.  
  *      This could only be specified when 'mapping a spreadsheet' right now, which need an SWF taskId...
  *  - REMOVE : Currency & Map
  *    + If removing the field are too risky, at least, make the currency optional, not mandatory
  */


  var productListInfo = { 
    name: listName,
    orgname : ORGNAME, 
    currency: "USD",
    recordSrcMapping: {"sku": "recordId"},
    recordSrcAttributes: ["sku", "name", "cost", "status", "inventory", "brand", "image"],
    imageColumns: ["image"],
    imageType: "imagesURL"
  };


  var options = {
    url: URL_API + '/api/orgs/' + ORGNAME + '/collections',
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


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.getAllLists = function(token, next) {
  // TODO
  console.log("getAllLists!")
  next();
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.getList = function(token, listName, next) {
  // TODO
  console.log("getList!")
  next();
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.updateList = function(token, listName, next) {

  /* DOCUMENTATION - //updateOrgCollection
  *  
  *  - Update product list works fine
  *  - ADD : ImageType.  You should be able to update the type (probably only if there's no transfo) 
  *
  */



  var collection = listName

  var productListInfo = { 
    name: listName + "-updateName",
    orgname : ORGNAME, 
    currency: "CAD",
    recordSrcMapping: {"sku": "recordId"},
    recordSrcAttributes: ["sku", "name", "cost", "status", "inventory", "brand", "image", "myNewField1", "myNewField2"],
    imageColumns: ["image"],
    imageType: "imagesURL"
  };


  var options = {
    url: URL_API + '/api/collections/' + ORGNAME + '/' + collection,
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


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.deleteList = function(token, listName, next) {

  /* DOCUMENTATION - //deleteOrgCollection
  *  
  *  - Update product list works fine
  *
  */


  var collection = listName;

  var productListInfo = { 
    name: collection,
    uploadingErrorExists: true
  };


  var options = {
    url: URL_API + '/api/collections/' + ORGNAME + '/' + collection,
    auth: { bearer: token },
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productListInfo)
  };
  
  var callback = function (err, response, body){    

    console.log("==== DELETE PRODUCT LIST ====");

    if (!err && response.statusCode === 200){
      console.log(JSON.stringify(JSON.parse(body), null, 4));
      next()
    }
    else {
      console.log("ERROR: " + err);
      console.log("BODY: \n" + JSON.stringify(JSON.parse(response.body), null, 4));
      next(true);
    }
  };

  client.delete(options, callback);  
}
