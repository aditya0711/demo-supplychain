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
  products.push(new Product(_id,_name,_description,_manufacturingDate,_manufacturingLocation,ProductTypeEnum.PRODUCT));
  return ErrorCodesEnum.SUCCESS;
 }

 function addComponent(string _id, string _name,string _description, string _manufacturingDate,string _manufacturingLocation,string _pid) returns (address){
  uint index=products.length;
  Product component=new Product(_id,_name,_description,_manufacturingDate,_manufacturingLocation,ProductTypeEnum.COMPONENT);
  index=productList[_pid];
  var product=products[index];
  product.addComponent(component);
  return component;
 }

}