import { configureStore } from '@reduxjs/toolkit'
import filterSearch from './features/filterSearch'
import AnalyticData from './features/analyticsData'
import InventoryData  from './features/iventoryData'
import TempWarehouse  from './features/tempWarehouse'
import UserData from './features/userData'
import OrderData from './features/orderData'

export const makeStore = () => {
    return configureStore({
        reducer: {
            filterSearch,
            AnalyticData,
            InventoryData,
            TempWarehouse,
            UserData,
            OrderData 
        }
    })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']