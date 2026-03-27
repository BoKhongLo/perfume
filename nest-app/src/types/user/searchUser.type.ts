import { Field, Float, ID, Int, ObjectType } from "@nestjs/graphql";
import { UserType } from "./user.type";


@ObjectType('SearchUser')
export class SearchUserType {
    @Field()
    maxValue: number;

    @Field(() => [UserType])
    data: UserType[]

}