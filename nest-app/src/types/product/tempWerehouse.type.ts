import { Field, ID, Int, ObjectType } from "@nestjs/graphql";

@ObjectType('TempWareHouse')
export class TempWareHouseType {
    @Field(() => ID)
    id: number;

    @Field()
    name: string;

    @Field(() => Int, { nullable: true, defaultValue: 0 })
    count?: number;

    @Field(() => Int, { nullable: true, defaultValue: 0 })
    summary?: number;
}
