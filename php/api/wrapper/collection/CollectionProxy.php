<?

include_once 'Collection.php';

/*
* Service Interface
*/
interface collectionsAdapter {
	public function getCollectionRecords();
}

class CollectionProxy implements CollectionsAdapter{
	
	private $collection = NULL;

	public function __construct(Collection $collection){
		$this->collection = $collection;
	}

	/*
	* Decorator & Delegate to protect against API changes
	*/ 
	public function getCollectionRecords(){
		return $this->collection->getLimitedCollectionRecordsByOrganizationName($this->collection->getCollectionRequest() );
	}
}
?>