import { Field, Float, ID, InputType, } from "@nestjs/graphql";
import { IsString, IsNotEmpty, IsOptional, IsNumber } from "class-validator";

@InputType()
export class CustomerInfoInp {
  @IsNotEmpty()
  @IsString()
  @Field()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  phoneNumber: string;
}

@InputType()
export class DeliveryInfoInp {
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  city?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  district?: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  address: string;
}


@InputType()
export class createOrderDto {
  @IsNotEmpty()
  @Field(() => [OrderProductInp])
  orderProducts: OrderProductInp[];

  @IsNotEmpty()
  @Field(() => DeliveryInfoInp)
  deliveryInfo: DeliveryInfoInp;

  @IsNotEmpty()
  @Field(() => CustomerInfoInp)
  customerInfo: CustomerInfoInp;

  @IsNotEmpty()
  @IsString()
  @Field()
  status: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  notes?: string;
}


@InputType()
export class OrderProductInp {
  @IsNotEmpty()
  @IsNumber()
  @Field(() => ID)
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  @Field()
  quantity: number;

  @IsOptional()
  @IsNumber()
  @Field(() => Float, { nullable: true })
  discount?: number;
}