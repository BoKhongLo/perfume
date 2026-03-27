import { Module } from '@nestjs/common';
import { BlogResolver } from './blog.resolver';
import { BlogService } from './blog.service';
import { BlogEntity } from 'src/types/blog';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/types/user';

@Module({
  imports: [TypeOrmModule.forFeature([BlogEntity, UserEntity])],
  providers: [BlogResolver, BlogService]
})
export class BlogModule {}
