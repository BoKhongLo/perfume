import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageDetailEntity, ProductDetailEntity, ProductEntity, TagsEntity, TempWareHouseType } from 'src/types/product';
import { UserEntity } from 'src/types/user';
import { Repository } from 'typeorm';
import { CreateProductDto, DeleteProductDto, GetTempWarehouseDto, ProductDetailInp, SearchProductDto, TagsProductDto, UpdateProductDto, UpdateWarehouseDto } from './dtos';
import { OrderService } from 'src/order/order.service';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import * as FormData from 'form-data';


@Injectable()
export class ProductService {
    constructor(
        private config: ConfigService,
        private orderService: OrderService,
        private readonly httpService: HttpService,
        @InjectRepository(ProductEntity) private productRepository: Repository<ProductEntity>,
        @InjectRepository(ProductDetailEntity) private productDetailRepository: Repository<ProductDetailEntity>,
        @InjectRepository(ImageDetailEntity) private imageDetailRepository: Repository<ImageDetailEntity>,
        @InjectRepository(TagsEntity) private tagsRepository: Repository<TagsEntity>,
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,

    ) { }

    private CheckRoleUser(user: UserEntity) {
        if (!user.role.includes("ADMIN") && !user.role.includes("WEREHOUSEMANAGER")) {
            throw new ForbiddenException('The user does not have permission');
        }
    }

    async GetReportProduct(dto: SearchProductDto) {
        const dataRequest: ProductEntity[] = (await this.SearchProductWithOptionsService(dto)).data;
        console.log(dto)
        const requestBody = {
            data: dataRequest,
            type: 'ReportProduct'
        };

        const response = await firstValueFrom(
        this.httpService.post('http://localhost:8000/export-file', requestBody, {
            responseType: 'arraybuffer',
        }),
        );

        return response.data;
    }


    async SearchProductWithOptionsService(dto: SearchProductDto) {
        const queryBuilder = this.productRepository.createQueryBuilder('product');

        queryBuilder
            .leftJoinAndSelect('product.details', 'details')
            .leftJoinAndSelect('details.imgDisplay', 'imgDisplay')
            .leftJoinAndSelect('details.size', 'size')
            .leftJoinAndSelect('details.brand', 'brand')
            .leftJoinAndSelect('details.fragranceNotes', 'fragranceNotes')
            .leftJoinAndSelect('details.concentration', 'concentration')
            .leftJoinAndSelect('details.sex', 'sex')
            .leftJoinAndSelect('details.sillage', 'sillage')
            .leftJoinAndSelect('details.longevity', 'longevity');

        queryBuilder.andWhere('product.isDisplay = :isDisplay', { isDisplay: true });

        if (dto.name) {
            queryBuilder.andWhere('product.name LIKE :name', { name: `%${dto.name}%` });
        }

        if (dto.rangeMoney && dto.rangeMoney.length === 2) {
            const [min, max] = dto.rangeMoney;
            queryBuilder.andWhere('product.displayCost BETWEEN :min AND :max', { min, max });
        }

        if (dto.size && dto.size.length > 0) {
            queryBuilder.andWhere('size.value IN (:...sizes)', { sizes: dto.size.map(tag => tag.value.toLowerCase()) });
        }

        if (dto.brand && dto.brand.length > 0) {
            queryBuilder.andWhere('brand.value IN (:...brands)', { brands: dto.brand.map(tag => tag.value.toLowerCase()) });
        }

        if (dto.fragranceNotes && dto.fragranceNotes.length > 0) {
            queryBuilder.andWhere('fragranceNotes.value IN (:...fragranceNotes)', { fragranceNotes: dto.fragranceNotes.map(tag => tag.value.toLowerCase()) });
        }

        if (dto.concentration && dto.concentration.length > 0) {
            queryBuilder.andWhere('concentration.value IN (:...concentrations)', { concentrations: dto.concentration.map(tag => tag.value.toLowerCase()) });
        }

        if (dto.sex && dto.sex.length > 0) {
            queryBuilder.andWhere('sex.value IN (:...sexes)', { sexes: dto.sex.map(tag => tag.value.toLowerCase()) });
        }

        // Sorting
        if (dto.sort) {
            switch (dto.sort) {
                case 'price_asc':
                    queryBuilder.orderBy('product.displayCost', 'ASC');
                    break;
                case 'price_desc':
                    queryBuilder.orderBy('product.displayCost', 'DESC');
                    break;
                case 'created_at_asc':
                    queryBuilder.orderBy('product.created_at', 'ASC');
                    break;
                case 'created_at_desc':
                    queryBuilder.orderBy('product.created_at', 'DESC');
                    break;
                default:
                    break;
            }
        }

        const maxValue = await queryBuilder.getCount();

        let list_product = await queryBuilder.getMany();

        if (dto.hotSales) {
            const timeframes: Array<'week' | 'month' | 'year' | 'all'> = ['week', 'month', 'year', 'all'];
            let currentTimeframe: 'week' | 'month' | 'year' | 'all' = (dto.hotSales as 'week' | 'month' | 'year' | 'all') || 'week';

            let tmpOrder = await this.orderService.getOrderDetail(currentTimeframe);

            while (tmpOrder.length < dto.count) {
                const currentIndex = timeframes.indexOf(currentTimeframe);
                if (tmpOrder.length < dto.count) {
                    currentTimeframe = timeframes[currentIndex + 1];
                    if (currentTimeframe === 'all') {
                        list_product.sort((a, b) => a.buyCount - b.buyCount);
                        break;
                    }
                    tmpOrder = await this.orderService.getOrderDetail(currentTimeframe);
                } else {
                    list_product = list_product.filter((i) => tmpOrder.findIndex(e => e.productId === i.id) !== -1);
                    break;
                }
            }
        }

        if (dto.index && dto.count) {
            const offset = (dto.index - 1) * dto.count;
            list_product = list_product.slice(offset, offset + dto.count);
        }

        return { maxValue, data: list_product };
    }



