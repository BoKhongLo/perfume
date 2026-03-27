import { Field, Float, ID, ObjectType } from "@nestjs/graphql";

import { ProductType } from "../product";

@ObjectType("CustomerInfo")
export class CustomerInfoType {
    @Field(() => ID)
    id: number;
  
    @Field()
    email: string;
  
    @Field()
    firstName: string;
  
    @Field()
    lastName: string;
  
    @Field()
    phoneNumber: string;
}

@ObjectType('DeliveryInfo')
export class DeliveryInfoType {
    @Field(() => ID)
    id: number;
  
    @Field({ nullable: true })
    city?: string;
  
    @Field({ nullable: true })
    district?: string;
  
    @Field()
    address: string;
}



@ObjectType('Order')
export class OrderType {
    @Field(() => ID)
    id: number;
  
    @Field()
    isDisplay: boolean;
    
    @Field()
    isPaid: boolean;

    @Field(() => Float)
    totalAmount: number;
  
    @Field(() => [OrderProductType])
    orderProducts: OrderProductType[];
  
    @Field(() => DeliveryInfoType)
    deliveryInfo: DeliveryInfoType;
  
    @Field(() => CustomerInfoType)
    customerInfo: CustomerInfoType;
  
    @Field()
    status: string;
  
    @Field({ nullable: true })
    notes?: string;
  
    @Field()
    created_at: Date;
  
    @Field()
    updated_at: Date;
}


@ObjectType('OrderProduct')
export class OrderProductType {
    @Field(() => ID)
    id: number;
  
    @Field(() => ID)
    orderId: number;
  
    @Field(() => ID)
    productId: number;
  
    @Field(() => Float)
    unitPrice: number;
  
    @Field()
    quantity: number;
  
    @Field(() => Float, { nullable: true })
    discount?: number;
  
    @Field(() => OrderType)
    order: OrderType;
  
    @Field(() => ProductType)
    product: ProductType;
}