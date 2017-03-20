import "./ComponentManager.sol";
import "./Product.sol";

contract ProductManager is ComponentManager {

  function ProductManager() ComponentManager() {
  }

  function createProduct(bytes32 id32, string id, string name, uint price) returns (ErrorCodesEnum) {
    // fail if id32 exists
    if (exists(id32)) return ErrorCodesEnum.EXISTS;
    // add product
    idToComponentMap[id32] = components.length;
    Product product = new Product(id32, id, name, price);
    components.push(product);
    return ErrorCodesEnum.SUCCESS;
  }
}

