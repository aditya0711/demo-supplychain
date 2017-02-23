/**
 * Component
 */
contract Component {
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

  function Component(bytes32 id32, string id, string name) {
    _id32 = id32;
    _id = id;
    _name = name;
  }

  function addComponent(bytes32 id32, string id, uint quantity) {
    idToComponentMap[id32] = children.length;
    children.push(subComponent(id32, id, quantity));
  }
}
