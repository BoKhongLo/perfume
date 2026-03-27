import { Field, ID, InputType } from "@nestjs/graphql";
import { IsBoolean, IsDate, IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

@InputType()
export class UpdateUserDto {
    @IsString()
    @IsNotEmpty()
    @Field()
    userId: string;

    @IsOptional()
    @IsBoolean()
    @Field({ nullable: true })
    isDisplay: boolean;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @Field()
    email: string;

    @IsNotEmpty()
    @IsString()
    @Field()
    username: string;

    @IsNotEmpty()
    @IsNotEmpty()
    @Field()
    password: string;

    @IsNotEmpty()
    @IsString()
    @Field()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    @Field()
    lastName: string;

    @IsOptional()
    @Field(() => [String])
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
}