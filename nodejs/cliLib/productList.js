var client    = require("request");
var fs        = require('fs');

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

  /* DOCUMENTATION - //getOrgCollectionList
  *
  *  - Work as expected
  *  
  */

  var params = {
  	type: 'source',
  	image: false,
  	extras: false
  }

  var options = {
    url: URL_API + "/api/orgs/" + ORGNAME + "/collections",
    auth: { bearer: token },
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params)

  };

  var callback = function (err, response, body){    
    
    console.log("==== ALL PRODUCT LISTS ====");    

    if (!err && response.statusCode === 200){
      //console.log(JSON.stringify(JSON.parse(body), null, 4));
      lists = JSON.parse(body);
      
      for (var x = 0; x < lists.length; x++) {
      	console.log("  " + (x+1) + ". " + lists[x].name);	
      }
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


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.getList = function(token, listName, next) {

  /* DOCUMENTATION - //getOrgCollection
  *
  *  - Need to clarify what is the "includeExtraInfo" field.  
  *  - It returned the transformed collection attached to that source
  */

  var params = {
  	includeExtraInfo: true
  }

  var options = {
    url: URL_API + "/api/collections/" + ORGNAME + "/" + listName,
    auth: { bearer: token },
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params)

  };

  var callback = function (err, response, body){    
    
    console.log("==== GET PRODUCT LIST ====");    

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
  *  - Delete product list works fine
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


exports.downloadSourceList = function(token, listName, next) {

  /* DOCUMENTATION - //postExportCollectionRecords
  *  
  *  - Download source product list TBD
  *
  */


  var collection = listName;

  var productListInfo = { 
    action: 'exclude',
    extension: 'csv',
    recordIds: []
  };


  var options = {
    url: URL_API + '/api/collections/' + ORGNAME + '/' + collection + '/export/file',
    auth: { bearer: token },
    headers: { "Content-Type": "application/binary" },
    body: JSON.stringify(productListInfo)
  };
  
  var callback = function (err, response, body){    

    console.log("==== DOWNLOAD SOURCE PRODUCT LIST ====");

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

  client.post(options, callback) //.pipe(fs.createWriteStream('myProductList.csv'));  

}


exports.checkDownloadStatus = function(token, taskId, next) {


  /* DOCUMENTATION - //getCollectionProcessStatus
  *  
  *  - Swagger UI doesn't work.
  *  - cURL command : curl -H "Authorization: Bearer gLsZ8rhZqY6M6lwdoBLAzostI5CzrmRK" -i https://api-qa.venzee.com/collections/payonscombule/status/06D98092RH 
  *                   curl 'https://api-qa.venzee.com/api/collections/payonscombule/acme/export/file' -H 'authorization: Bearer gLsZ8rhZqY6M6lwdoBLAzostI5CzrmRK' -H 'content-type: application/json' --data '{"action":"exclude","extension":"csv","recordIds":[]}'
  */  

  var options = {
    url: URL_API + '/api/collections/' + ORGNAME + '/status/' + taskId,
    auth: { bearer: token },
    headers: { "Content-Type": "application/json" }
  };
  
  var callback = function (err, response, body){    

    console.log("==== CHECK DOWNLOAD STATUS ====");

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
  console.log(options);
  client.get(options, callback); 

}

