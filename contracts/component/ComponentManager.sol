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

  function createComponent(bytes32 id32, string id, string name) returns (ErrorCodesEnum) {
    // fail if id32 exists
    if (exists(id32)) return ErrorCodesEnum.EXISTS;
    // add component
    idToComponentMap[id32] = components.length;
    Component component = new Component(id32, id, name);
    components.push(component);
    return ErrorCodesEnum.SUCCESS;
  }

  function addSubComponent(bytes32 parentId32, bytes32 childId32, string childId, uint quantity) returns (ErrorCodesEnum) {
    // fail if parent doesnt exist
    if (!exists(parentId32)) return ErrorCodesEnum.NOT_FOUND;
    // fail if child doesnt exist
    if (!exists(childId32)) return ErrorCodesEnum.NOT_FOUND;
    // add sub component
    uint index = idToComponentMap[parentId32];
    Component parent = components[index];
    return parent.addSubComponent(childId32, childId, quantity);
  }


}
