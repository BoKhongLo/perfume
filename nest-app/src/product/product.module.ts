import { Module } from '@nestjs/common';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/types/user';
import { ImageDetailEntity, ProductDetailEntity, ProductEntity, TagsEntity } from 'src/types/product';
import { OrderModule } from 'src/order/order.module';
import { HttpModule } from '@nestjs/axios';
import { ProductController } from './product.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ProductEntity, ProductDetailEntity, ImageDetailEntity, TagsEntity]),
    OrderModule, HttpModule
  ],
  providers: [ProductResolver, ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
