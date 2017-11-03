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
    ]
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
  // TODO
  console.log("getAllProducts!")
  next();
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.getProduct = function(token, productId, listName, next) {
  // TODO
  console.log("getProduct!")
  next();
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.updateProduct = function(token, productId, productName, listName, next) {
  // TODO
  console.log("updateProduct!")
  next();
}
