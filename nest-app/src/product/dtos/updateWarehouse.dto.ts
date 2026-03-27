import { Field, Float,  InputType, Int } from "@nestjs/graphql";
import { IsString, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

@InputType()
export class UpdateWarehouseDto {
  @IsNotEmpty()
  @IsNumber()
  @Field()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  @Field()
  stockQuantity?: number;
}

@InputType()
export class GetTempWarehouseDto {
  @IsNotEmpty()
  @IsNumber()
  @Field()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  @Field()
  stockQuantity?: number;
}

