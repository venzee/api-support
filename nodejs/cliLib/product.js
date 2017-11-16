var client    = require("request");

const URL_API = "https://api-qa.venzee.com"
const ORGNAME = "payonscombule";


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.createProduct = function(token, productName, productId, listName, next) {

 /* DOCUMENTATION - //createNewRecordViaPost
  *  
  *  - Creating product works fine
  *  - REMOVE : Cost & Map
  *  - TO TEST: Passing imageURL at the same time (but need to create those field
  *    manually in Dynamo or test with an exiting collection !)
  *
  */

  
  var collection = listName;

  var productInfo = {
    name: productName,
    recordId: productId,
    customFields : {
      name: "My Product from Acme1", 
      cost: "6.99", 
      status: "In Stock", 
      inventory: "11", 
      brand: "Acme"
    }
  }

  var options = {
    url: URL_API + '/api/collections/' + ORGNAME + '/' + collection + '/records',
    auth: { bearer: token },
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productInfo)
  };
  
  var callback = function (err, response, body){    

    console.log("==== CREATE PRODUCT ====");

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

  client.post(options, callback);  
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.createProductBulk = function(token, productName, productId, listName, next) {

  /* DOCUMENTATION - //createUpdateBulkRecords
  *  
  *  - Need to test the way to send ImageURL
  *
  */

  var collection = listName 

  var productInfo = {
    records : [ 
      {
        name: productName + "1",
        recordId: productId + 1,
        customFields : {
          name: "My Product from Acme1", 
          cost: "6.99", 
          status: "In Stock", 
          inventory: "11", 
          brand: "Acme",
        }
      },
      {
        name: productName + "2",
        recordId: productId + 2,
        customFields : {
          name: "My Product from Acme2", 
          cost: "6.99", 
          status: "In Stock", 
          inventory: "11", 
          brand: "Acme",
        }
      },
      {
        name: productName + "3",
        recordId: productId + 3,
        customFields : {
          name: "My Product from Acme3", 
          cost: "6.99", 
          status: "In Stock", 
          inventory: "11", 
          brand: "Acme",
        }
      }
    ],
    isImageFromUrl: false
  }

  var options = {
    url: URL_API + '/api/collections/' + ORGNAME + '/' + collection + '/records/bulk',
    auth: { bearer: token },
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productInfo)
  };
  
  var callback = function (err, response, body){    

    console.log("==== CREATE 3 PRODUCTS IN BULK ====");

    if (!err && response.statusCode === 200){
      console.log(JSON.stringify(JSON.parse(body), null, 4));
      next();
    }
    else {
      console.log("ERROR: " + err);
      console.log("BODY: \n" + body);
      next(true);
    }
  };

  client.post(options, callback);    
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.getAllProducts = function(token, listName, next) {

  /* DOCUMENTATION - //getOwnedRecords
  *  
  *  - Add date format example
  *
  */

  var options = {
    url: URL_API + "/api/collections/" + ORGNAME + "/" + listName + "/records",
    auth: { bearer: token },
    headers: { "Content-Type": "application/json" },
    qs: {
      offset:0, 
      limit:50,
      order: 'desc'  // or asc
    }
  };

  var callback = function (err, response, body){    
    
    console.log("==== GET ALL PRODUCT FROM A LIST ====");    

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
exports.getProduct = function(token, listName, productId, next) {

  /* DOCUMENTATION - //getRecordByID
  *  
  *  - Improve description of Id : Refers to the "id" of a product (not to be confused with the RecordId)
  *
  */

  var options = {
    url: URL_API + "/api/collections/" + ORGNAME + "/" + listName + "/records/" + productId,
    auth: { bearer: token },
    headers: { "Content-Type": "application/json" },
  };

  var callback = function (err, response, body){    
    
    console.log("==== GET PRODUCT ====");    

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
exports.updateProduct = function(token, listName, productId, productName, next) {

  /* DOCUMENTATION - //updateRecordByID
  *  
  *  - Improve description of Id : Refers to the "id" of a product (not to be confused with the RecordId)
  *  - Improve description of customField : Give an example of the payload
  *  - REMOVE : Name, Cost, Map, videos
  *
  */

var productInfo = {
    customFields : {
      name: productName,
      cost: "1996.99", 
      status: "In Stock", 
      inventory: "11", 
      brand: "Acme"
    }
  }



var options = {
    url: URL_API + "/api/collections/" + ORGNAME + "/" + listName + "/records/" + productId,
    auth: { bearer: token },
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productInfo)
  };

  var callback = function (err, response, body){    
    
    console.log("==== UPDATE PRODUCT ====");    

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

  client.put(options, callback);
}
