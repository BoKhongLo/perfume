import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserDetailEntity, UserEntity } from 'src/types/user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAccessStrategy, JwtGraphqlStrategy, JwtRefreshStrategy} from './strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserDetailEntity]), PassportModule ],
  providers: [AuthService, JwtAccessStrategy, JwtRefreshStrategy, JwtGraphqlStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
