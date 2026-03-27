import { Field, InputType } from "@nestjs/graphql";
import { IsBoolean, IsDate, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";



@InputType()
export class SearchUserDto {
    @IsOptional()
    @IsString()
    @IsEmail()
    @Field({ nullable: true })
    email?: string;

    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    username?: string;

    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    firstName?: string;

    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    lastName?: string;

    @IsOptional()
    @Field(() => [String], { nullable: true })
    role?: string[];

    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    phoneNumber?: string;

    @IsOptional()
    @IsDate()
    @Field({ nullable: true })
    birthday?: Date

    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    address?: string

    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    gender?: string

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
