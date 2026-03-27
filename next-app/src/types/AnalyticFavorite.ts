
export type FavoriteElementProductType =  {
    name: string,
    imgDisplay: string;  
    brand: string;          
    totalQuantity: number;   
    totalProfit: number;    
    displayCost: number;     
}

export type FavoriteElementWeekType = {
    type: string;
    value: number;
};

export type FavoriteType = {
    dataBrand: FavoriteElementWeekType[];
    dataSex: FavoriteElementWeekType[];
    dataProduct: FavoriteElementProductType[]
};