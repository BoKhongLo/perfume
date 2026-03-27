import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType("ResponseType")
export class ResponseType {
    @Field()
    message: string
}
