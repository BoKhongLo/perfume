import axios from 'axios';

import { GetTempWarehouseDto, OrderType, Perfume, ProductType, TagsDetailType, TempWareHouseType, UpdateWarehouseDto, UserType } from "@/types";
import { Backend_URL } from "./Constants";
import { SignUpDto } from "./dtos/auth";
import { CreateProductDto, SearchProductDto, UpdateProductDto } from "./dtos/product";
import { ProductData, ProductDetails } from '@/lib/dtos/product'
import { CreateOrderDto, SearchOrderDto, UpdateOrderDto } from './dtos/order';
import { ReadFileDto } from './dtos/media';
import { CreateUserDto, UpdateUserDto } from './dtos/user';




async function refreshTokenApi(refreshToken: string): Promise<string | null> {
    try {
        const response = await fetch(Backend_URL + "/auth/refresh", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${refreshToken}`
            },
        });

        if (response.status === 201) {
            const data = await response.json();
            return data.access_token;
        } else {
            console.error("Failed to refresh access token:", response.statusText);
            return null;
        }
    } catch (error) {
        console.error("Error while refreshing access token:", error);
        return null;
    }
}

export async function makeRequestApi(callback: Function, dto: any, refreshToken: string | undefined, accessToken: string | undefined) {
    try {
        if (accessToken == undefined) return null;
        const data = await callback(dto, accessToken);

        if (data == null && refreshToken !== undefined) {
            const newAccessToken = await refreshTokenApi(refreshToken);

            if (newAccessToken) {
                return await callback(dto, newAccessToken);
            } else {
                console.log('Unauthorized!');
                return null;
            }
        } else {
            return data;
        }
    } catch (error) {
        console.log(error);
    }
}



export async function signUpApi(dto: SignUpDto) {
    const res = await fetch(Backend_URL + "/auth/signup", {
        method: "POST",
        body: JSON.stringify({
            ...dto
        }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (res.status == 401) {
        console.log(res.statusText);
        return null;
    }
    return await res.json();
}


export async function GetHotSaleProductForHome(sex: string) {
    const query = `
    query SearchProductWithOptions {
      SearchProductWithOptions(
        SearchProduct: {
          index: 1
          count: 10
          hotSales: "week"
          sex: { type: "sex", value: "${sex}" }
        }
      ) {
        data {
            displayCost
            name
            details {
                id
                imgDisplay {
                    id
                    link
                    url
                }
                brand {
                    id
                    type
                    value
                }
            }
            id
        }
        maxValue
      }
    }
  `;

    try {
        const response = await axios.post(Backend_URL + '/graphql', {
            query: query,
        });

        const res: ProductType[] = response.data.data.SearchProductWithOptions.data;
        const maxValue = response.data.data.SearchProductWithOptions.maxValue

        const dataReturn: Perfume[] = []
        for (const item of res) {
            dataReturn.push({
                img: item.details?.imgDisplay?.[0]?.url || null,
                name: item.name,
                brand: item.details?.brand?.value || null,
                cost: item.displayCost && item.displayCost.toLocaleString('vi-VN') + ' VNĐ',
                id: item.id
            } as Perfume)
        }
        return { maxValue: maxValue, data: dataReturn };
    } catch (error) {
        console.error('Error fetching: ', error);
        throw error;
    }
}

export async function GetProductForSearch(dto: SearchProductDto) {
    const query = `
    query SearchProductWithOptions {
      SearchProductWithOptions(
        SearchProduct: {
          name: ${dto.name ? `"${dto.name}"` : null}
          rangeMoney: ${dto.rangeMoney ? `[${dto.rangeMoney.join(', ')}]` : null}
          size: ${dto.size ? `[${dto.size.map(item => `{ type: "${item.type}", value: "${item.value || ''}" }`).join(', ')}]` : null}
          brand: ${dto.brand ? `[${dto.brand.map(item => `{ type: "${item.type}", value: "${item.value || ''}" }`).join(', ')}]` : null}
          fragranceNotes: ${dto.fragranceNotes ? `[${dto.fragranceNotes.map(item => `{ type: "${item.type}", value: "${item.value || ''}" }`).join(', ')}]` : null}
          concentration: ${dto.concentration ? `[${dto.concentration.map(item => `{ type: "${item.type}", value: "${item.value || ''}" }`).join(', ')}]` : null}
          sex: ${dto.sex ? `[${dto.sex.map(item => `{ type: "${item.type}", value: "${item.value || ''}" }`).join(', ')}]` : null}
          index: ${dto.index || 1}
          count: ${dto.count || 10}
          sort: ${dto.sort ? `"${dto.sort}"` : null}
          hotSales: ${dto.hotSales ? `"${dto.hotSales}"` : null}
        }
      ) {
        data {
            displayCost
            name
            details {
                id
                imgDisplay {
                    id
                    link
                    url
                }
                brand {
                    id
                    type
                    value
                }
            }
            id
        }
        maxValue
      }
    }
  `;

    try {
        const response = await axios.post(Backend_URL + '/graphql', { query });

        const res: ProductType[] = response.data.data.SearchProductWithOptions.data;
        const maxValue = response.data.data.SearchProductWithOptions.maxValue
        const dataReturn: Perfume[] = [];

        for (const item of res) {
            dataReturn.push({
                img: item.details?.imgDisplay?.[0]?.url || null,
                name: item.name,
                brand: item.details?.brand?.value || null,
                cost: item.displayCost && item.displayCost.toLocaleString('vi-VN') + ' VNĐ',
                id: item.id
            } as Perfume);
        }

        return { maxValue: maxValue, data: dataReturn };
    } catch (error) {
        console.error('Error fetching: ', error);
        throw error;
    }
}

export async function GetTagsProduct(tag: string | null = null) {
    const query = `
      query GetTagsProduct {
        GetTagsProduct(GetTagsProduct: { tags: ${tag ? `"${tag}"` : null} }) {
          id
          type
          value
        }
      }
    `;

    try {
        const response = await axios.post(Backend_URL + '/graphql', {
            query: query,
        });

        const res: TagsDetailType[] = response.data.data.GetTagsProduct;
        return res
    } catch (error) {
        console.error('Error fetching: ', error);
        throw error;
    }
}

export async function GetProductById(id: number) {
    const query = `
        query GetProductById {
            GetProductById(productId: ${id}) {
                displayCost
                id
                isDisplay
                name
                originCost
                rating
                stockQuantity
                updated_at
                created_at
                buyCount
                details {
                    brand {
                        id
                        type
                        value
                    }
                    fragranceNotes {
                        id
                        type
                        value
                    }
                    description
                    concentration {
                        id
                        type
                        value
                    }
                    imgDisplay {
                        id
                        link
                        url
                    }
                    longevity {
                        id
                        type
                        value
                    }
                    sex {
                        id
                        type
                        value
                    }
                    sillage {
                        id
                        type
                        value
                    }
                    size {
                        id
                        type
                        value
                    }
                    tutorial
                }
            }
        }
  `;

    try {
        const response = await axios.post(Backend_URL + '/graphql', {
            query: query,
        });


        return response.data.data.GetProductById as ProductType
    } catch (error) {
        console.error('Error fetching: ', error);
        throw error;
    }
}


export async function uploadFile(data: File, accessToken: string) {
    try {
        const formData = new FormData();
        formData.append('file', data);
        const response = await axios.post(Backend_URL + '/media/upload', formData, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        if (response.status == 201) {
            return Backend_URL + '/media' + response.data['url'];
        }
    } catch (error: any) {
        console.error('Upload failed:', error.response ? error.response.data : error.message);
        throw error;
    }
}

export async function SearchProductWithOptions(name: string | null) {
    const query = `
    query SearchProductWithOptions {
      SearchProductWithOptions(SearchProduct: { name: ${name !== null ? `"${name}"` : "null"} }) {
        data {
          id
          name
        }
      }
    }
  `;

    try {
        const response = await axios.post(Backend_URL + "/graphql", {
            query: query,
        });

        const res = response.data.data.SearchProductWithOptions;
        return res;
    } catch (error) {
        console.error("Error fetching: ", error);
        throw error;
    }
}

export async function CreateUser(userData: {
    email?: string,
    birthday?: string,
    address?: string,
    firstName?: string,
    gender?: string,
    lastName?: string,
    password?: string,
    phoneNumber?: string,
    role?: string,
    userId?: string,
    username?: string,
}) {
    const mutation = `
        mutation CreateUser {
            CreateUser(
                CreateUser: {
                    email: "${userData.email}"
                    birthday: "${userData.birthday}"
                    address: "${userData.address}"
                    firstName: "${userData.firstName}"
                    gender: "${userData.gender}"
                    lastName: "${userData.lastName}"
                    password: "${userData.password}"
                    phoneNumber: "${userData.phoneNumber}"
                    role: "${userData.role}"
                    userId: "${userData.userId}"
                    username: "${userData.username}"
                }
            ) {
                created_at
                email
                hash
                id
                isDisplay
                refreshToken
                role
                secretKey
                updated_at
                username
            }
        }
    `;

    try {
        const response = await axios.post(Backend_URL + '/graphql', {
            query: mutation,
        });

        return response.data.data.CreateUser;
    } catch (error) {
        console.error('Error creating user: ', error);
        throw error;
    }
}

export async function getAllUserName(dto: any, accessToken?: string) {
    const query = `
    query SearchUserWithOption {
      SearchUserWithOption(SearchUser: { index: 1 }) {
        data {
          username
          id
          secretKey
        }
      }
    }
  `;

    try {
        const response = await axios.post(
            `${Backend_URL}/graphql`,
            { query: query },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken || ""}`,
                },
            }
        );

        return response.data.data.SearchUserWithOption.data;
    } catch (error) {
        console.error("Error fetching users: ", error);
        throw error;
    }
}

