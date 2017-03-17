import "./Component.sol";

contract Product is Component {

  string _name;
  uint   _price;

  function Product(
      bytes32 id32,
      string id,
      string name,
      uint price) Component(id32, id) {
    _name = name;
    _price = price;
  }

  function addSubProduct(address childAddress, uint quantity) returns (ErrorCodesEnum) {
    // validate
    Product childProduct = Product(childAddress);
    bytes32 id32 = childProduct.getId32();
    if (exists(id32)) return ErrorCodesEnum.EXISTS;
    if (id32 == _id32) return ErrorCodesEnum.RECURSIVE;
    // add
    return addSubComponent(childAddress, quantity);
  }
}

