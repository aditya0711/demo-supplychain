contract ErrorCodesEnum {
    function isSuccess(ErrorCodes result) internal returns (bool) {
        return result == ErrorCodes.SUCCESS;
    }

    enum ErrorCodes {
        NULL,
        SUCCESS,
        ERROR,
        NOT_FOUND,
        EXISTS,
        RECURSIVE,
        INSUFFICIENT_BALANCE
    }
}
