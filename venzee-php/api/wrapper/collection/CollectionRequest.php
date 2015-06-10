<?
class CollectionRequest {
	
	private $organizationName = '';
	private $collectionName = '';
	private $offset = '';
	private $limit = '';
	private $accessToken = '';

	function __construct($organizationName, $collectionName, $offset, $limit, $accessToken){
		$this->organizationName = $organizationName;
		$this->collectionName = $collectionName;
		$this->offset = $offset;
		$this->limit = $limit;
		$this->accessToken = $accessToken;
	}

	public function getOrganizationName(){
		return $this->organizationName;
	}

	public function getCollectionName(){
		return $this->collectionName;
	}

	public function getOffset(){
		return $this->offset;
	}

	public function getLimit(){
		return $this->limit;
	}
	
	public function getAccessToken(){
		return $this->accessToken;
	}
}
?>