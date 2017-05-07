import "../../common/ErrorCodesEnum.sol";
import "../../common/Version.sol";

/**
 * User data contract
 */
contract GUser is ErrorCodesEnum, Version {
  string public username;
  bytes32 public pwHash;

  function GUser(string _username, bytes32 _pwHash) {
    username = _username;
    pwHash = _pwHash;
    version = 1;
  }
}