export async function getUserById(id: string, token: string) {
    const query = `
        query GetUserById {
            GetUserById(id: "${id}") {
                created_at
                email
                id
                isDisplay
                refreshToken
                role
                secretKey
                updated_at
                username
                details {
                    address
                    gender
                    id
                    imgDisplay
                    phoneNumber
                    birthday
                    firstName
                    lastName
                }
                created_at
                actionLog {
                    action
                    created_at
                    details
                    entityId
                    entityName
                    id
                }
            }
        }
    `;

    try {
        const response = await axios.post(
            `${Backend_URL}/graphql`,
            { query },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data.data.GetUserById;
    } catch (error) {
        console.error('Error fetching user: ', error);
        throw error;
    }
}

export async function getAnalyticsRevenue(dto: any, accessToken?: string) {
    const query = `
        query AnalyticRevenue {
            AnalyticRevenue{
                dataAllTime {
                    totalOrder
                    totalProduct
                    totalProfit
                    totalRevenue
                }
                dataMonth {
                    Date
                    productSold
                    profit
                    revenue
                }
                dataWeek {
                    name
                    xData
                    yData
                }
            }
        }
  `;

    try {
        const response = await axios.post(
            `${Backend_URL}/graphql`,
            { query: query },
            {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${accessToken || ""}`,
                },
            }
        );

        return response.data.data.AnalyticRevenue;
    } catch (error) {
        console.error("Error fetching users: ", error);
    }
}
export async function getAllProduct() {
    const query = `
        query SearchProductWithOptions {
            SearchProductWithOptions(SearchProduct: { index: 1 }) {
                maxValue
                data {
                    buyCount
                    category
                    created_at
                    displayCost
                    id
                    isDisplay
                    name
                    originCost
                    rating
                    stockQuantity
                    updated_at
                    details {
                        id
                        brand {
                            value
                        }
                        concentration {
                            value
                        }
                        fragranceNotes {
                            value
                        }
                        longevity {
                            value
                        }
                        sex {
                            value
                        }
                        sillage {
                            value
                        }
                        size {
                            value
                        }
                    }
                }
            }
        }
    `

    try {
        const response = await axios.post(Backend_URL + '/graphql', { query });

        const dataReturn: ProductData[] = response.data.data.SearchProductWithOptions.data;
        const maxValue = response.data.data.SearchProductWithOptions.maxValue

        return { maxValue: maxValue, data: dataReturn };
    } catch (error) {
        console.error('Error fetching: ', error);
        throw error;
    }
}
export async function getAllOrder(dto: any, accessToken?: string) {
    const query = `
        query SearchOrderWithOption {
            SearchOrderWithOption(SearchOrder: { index: 1.0 }) {
                maxValue
                data {
                    created_at
                    id
                    isDisplay
                    isPaid
                    notes
                    status
                    totalAmount
                    updated_at
                    customerInfo {
                        email
                        firstName
                        id
                        lastName
                        phoneNumber
                    }
                    deliveryInfo {
                        address
                        city
                        district
                        id
                    }
                    orderProducts {
                        discount
                        id
                        orderId
                        productId
                        quantity
                        unitPrice
                        product {
                            buyCount
                            category
                            created_at
                            displayCost
                            id
                            isDisplay
                            name
                            originCost
                            rating
                            stockQuantity
                            updated_at
                        }
                    }
                }
            }
        }


    `

    try {
        const response = await axios.post(Backend_URL + '/graphql',
            { query },
            {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${accessToken || ""}`,
                },
            }
        );

        const dataReturn: OrderType[] = response.data.data.SearchOrderWithOption.data;
        const maxValue = response.data.data.SearchOrderWithOption.maxValue

        return { maxValue: maxValue, data: dataReturn };
    } catch (error) {
        console.error('Error fetching: ', error);
        throw error;
    }
}

