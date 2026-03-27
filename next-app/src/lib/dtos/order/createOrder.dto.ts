
export type CustomerInfoInp = {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

export type DeliveryInfoInp = {
    city?: string;
    district?: string;
    address: string;
}

export type OrderProductInp = {
    productId: number;
    quantity: number;
    discount?: number;
}

export type CreateOrderDto = {
    orderProducts: OrderProductInp[];
    deliveryInfo: DeliveryInfoInp;
    customerInfo: CustomerInfoInp;
    status: string;
    notes?: string;
}
