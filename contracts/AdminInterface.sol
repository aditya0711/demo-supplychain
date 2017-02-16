import "./user/UserManager.sol";
import "./store/StoreManager.sol";

import "./product/ProductManager.sol";

/**
  * Interface to global contracts
*/
contract AdminInterface {
  UserManager public userManager;
  StoreManager public storeManager;
  ProductManager public productManager;

  /**
    * Constructor. Initialize global contracts and pointers
  */
  function AdminInterface() {
    userManager = new UserManager();
    storeManager = new StoreManager();
    productManager = new ProductManager();
  }
}
