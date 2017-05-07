import "../../common/ErrorCodesEnum.sol";
import "./GovernUser.sol";
import "./GovernUserStateEnum.sol";
import "./GovernUserRoleEnum.sol";

/**
 * Govern User Manager contract
 */
contract GovernUserManager is GovernUserRoleEnum, GovernUserStateEnum, ErrorCodesEnum {

  function GovernUserManager() {
  }

  function createGovernUser(string _username, bytes32 _pwHash) returns (ErrorCodes, address) {
    GovernUser governUser = new GovernUser(_username, _pwHash, GovernUserRole.MEMBER, GovernUserState.PENDING);
    return (ErrorCodes.SUCCESS, governUser);
  }

  function setRole(address userAddress, GovernUserRole _role) returns (ErrorCodes) {
    return ErrorCodes.ERROR;
  }

  function setState(address userAddress, GovernUserState _state) returns (ErrorCodes) {
    return ErrorCodes.ERROR;
  }
}
