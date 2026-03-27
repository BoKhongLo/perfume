import { Field, InputType } from "@nestjs/graphql";
import {IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

@InputType()
export class SignUpDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

}