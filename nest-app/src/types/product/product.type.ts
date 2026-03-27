import { Field, Float, ID, Int, ObjectType } from "@nestjs/graphql";
import { OrderProductType } from "../order";

@ObjectType('TagsDetail')
export class TagsDetailType {
    @Field(() => ID)
    id: number;

    @Field()
    type: string;

    @Field()
    value?: string;
}

@ObjectType('ProductDetail')
export class ProductDetailType {
    @Field(() => ID)
    id: number;

    @Field(() => [ImageDetailType], { nullable: true })
    imgDisplay?: ImageDetailType[];

    @Field(()=>[TagsDetailType], { nullable: true })
    size?: TagsDetailType[];

    @Field(()=>TagsDetailType, { nullable: true })
    brand?: TagsDetailType;
    
    @Field(()=>TagsDetailType, { nullable: true })
    sillage?: TagsDetailType;

    @Field(()=>TagsDetailType, { nullable: true })
    longevity?: TagsDetailType;

    @Field(()=>TagsDetailType, { nullable: true })
    fragranceNotes?: TagsDetailType;
    
    @Field(()=>TagsDetailType, { nullable: true })
    concentration?: TagsDetailType;

    @Field(()=>TagsDetailType, { nullable: true })
    sex?: TagsDetailType;

    @Field({ nullable: true })
    description?: string;

    @Field({ nullable: true })
    tutorial?: string
}

@ObjectType("ImageDetail")
export class ImageDetailType {
    @Field(() => ID)
    id: number;

    @Field()
    url: string;

    @Field(() => [String], { nullable: true })
    link?: string[];

    @Field(() => ProductDetailType, { nullable: true })
    productDetail?: ProductDetailType;
}
@ObjectType('Product')
export class ProductType {
    @Field(() => ID)
    id: number;

    @Field()
    name: string;

    @Field()
    isDisplay: boolean;

    @Field(() => Float)
    originCost: number;

    @Field(() => Float)
    displayCost: number;

    @Field(() => Int, { nullable: true, defaultValue: 0 })
    stockQuantity?: number;

    @Field({ nullable: true})
    category?: string;

    @Field(() => Int, { nullable: true, defaultValue: 0 })
    buyCount?: number;

    @Field(() => Float, { nullable: true, defaultValue: 0 })
    rating?: number;

    @Field(() => ProductDetailType)
    details: ProductDetailType;

    @Field(() => [OrderProductType])
    orderProducts: OrderProductType[];

    @Field()
    created_at: Date;

    @Field()
    updated_at: Date;
}
