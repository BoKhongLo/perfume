import { Field, Float, ID, Int, ObjectType } from "@nestjs/graphql";
import { ProductType } from "./product.type";

@ObjectType('SearchProduct')
export class SearchProductType {
    @Field()
    maxValue: number;

    @Field(() => [ProductType])
    data: ProductType[]

}