export type TempWareHouseType = {
    id?: number;

    key?: string;

    name?: string;

    count?: number;

    summary?: number;

    updated_at?: string;
}

export type GetTempWarehouseDto = {
    productId: number;

    stockQuantity?: number;
}

export type UpdateWarehouseDto = {
    productId: number;

    stockQuantity?: number;
}
