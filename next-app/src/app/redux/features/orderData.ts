
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderType } from '@/types'


type InitialState = {
    listOrder: OrderType[],

}
const initialState: InitialState = {
    listOrder: [],

}

export const OrderData = createSlice({
    name: 'OrderData',
    initialState,
    reducers: {
        UpdateListOrder: (state, action: PayloadAction<OrderType[]>) => {
            state.listOrder = action.payload
        },
        UpdateOneOrder:(state, action: PayloadAction<OrderType>) => {
            const idx = state.listOrder.findIndex(e => Number(e.id) == Number(action.payload.id))
            if (idx !== -1) {
                state.listOrder[idx].isPaid = action.payload.isPaid
                state.listOrder[idx].status = action.payload.status
            }
        },
        AddListOrder:(state, action: PayloadAction<OrderType[]>) => {
            state.listOrder = [...state.listOrder, ...action.payload]
        },
    }
})

export const { UpdateListOrder, UpdateOneOrder, AddListOrder } = OrderData.actions;

export default OrderData.reducer;