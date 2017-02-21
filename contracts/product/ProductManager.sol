import "./Product.sol";
import "../enums/ProductType.sol";
import "../enums/ErrorCodes.sol";
/* Manufacturer data*/


contract ProductManager is ErrorCodes,ProductType{

 Product[] products;
 mapping (string => uint) productList;

 function ProductManager() {
    products.length=1;
 }

  function exists(string _id) returns (bool) {
      return productList[_id] !=  0;
  }

 function addProduct(string _id, string _name,string _description, string _manufacturingDate,string  _manufacturingLocation) returns (ErrorCodesEnum){
  // fail if _id exists
  if (exists(_id)) return ErrorCodesEnum.PRODUCT_EXISTS;
  uint index=products.length;
  productList[_id]=index;
  //string _parentId = _id;
  products.push(new Product(_id,_name,_description,_manufacturingDate,_manufacturingLocation,ProductTypeEnum.PRODUCT, _id));
  return ErrorCodesEnum.SUCCESS;
 }

 function addComponent(string _id, string _name,string _description, string _manufacturingDate,string _manufacturingLocation,string _pid) returns (ErrorCodesEnum){
  // fail if _id exists
  if (exists(_id)) return ErrorCodesEnum.COMPONENT_EXISTS;

  uint index=products.length;
  if (!exists(_pid)) return ErrorCodesEnum.PRODUCT_NOT_EXISTS;
  Product component=new Product(_id,_name,_description,_manufacturingDate,_manufacturingLocation,ProductTypeEnum.COMPONENT,_pid);
  productList[_id]=index;
  products.push(component);

   //finding existing product object to add component
      index=productList[_pid];
      var product=products[index];

  product.addComponent(component);
  return ErrorCodesEnum.SUCCESS;
 }
function getAddressById(string _id) returns(address)
    {
        uint index=productList[_id];
        Product product=products[index];
        return product;
    }
}