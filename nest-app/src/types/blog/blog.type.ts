import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType('Blog')
export class BlogType {
    @Field(() => ID)
    id: number;

    @Field()
    isDisplay: boolean;

    @Field()
    title: string;

    @Field()
    typeBlog: string;

    @Field({nullable: true})
    content?: string;
    
    @Field()
    created_at: Date;

    @Field()
    updated_at: Date;
}