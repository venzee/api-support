<?

include_once 'OAuthConnection.php';
include_once 'OAuthConnectionResponse.php';
include_once 'api/wrapper/collection/Collection.php';
include_once 'api/wrapper/collection/CollectionProxy.php';
include_once 'api/wrapper/collection/CollectionRequest.php';

ini_set('display_errors', 1);
error_reporting(E_ERROR | E_WARNING | E_PARSE | E_NOTICE);

/*
* Operational modes (development|sandbox)
* [sandbox], 		Sandbox URL 	: https://api-sandbox.venzee.com/
* [development]		Development URL : https://api-dev.venzee.com/
*/
define('OPERATIONAL_MODE', 	'sandbox');
define('CLI_MODE', 			false);
define('BASE_URL', 	   		'https://api-sandbox.venzee.com/');

$appID 				= '<YOUR_APP_ID_HERE>';
$appSecret 			= '<YOUR_APP_SECRET_HERE>';
$userName			= '<YOUR_USERNAME_HERE>';
$password 			= '<YOUR_PASSWORD_HERE>';
$organizationName 	= '<YOUR_ORGANIZATION_NAME_HERE>';
$collectionName	 	= '<YOUR_COLLECTION_NAME_HERE>';
$accessToken		= '';

$coleccionProxy 	= NULL;
$collection 		= NULL;
$collectionRequest 	= NULL;

if(CLI_MODE === true){
	if (!isset($argv[1]) ||
		!isset($argv[2]) ||
		!isset($argv[3]) ||
		!isset($argv[4]) ||
		!isset($argv[5]) ||
		!isset($argv[6])
		) {
    	echo "\033[0;31mDebe especificar todos los parametros de entrada Ejemplo: $ > php api.php <APP_ID> <APP_SECRET> <USERNAME> <PASSWORD> <ORGANIZATION_NAME> <COLLECTION_NAME> ";
	    echo "\n";
    	exit();
	}else {
		$appID 				= $argv[1];
		$appSecret 			= $argv[2];
		$userName 			= $argv[3];
		$password 			= $argv[4];
		$organizationName 	= $argv[5];
		$collectionName 	= $argv[6];

    	echo "\033[0;32mUtilizando <appID> :" 			. $argv[1] . 
    						   	 ' <appSecret>' 		. $argv[2] . 
    						     ' <userName> ' 		. $argv[3] . 
    						     ' <password>'  		. $argv[4] . 
    						     ' <organizationName>' 	. $argv[5] . 
    						     ' <collectionName>' 	. $argv[6];
	}
}

//Access Token
$connection = new OAuthConnection($appID, $appSecret, $userName, $password);
$accessToken = $connection->getAccessToken();

//Collection Request
$collectionRequest = new CollectionRequest($organizationName, $collectionName, 0, 50, $accessToken);
$collection = new Collection($collectionRequest);
$collectionProxy = new CollectionProxy($collection);
$collectionResponse = $collectionProxy->getCollectionRecords();

if(CLI_MODE === false){
	echo '<!DOCTYPE html>
	<html>
	<head>
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap-theme.min.css">
	</head>
	<body>';
	echo '<div class="container text-center">';
	echo '<div class="alert alert-info"><h1>/Collections/Records</h1></div>';
	echo '<table class="table table-bordered table-hover table-condensed" style="max-width:900px;">';
	echo '<thead>
			<tr>
				<th>id</td>
				<th>map</th>
				<th>cost</th>
				<th>recordId</th>
				<th>created</th>
				<th>lastUpdated</th>
				<th>name</th>
				<th>images</th>
				<th>videos</th>
				<th>collectionId</th>
				<th>relatives</th>
		  	</tr>
		  </thead>';
	echo '<tbody>';
		foreach($collectionResponse as $collection) {

			echo '<tr>';
			echo '<td>' . $collection->id 			. '</td>';
			echo '<td>' . $collection->map 			. '</td>';
			echo '<td>' . $collection->cost 		. '</td>';
			echo '<td>' . $collection->recordId 	. '</td>';
			echo '<td>' . $collection->created 		. '</td>';
			echo '<td>' . $collection->lastUpdated 	. '</td>';
			echo '<td>' . $collection->name 		. '</td>';
			echo '<td>';
			if(count($collection->images) > 0){
				echo '<ul>';
				foreach($collection->images as $image){
					echo '<li>' . $image['filename'] . '</li>';
				}
				echo '</ul>';
			}
			echo '</td>';
			echo '<td>';
			if(count($collection->videos) > 0){
				echo '<ul>';
				foreach($collection->videos as $video){
					echo '<li>' . $video . '</li>';
				}
				echo '</ul>';
			}
			echo '</td>';
			echo '<td>' . $collection->collectionId . '</td>';
			echo '<td>';
			if(count($collection->relatives) > 0){
				echo '<ul>';
				foreach($collection->relatives['children'] as $child){
					echo '<li>' . $child['id'] . '</li>';
				}
				echo '</ul>';
			}
			echo '</td>';
			echo '</tr>';
		}
	echo '</tbody>';
	echo '</table>';
	echo '</div>';
	echo '</body>';
	echo '</html>';
	
}else {
	echo "***************************************************************************************" . PHP_EOL;
	echo "                                    /Collections/Records                               " . PHP_EOL;
	echo "***************************************************************************************" . PHP_EOL;
	echo PHP_EOL;
		foreach($collectionResponse as $collection) {

			echo '[id          :] ' . $collection->id . PHP_EOL;
			echo '[map         :] ' . $collection->map . PHP_EOL;
			echo '[cost        :] ' . $collection->cost . PHP_EOL;
			echo '[recordId    :] ' . $collection->recordId . PHP_EOL;
			echo '[created     :] ' . $collection->created . PHP_EOL;
			echo '[lastUpdated :] ' . $collection->lastUpdated . PHP_EOL;
			echo '[name        :] ' . $collection->name . PHP_EOL;

			if(count($collection->images) > 0){
				echo '[images          :] ' . PHP_EOL;
				foreach($collection->images as $image){
					echo '   +' . $image['filename'] . PHP_EOL;
				}
			}

			if(count($collection->videos) > 0){
				echo '[videos           :] ' . PHP_EOL;
				foreach($collection->videos as $video){
					echo '   +' . $video . PHP_EOL;
				}
			}

			if(count($collection->relatives) > 0){
				echo '[relatives          :] ' . PHP_EOL;
				foreach($collection->relatives['children'] as $child){
					echo '   +' . $child['id'] . PHP_EOL;
				}
			}
		}
	echo PHP_EOL;
	echo "***************************************************************************************";
}
?>