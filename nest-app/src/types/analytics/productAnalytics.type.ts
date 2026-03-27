import { Field, Float, ID, ObjectType } from "@nestjs/graphql";


@ObjectType()
export class ProductAnalyticElementWeekType {
    @Field()
    type: string;

    @Field()
    value: number;
}

@ObjectType('ProductAnalytic')
export class ProductAnalyticType {
  
    @Field(() => [ProductAnalyticElementWeekType])
    dataBrand: ProductAnalyticElementWeekType[];   

    @Field(() => [ProductAnalyticElementWeekType])
    dataSex: ProductAnalyticElementWeekType[];   
}
