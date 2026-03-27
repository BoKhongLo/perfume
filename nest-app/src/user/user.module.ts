import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { UserDetailEntity, UserEntity } from 'src/types/user';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { UserController } from './user.controller';


@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserDetailEntity]), HttpModule],
  providers: [UserService, UserResolver,],
  controllers: [UserController]
})
export class UserModule {}
