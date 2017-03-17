/**
 * Component
 */

import "../enums/ErrorCodes.sol";

contract Component is ErrorCodes{
  bytes32 _id32;
  string _id;

  struct subComponent {
    bytes32 id32;
    address adrs;
    uint quantity;
  }

  subComponent[] children;
  mapping (bytes32 => uint) idToComponentMap;

  /*
    note on mapping to array index:
    a non existing mapping will return 0, so 0 shouldnt be a valid value in a map,
    otherwise exists() will not work
  */

  function Component(bytes32 id32, string id) {
    _id32 = id32;
    _id = id;

    children.length = 1;  // see above note
  }

  function exists(bytes32 id32) returns (bool) {
    return idToComponentMap[id32] != 0;
  }

  function getId32() returns (bytes32) {
    return _id32;
  }

  function hasChild(bytes32 childId32) returns (bool) {
    // immediate child
    if (exists(childId32)) return true;
    // recursion
    bool result;
    for (uint i = 1; i < children.length; i++) {
      address childAddress = children[i].adrs;
      Component child = Component(childAddress);
      result = child.hasChild(childId32);
      if (result == true) return true;
    }
    return false;
  }

  function addSubComponent(address childAddress, uint quantity) returns (ErrorCodesEnum) {
    Component child = Component(childAddress);
    bytes32 id32 = child.getId32();
    // fail if child exists
    if (exists(id32)) return ErrorCodesEnum.EXISTS;
    // fail if same id as parent exists
    if (id32 == _id32) return ErrorCodesEnum.RECURSIVE;
    // add
    idToComponentMap[id32] = children.length;
    children.push(subComponent(id32, childAddress, quantity));
    return ErrorCodesEnum.SUCCESS;
  }
}
