------------------------------------------------------------------------
VENZEE EXAMPLE CODE
------------------------------------------------------------------------

### Synopsis

This project is a simple wrapper for calling the Venzee API usign the PHP Programming Languaje, it uses cURL engine a powerfull free opensource library for interacting with **RESTFull Web Services**. cURL must be installed and PHP 5.4+ is required.

### Motivation

The integration proccess with Venzee is straight forward we simplify the comunication with your company through an API to intercomunicate disparate systems. The RESTFull approach lets us give simplicity and uniformity of shared resources.

### Installation

You need to clone this repository by typing <code>git clone https://github.com/venzee/API-doc</code> from your console, once done this you must find the directory **venzee-php** <code>cd</code> into this directory and run the program via a web server or interactively from the command line.

### API Reference

Venzee API

|  Verb |                        Path								|                    Description                       |
|:-----:|:---------------------------------------------------------:|:----------------------------------------------------:|
| POST 	|  /api/app/token 											| Impersonate the request by requesting an acces token |
| GET 	|  /api/collections/{orgname}/{collection}/records/parents  | Returns the list of products of a created collection |

### Usage 

1. You must specify the **OPERATIONAL_MODE** whether is <code>development</code> or <code>sandbox</code>, aditionaly you must pass via de command line (CLI) the arguments for the API to retrieve the items in the collection, or you can fill in the spaces into de <code>api.php</code> file.

####Requirements 

You must have an account into Venzee's App, generated an integration App and have created al least one product.

Gabriel Ramírez Melgarejo

## License
