import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

@InputType()
export class CreateBlogDto {
    @IsNotEmpty()
    @IsString()
    @Field()
    title: string;

    @IsNotEmpty()
    @IsString()
    @Field()
    typeBlog: string;

    @IsOptional()
    @IsString()
    @Field({nullable: true})
    content?: string;
}