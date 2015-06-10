<?

include_once 'ConnectionHelper.php';
include_once 'OAuthConnectionResponse.php';

class OAuthConnection {

	const TOKEN_ENDPOINT = 'oauth/token';
	const AUTH0_GRANT_TYPE = 'password';
	const HTTP_OK = '200';

	private $userName = '';
	private $password = '';
	private $accessToken = '';
	private $credentialsHash = '';

	/*
	* Public API 
	*/

	function __construct($appId, $appSecret, $userName, $password) {
		$this->credentialsHash = ConnectionHelper::getSignedCredentials($appId, $appSecret);
		$this->userName = $userName;
		$this->password = $password;
   	}

	public function getAccessToken(){
		$oAuthConnectionResponse = NULL;
		$handle = curl_init();

		$data = json_encode(array(
		    'grant_type'	=> OAuthConnection::AUTH0_GRANT_TYPE,
		    'username'		=> $this->userName,
		    'password' 		=> $this->password
		));

		curl_setopt($handle, CURLOPT_URL, 				BASE_URL . OAuthConnection::TOKEN_ENDPOINT);
		curl_setopt($handle, CURLOPT_HTTPHEADER, 		$this->getHttpHeaders() );
		curl_setopt($handle, CURLOPT_RETURNTRANSFER, 	true);
		curl_setopt($handle, CURLOPT_SSL_VERIFYHOST, 	false);
		curl_setopt($handle, CURLOPT_SSL_VERIFYPEER, 	false);
		curl_setopt($handle, CURLOPT_VERBOSE, 			true);
		curl_setopt($handle, CURLOPT_HTTPAUTH, 			CURLAUTH_BASIC ); 
		curl_setopt($handle, CURLOPT_USERPWD, 			$this->credentialsHash ); 
		//Http POST method only options 
		curl_setopt($handle, CURLOPT_POST, 				true);
        curl_setopt($handle, CURLOPT_POSTFIELDS, 		$data);

		$rawResponse = curl_exec($handle);
		$code = curl_getinfo($handle, CURLINFO_HTTP_CODE);
		$response = new OAuthConnectionResponse($rawResponse, $code);
		$this->accessToken = $response->getAccessTokenFromResponseData();

		if($code != OAuthConnection::HTTP_OK) var_dump($response);

		return $this->accessToken;
	}

	/*
	* Private API
	*/

	private function getHttpHeaders(){
		return array('Accept: application/json', 'Content-Type: application/json');
	}
	
}
?>