var cliFunc = require('./functionCli.js');
const vorpal = require('vorpal')();
 
var bearerToken;

vorpal
  .command('getToken', '[t] Get getToken from API key & secret in env variable.')
  .alias('t')
  .action(function(args, callback) {
    this.log('Getting token...');
    cliFunc.getToken(function(err, token) {
    	bearerToken = token;
    	console.log('bearerToken: ' + bearerToken);
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
  .command('deleteList [name]', '[dl] Delete a product list.')
  .alias('dl')
  .action(function(args, callback) {
  	listName = args.name || "mylist-updateName"
    this.log('Creating list ' + listName + "...");
    cliFunc.deleteList(bearerToken, listName, function(err) {
      callback();
    });	
  });

 
vorpal
  .delimiter('vzApi $ ')
  .show();

vorpal.exec("help");