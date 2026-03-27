import { ProductType } from "./Product";

export type CustomerInfoType = {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
};

export type DeliveryInfoType = {
    id: number;
    city?: string;
    district?: string;
    address: string;
};

export type OrderProductType = {
    id: number;
    orderId: number;
    productId: number;
    unitPrice: number;
    quantity: number;
    discount?: number;
    order: OrderType;
    product: ProductType;
};

export type OrderType = {
    id: number;
    isDisplay: boolean;
    isPaid: boolean;
    totalAmount: number;
    orderProducts: OrderProductType[];
    deliveryInfo: DeliveryInfoType;
    customerInfo: CustomerInfoType;
    status: string;
    notes?: string;
    created_at: Date;
    updated_at: Date;
};
