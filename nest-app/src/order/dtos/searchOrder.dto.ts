import { Field, ID, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

@InputType()
export class SearchOrderDto {
    @IsOptional()
    @Field(() => ID, {nullable: true})
    orderId?: number;

    @IsOptional()
    @IsString()
    @Field({nullable: true})
    email?: string;

    @IsOptional()
    @IsString()
    @Field({nullable: true})
    firstName?: string;

    @IsOptional()
    @IsString()
    @Field({nullable: true})
    lastName?: string;
    
    @IsOptional() 
    @Field(() => [Number], { nullable: true })
    rangeMoney?: number[]

    @IsOptional()
    @IsString()
    @Field({nullable: true})
    phoneNumber?: string;
    
    @IsOptional() 
    @IsNumber()
    @Field(() => Number, { nullable: true })
    index?: number

    @IsOptional() 
    @IsNumber()
    @Field(() => Number, { nullable: true })
    count?: number

    @IsOptional() 
    @IsString()
    @Field(() => String, { nullable: true })
    sort?: string
}
