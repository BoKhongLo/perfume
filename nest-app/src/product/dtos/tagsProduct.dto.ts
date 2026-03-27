import { InputType, Field, ID } from "@nestjs/graphql";
import { IsString, IsNotEmpty, IsOptional, IsNumber } from "class-validator";

@InputType()
export class TagsProductDto {
    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    tags?: string
}