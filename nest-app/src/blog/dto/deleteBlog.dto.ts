import { InputType, Field} from "@nestjs/graphql";
import { IsString, IsNotEmpty, IsOptional, IsNumber } from "class-validator";

@InputType()
export class DeleteBlogDto {
    @IsNotEmpty()
    @IsNumber()
    @Field()
    blogId: number;
}