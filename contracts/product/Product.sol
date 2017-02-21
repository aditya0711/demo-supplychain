import "../enums/ProductType.sol";
/**
 * Product data contract
*/
 contract Product is ProductType{

  string id;
  string name;
  string description;
  string manufacturingDate;
  string manufacturingLocation;
  ProductTypeEnum productType;
  Product[] componentList;
  string parentId;

  function Product (string _id, string _name,string _description, string _manufacturingDate,string _manufacturingLocation,ProductTypeEnum _type,string  _parentId) {
  id= _id;
  name = _name;
  description =  _description;
  manufacturingDate =  _manufacturingDate;
  manufacturingLocation = _manufacturingLocation;
  productType= _type;
  parentId = _parentId;
 }

  function addComponent(Product product){
  componentList.push(product);
  }


}



