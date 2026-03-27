import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { FavoriteElementProductType, RevenueType } from 'src/types/analytics';
import { CustomerInfoEntity, DeliveryInfoEntity, OrderEntity, OrderProductEntity } from 'src/types/order';
import { ImageDetailEntity, ProductDetailEntity, ProductEntity, TagsEntity } from 'src/types/product';
import { UserEntity } from 'src/types/user';
import { Repository } from 'typeorm';



@Injectable()
export class AnalyticService {
    constructor(
        private config: ConfigService,

        @InjectRepository(ProductEntity) private productRepository: Repository<ProductEntity>,
        @InjectRepository(ProductDetailEntity) private productDetailRepository: Repository<ProductDetailEntity>,
        @InjectRepository(ImageDetailEntity) private imageDetailRepository: Repository<ImageDetailEntity>,
        @InjectRepository(TagsEntity) private tagsRepository: Repository<TagsEntity>,
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        @InjectRepository(OrderEntity) private orderRepository: Repository<OrderEntity>,
        @InjectRepository(DeliveryInfoEntity) private deliveryRepository: Repository<DeliveryInfoEntity>,
        @InjectRepository(CustomerInfoEntity) private customerRepository: Repository<CustomerInfoEntity>,
        @InjectRepository(OrderProductEntity) private orderProductRepository: Repository<OrderProductEntity>,
    ) { }
    private CheckRoleUser(user: UserEntity) {
        if (!user.role.includes("ADMIN")) {
            throw new ForbiddenException('The user does not have permission');
        }
    }

    private slipData(orders: OrderEntity[]) {
        const monthly: Record<string, OrderEntity[]> = {};
        const startMonth = new Date(orders[0].created_at).getMonth() + 1;
        const startYear = new Date(orders[0].created_at).getFullYear()
        const endMonth = new Date().getMonth() + 1;
        const endYear = new Date().getFullYear();

        for (let year = startYear; year <= endYear; year++) {
            for (let month = (year === startYear ? startMonth : 1); month <= (year === endYear ? endMonth : 12); month++) {
                monthly[`${year}-${month}`] = [];
            }
        }
        orders.forEach((order) => {
            const tmpMonth = new Date(order.created_at).getMonth() + 1;
            const tmpYear = new Date(order.created_at).getFullYear();
            monthly[`${tmpYear}-${tmpMonth}`].push(order);
        });

        return monthly;
    }

    private CalculateDataRevenue(orders: OrderEntity[]) {
        const dataReturn = {
            totalRevenue: 0,
            totalProfit: 0,
            totalProduct: 0,
            totalOrder: orders.length
        }

        const totalOrder = orders.length

        for (const order of orders) {
            for (const product of order.orderProducts) {
                dataReturn.totalProduct += product.quantity
                dataReturn.totalRevenue += product.quantity * (product.unitPrice - (product.unitPrice * product?.discount ? product.discount : 0))
                dataReturn.totalProfit += product.quantity * (product.unitPrice - (product.unitPrice * product?.discount ? product.discount : 0)) - product.quantity * product.product.originCost
            }

        }
        return dataReturn
    }
    private CalculateDataRevenuePerMonth(data: Record<string, OrderEntity[]>) {
        const dataMonth = []
        for (const e in data) {
            let tmpRevenue = 0
            let tmpProfit = 0
            let tmpProduct = 0

            for (const order of data[e]) {
                for (const product of order.orderProducts) {
                    tmpProduct += product.quantity
                    tmpRevenue += product.quantity * (product.unitPrice - (product.unitPrice * product?.discount ? product.discount : 0))
                    tmpProfit += product.quantity * (product.unitPrice - (product.unitPrice * product?.discount ? product.discount : 0)) - product.quantity * product.product.originCost
                }
            }
            dataMonth.push({ Date: e, 'productSold': tmpProduct, 'profit': tmpProfit, 'revenue': tmpRevenue })

        }
        return dataMonth
    }

