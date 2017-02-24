/**
 * Component Manager
 */
import "./Component.sol";
import "../enums/ErrorCodes.sol";

contract ComponentManager is ErrorCodes {
  Component[] components;
  mapping (bytes32 => uint) idToComponentMap;

  /**
  * Constructor
  */
  function ComponentManager() {
    components.length = 1;
  }

  function exists(bytes32 id32) returns (bool) {
    return idToComponentMap[id32] != 0;
  }

  function addComponent(bytes32 id32, string id, string name) returns (ErrorCodesEnum) {
    // fail if id32 exists
    if (exists(id32)) return ErrorCodesEnum.EXISTS;
    // add component
    idToComponentMap[id32] = components.length;
    components.push(new Component(id32, id, name));
    return ErrorCodesEnum.SUCCESS;
  }
}
