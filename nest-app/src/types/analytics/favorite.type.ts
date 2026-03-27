import { Field, Float, ID, ObjectType } from "@nestjs/graphql";


@ObjectType()
export class FavoriteElementProductType {
    @Field()
    name: string;

    @Field()
    imgDisplay: string;  

    @Field()
    brand: string;

    @Field()        
    totalQuantity: number; 

    @Field() 
    totalProfit: number; 

    @Field()   
    displayCost: number;  
}
@ObjectType()
export class FavoriteElementWeekType {
    @Field()
    type: string;

    @Field()
    value: number;
}

@ObjectType('Favorite')
export class FavoriteType {
  
    @Field(() => [FavoriteElementWeekType])
    dataBrand: FavoriteElementWeekType[];   

    @Field(() => [FavoriteElementWeekType])
    dataSex: FavoriteElementWeekType[];   

    @Field(() => [FavoriteElementProductType])
    dataProduct: FavoriteElementProductType[]
}
