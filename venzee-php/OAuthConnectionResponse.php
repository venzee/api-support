<?
class OauthConnectionResponse {
	
	private $responseData = NULL;
	private $responseCode = NULL;
	private $refreshToken = NULL;

   	/*
   	* Public API
   	*/

	function __construct($responseData, $responseCode) {
		$this->responseData = $responseData;
		$this->responseCode = $responseCode;
		$this->refreshToken = $this->cacheRefreshToken();
   	}

   	public function getAccessTokenFromResponseData(){
   		$jsonResponse = json_decode($this->responseData, true);
   		return $jsonResponse['access_token'];
   	}

   	public function getRefreshTokenFromResponseData(){
   		return $this->refreshToken;
   	}
   	
   	/*
   	* Private API
   	*/
   	private function cacheRefreshToken(){
   		$jsonResponse = json_decode($this->responseData, true);
   		return $jsonResponse['refresh_token'];
   	}
}
?>