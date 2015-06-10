<?
include_once 'CollectionRequest.php';
include_once 'CollectionResponse.php';

/*
* Adaptee - Concrete implementation of the Collections endpoint 
* /api/collections/
*/

class Collection {

	const RECORDS_ENDPOINT = 'api/collections/';
	const RESOURCE = 'records/parents?';
	const LIMIT = 'limit=';
	const OFFSET = 'offset=';
	const OAUTH_AUTHENTICATION_HEADER = 'Authorization: Bearer ';
	const HTTP_OK = '200';

	private $colectionRequest = NULL;
	private $CollectionResponse = NULL;

	public function __construct(CollectionRequest $collectionRequest){
		$this->collectionRequest = $collectionRequest;
	}

	/*
	* Wrapper method to retrieve filtered collection items
	* GET /api/collections/{orgname}/{collection}/records/parents
	*/
	public function getLimitedCollectionRecordsByOrganizationName(){

		$handle = curl_init();
		$authorizationHeader = Collection::OAUTH_AUTHENTICATION_HEADER . $this->collectionRequest->getAccessToken();
		$headers = array(
		    $authorizationHeader
		);

		curl_setopt($handle, CURLOPT_URL, 				Collection::assembleURL(	
																					$this->collectionRequest->getLimit(), 
																					$this->collectionRequest->getOffset() 
																				) 
					);
		curl_setopt($handle, CURLOPT_HTTPHEADER, 		$headers);
		curl_setopt($handle, CURLOPT_RETURNTRANSFER, 	true);
		curl_setopt($handle, CURLOPT_SSL_VERIFYHOST, 	false);
		curl_setopt($handle, CURLOPT_SSL_VERIFYPEER, 	false);
		curl_setopt($handle, CURLOPT_VERBOSE, 			true);

		$rawResponse = curl_exec($handle);
		$code = curl_getinfo($handle, CURLINFO_HTTP_CODE);

		if($code != Collection::HTTP_OK){
			var_dump($response);
			exit();	
		} 

		$objectResponse = json_decode($rawResponse, true);
		return $this->buildCollectionResponse($objectResponse);

	}

	public function getCollectionRequest(){
		return $this->collectionRequest;
	}

	private function buildCollectionResponse($objectResponse){

		$list[] = NULL; 
		for ($i = 0; $i < count($objectResponse); $i++){
			$cr = new CollectionResponse($objectResponse[$i], Collection::HTTP_OK);
			$list[$i] = $cr;
		}
		return $list;
	}

	private function assembleURL($limit, $offset){
		return 	BASE_URL 										. 
				Collection::RECORDS_ENDPOINT 					. 
				$this->collectionRequest->getOrganizationName() . 
				'/'												.
				$this->collectionRequest->getCollectionName() 	. 
				'/'												.
				Collection::RESOURCE 							. 
				Collection::LIMIT 								. 
				$limit 											.  
				'&'												. 
				Collection::OFFSET 								. 
				$offset;
	}


}
?>