    async GetTagsProductService(dto: TagsProductDto) {
        const queryBuilder = this.tagsRepository.createQueryBuilder('tagsDetail');
        if (dto.tags) {
            queryBuilder.andWhere('tagsDetail.type = :tagsType', { tagsType: dto.tags });
        }

        return await queryBuilder.getMany();
    }



    async GetProductByIdService(productId: number) {
        const product = await this.productRepository.findOne({
            where: { id: productId, isDisplay: true },
            relations: [
                'details',
                'details.imgDisplay',
                'details.size',
                'details.brand',
                'details.fragranceNotes',
                'details.concentration',
                'details.sex',
                'details.sillage',
                'details.longevity',
            ],
        });

        if (!product) {
            throw new ForbiddenException('Product not found or not available');
        }

        return product;
    }

    private async findOrCreateTag(tagValue: string, tagType: string): Promise<TagsEntity> {
        const tagLowerCase = tagValue.toLowerCase();
        let tag = await this.tagsRepository.findOne({ where: { value: tagLowerCase, type: tagType } });

        if (!tag) {
            tag = this.tagsRepository.create({ value: tagLowerCase, type: tagType });
            tag = await this.tagsRepository.save(tag);
        }

        return tag;
    }

    async CreateProductByListService(dto: CreateProductDto[], user: UserEntity) {
        const dataReturn : ProductEntity[] = []
        for (const product of dto) {
            dataReturn.push(await this.CreateProductService(product, user))
        }
        return dataReturn
    }

    async CreateProductService(dto: CreateProductDto, user: UserEntity) {
        this.CheckRoleUser(user);

        const existingProduct = await this.productRepository.findOne({
            where: { name: dto.name, category: dto.category, isDisplay: true },
        });

        if (existingProduct) {
            throw new ForbiddenException('Product already exists with the same name and category.');
        }
        let savedImgDetails = []

        if (dto.details.imgDisplay) {
            const imgDetails = dto.details.imgDisplay.map((img) =>
                this.imageDetailRepository.create({ url: img.url, link: img.link || [] })
            );
            savedImgDetails = await this.imageDetailRepository.save(imgDetails);
        }


        const sizeTags = [];

        for (const sizeTag of dto.details.size) {
            const tag = await this.findOrCreateTag(sizeTag.value, 'size');
            sizeTags.push(tag);
        }

        const brandTag = dto.details.brand?.value ? await this.findOrCreateTag(dto.details.brand.value, 'brand') : null;
        const fragranceNotesTag = dto.details.fragranceNotes?.value
            ? await this.findOrCreateTag(dto.details.fragranceNotes.value, 'fragranceNotes')
            : null;
        const concentrationTag = dto.details.concentration?.value
            ? await this.findOrCreateTag(dto.details.concentration.value, 'concentration')
            : null;
        const sexTag = dto.details.sex?.value ? await this.findOrCreateTag(dto.details.sex.value, 'sex') : null;
        const sillageTag = dto.details.sillage?.value ? await this.findOrCreateTag(dto.details.sillage.value, 'sillage') : null;
        const longevityTag = dto.details.longevity?.value
            ? await this.findOrCreateTag(dto.details.longevity.value, 'longevity')
            : null;


        const newProductDetail = this.productDetailRepository.create({
            size: sizeTags, 
            brand: brandTag,
            fragranceNotes: fragranceNotesTag,
            concentration: concentrationTag,
            sex: sexTag,
            description: dto.details.description || '',
            imgDisplay: savedImgDetails,
            tutorial: dto.details.tutorial || '',
            sillage: sillageTag,
            longevity: longevityTag,
        });

        const savedProductDetail = await this.productDetailRepository.save(newProductDetail);

        const newProduct = this.productRepository.create({
            name: dto.name,
            originCost: dto.originCost,
            displayCost: dto.displayCost,
            isDisplay: true,
            stockQuantity: dto.stockQuantity || 0,
            category: dto.category,
            details: savedProductDetail,
        });

        return await this.productRepository.save(newProduct);
    }

