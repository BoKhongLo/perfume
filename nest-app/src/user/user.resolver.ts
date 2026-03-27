import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { SearchUserType, UserEntity, UserType } from 'src/types/user';
import { HttpCode, UseGuards } from '@nestjs/common';
import { CurrentUserGraphql } from 'src/decorators';
import { CreateUserDto, SearchUserDto, UpdateUserDto } from './dtos';
import { JwtGuardGraphql } from 'src/auth/guard';
import { ResponseType } from 'src/types/response.type';

@UseGuards(JwtGuardGraphql)
@Resolver()
export class UserResolver {
    constructor(
        private userService: UserService,
    ) { }

    @Mutation(() => UserType)
    async CreateUser(
        @CurrentUserGraphql() user: UserEntity,
        @Args('CreateUser') dto: CreateUserDto,
    ): Promise<UserType> {
        return await this.userService.CreateUserService(dto, user)
    }

    @Mutation(() => [UserType])
    async CreateUserByList(
        @CurrentUserGraphql() user: UserEntity,
        @Args({ name: 'CreateUser', type: () => [CreateUserDto] }) dto: CreateUserDto[],
    ): Promise<UserType[]> {
        return await this.userService.CreateUserByListService(dto, user);
    }
    @Mutation(() => UserType)
    async UpdateUser(
        @CurrentUserGraphql() user: UserEntity,
        @Args('UpdateUser') dto: UpdateUserDto,
    ): Promise<UserType> {
        return await this.userService.UpdateUserService(dto, user)
    }

    @Query(() => SearchUserType)
    async SearchUserWithOption(
        @CurrentUserGraphql() user: UserEntity,
        @Args('SearchUser') dto: SearchUserDto
    ): Promise<SearchUserType> { 
        return await this.userService.SearchUserWithOptionsServices(dto, user)
    }

    @Mutation(() => ResponseType)
    async DeleteUser(
        @CurrentUserGraphql() user: UserEntity,
        @Args('id') userId: string
    ): Promise<ResponseType> {
        return await this.userService.DeleteUserService(userId, user)
    }

    @Query(() => UserType)
    async GetUserById(
        @CurrentUserGraphql() user: UserEntity,
        @Args('id') userId: string
    ) {
        return await this.userService.GetUserByIdService(userId, user);
    }
}
