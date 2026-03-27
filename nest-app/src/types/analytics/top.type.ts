import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class TopType {
    @Field(() => [String])
    data: string[];
}