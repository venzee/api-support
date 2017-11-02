var client = require("request");

var URL_API    = "https://api-qa.venzee.com"
var APP_KEY    = process.env.APP_KEY    || "9f0fa703f25f049c1fa9a44fc798294e";  // Set the environement variable at the command line
var APP_SECRET = process.env.APP_SECRET || "a2015ed7f6e05ba0016f90ebbddf625f1c2dd693";



// get token with user credentials and app keys
var getToken = function(next){

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
      next(null, resp);
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



// get CurrentUser
var getCurrentUserInfo  = function(token){

  /* DOCUMENTATION
  *
  *  - Work as expected
  *  
  */

  var options = {
    url: URL_API + "/api/user",
    auth: {
      bearer: token + "1"
    }
  };

  var callback = function (err, response, body){    
    
    console.log("==== CURRENT USER ====");    

    if (!err && response.statusCode === 200){
      console.log(JSON.stringify(JSON.parse(body), null, 4));
    }
    else {
      console.log("ERROR: " + err);
      console.log("BODY: \n" + JSON.stringify(response, null, 4));
    }
  };

  client.get(options, callback);
}



// get CurrentOrg
var getCurrentOrgs  = function(token){

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
    }
    else {
      console.log("ERROR: " + err);
      console.log("BODY: \n" + JSON.stringify(JSON.parse(response.body), null, 4));
    }
  };
  
  client.get(options, callback);
}



var createProductList = function (token, next) {
  
  /* DOCUMENTATION
  *  
  *  - Creating product is fine
  *  - Need to refactor the endpoint to pass the ImageColumn and ImageType.  They are currently ignored.  
  *    This could only be specified when mapping a spreadsheet right now, which need an SWF taskId...
  *
  */


  var orgname         = "payonscombule";
  var productListInfo = { 
    name: "TestCollection8",
    orgname : "payonscombule", 
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
      console.log("BODY: \n" + JSON.stringify(JSON.parse(response.body), null, 4));
      next(true);
    }
  };

  client.post(options, callback);  
}


var createProduct = function(token) {

  /* DOCUMENTATION
  *  
  *  - Creating product is fine
  *  - Need to test passing imageURL at the same time
  *
  */

  var orgname    = "payonscombule";
  var collection = "testcollection8" 

  var productInfo = {
    name: "testProductName2",
    recordId: 667,
    customFields : {
      name: "My Product from Acme1", 
      cost: "6.99", 
      status: "In Stock", 
      inventory: "11", 
      brand: "Acme"
    }
  }

  var options = {
    url: URL_API + '/api/collections/' + orgname + '/' + collection + '/records',
    auth: { bearer: token },
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productInfo)
  };
  
  var callback = function (err, response, body){    

    console.log("==== CREATE PRODUCT ====");

    if (!err && response.statusCode === 200){
      console.log(JSON.stringify(JSON.parse(body), null, 4));
    }
    else {
      console.log("ERROR: " + err);
      console.log("BODY: \n" + JSON.stringify(JSON.parse(response.body), null, 4));
    }
  };

  client.post(options, callback);  
}



var createProductInBulk = function(token) {

  /* DOCUMENTATION
  *  
  *  - Creating product is fine BUT the API crash and return a 402.  Carlos is fixing that.  A param is missing when calling a function.
  *  - Need to find the way to send ImageURL
  *
  */

  var orgname    = "payonscombule";
  var collection = "testcollection8" 

  var productInfo = {
    records : [ 
      {
        //id:"1",
        name: "testProductName6",
        recordId: 66,
        customFields : {
          name: "My Product from Acme1", 
          cost: "6.99", 
          status: "In Stock", 
          inventory: "11", 
          brand: "Acme",
        }
      },
      {
        //id:"2",
        name: "testProductName4",
        recordId: 67,
        customFields : {
          name: "My Product from Acme1", 
          cost: "6.99", 
          status: "In Stock", 
          inventory: "11", 
          brand: "Acme",
          isImageFromUrl: true
        }
      },
      {
        //id:"3",
        name: "testProductName5",
        recordId: 68,
        customFields : {
          name: "My Product from Acme1", 
          cost: "6.99", 
          status: "In Stock", 
          inventory: "11", 
          brand: "Acme",
          isImageFromUrl: true
        }
      }
    ]
  }

  var options = {
    url: URL_API + '/api/collections/' + orgname + '/' + collection + '/records/bulk',
    auth: { bearer: token },
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productInfo)
  };
  
  var callback = function (err, response, body){    

    console.log("==== CREATE 3 PRODUCTS IN BULK ====");

    if (!err && response.statusCode === 200){
      console.log(JSON.stringify(JSON.parse(body), null, 4));
    }
    else {
      console.log("ERROR: " + err);
      console.log("BODY: \n" + body);
    }
  };

  client.post(options, callback);  
}


var updateProductList = function(token) {

  /* DOCUMENTATION
  *  
  *  - Update product listis fine
  *  - Need to refactor the endpoint to pass the ImageType.  They are currently ignored.  
    *
  */


  var orgname    = "payonscombule";
  var collection = 'TestCollection5';

  var productListInfo = { 
    name: "Test_Collection_5",
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
    }
    else {
      console.log("ERROR: " + err);
      console.log("BODY: \n" + JSON.stringify(JSON.parse(response.body), null, 4));
    }
  };

  client.put(options, callback);  

}






//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ## MAIN
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var main = function(){
  login()
}

if (require.main === module) {

    // Get authentication token
    getToken(function(err, res){

      if (!err) {
        
        //getCurrentUserInfo(res.access_token);
        //getCurrentOrgs(res.access_token);

        createProductList(res.access_token, function(err) { 
        
          if (!err) {
            createProduct(res.access_token);
            createProductInBulk(res.access_token);

            //updateProductList(res.access_token)

          }

        });

      }

    });
}


/* ==============================================================================================
   PROJECT DEV PORTAL

  
    END POINT                         REFERENCE                                    STATUS
    --------------------------------------------------------------------------------------------

  - [auth] Get token                  //createAccessToken                           DONE
  - [auth] Update token               /api/refresh                                  todo

  - [profile] Get current user        //getAuthenticatedUser                        DONE
  - [profile] Get current org         //getOrgs                                     DONE

  - [import] Create a product list    //createCollectionViaPost                     DONE
  - [import] Update a product list    //updateOrgCollection                         todo
  - [import] Delete a product list    //deleteOrgCollection                         todo

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


