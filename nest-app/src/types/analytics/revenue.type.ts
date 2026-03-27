import { Field, Float, ID, ObjectType } from "@nestjs/graphql";



@ObjectType()
export class RevenueAllTimeType {
    @Field()
    totalRevenue: number

    @Field()
    totalProfit: number

    @Field()
    totalProduct: number

    @Field()
    totalOrder: number
}

@ObjectType()
export class RevenueElementMonthType {
    @Field()
    Date: string

    @Field({nullable: true})
    productSold?: number

    @Field({nullable: true})
    revenue?: number
    
    @Field({nullable: true})
    profit?: number
}



@ObjectType()
export class RevenueElementWeekType {
    @Field()
    name: string;
    @Field()
    xData: string;
    @Field()
    yData: number;
}

@ObjectType('Revenue')
export class RevenueType {
  
    @Field(() => RevenueAllTimeType)
    dataAllTime: RevenueAllTimeType;

    @Field(() => [RevenueElementMonthType])
    dataMonth: RevenueElementMonthType[];   

    @Field(() => [RevenueElementWeekType])
    dataWeek: RevenueElementWeekType[];
}
