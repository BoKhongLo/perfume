import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from 'src/types/blog';
import { UserEntity } from 'src/types/user';
import { Repository } from 'typeorm';
import { CreateBlogDto, DeleteBlogDto, SearchBlogDto, UpdateBlogDto } from './dto';

@Injectable()
export class BlogService {
    constructor(
        private config: ConfigService,
        @InjectRepository(BlogEntity) private blogRepository: Repository<BlogEntity>,
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    ) { }

    private CheckRoleUser(user: UserEntity) {
        if (!user.role.includes("ADMIN")) {
            throw new ForbiddenException('The user does not have permission');
        }
    }
    async SearchBlogWithOptionsService(dto: SearchBlogDto) {
        const query = this.blogRepository.createQueryBuilder('blog');
        const { blogId, title, typeBlog } = dto;
        query.andWhere('product.isDisplay = :isDisplay', { isDisplay: true });
        if (blogId) {
            query.andWhere('blog.id = :blogId', { blogId });
        }

        if (title) {
            query.andWhere('blog.title LIKE :title', { title: `%${title}%` });
        }

        if (typeBlog) {
            query.andWhere('blog.type = :type', { typeBlog });
        }

        return await query.getMany();
    }

    async GetBlogByIdService(blogId: number) {
        const blog = await this.blogRepository.findOne({ where: { id: blogId, isDisplay: true } });
        if (!blog) {
            throw new NotFoundException('Blog not found');
        }
        return blog;
    }

    async CreateBlogService(dto: CreateBlogDto, user: UserEntity) {
        this.CheckRoleUser(user)
        const newBlog = this.blogRepository.create({
            title: dto.title,
            typeBlog: dto.typeBlog,
            content: dto.content || '',
            isDisplay: true,
        });
    
        return await this.blogRepository.save(newBlog);
    }

    async UpdateBlogService(dto: UpdateBlogDto, user: UserEntity) {
        this.CheckRoleUser(user)
        const blog = await this.blogRepository.findOne({ where: { id: dto.blogId } });
        if (!blog) {
            throw new NotFoundException('Blog not found');
        }
        if (dto.title) {
            blog.title = dto.title
        }
        if (dto.typeBlog) {
            blog.typeBlog = dto.typeBlog
        }
        if (dto.content) {
            blog.content = dto.content
        }
        return await this.blogRepository.save(blog);
    }

    async DeleteBlogService(dto: DeleteBlogDto, user: UserEntity) {
        this.CheckRoleUser(user)
        const blog = await this.blogRepository.findOne({ where: { id: dto.blogId } });
        if (!blog) {
            throw new NotFoundException('Blog not found');
        }
        blog.isDisplay = false;
        await this.blogRepository.save(blog);
        return { message: 'Order successfully soft deleted' };
    }
}
