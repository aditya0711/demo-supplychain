/**
 * Component
 */
contract Component {
  // note: using byte32, since Solidity can't return variable length strings
   bytes32 _id32;
   string _id;
   string _name;

  function Component(bytes32 id32, string id, string name) {
    _id32 = id32;
    _id = id;
    _name = name;
  }
}
