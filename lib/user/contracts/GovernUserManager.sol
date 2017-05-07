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

  function setRole(address userAddress, GovernUserRole _role) returns (ErrorCodes) {
    return ErrorCodes.ERROR;
  }

  function setState(address userAddress, GovernUserState _state) returns (ErrorCodes) {
    return ErrorCodes.ERROR;
  }
}
