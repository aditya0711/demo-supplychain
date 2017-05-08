import "../../common/ErrorCodesEnum.sol";
import "./GovernUser.sol";
import "./GovernUserStateEnum.sol";
import "./GovernUserRoleEnum.sol";
import "./GovernUserEventEnum.sol";

/**
 * Govern User Manager contract
 */
contract GovernUserManager is GovernUserRoleEnum, GovernUserStateEnum, GovernUserEventEnum, ErrorCodesEnum {

  function GovernUserManager() {
  }

  /**
   * createGovernUser - create a new member with default values
   */
  function createGovernUser(string _username, bytes32 _pwHash) returns (ErrorCodes, address) {
    GovernUser governUser = new GovernUser(_username, _pwHash, GovernUserRole.MEMBER, GovernUserState.PENDING);
    return (ErrorCodes.SUCCESS, governUser);
  }

  /**
   * handleEvent - transition user to a new state baed on incoming event
   */
  function handleEvent(address userAddress, GovernUserEvent userEvent) returns (ErrorCodes, GovernUserState) {
    GovernUser governUser = GovernUser(userAddress);
    GovernUserState state = governUser.getState();
    // fsm activate
    var (errorCode, newState) = fsm(state, userEvent);
    // event is valid - use the new state
    if (errorCode == ErrorCodes.SUCCESS) {
      governUser.setState(newState);
      return (ErrorCodes.SUCCESS, newState);
    }
    // nah
    return (errorCode, state);
  }

  function fsm(GovernUserState state, GovernUserEvent userEvent) returns (ErrorCodes, GovernUserState) {
    // NULL
    if (state == GovernUserState.NULL)
      return (ErrorCodes.ERROR, state);
    // PENDING
    if (state == GovernUserState.PENDING) {
      if (userEvent == GovernUserEvent.APPROVE)
        return (ErrorCodes.SUCCESS, GovernUserState.ACTIVE);
    }
    return (ErrorCodes.ERROR, state);
  }

  function setRole(address userAddress, GovernUserRole _role) returns (ErrorCodes) {
    return ErrorCodes.ERROR;
  }

  function setState(address userAddress, GovernUserState _state) returns (ErrorCodes) {
    return ErrorCodes.ERROR;
  }
}
