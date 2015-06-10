<?
class ConnectionHelper {

	static public function getSignedCredentials($appID, $appSecret){
		if(OPERATIONAL_MODE === 'development'){
			return $appID . ':' . $appSecret;
		}else if(OPERATIONAL_MODE === 'sandbox'){
			return base64_encode($appID . ':' . $appSecret);
		}else {
			throw new Exception('ERORR: INVALID OPERATIONAL MODE');
		}
	}
}
?>