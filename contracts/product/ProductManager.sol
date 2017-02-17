import "./Product.sol";
import "../enums/ProductType.sol";
import "../enums/ErrorCodes.sol";
/* Manufacturer data*/


contract ProductManager is ErrorCodes,ProductType{

 Product[] products;
Product[] components;
 mapping (string => uint) productList;
mapping (string ==> uint) componentList;

function ProductManager() {
    products.length=1;

  }
  function productExists(string _id) returns (bool) {
      return productList[_id] != 0;
    }
    function componentExists(string _id) returns (bool) {
          return componentList[_id] != 0;
        }

 function addProduct(string _id, string _name,string _description, string _manufacturingDate,string  _manufacturingLocation) returns (ErrorCodesEnum){
  // fail if _id exists
  if (productExists(_id)) return ErrorCodesEnum.PRODUCT_EXISTS;

  uint index=products.length;
  productList[_id]=index;
  products.push(new Product(_id,_name,_description,_manufacturingDate,_manufacturingLocation,ProductTypeEnum.PRODUCT));
  return ErrorCodesEnum.SUCCESS;
 }

 function addComponent(string _id, string _name,string _description, string _manufacturingDate,string _manufacturingLocation,string _pid) returns (ErrorCodesEnum){
  // fail if product exists
    if (!productExists(_id)) return ErrorCodesEnum.PRODUCT_NOT_EXISTS;

    uint index=products.length;

  Product component=new Product(_id,_name,_description,_manufacturingDate,_manufacturingLocation,ProductTypeEnum.COMPONENT);
  index=productList[_pid];
  //componentList[_id]=index
  var product=products[index];
  var component=components[index];
  components.push(component);
  product.addComponent(component);
  return ErrorCodesEnum.SUCCESS;
 }


 if product exists--true
 componentalready exists check ---error

}