export async function getAnalyticsFavorite(dto: any, accessToken?: string) {
    const query = `
        query AnalyticFavorite {
            AnalyticFavorite {
                dataBrand {
                    type
                    value
                }
                dataProduct {
                    brand
                    displayCost
                    imgDisplay
                    name
                    totalProfit
                    totalQuantity
                }
                dataSex {
                    type
                    value
                }
            }
        }

  `;

    try {
        const response = await axios.post(
            `${Backend_URL}/graphql`,
            { query: query },
            {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${accessToken || ""}`,
                },
            }
        );

        return response.data.data.AnalyticFavorite;
    } catch (error) {
        console.error("Error fetching users: ", error);
        throw error;
    }
}

export async function getAnalyticsProduct(dto: any, accessToken?: string) {
    const query = `
        query AnalyticProduct {
            AnalyticProduct {
                dataBrand {
                    type
                    value
                }
                dataSex {
                    type
                    value
                }
            }
        }

  `;

    try {
        const response = await axios.post(
            `${Backend_URL}/graphql`,
            { query: query },
            {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${accessToken || ""}`,
                },
            }
        );

        return response.data.data.AnalyticProduct;
    } catch (error) {
        console.error("Error fetching users: ", error);
    }
}
export async function getProductById(id: number) {
    const query = `
        query GetProductById {
            GetProductById(productId: ${id}) {
                buyCount
                displayCost
                id
                name
                stockQuantity
                details {
                    id
                    brand {
                        value
                    }
                    concentration {
                        value
                    }
                    fragranceNotes {
                        value
                    }
                    longevity {
                        value
                    }
                    sex {
                        value
                    }
                    sillage {
                        value
                    }
                    size {
                        value
                    }
                }
                originCost
            }
        }

    `;

    try {
        const response = await axios.post(Backend_URL + '/graphql', {
            query: query,
        });

        const productData = response.data?.data?.GetProductById;
        return productData;
    } catch (error) {
        console.error('Error fetching product by id:', error);
        throw error;
    }
}

