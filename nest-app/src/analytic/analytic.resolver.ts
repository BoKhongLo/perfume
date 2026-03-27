import { Query, Resolver } from '@nestjs/graphql';
import { AnalyticService } from './analytic.service';
import { FavoriteType, ProductAnalyticType, RevenueType, TopType } from 'src/types/analytics';

import { UserEntity } from 'src/types/user';
import { JwtGuardGraphql } from 'src/auth/guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUserGraphql } from 'src/decorators';


@Resolver()
export class AnalyticResolver {
    constructor(
        private readonly analyticService: AnalyticService,
    ) { }
    @UseGuards(JwtGuardGraphql)
    @Query(() => RevenueType)
    async AnalyticRevenue(
        @CurrentUserGraphql() user: UserEntity,
    ): Promise<RevenueType> { 
        return await this.analyticService.analyticsRevenue(user)
    }
    @UseGuards(JwtGuardGraphql)
    @Query(() => FavoriteType)
    async AnalyticFavorite(
        @CurrentUserGraphql() user: UserEntity,

    ): Promise<FavoriteType> { 
        return await this.analyticService.analyticsFavorite(user)
    }
    @UseGuards(JwtGuardGraphql)
    @Query(() => ProductAnalyticType)
    async AnalyticProduct(
        @CurrentUserGraphql() user: UserEntity,

    ): Promise<ProductAnalyticType> { 
        return await this.analyticService.analyticsProduct(user)
    }

    @Query(() => TopType)
    async GetTopBrand(
    ): Promise<TopType> { 
        return await this.analyticService.GetTopBrand()
    }
}

