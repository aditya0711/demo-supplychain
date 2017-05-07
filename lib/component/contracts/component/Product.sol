import "./Component.sol";

contract Product is Component {

  string name;
  uint price;

  function Product(
      bytes32 _id32,
      string _id,
      string _name,
      uint _price) Component(_id32, _id) {
    name = _name;
    price = _price;
  }

  function addSubProduct(address childAddress, uint quantity) returns (ErrorCodesEnum) {
    // validate
    Product childProduct = Product(childAddress);
    bytes32 _id32 = childProduct.getId32();
    if (exists(_id32)) return ErrorCodesEnum.EXISTS;
    if (id32 == _id32) return ErrorCodesEnum.RECURSIVE;
    // add
    return addSubComponent(childAddress, quantity);
  }
}

