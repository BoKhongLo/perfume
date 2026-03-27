import { InputType, Field } from "@nestjs/graphql";
import { IsString, IsNotEmpty, IsOptional, IsNumber } from "class-validator";

@InputType()
export class SearchBlogDto {
    @IsOptional()
    @IsNumber()
    @Field( { nullable: true })
    blogId?: number;

    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    title?: string;

    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    typeBlog?: string;
}