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

  function hasChild(bytes32 parentId32, bytes32 childId32) returns (ErrorCodesEnum, bool) {
    // fail if parent or child dont exist
    if (!exists(parentId32)) return (ErrorCodesEnum.NOT_FOUND, false);
    if (!exists(childId32)) return (ErrorCodesEnum.NOT_FOUND, false);
    // check the parent
    uint index = idToComponentMap[parentId32];
    Component parent = components[index];
    bool result = parent.hasChild(childId32);
    return (ErrorCodesEnum.SUCCESS, result);
  }

  function createComponent(bytes32 id32, string id) returns (ErrorCodesEnum) {
    // fail if id32 exists
    if (exists(id32)) return ErrorCodesEnum.EXISTS;
    // add component
    idToComponentMap[id32] = components.length;
    Component component = new Component(id32, id);
    components.push(component);
    return ErrorCodesEnum.SUCCESS;
  }

  function link(bytes32 parentId32, bytes32 childId32, uint quantity) returns (ErrorCodesEnum) {
    // fail if parent doesnt exist
    if (!exists(parentId32)) return ErrorCodesEnum.NOT_FOUND;
    // fail if child doesnt exist
    if (!exists(childId32)) return ErrorCodesEnum.NOT_FOUND;
    // fail if child has the parent as a child (recursive)
    var (code, result) = hasChild(childId32, parentId32);
    if (code != ErrorCodesEnum.SUCCESS) return code;
    if (result == true) return ErrorCodesEnum.RECURSIVE;
    // add sub component
    uint indexParent = idToComponentMap[parentId32];
    Component parent = components[indexParent];
    uint indexChild = idToComponentMap[childId32];
    Component child = components[indexChild];
    return parent.addSubComponent(child, quantity);
  }
}
