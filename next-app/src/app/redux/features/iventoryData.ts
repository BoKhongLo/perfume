
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductFormType, ProductType } from '@/types'
import { ProductData } from '@/lib/dtos/product';


type InitialState = {
    productEditId: number | null
    productEdit: ProductType | null
    listProduct: ProductFormType[]
}

const initialState: InitialState = {
    productEditId: null,
    productEdit : null,
    listProduct: []
}

export const InventoryData = createSlice({
    name: 'InventoryData',
    initialState,
    reducers: {
        UpdateProductEditId: (state, action: PayloadAction<number| null>) => {
            state.productEditId = action.payload;
        },
        UpdateProductEdit: (state, action: PayloadAction<ProductType| null>) => {
            state.productEdit = action.payload;
        },

        UpdateListProduct: (state, action: PayloadAction<ProductData[]>) => {
            state.listProduct = action.payload.map((e: ProductData) => ({
                id: e.id,
                key: e.id,
                name: e.name,
                buyCount: e.buyCount,
                created_at: e.created_at,
                updated_at: e.updated_at,
                displayCost: e.displayCost,
                originCost: e.originCost?.toString(),
                stockQuantity: e.stockQuantity,
                brand: e.details?.brand?.value,
                concentration: e.details?.concentration?.value,
                fragranceNotes: e.details?.fragranceNotes?.value,
                longevity: e.details?.longevity?.value,
                sex: e.details?.sex?.value,
                sillage: e.details?.sillage?.value,
                size: e.details?.size?.map(s => s?.value).filter(Boolean).join(', '),
            }));
        },
        
        AddListProduct: (state, action: PayloadAction<ProductData[]>) => {
            state.listProduct.push(...action.payload.map((e: ProductData) => ({
                id: e.id,
                key: e.id,
                name: e.name,
                buyCount: e.buyCount,
                created_at: e.created_at,
                updated_at: e.updated_at,
                displayCost: e.displayCost,
                originCost: e.originCost?.toString(),
                stockQuantity: e.stockQuantity,
                brand: e.details?.brand?.value,
                concentration: e.details?.concentration?.value,
                fragranceNotes: e.details?.fragranceNotes?.value,
                longevity: e.details?.longevity?.value,
                sex: e.details?.sex?.value,
                sillage: e.details?.sillage?.value,
                size: e.details?.size?.map(s => s?.value).filter(Boolean).join(', '),
            })));
        },
        UpdateOneProduct: (state, action: PayloadAction<ProductType>) => {
 
            const selectProductIndex = state.listProduct.findIndex((e) =>Number(e.id ? e.id : '-1') === Number(action.payload.id));

            if (selectProductIndex !== -1) {
    
                const selectProduct = state.listProduct[selectProductIndex];
        

                const updatedProduct: ProductFormType = {
                    id: selectProduct.id,
                    key: selectProduct.key,
                    name: action.payload.name,
                    buyCount: action.payload.buyCount,
                    created_at: action.payload.created_at ? new Date(action.payload.created_at).toISOString() : '',
                    updated_at: action.payload.updated_at ? new Date(action.payload.updated_at).toISOString() : '',
                    displayCost: action.payload.displayCost,
                    originCost: action.payload.originCost?.toString(),
                    stockQuantity: action.payload.stockQuantity,
                    brand: action.payload.details?.brand?.value,
                    concentration: action.payload.details?.concentration?.value,
                    fragranceNotes: action.payload.details?.fragranceNotes?.value,
                    longevity: action.payload.details?.longevity?.value,
                    sex: action.payload.details?.sex?.value,
                    sillage: action.payload.details?.sillage?.value,
                    size: action.payload.details?.size?.map(s => s?.value).filter(Boolean).join(', ')
                };
        
 
                state.listProduct[selectProductIndex] = updatedProduct;
            }
        },
        
        
        DeleteProduct: (state, action: PayloadAction<ProductFormType | null>) => {
            state.listProduct = state.listProduct.filter(i => i != action.payload)
        },
    }

})

export const { UpdateProductEdit,UpdateProductEditId, UpdateListProduct, DeleteProduct, UpdateOneProduct, AddListProduct } = InventoryData.actions;

export default InventoryData.reducer;