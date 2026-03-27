import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ActionLogType } from '../actionlog';
import { Relation } from 'typeorm';

@ObjectType("UserDetail")
export class UserDetailType {
  @Field(() => ID)
  id: number;

  @Field({ nullable: true })
  firstName: string;

  @Field({ nullable: true })
  lastName: string;

  @Field({ nullable: true })
  phoneNumber: string;

  @Field({ nullable: true })
  birthday?: Date;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  gender?: string;

  @Field({ nullable: true, defaultValue: "http://localhost:3434/media/file/user.png" })
  imgDisplay?: string;
}

@ObjectType()
export class UserType {
  @Field(() => ID)
  id: number;

  @Field()
  email: string;

  @Field()
  secretKey: string;

  @Field()
  isDisplay: boolean;

  @Field()
  username: string;

  @Field(() => [String])
  role: string[];

  @Field(() => UserDetailType, { nullable: true })
  details: UserDetailType;

  @Field()
  hash: string;

  @Field({ nullable: true })
  refreshToken: string;

  @Field(() => [ActionLogType], { nullable: true })
  actionLog: Relation<ActionLogType[]>;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}
