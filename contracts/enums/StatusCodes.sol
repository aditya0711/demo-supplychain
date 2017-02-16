contract StatusCodes {
    function Success(StatusCodesEnum result) internal returns (bool) {
        return result == StatusCodesEnum.SUCCESS;
    }

    enum StatusCodesEnum {
        NULL,
        NEW,
        INTRANSIT,
        RECEIVED,
        DISPATCHED,
        PRODUCT_EXISTS,
        MANUFACTURER_EXISTS,
        USERNAME_EXISTS,
        STOREITEM_EXISTS,
        INSUFFICIENT_BALANCE
    }
}
