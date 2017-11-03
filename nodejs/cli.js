var cliFunc = require('./functionCli.js');
const vorpal = require('vorpal')();
 
var bearerToken;

var exit = vorpal.find('exit');
exit.remove();

vorpal
  .command('exit', '[e or q] Exit the CLI.')
  .alias('q')
  .alias('e')
  .action(function(args, callback) {
    vorpal.exec("exit");    
  })


vorpal
  .command('getToken', '[t] Get getToken from API key & secret in env variable.')
  .alias('t')
  .alias('gt')
  .action(function(args, callback) {
    this.log('Getting token...');
    cliFunc.getToken(function(err, token) {
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
    cliFunc.refreshToken(bearerToken, function(err, newBearerToken) {
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
    cliFunc.getCurrentOrg(bearerToken, function(err) {
      callback();
    }); 
  });

vorpal
  .command('getCurrentUser', '[gu] Get the current user detail')
  .alias('gu')
  .action(function(args, callback) {
    this.log('Getting user details...');
    cliFunc.getCurrentUser(bearerToken, function(err) {
      callback();
    }); 
  });


vorpal
  .command('createList [name]', '[cl] Create a product list. "mylist" is the default name')
  .alias('cl')
  .action(function(args, callback) {
  	listName = args.name || "mylist"
    this.log('Creating list ' + listName + "...");
    cliFunc.createList(bearerToken, listName, function(err) {
      callback();
    });	
  });

vorpal
  .command('updateList [name]', '[ul] Update a product list.')
  .alias('ul')
  .action(function(args, callback) {
  	listName = args.name || "mylist"
    this.log('Updating list ' + listName + "...");
    cliFunc.updateList(bearerToken, listName, function(err) {
      callback();
    });	
  });

vorpal
  .command('getAllLists', '[gal] Get all the product list.')
  .alias('gal')
  .action(function(args, callback) {
    this.log('Getting lists...');
    cliFunc.getAllLists(bearerToken, function(err) {
      callback();
    }); 
  });

vorpal
  .command('deleteList [name]', '[dl] Delete a product list.')
  .alias('dl')
  .action(function(args, callback) {
  	listName = args.name || "mylist"
    this.log('Deleteing list ' + listName + "...");
    cliFunc.deleteList(bearerToken, listName, function(err) {
      callback();
    });	
  });

vorpal
  .command('createProduct [name] [id] [listName]', '[cp] Create a product. "mylist" is the default listName')
  .alias('cp')
  .action(function(args, callback) {
    productName = args.name || "myProduct";
    productId   = args.id   || "999"
    listName    = args.listName || "mylist";
    this.log('Creating product ' + productName + "...");
    cliFunc.createProduct(bearerToken, productName, productId, listName, function(err) {
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
    cliFunc.createProductBulk(bearerToken, productName, productId, listName, function(err) {
      callback();
    }); 
  });


vorpal.exec("help");

vorpal
  .delimiter("\x1b[33mvzApi $ ")
  .show();
