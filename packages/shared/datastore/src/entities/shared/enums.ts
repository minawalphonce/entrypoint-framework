export enum EVSEStatus {
    /**
     *  The EVSE/Connector is able to start a new charging session.
     */
    available = "available",
    /**
     * The EVSE/Connector is not accessible because of a physical barrier, i.e.a car.
     */
    blocked = "blocked",
    /**
     * The EVSE/Connector is currently in use.
     */
    charging = "charging",

    /**
     * The EVSE/Connector is not yet active, or temporarily not available for use, but not broken or defect.
     */
    inoperative = "inoperative",
    /**
     * The EVSE/Connector is currently out of order, some part/components may be broken/defect.
     */
    outOfOrder = "outOfOrder",

    /**
     * The EVSE/Connector is planned, will be operating soon.
     */
    planned = "planned",

    /**
     * The EVSE/Connector was discontinued/removed.
     */
    removed = "removed",

    /**
     * The EVSE/Connector is reserved for a particular EV driver and is unavailable for other drivers.
     */
    reserved = "reserved",

    /**
     * No status information available(also used when offline).
     */
    unknown = "unknown"
};

export enum Connector {
    cdm = "cdm",
    type2 = "type2",
    type1 = "type1",
    ccs2 = "ccs2",
    ccs = "ccs",
    tesla = "tesla"
}

export enum OperatorProvider {
    Hubject = "hubject",
    SaasCharge = "saascharge",
    Virtual = "virtual"
};

export enum ParkingType {
    OnStreet = "OnStreet",
    ParkingLot = "ParkingLot",
    ParkingGarage = "ParkingGarage",
    UndergroundParkingGarage = "UndergroundParkingGarage"
}

export enum ParkingAccessibility {
    FreePublicly = "Free publicly accessible",
    RestrictedAccess = "Restricted access",
    PayingPublicly = "Paying publicly accessible",
    TestStation = "Test Station"
}

export enum PowerType {
    AC = "AC",
    DC = "DC"
}

export enum TariffFeeUnit {
    kwh = "kwh",
    minute = "min",
    hour = "hour",
    percent = "percent",
    fixed = "fixed"
}

export enum SessionStatus {
    started = "started",
    stopped = "stopped",
    failed = "failed",
    error = "error",
    completed = "completed"
};

export enum PaymentType {
    creditCard = "cc",
    paypal = "pp",
    applePay = "ap",
    googlePay = "gp",
    klarna = "kl",
    swish = "sw"
}

export enum PaymentStatus {
    authorized = "authorized",
    captured = "captured",
    failed = "failed",
    canceled = "canceled",
    settled = "settled",
    error = "error"
};
