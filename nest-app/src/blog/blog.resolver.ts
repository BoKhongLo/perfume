import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtGuardGraphql } from 'src/auth/guard';
import { BlogService } from './blog.service';
import { BlogType } from 'src/types/blog';
import { CurrentUserGraphql } from 'src/decorators';
import { UserEntity } from 'src/types/user';
import { ResponseType } from 'src/types/response.type';
import { CreateBlogDto, DeleteBlogDto, SearchBlogDto, UpdateBlogDto } from './dto';

@UseGuards(JwtGuardGraphql) 
@Resolver(() => BlogType) 
export class BlogResolver {
    constructor(private readonly blogService: BlogService) {}

    @Query(() => [BlogType])
    async SearchBlogWithOptions(
        @Args('SearchBlog') dto: SearchBlogDto, 
    ): Promise<BlogType[]> {
        return await this.blogService.SearchBlogWithOptionsService(dto);
    }

    @Query(() => BlogType)
    async GetBlogById(
        @Args('blogId') blogId: number, 
    ): Promise<BlogType> {
        return await this.blogService.GetBlogByIdService(blogId);
    }

    @Mutation(() => BlogType)
    async CreateBlog(
        @CurrentUserGraphql() user: UserEntity,
        @Args('CreateBlog') dto: CreateBlogDto,
    ): Promise<BlogType> {
        return await this.blogService.CreateBlogService(dto, user);
    }

    @Mutation(() => ResponseType) 
    async DeleteBlog(
        @CurrentUserGraphql() user: UserEntity,
        @Args('DeleteBlog') dto: DeleteBlogDto,
    ): Promise<ResponseType> {
        return await this.blogService.DeleteBlogService(dto, user);
    }

    @Mutation(() => BlogType)
    async UpdateBlog(
        @CurrentUserGraphql() user: UserEntity,
        @Args('UpdateBlog') dto: UpdateBlogDto, 
    ): Promise<BlogType> {
        return await this.blogService.UpdateBlogService(dto, user);
    }
}
