<?	

/*
* Data Transfer Object which serves as data holder and mapping entity
*/

class CollectionResponse {

	private $map;
	private $cost;
	private $id;
	private $customFields;
	private $recordId;
	private $lastUpdated;
	private $name;
	private $images;
	private $videos;
	private $created;
	private $collectionId;
	private $relatives;
	private $responseCode = NULL;

	function __construct($responseData, $responseCode){
		$this->mapProperties($responseData);
		$this->responseCode = $responseCode;
	}

	function mapProperties($d){
		$this->map 			= $d['map'];
		$this->cost 		= $d['cost'];
		$this->id 			= $d['id'];
		$this->customFields = $d['customFields'];
		$this->recordId 	= $d['recordId'];
		$this->lastUpdated 	= $d['lastUpdated'];
		$this->name 		= $d['name'];
		$this->images 		= $d['images'];
		$this->videos 		= $d['videos'];
		$this->created 		= $d['created'];
		$this->collectionId = $d['collectionId'];
		$this->relatives 	= $d['relatives'];
	}

	/*
	* Magic Methods for r+w
	*/
	public function __get($property) {
		if (property_exists($this, $property)) {
			return $this->$property;
		}
	}

	public function __set($property, $value) {
		if (property_exists($this, $property)) {
			$this->$property = $value;
		}

	/*
	* Object facade returned
	*/
	return $this;

	}
}
?>