export type RevenueAllTimeType = {
    totalRevenue: number;
    totalProfit: number;
    totalProduct: number;
    totalOrder: number;
};

export type RevenueElementMonthType = {
    date: string;
    productSold?: number;
    revenue?: number;
    profit?: number;
};

export type RevenueElementWeekType = {
    name: string;
    xData: string;
    yData: number;
};

export type RevenueType = {
    dataAllTime: RevenueAllTimeType;
    dataMonth: RevenueElementMonthType[];
    dataWeek: RevenueElementWeekType[];
};