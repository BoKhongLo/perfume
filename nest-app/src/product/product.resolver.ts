import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateProductDto, DeleteProductDto, GetTempWarehouseDto, SearchProductDto, TagsProductDto, UpdateProductDto, UpdateWarehouseDto } from './dtos';
import { ProductType, SearchProductType, TagsDetailType, TempWareHouseType } from 'src/types/product';
import { ResponseType } from 'src/types/response.type';
import { JwtGuardGraphql } from 'src/auth/guard';
import { ProductService } from './product.service';
import { UserEntity } from 'src/types/user';
import { CurrentUserGraphql } from 'src/decorators';

@Resolver(() => ProductType)
export class ProductResolver {
    constructor(
        private readonly productService: ProductService,
    ) { }

    @Query(() => [TagsDetailType])
    async GetTagsProduct(
        @Args('GetTagsProduct') tags: TagsProductDto
    ): Promise<TagsDetailType[]> { 
        return await this.productService.GetTagsProductService(tags)
    }

    @Query(() => SearchProductType)
    async SearchProductWithOptions(
        @Args('SearchProduct') dto: SearchProductDto
    ): Promise<SearchProductType> { 
        return await this.productService.SearchProductWithOptionsService(dto)
    }

    @Query(() => SearchProductType)
    async GetReportProduct(
        @Args('ReportProduct') dto: SearchProductDto
    ) { 
        return await this.productService.GetReportProduct(dto)
    }

    @Query(() => ProductType)
    async GetProductById(
        @Args('productId') productId: number 
    ): Promise<ProductType> { 
        const product = await this.productService.GetProductByIdService(productId);
        return product;
    }
    
    @UseGuards(JwtGuardGraphql)
    @Mutation(() => ProductType)
    async CreateProduct(
        @CurrentUserGraphql() user: UserEntity,
        @Args('CreateProduct') dto: CreateProductDto
    ): Promise<ProductType> {
        const product = await this.productService.CreateProductService(dto, user);
        return product; 
    }

    @UseGuards(JwtGuardGraphql)
    @Mutation(() => [ProductType])
    async CreateProductByList(
        @CurrentUserGraphql() user: UserEntity,
        @Args({ name: 'CreateProduct', type: () => [CreateProductDto] }) dto: CreateProductDto[]
    ): Promise<ProductType[]> {
        const product = await this.productService.CreateProductByListService(dto, user);
        return product; 
    }

    @UseGuards(JwtGuardGraphql)
    @Mutation(() => ResponseType)
    async DeleteProduct(
        @CurrentUserGraphql() user: UserEntity,
        @Args('DeleteProduct') dto: DeleteProductDto
    ): Promise<ResponseType> { 
        return await this.productService.DeleteProductService(dto, user);
    }

    @UseGuards(JwtGuardGraphql)
    @Mutation(() => ProductType)
    async UpdateProduct(
        @CurrentUserGraphql() user: UserEntity,
        @Args('UpdateProduct') dto: UpdateProductDto
    ): Promise<ProductType> {
        return await this.productService.UpdateProductService(dto, user);
    }

    @UseGuards(JwtGuardGraphql)
    @Mutation(() => [ProductType])
    async UpdateWareHouse(
        @CurrentUserGraphql() user: UserEntity,
        @Args({ name: 'TempWarehouse', type: () => [UpdateWarehouseDto] }) dto: UpdateWarehouseDto[]
    ): Promise<ProductType[]> {
        return await this.productService.UpdateListWarehouseService(dto, user);
    }

    @UseGuards(JwtGuardGraphql)
    @Query(() => [TempWareHouseType])
    async GetTempWareHouse(
        @CurrentUserGraphql() user: UserEntity,
        @Args({ name: 'TempWarehouse', type: () => [GetTempWarehouseDto] }) dto: GetTempWarehouseDto[]
    ): Promise<TempWareHouseType[]> {
        return await this.productService.GetListTempWarehouseService(dto, user);
    }
}
