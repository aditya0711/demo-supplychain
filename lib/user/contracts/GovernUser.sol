import "./User.sol";
import "./GovernUserStateEnum.sol";
import "./GovernUserRoleEnum.sol";

/**
 * Govern User data contract
 */
contract GovernUser is User, GovernUserStateEnum, GovernUserRoleEnum {
  GovernUserRole public role;
  GovernUserState public state;

  function GovernUser(string _username, bytes32 _pwHash, GovernUserRole _role, GovernUserState _state)
           User(_username, _pwHash) {
    role = _role;
    state = _state;
    version = 2;
  }

  function setRole(GovernUserRole _role) {
    role = _role;
  }

  function getState() returns (GovernUserState) {
    return state;
  }

  function setState(GovernUserState _state) {
    state = _state;
  }

}
