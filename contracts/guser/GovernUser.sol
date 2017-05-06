import "./GUser.sol";
import "../enums/GovernUserStateEnum.sol";
import "../enums/GovernUserRoleEnum.sol";

/**
 * Govern User data contract
 */
contract GovernUser is GUser, GovernUserStateEnum, GovernUserRoleEnum {
  GovernUserRole public role;
  GovernUserState public state;

  function GovernUser(string _username, bytes32 _pwHash, GovernUserRole _role, GovernUserState _state)
           GUser(_username, _pwHash) {
    role = _role;
    state = _state;
    version = 2;
  }

  function setRole(GovernUserRole _role) {
    role = _role;
  }

  function setState(GovernUserState _state) {
    state = _state;
  }

}
