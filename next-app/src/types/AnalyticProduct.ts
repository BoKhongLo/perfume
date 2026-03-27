export type ProductAnalyticElementWeekType = {
    type: string;
    value: number;
};

export type ProductAnalyticType = {
    dataBrand: ProductAnalyticElementWeekType[];
    dataSex: ProductAnalyticElementWeekType[];
};