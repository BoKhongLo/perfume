import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

@InputType()
export class UpdateBlogDto {
    @IsNotEmpty()
    @IsNumber()
    @Field()
    blogId: number;

    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    title?: string;

    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    typeBlog?: string;

    @IsOptional()
    @IsString()
    @Field()
    content?: string;
}