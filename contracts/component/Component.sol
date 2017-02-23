/**
 * Component
 */

import "../enums/ErrorCodes.sol";

contract Component is ErrorCodes{
  bytes32 _id32;
  string _id;
  string _name;

  struct subComponent {
    bytes32 id32;
    string id;
    uint quantity;
  }

  subComponent[] children;
  mapping (bytes32 => uint) idToComponentMap;

  /*
    note on mapping to array index:
    a non existing mapping will return 0, so 0 shouldnt be a valid value in a map,
    otherwise exists() will not work
  */

  function Component(bytes32 id32, string id, string name) {
    _id32 = id32;
    _id = id;
    _name = name;
    children.length = 1;  // see above note
  }

  function exists(bytes32 id32) returns (bool) {
    return idToComponentMap[id32] != 0;
  }

  function addComponent(bytes32 id32, string id, uint quantity) returns (ErrorCodesEnum) {
    // if exists - error
    if (exists(id32)) return ErrorCodesEnum.EXISTS;
    // add
    idToComponentMap[id32] = children.length;
    children.push(subComponent(id32, id, quantity));
    return ErrorCodesEnum.SUCCESS;
  }
}
