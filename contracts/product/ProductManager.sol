
import "./Product.sol";
import "../enums/ProductType.sol";
/* Manufacturer data*/


contract ProductManager is ProductType{

 Product[] products;
 mapping (string => uint) productList;

function ProductManager() {
   
  }
 function addProduct(string _id, string _name,string _description, string _manufacturingDate,string  _manufacturingLocation) returns (address){
  uint index=products.length;
  productList[_id]=index;
  products.push(new Product(_id,_name,_description,_manufacturingDate,_manufacturingLocation,ProductTypeEnum.PRODUCT));
  return products[index];
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