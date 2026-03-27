import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/types/user';
import { CustomerInfoEntity, DeliveryInfoEntity, OrderEntity, OrderProductEntity } from 'src/types/order';
import { ProductEntity } from 'src/types/product';
import { HttpModule } from '@nestjs/axios';
import { OrderController } from './order.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, OrderEntity, DeliveryInfoEntity, CustomerInfoEntity, OrderProductEntity, ProductEntity]),
    HttpModule
  ],
  providers: [OrderService, OrderResolver,],
  exports: [OrderService],
  controllers: [OrderController]
})
export class OrderModule { }
