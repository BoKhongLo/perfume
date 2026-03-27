import { Module } from '@nestjs/common';
import { AnalyticResolver } from './analytic.resolver';
import { AnalyticService } from './analytic.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/types/user';
import { ImageDetailEntity, ProductDetailEntity, ProductEntity, TagsEntity } from 'src/types/product';
import { CustomerInfoEntity, DeliveryInfoEntity, OrderEntity, OrderProductEntity } from 'src/types/order';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ProductEntity, ProductDetailEntity, ImageDetailEntity, TagsEntity, OrderEntity, DeliveryInfoEntity, CustomerInfoEntity, OrderProductEntity]),
  ],
  providers: [AnalyticResolver, AnalyticService]
})
export class AnalyticModule {}
