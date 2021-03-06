// Generated by https://quicktype.io

export interface IDashboarResponse {
    ok:            boolean;
    msg:           string;
    dataDashboard: DataDashboard;
}

export interface DataDashboard {
    numberOfOrder:           number;
    paidOrder:               number;
    notPaidOrder:            number;
    numberOfClient:          number;
    numberOfProduct:         number;
    productWithNotInventory: number;
    lowInventory:            number;
}