    async DeleteProductService(dto: DeleteProductDto, user: UserEntity) {
        this.CheckRoleUser(user);

        const product = await this.productRepository.findOne({ where: { id: dto.productId } });

        if (!product) {
            throw new ForbiddenException('Product not found');
        }

        product.isDisplay = false;
        await this.productRepository.save(product);

        return { message: 'Product successfully soft deleted' };
    }

    private async updateProductDetails(details: ProductDetailEntity, dtoDetails: ProductDetailInp): Promise<ProductDetailEntity> {
        if (dtoDetails.size) {
            const sizeTags = [];

            for (const sizeTag of dtoDetails.size) {
                const tag = await this.findOrCreateTag(sizeTag.value, 'size');
                sizeTags.push(tag);
            }
            details.size = sizeTags;
        }

        if (dtoDetails.brand && dtoDetails.brand.value) {
            details.brand = await this.findOrCreateTag(dtoDetails.brand.value, 'brand');
        }

        if (dtoDetails.fragranceNotes && dtoDetails.fragranceNotes.value) {
            details.fragranceNotes = await this.findOrCreateTag(dtoDetails.fragranceNotes.value, 'fragranceNotes');
        }

        if (dtoDetails.concentration && dtoDetails.concentration.value) {
            details.concentration = await this.findOrCreateTag(dtoDetails.concentration.value, 'concentration');
        }

        if (dtoDetails.sex && dtoDetails.sex.value) {
            details.sex = await this.findOrCreateTag(dtoDetails.sex.value, 'sex');
        }
        if (dtoDetails.sillage && dtoDetails.sillage.value) {
            details.sillage = await this.findOrCreateTag(dtoDetails.sillage.value, 'sillage');
        }
        if (dtoDetails.longevity && dtoDetails.longevity.value) {
            details.longevity = await this.findOrCreateTag(dtoDetails.longevity.value, 'longevity');
        }
        if (dtoDetails.description) {
            details.description = dtoDetails.description;
        }
        if (dtoDetails.tutorial) {
            details.tutorial = dtoDetails.tutorial;
        }

        if (dtoDetails.imgDisplay) {
            details.imgDisplay = [];
            const imgDetails = [];
            for (const img of dtoDetails.imgDisplay) {

                const existingImageDetails = await this.imageDetailRepository.findOne({
                    where: { url: img.url }
                });
    
                if (!existingImageDetails) {
                    const newImageDetail = this.imageDetailRepository.create({
                        url: img.url,
                        link: img?.link || []
                    });
                    imgDetails.push(await this.imageDetailRepository.save(newImageDetail));
                }
                else {
                    imgDetails.push(existingImageDetails)
                }
            }
            details.imgDisplay = imgDetails;
        }
        
        return await this.productDetailRepository.save(details);
    }


    async UpdateProductService(dto: UpdateProductDto, user: UserEntity) {
        this.CheckRoleUser(user);

        const product = await this.productRepository.findOne({
            where: { id: dto.productId, isDisplay: true },
            relations: [
                'details',
                'details.imgDisplay',
                'details.size',
                'details.brand',
                'details.fragranceNotes',
                'details.concentration',
                'details.sex',
                'details.sillage',
                'details.longevity',
            ],
        });

        if (!product) {
            throw new ForbiddenException('Product not found or is not available for update');
        }

        if (dto.name) product.name = dto.name;
        if (dto.originCost) product.originCost = dto.originCost;
        if (dto.displayCost) product.displayCost = dto.displayCost;
        if (dto.stockQuantity) product.stockQuantity = dto.stockQuantity;
        if (dto.category) product.category = dto.category;

        if (dto.details) {
            product.details = await this.updateProductDetails(product.details, dto.details);
        }

        return await this.productRepository.save(product);

    }

    async UpdateWarehouseService(dto: UpdateWarehouseDto) {

        const product = await this.productRepository.findOne({
            where: { id: dto.productId, isDisplay: true },
        });

        if (!product) {
            throw new ForbiddenException('Product not found or is not available for update');
        }

        if (dto.stockQuantity) product.stockQuantity += dto.stockQuantity;
    
        return await this.productRepository.save(product);
    }
    async GetListTempWarehouseService(dto: GetTempWarehouseDto[], user: UserEntity) {
        this.CheckRoleUser(user);
        const dataReturn = []
        for (const e of dto) {
            dataReturn.push(await this.GetTempWarehouseService(e))

        }
        return dataReturn
    }

    async UpdateListWarehouseService(dto: UpdateWarehouseDto[], user: UserEntity) {
        this.CheckRoleUser(user);
        const dataReturn = []
        for (const e of dto) {
            dataReturn.push(await this.UpdateWarehouseService(e))

        }
        return dataReturn
    }

    async GetTempWarehouseService(dto: GetTempWarehouseDto) {
        const product = await this.productRepository.findOne({
            where: { id: dto.productId, isDisplay: true },
        });

        if (!product) {
            throw new ForbiddenException('Product not found or is not available for update');
        }

        return {
            id: product.id,
            name: product.name,
            count: dto.stockQuantity,
            summary: product.stockQuantity + dto.stockQuantity
        } as TempWareHouseType
    }
}
