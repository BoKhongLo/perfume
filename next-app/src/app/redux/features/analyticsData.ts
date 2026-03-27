
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SearchProductDto, TagsDetailInp } from "@/lib/dtos/product/"
import { FavoriteType, Perfume, RevenueType, ProductAnalyticType } from '@/types'


type InitialState = {
    dataRevenuePage: RevenueType,
    dataFavoritePage: FavoriteType,
    dataProductPage: ProductAnalyticType
}

const initialState: InitialState = {
    dataRevenuePage: {
        dataAllTime : {
            totalOrder: 0,
            totalProduct: 0,
            totalProfit: 0,
            totalRevenue: 0
        },
        dataMonth: [],
        dataWeek: []
    },
    dataFavoritePage: {
        dataBrand: [],
        dataSex: [],
        dataProduct: []
    },
    dataProductPage: {
        dataBrand: [],
        dataSex: []
    }
}

export const AnalyticData = createSlice({
    name: 'AnalyticData',
    initialState,
    reducers: {
        UpdateRevenuePage: (state, action: PayloadAction<{ value: RevenueType}>) => {
            state.dataRevenuePage = action.payload.value;
        },
        UpdateFavoritePage: (state, action: PayloadAction<{ value: FavoriteType}>) => {
            state.dataFavoritePage = action.payload.value;
        },
        UpdateProductPage: (state, action: PayloadAction<{ value: ProductAnalyticType}>) => {
            state.dataProductPage = action.payload.value;
        },
    }
})

export const { UpdateRevenuePage, UpdateFavoritePage, UpdateProductPage } = AnalyticData.actions;

export default AnalyticData.reducer;