export async function deleteProductById(id: number, accessToken?: string) {
    const query = `
        mutation DeleteProduct {
            DeleteProduct(DeleteProduct: { productId: ${id} }) {
                message
            }
        }
    `;
    
    try {
        const response = await axios.post(Backend_URL + '/graphql', {
            query: query,
        }, {
            headers: {
                Authorization: accessToken ? `Bearer ${accessToken}` : '',
            },
        });

        const productData = response.data?.data?.DeleteProduct;
        return productData;
    } catch (error) {
        console.error('Error deleting product by id:', error);
        throw error;
    }
}



export async function UpdateProductApi(dto: UpdateProductDto, accessToken?: string) {
    const mutation = `
    mutation UpdateProduct($input: UpdateProductDto!) {
        UpdateProduct(UpdateProduct: $input) {
            id
            name
            originCost
            displayCost
            stockQuantity
            category
            buyCount
            created_at
            updated_at
            rating
            details {
                brand {
                    value
                }
                longevity {
                    value
                }
                concentration {
                    value
                }
                fragranceNotes {
                    value
                }
                sex {
                    value
                }
                sillage {
                    value
                }
                size {
                    value
                }
                imgDisplay {
                    id
                    url
                }
                description
                tutorial
            }
        }
    }
    `;

    try {
        const response = await axios.post(
            Backend_URL + '/graphql',
            {
                query: mutation,
                variables: { input: dto },
            },
            {
                headers: {
                    Authorization: accessToken ? `Bearer ${accessToken}` : '',
                },
            }
        );

        const productData = response.data?.data?.UpdateProduct;
        return productData;
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
}


export async function CreateOrderApi(dto: CreateOrderDto, accessToken?: string) {
    const mutation = `
    mutation CreateOrder($input: createOrderDto!) {
        CreateOrder(CreateOrder: $input) {
            created_at
            id
            isDisplay
            isPaid
            notes
            status
            totalAmount
            updated_at
            customerInfo {
                email
                firstName
                id
                lastName
                phoneNumber
            }
            deliveryInfo {
                address
                city
                district
                id
            }
            orderProducts {
                discount
                id
                orderId
                productId
                quantity
                unitPrice
            }
        }
    }
    `;

    try {
        const response = await axios.post(
            Backend_URL + '/graphql',
            {
                query: mutation,
                variables: { input: dto },
            },
            {
                headers: {
                    Authorization: accessToken ? `Bearer ${accessToken}` : '',
                },
            }
        );

        const orderData = response.data?.data?.CreateOrder;
        return orderData;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
}

export async function readFileApi(dto: ReadFileDto, accessToken?: string) {
    const formData = new FormData();
    formData.append('file', dto.file);
    formData.append('type', dto.type);

    try {
        const response = await axios.post(Backend_URL + '/media/read-file', formData, {
            headers: {
                'Authorization': accessToken ? `Bearer ${accessToken}` : '',
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};


export async function getTempWareHouse(dto: GetTempWarehouseDto[], accessToken?: string) {
    const query = `
    query GetTempWareHouse($input: [GetTempWarehouseDto!]!) {
      GetTempWareHouse(TempWarehouse: $input) {
        count
        id
        name
        summary
      }
    }
  `;

    try {
        const response = await axios.post(
            Backend_URL + '/graphql',
            {
                query: query,
                variables: { input: dto },
            },
            {
                headers: {
                    Authorization: accessToken ? `Bearer ${accessToken}` : '',
                    'Content-Type': 'application/json',
                },
            }
        );

        return response.data?.data?.GetTempWareHouse as TempWareHouseType[];
    } catch (error) {
        console.error('Error fetching temp warehouse:', error);
        throw error;
    }
};


export async function updateWareHouse(dto: UpdateWarehouseDto[], accessToken?: string) {
    const mutation = `
    mutation UpdateWareHouse($input: [UpdateWarehouseDto!]!) {
        UpdateWareHouse(TempWarehouse: $input) {
            buyCount
            category
            created_at
            displayCost
            id
            isDisplay
            name
            originCost
            rating
            stockQuantity
            updated_at
        }
    }
    `;

    try {
        const response = await axios.post(
            Backend_URL + '/graphql',
            {
                query: mutation,
                variables: { input: dto },
            },
            {
                headers: {
                    Authorization: accessToken ? `Bearer ${accessToken}` : '',
                    'Content-Type': 'application/json',
                },
            }
        );

        return response.data?.data?.UpdateWareHouse as ProductType[];
    } catch (error) {
        console.error('Error updating warehouse:', error);
        throw error;
    }
};


export async function createUser(dto: CreateUserDto, accessToken?: string) {
    const mutation = `
        mutation CreateUser($input: CreateUserDto!) {
            CreateUser(CreateUser: $input) {
                email
                hash
                id
                isDisplay
                refreshToken
                role
                secretKey
                updated_at
                username
                details {
                    address
                    birthday
                    firstName
                    gender
                    id
                    imgDisplay
                    lastName
                    phoneNumber
                }
                created_at
            }
        }
    `;

    try {

        const response = await axios.post(
            `${Backend_URL}/graphql`,
            {
                query: mutation,
                variables: { input: dto },
            },
            {
                headers: {
                    Authorization: accessToken ? `Bearer ${accessToken}` : '',
                    'Content-Type': 'application/json',
                },
            }
        );

        return response.data?.data?.CreateUser as UserType;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

export async function updateUser(dto: UpdateUserDto, accessToken?: string) {
    const mutation = `
        mutation UpdateUser($input: UpdateUserDto!) {
            UpdateUser(UpdateUser: $input) {
                created_at
                email
                hash
                id
                isDisplay
                refreshToken
                role
                secretKey
                updated_at
                username
                details {
                    address
                    birthday
                    firstName
                    gender
                    id
                    imgDisplay
                    lastName
                    phoneNumber
                }
            }
        }
    `;

    try {
        const response = await axios.post(
            `${Backend_URL}/graphql`,
            {
                query: mutation,
                variables: { input: dto },
            },
            {
                headers: {
                    Authorization: accessToken ? `Bearer ${accessToken}` : '',
                    'Content-Type': 'application/json',
                },
            }
        );

        return response.data?.data?.UpdateUser as UserType;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}

export async function createProduct(dto: CreateProductDto, accessToken?: string) {
    const mutation = `
    mutation CreateProduct($input: CreateProductDto!) {
        CreateProduct(CreateProduct: $input) {
            buyCount
            category
            created_at
            details {
                description
                id
                brand {
                    id
                    type
                    value
                }
                fragranceNotes {
                    id
                    type
                    value
                }
                concentration {
                    id
                    type
                    value
                }
                sex {
                    id
                    type
                    value
                }
                imgDisplay {
                    id
                    link
                    url
                }
                size {
                    id
                    type
                    value
                }
            }
            name
            isDisplay
            originCost
            rating
            stockQuantity
            updated_at
        }
    }`;

    try {
        const response = await axios.post(
            Backend_URL + '/graphql',
            {
                query: mutation,
                variables: { input: dto },
            },
            {
                headers: {
                    Authorization: accessToken ? `Bearer ${accessToken}` : '',
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data?.data?.CreateProduct;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
}

export async function updateOrder(dto: UpdateOrderDto, accessToken?: string) {
    const mutation = `
        mutation UpdateOrder {
            UpdateOrder(UpdateOrder: {
                orderId: ${dto.orderId},
                ${dto.status !== undefined ? `status: "${dto.status}"` : ''}
                ${dto.isPaid !== undefined ? `isPaid: ${dto.isPaid}` : ''}
            }) {
                created_at
                id
                isDisplay
                isPaid
                notes
                status
                totalAmount
                updated_at
            }
        }
    `;

    try {
        const response = await axios.post(
            `${Backend_URL}/graphql`,
            {
                query: mutation,
                variables: { input: dto },
            },
            {
                headers: {
                    Authorization: accessToken ? `Bearer ${accessToken}` : '',
                    'Content-Type': 'application/json',
                },
            }
        );

        return response.data?.data?.UpdateOrder as OrderType;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}

export const exportOrdersToCSV = async (dto: SearchOrderDto, accessToken: string | undefined) => {
    try {
        const response = await axios.post(
            Backend_URL + '/order/export-file',
            dto,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                responseType: 'blob',
            }
        );
        return response

    } catch (error) {
        console.error('Error exporting orders to CSV:', error);

    }
};

export const exportProductToCSV = async (dto: SearchProductDto, accessToken: string | undefined) => {
    try {
        const response = await axios.post(
            Backend_URL + '/product/export-file',
            dto,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                responseType: 'arraybuffer'
            }
        );
        return response

    } catch (error) {
        console.error('Error exporting orders to CSV:', error);

    }
};

export const createListOrder = async (dto: CreateOrderDto[], accessToken: string) => {
    const query = `
      mutation CreateListOrder($CreateOrder: [createOrderDto!]!) {
        CreateListOrder(CreateOrder: $CreateOrder) {
            created_at
            id
            isDisplay
            isPaid
            notes
            status
            totalAmount
            updated_at
            customerInfo {
                email
                firstName
                id
                lastName
                phoneNumber
            }
            deliveryInfo {
                address
                city
                district
                id
            }
            orderProducts {
                discount
                id
                orderId
                productId
                quantity
                unitPrice
                product {
                    buyCount
                    category
                    created_at
                    displayCost
                    id
                    isDisplay
                    name
                    originCost
                    rating
                    stockQuantity
                    updated_at
                }
            }
        }
      }
    `;

    try {
        const response = await axios.post(
            `${Backend_URL}/graphql`,
            {
                query: query,
                variables: { CreateOrder: dto }
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );

        const data = response.data?.data?.CreateListOrder as OrderType[];
        return data;
    } catch (error) {
        console.error('Error creating list order:', error);
        throw error;
    }
}

export async function getTopPerfume() {
    const query = `
    query GetTopBrand {
      GetTopBrand {
        data
      }
    }
  `;

    try {
        const response = await axios.post(Backend_URL + '/graphql', {
            query: query,
        });
        return response.data.data.GetTopBrand.data;
    } catch (error) {
        console.error('Error fetching top perfumes:', error);
        throw error;
    }
}

export const createProductByList = async (dto: CreateProductDto[], accessToken: string) => {
    const query = `
      mutation CreateProductByList($CreateProduct: [CreateProductDto!]!) {
        CreateProductByList(CreateProduct: $CreateProduct) {
            buyCount
            category
            created_at
            displayCost
            id
            isDisplay
            name
            originCost
            rating
            stockQuantity
            updated_at
            details {
                id
                brand {
                    value
                }
                concentration {
                    value
                }
                fragranceNotes {
                    value
                }
                longevity {
                    value
                }
                sex {
                    value
                }
                sillage {
                    value
                }
                size {
                    value
                }
            }
        }
      }
    `;

    try {
        const response = await axios.post(
            `${Backend_URL}/graphql`,
            {
                query: query,
                variables: { CreateProduct: dto }
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );

        const data = response.data?.data?.CreateProductByList as ProductData[];
        return data;
    } catch (error) {
        console.error('Error creating product list:', error);
        throw error;
    }
}