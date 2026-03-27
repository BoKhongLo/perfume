import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDetailEntity, UserEntity } from 'src/types/user';
import { Repository } from 'typeorm';
import { LoginDto, SignUpDto } from './dto';
import * as argon from 'argon2';
import { v5 as uuidv5 } from 'uuid';
import { v4 as uuidv4 } from 'uuid';
import { JwtPayload } from './interfaces';

@Injectable()
export class AuthService {
    constructor(
        private jwt: JwtService,
        private config: ConfigService,
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        @InjectRepository(UserDetailEntity) private userDetailRepository: Repository<UserDetailEntity>,

    ) { }

    async validateUser(id: string, email: string): Promise<any> {
        const user = await this.userRepository.findOne({
            where: {
                email: email,
                secretKey: id
            }
        })
        if (user) {
            return user
        }
        return null;
    }

    async validateJwtPayload(
        payload: JwtPayload,
    ): Promise<any> {
        const user = await this.userRepository.findOne({
            where: {
                email: payload.email,
                secretKey: payload.id
            }
        })
        if (user) {
            return user
        }
        return null;
    }

    async LoginService(dto: LoginDto) {
        const userLogin = await this.userRepository.findOne({
            where: {
                email: dto.email
            }
        });
        if (!userLogin)
            throw new ForbiddenException(
                'This user does not exist',
            );

        const pwMatches = await argon.verify(
            userLogin.hash,
            dto.password,
        );

        if (!pwMatches)
            throw new ForbiddenException(
                'Wrong password',
            );
        const token = await this.signToken(userLogin.secretKey, userLogin.email)
        await this.updateRefreshToken(userLogin.secretKey, token.refresh_token)
        return token;
    }
    
    async RefreshService(dto: JwtPayload) {
        const userLogin = await this.userRepository.findOne({
            where: {
                email: dto.email,
                secretKey: dto.id,
            }
        });
        if (!userLogin)
            throw new ForbiddenException(
                'This user does not exist',
            );

 
        const token = await this.signToken(userLogin.secretKey, userLogin.email)
        await this.updateRefreshToken(userLogin.secretKey, token.refresh_token)
        return token;
    }
    async SignupService(dto: SignUpDto) {
        const checkMail = await this.userRepository.findOne({
            where: {
                email: dto.email,
            }
        })

        if (checkMail != null) {
            throw new ForbiddenException(
                'This email was existed before',
            );
        }

        const hash = await argon.hash(dto.password);
        
        const userDetail = this.userDetailRepository.create({
            firstName: dto.firstName,
            lastName: dto.lastName,
        });
    

        const savedUserDetail = await this.userDetailRepository.save(userDetail);

        const UserCre = this.userRepository.create({
            secretKey: uuidv5(dto.email, uuidv5.URL),
            email: dto.email,
            hash: hash,
            refreshToken: uuidv4(),
            details: savedUserDetail,
            actionLog: [],
            role: [],
            username: dto.username
        })

        const newUser = await this.userRepository.save(UserCre);
        const token = await this.signToken(newUser.secretKey, newUser.email)
        await this.updateRefreshToken(newUser.secretKey, token.refresh_token)
        return token;
    }

    async signToken(
        id: string,
        email: string,
    ): Promise<{ access_token: string, refresh_token: string }> {

        const accessToken = await this.jwt.signAsync(
            {
                id: id,
                email,
            },
            {
                expiresIn: '2h',
                secret: this.config.get('JWT_SECRET'),
            },
        );

        const refreshToken = await this.jwt.signAsync(
            {
                id: id,
                email,
            },
            {
                expiresIn: '15d',
                secret: this.config.get('JWT_REFRESH_SECRET'),
            },
        );

        return {
            access_token: accessToken,
            refresh_token: refreshToken
        };
    }

    async updateRefreshToken(userId: string, refreshToken: string) {
        const user = await this.userRepository.findOne({
            where: {
                secretKey: userId,
            }
        })
        user.refreshToken = refreshToken
        await this.userRepository.save(user)
    }

}
