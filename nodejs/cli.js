var vorpal  = require('vorpal')();

var auth        = require("./cliLib/authentication.js");
var user        = require("./cliLib/user.js");
var productList = require("./cliLib/productList.js");
var product     = require("./cliLib/product.js");
var download    = require("./cliLib/download.js");

var bearerToken;


/* ==============================================================================================
   PROJECT DEV PORTAL
   ==============================================================================================
  
    END POINT                         REFERENCE                                    STATUS
    ---------------------------------------------------------------------------------------------

  - [auth] Get token                  //createAccessToken                           DONE
  - [auth] Update token               /api/refresh                                  In Progress

  - [profile] Get current user        //getAuthenticatedUser                        DONE
  - [profile] Get current org         //getOrgs                                     DONE

  - [import] Create a product list    //createCollectionViaPost                     DONE
  - [import] Update a product list    //updateOrgCollection                         DONE
  - [import] Delete a product list    //deleteOrgCollection                         DONE

  - [import] Create a product         //createNewRecordViaPost                      DONE 
                                      //createUpdateBulkRecords                     DONE
  - [import] Update a product         //updateRecordByID                            DONE 
  - [import] Delete a product         n/a                                           DONE

  - [export] Get the product lists    //getOrgCollectionList                        DONE
  - [export] Get a products list      //getOrgCollection                            DONE
  - [export] Get the list of product  //getOwnedRecords                             DONE
  - [export] Get a product            //getRecordByID                               DONE

  - [export] Download file            //postExportCollectionRecords                 todo
                                      //postExportSharedCollectionRecords           todo
                                      //postExportTransformedCollectionRecords      todo
                                      //postExportTransformedSharedCollectionRecords todo

  - [export] Download images          //exportCollectionImages                      todo
                                      //exportSharedCollectionImages                todo
                                      //exportTransformedSharedCollectionImages     todo
                                      //exportTransformedCollectionImages           todo


  */




// Remove the Exit command to rebuild it with multiple alias
var exit = vorpal.find('exit');
exit.remove();

vorpal
  .command('exit', '[e or q] Exit the CLI.')
  .alias('q')
  .alias('e')
  .action(function(args, callback) {
    vorpal.exec("exit");    
  })


// User commands
vorpal
  .command('getToken', '[t] Get getToken from API key & secret in env variable.')
  .alias('t')
  .alias('gt')
  .action(function(args, callback) {
    this.log('Getting token...');
    auth.getToken(function(err, token) {
    	bearerToken = token;
    	console.log('bearerToken: ' + bearerToken);
    	callback();
    });
  });

vorpal
  .command('refreshToken', '[r] Refresh the bearer token')
  .alias('r')
  .action(function(args, callback) {
    this.log('Refreshing the token...');
    auth.refreshToken(bearerToken, function(err, newBearerToken) {
      bearerToken = newBearerToken;
      console.log('New bearerToken: ' + bearerToken);
      callback();
    });  
  })
  .hidden();

vorpal
  .command('getCurrentOrg', '[go] Get the current organization detail')
  .alias('go')
  .action(function(args, callback) {
    this.log('Getting organization details...');
    user.getCurrentOrg(bearerToken, function(err) {
      callback();
    }); 
  });

vorpal
  .command('getCurrentUser', '[gu] Get the current user detail')
  .alias('gu')
  .action(function(args, callback) {
    this.log('Getting user details...');
    user.getCurrentUser(bearerToken, function(err) {
      callback();
    }); 
  });

vorpal
  .command('---------------------', '--------------------------------------------')
  .alias('-1')
  .action(function(args, callback) {
    callback();
  });

vorpal
  .command('createList [name]', '[cl] Create a product list. "mylist" is the default name')
  .alias('cl')
  .action(function(args, callback) {
  	listName = args.name || "mylist"
    this.log('Creating list ' + listName + "...");
    productList.createList(bearerToken, listName, function(err) {
      callback();
    });	
  });

vorpal
  .command('updateList [name]', '[ul] Update a product list.')
  .alias('ul')
  .action(function(args, callback) {
  	listName = args.name || "mylist"
    this.log('Updating list ' + listName + "...");
    productList.updateList(bearerToken, listName, function(err) {
      callback();
    });	
  });

vorpal
  .command('getAllLists', '[gal] Get all the product list.')
  .alias('gal')
  .action(function(args, callback) {
    this.log('Getting lists...');
    productList.getAllLists(bearerToken, function(err) {
      callback();
    }); 
  });

vorpal
  .command('getList [name]', '[gl] Get a the product list.')
  .alias('gl')
  .action(function(args, callback) {
    var listName = args.name || "mylist"
    this.log('Getting list info for ' + listName + '...');
    productList.getList(bearerToken, listName, function(err) {
      callback();
    }); 
  });

vorpal
  .command('deleteList [name]', '[dl] Delete a product list.')
  .alias('dl')
  .action(function(args, callback) {
  	listName = args.name || "mylist"
    this.log('Deleteing list ' + listName + "...");
    productList.deleteList(bearerToken, listName, function(err) {
      callback();
    });	
  });

vorpal
  .command('----------------------', '--------------------------------------------')
  .alias('-2')
  .action(function(args, callback) {
    callback();
  });

vorpal
  .command('createProduct [name] [id] [listName]', '[cp] Create a product. "mylist" is the default listName')
  .alias('cp')
  .action(function(args, callback) {
    productName = args.name || "myProduct";
    productId   = args.id   || "999"
    listName    = args.listName || "mylist";
    this.log('Creating product ' + productName + "...");
    product.createProduct(bearerToken, productName, productId, listName, function(err) {
      callback();
    }); 
  });

vorpal
  .command('createProductBulk [name] [id] [listName]', '[cpb] Create a product in bulk. "mylist" is the default listName')
  .alias('cpb')
  .action(function(args, callback) {
    productName = args.name || "myProduct";
    productId   = args.id   || "10"
    listName    = args.listName || "mylist";

    this.log('Creating 3 products in bulk from ' + productName + "...");
    product.createProductBulk(bearerToken, productName, productId, listName, function(err) {
      callback();
    }); 
  });

vorpal
  .command('getAllProducts [listName]', '[gap] Get the product that are on a list. "mylist" is the default list')
  .alias('gap')
  .action(function(args, callback) {
    listName    = args.listName || "mylist";

    this.log('Getting products from ' + listName + "...");
    product.getAllProducts(bearerToken, listName, function(err) {
      callback();
    }); 
  });

vorpal
  .command('getProduct [id]', '[gp] Get a Product by id. "myProduct" is the default product')
  .alias('gp')
  .action(function(args, callback) {
    productId   = args.id   || "MY44BZTIFK"
    listName    = args.listName || "mylist";

    this.log('Getting product id ' + productId + " from list " + listName + "...");
    product.getProduct(bearerToken, listName, productId, function(err) {
      callback();
    }); 
  });


vorpal
  .command('updateProduct [id] [title]', '[up] Update a Product by id. "myProduct" is the default product')
  .alias('up')
  .action(function(args, callback) {
    productId   = args.id       || "MY44BZTIFK"
    listName    = args.listName || "mylist";
    newTitle    = args.title    || "My Updated ACME Product"

    this.log('Updating product id ' + productId + " from list " + listName + "...");
    product.updateProduct(bearerToken, listName, productId, newTitle, function(err) {
      callback();
    }); 
  });


vorpal.exec("help");

vorpal
  .delimiter("\x1b[33mvzApi $ ")
  .show();


