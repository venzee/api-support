var client = require("request");

const URL_API    = "https://api-qa.venzee.com"
const APP_KEY    = process.env.APP_KEY    || "9f0fa703f25f049c1fa9a44fc798294e";  // Set the environement variable at the command line
const APP_SECRET = process.env.APP_SECRET || "a2015ed7f6e05ba0016f90ebbddf625f1c2dd693";
const ORGNAME    = "payonscombule";


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

exports.getCurrentOrg = function(token, next) {

  /* DOCUMENTATION
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

exports.getAllLists = function(token, next) {
  // TODO
  console.log("getAllLists!")
  next();
}

exports.getList = function(token, listName, next) {
  // TODO
  console.log("getList!")
  next();
}

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

exports.getAllProducts = function(token, listName, next) {
  // TODO
  console.log("getAllProducts!")
  next();
}

exports.getProduct = function(token, productId, listName, next) {
  // TODO
  console.log("getProduct!")
  next();
}

exports.updateProduct = function(token, productId, productName, listName, next) {
  // TODO
  console.log("updateProduct!")
  next();
}

exports.downloadSourceList = function(token, listName, next) {
  // TODO
}

exports.downloadSharedList = function(token, listName, next) {
  // TODO
}

exports.downloadTransformedList = function(token, listName, next) {
  // TODO
}

exports.downloadTransformedSharedList = function(token, listName, next) {
  // TODO
}

exports.downloadSourceListImg = function(token, listName, next) {
  // TODO
}

exports.downloadSharedListImg = function(token, listName, next) {
  // TODO
}

exports.downloadTransformedListImg = function(token, listName, next) {
  // TODO
}

exports.downloadTransformedSharedListImg = function(token, listName, next) {
  // TODO
}



/* ==============================================================================================
   PROJECT DEV PORTAL

  
    END POINT                         REFERENCE                                    STATUS
    --------------------------------------------------------------------------------------------

  - [auth] Get token                  //createAccessToken                           DONE
  - [auth] Update token               /api/refresh                                  ??

  - [profile] Get current user        //getAuthenticatedUser                        DONE
  - [profile] Get current org         //getOrgs                                     DONE

  - [import] Create a product list    //createCollectionViaPost                     DONE
  - [import] Update a product list    //updateOrgCollection                         DONE
  - [import] Delete a product list    //deleteOrgCollection                         DONE

  - [import] Create a product         //createNewRecordViaPost                      DONE 
                                      //createUpdateBulkRecords                     DONE
  - [import] Update a product         //updateRecordByID                            todo 
  - [import] Delete a product         n/a                                           todo

  - [export] Get the product lists    //getOrgCollectionList                        todo
  - [export] Get a products list      //getOrgCollection                            todo
  - [export] Get the list of product  //getOwnedRecords                             todo
  - [export] Get a product            //getRecordByID                               todo
  - [export] Download file            //postExportCollectionRecords                 todo
                                      //postExportSharedCollectionRecords           todo
                                      //postExportTransformedCollectionRecords      todo
                                      //postExportTransformedSharedCollectionRecords todo

  - [export] Download images          //exportCollectionImages                      todo
                                      //exportSharedCollectionImages                todo
                                      //exportTransformedSharedCollectionImages     todo
                                      //exportTransformedCollectionImages           todo


  */


