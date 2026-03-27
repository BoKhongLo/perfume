import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { UserType } from "../user";

@ObjectType("ActionLog")
export class ActionLogType {
    @Field(() => ID)
    id: number;
  
    @Field()
    action: string;
  
    @Field({ nullable: true })
    entityName: string;
  
    @Field(() => Int, { nullable: true })
    entityId: number;
  
    @Field(() => UserType)
    userId: string;
  
    @Field({ nullable: true })
    details: string;
  
    @Field()
    created_at: Date;
}
