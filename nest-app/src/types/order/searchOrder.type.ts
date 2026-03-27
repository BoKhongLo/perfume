import { Field, Float, ID, Int, ObjectType } from "@nestjs/graphql";
import { OrderType } from "./order.type";

@ObjectType('SearchOrder')
export class SearchOrderType {
    @Field()
    maxValue: number;

    @Field(() => [OrderType])
    data: OrderType[]

}