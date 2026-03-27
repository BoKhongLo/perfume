
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SearchProductDto, TagsDetailInp } from "@/lib/dtos/product/"
import { Perfume, TempWareHouseType } from '@/types'




type InitialState = {
    value: TempWareHouseType[]
}

const initialState: InitialState = {
    value: []
}

export const TempWarehouse = createSlice({
    name: 'TempWarehouse',
    initialState,
    reducers: {
        UpdateTempWarehouser: (state, action: PayloadAction<TempWareHouseType[]>) => {
            state.value = action.payload.map((e, i) => ({
                id: Number(e.id),  
                key: i.toString(), 
                name: e.name, 
                count: e.count,  
                summary: e.summary,
                updated_at: new Date().toISOString()  
            }));
        },
        
        DeleteTempWarehouser: (state, action: PayloadAction<TempWareHouseType>) => {
            state.value = state.value.filter(i => i != action.payload)
        },
    }
})

export const {  UpdateTempWarehouser, DeleteTempWarehouser } = TempWarehouse.actions;

export default TempWarehouse.reducer;