    private CalculateDataRevenueOfWeek(orders: OrderEntity[]) {
        const currentWeekOrders = orders.filter(order => {
            const orderDate = new Date(order.created_at);
            const today = new Date();
            const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 1);
            const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7 - today.getDay());
            return startOfWeek <= orderDate && orderDate <= endOfWeek;
        });


        const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        const weekDayOrders: Record<string, OrderEntity[]> = {};

        for (const day of weekday) {
            weekDayOrders[day] = []
        }

        currentWeekOrders.forEach(order => {
            const dayOfWeek = weekday[new Date(order.created_at).getDay()];
            if (!weekDayOrders[dayOfWeek]) {
                weekDayOrders[dayOfWeek] = [];
            }
            weekDayOrders[dayOfWeek].push(order);
        });

        const dataOfWeak = []
        for (const e in weekDayOrders) {
            let tmpRevenue = 0
            let tmpProfit = 0
            let tmpProduct = 0

            for (const order of weekDayOrders[e]) {
                for (const product of order.orderProducts) {
                    tmpProduct += product.quantity
                    tmpRevenue += product.quantity * (product.unitPrice - (product.unitPrice * product?.discount ? product.discount : 0))
                    tmpProfit += product.quantity * (product.unitPrice - (product.unitPrice * product?.discount ? product.discount : 0)) - product.quantity * product.product.originCost
                }
            }
            dataOfWeak.push({ name: 'revenue', xData: e, yData: tmpRevenue })
            dataOfWeak.push({ name: 'profit', xData: e, yData: tmpProfit })
            dataOfWeak.push({ name: 'productSold', xData: e, yData: tmpProduct })
        }
        return dataOfWeak
    }

    async analyticsRevenue(user: UserEntity) {
        this.CheckRoleUser(user)

        const query = this.orderRepository.createQueryBuilder('order')
            .leftJoinAndSelect('order.customerInfo', 'customerInfo')
            .leftJoinAndSelect('order.deliveryInfo', 'deliveryInfo')
            .leftJoinAndSelect('order.orderProducts', 'orderProducts')
            .leftJoinAndSelect('orderProducts.product', 'product')
            .orderBy('order.created_at', 'ASC')


        const orders = await query.getMany()
        const monthlySums = this.slipData(orders);
        const totalData = this.CalculateDataRevenue(orders)
        const totalDataMonth = this.CalculateDataRevenuePerMonth(monthlySums)

        const totalDataWeek = this.CalculateDataRevenueOfWeek(orders)


        return {
            dataAllTime: totalData,
            dataMonth: totalDataMonth,
            dataWeek: totalDataWeek
        } as RevenueType
    }

    async analyticsFavorite(user: UserEntity) {
        this.CheckRoleUser(user)
        const query = this.orderRepository.createQueryBuilder('order')
            .leftJoinAndSelect('order.customerInfo', 'customerInfo')
            .leftJoinAndSelect('order.deliveryInfo', 'deliveryInfo')
            .leftJoinAndSelect('order.orderProducts', 'orderProducts')
            .leftJoinAndSelect('orderProducts.product', 'product')
            .leftJoinAndSelect('product.details', 'details')
            .leftJoinAndSelect('details.imgDisplay', 'imgDisplay')
            .leftJoinAndSelect('details.brand', 'brand')
            .leftJoinAndSelect('details.sex', 'sex')

        const orders = await query.getMany()

        const dataBrand: Record<string, number> = {}
        const dataSex: Record<string, number> = {}

        for (const order of orders) {
            for (const product of order.orderProducts) {
                if (product.product.details && product.product.details.brand && product.product.details.brand?.value) {
                    if (!dataBrand[product.product.details.brand?.value]) {
                        dataBrand[product.product.details.brand?.value] = 0
                    }
                } else {
                    continue;
                }
                if (product.product.details && product.product.details.sex && product.product.details.sex?.value) {
                    if (!dataSex[product.product.details.sex?.value]) {
                        dataSex[product.product.details.sex?.value] = 0
                    }
                } else {

                    continue;
                }

                dataBrand[product.product.details.brand.value] += product.quantity
                dataSex[product.product.details.sex.value] += product.quantity
            }
        }

        const total = dataSex['nam'] + dataSex['unisex'] + dataSex['nữ']

        const dataSexPer = [
            { type: 'nam', value: parseInt(((dataSex['nam'] / total) * 100).toFixed(0)) },
            { type: 'unisex', value: parseInt(((dataSex['unisex'] / total) * 100).toFixed(0)) },
            { type: 'nữ', value: parseInt(((dataSex['nữ'] / total) * 100).toFixed(0)) },
        ];


        const dataBrandPer = []
        for (const b in dataBrand) {
            dataBrandPer.push({ type: b, value: dataBrand[b] })
        }

        const productStats: { [productId: string]: FavoriteElementProductType } = {};

        orders.forEach(order => {
            order.orderProducts.forEach(orderProduct => {
                const productId = orderProduct.product.id;

                if (!productStats[productId]) {
                    productStats[productId] = {
                        name: orderProduct.product.name,
                        imgDisplay: orderProduct.product.details?.imgDisplay[0]?.url ? orderProduct.product.details?.imgDisplay[0]?.url : '', 
                        brand: orderProduct.product.details?.brand?.value ? orderProduct.product.details?.brand?.value : '', 
                        totalQuantity: 0,                       
                        totalProfit: 0,                            
                        displayCost: orderProduct.product?.displayCost
                    };
                }
        
                productStats[productId].totalQuantity += orderProduct.quantity;
                productStats[productId].totalProfit += orderProduct.quantity * (orderProduct.unitPrice 
                    - (orderProduct.unitPrice * orderProduct?.discount ? orderProduct.discount : 0))
                    - orderProduct.quantity * orderProduct.product.originCost
            });
        });
        
      
        const topProducts = Object.values(productStats)
            .sort((a, b) => b.totalQuantity - a.totalQuantity)
            .slice(0, 10); 
        

        return {dataBrand : dataBrandPer, dataSex: dataSexPer, dataProduct: topProducts}
    }

    async analyticsProduct(user: UserEntity) {
        this.CheckRoleUser(user)

        const query = this.productRepository.createQueryBuilder('product')
            .leftJoinAndSelect('product.details', 'details')
            .leftJoinAndSelect('details.brand', 'brand')
            .leftJoinAndSelect('details.sex', 'sex')

        const products = await query.getMany()

        const dataBrand: Record<string, number> = {}
        const dataSex: Record<string, number> = {}

        for (const product of products) {
            if (product.details && product.details.brand && product.details.brand?.value) {
                if (!dataBrand[product.details.brand?.value]) {
                    dataBrand[product.details.brand?.value] = 0
                }
            } else {
                continue;
            }
            if (product.details && product.details.sex && product.details.sex?.value) {
                if (!dataSex[product.details.sex?.value]) {
                    dataSex[product.details.sex?.value] = 0
                }
            } else {

                continue;
            }

            dataBrand[product.details.brand.value] += 1
            dataSex[product.details.sex.value] += 1
        }

        const total = dataSex['nam'] + dataSex['unisex'] + dataSex['nữ']

        const dataSexPer = [
            { type: 'nam', value: parseInt(((dataSex['nam'] / total) * 100).toFixed(0)) },
            { type: 'unisex', value: parseInt(((dataSex['unisex'] / total) * 100).toFixed(0)) },
            { type: 'nữ', value: parseInt(((dataSex['nữ'] / total) * 100).toFixed(0)) },
        ];


        const dataBrandPer = []
        for (const b in dataBrand) {
            dataBrandPer.push({ type: b, value: dataBrand[b] })
        }

        return {dataBrand : dataBrandPer, dataSex: dataSexPer}
    }


    async GetTopBrand() {
        const query = await this.orderRepository.createQueryBuilder('order')
            .leftJoin('order.orderProducts', 'orderProducts')
            .leftJoin('orderProducts.product', 'product')
            .leftJoin('product.details', 'details')
            .leftJoin('details.brand', 'brand')
            .select('brand.value', 'brandName')
            .addSelect('SUM(orderProducts.quantity)', 'totalSales')
            .groupBy('brand.value')
            .orderBy('totalSales', 'DESC')
            .limit(20);
    
        const result = await query.getRawMany();

        const formattedResult = {
            data: result.map(row => row.brandName).filter(e => e !== null).slice(0, 10)
        };

        return formattedResult;
    }
    
}