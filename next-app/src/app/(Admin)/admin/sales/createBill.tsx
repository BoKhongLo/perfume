"use client";
import React, { useEffect, useState } from "react";
import { Button, Form, Input, InputNumber, Radio, Select, Table, Space, message } from "antd";
const { TextArea } = Input;
import { CreateOrderApi, makeRequestApi, SearchProductWithOptions } from '@/lib/api'
import { useDispatch } from "react-redux";
import { useSession } from "next-auth/react";
import { CreateOrderDto } from "@/lib/dtos/order";
import UploadFile from '@/components/Input/orderUploadFile'

type FieldType = {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: number;
    notes?: string;
    isPaid?: boolean;
    products?: ProductType[];
    productId?: string,
    quantity?: number,
    address?: string
    discount?: number
};


type ProductType = {
    id: string;
    name: string;
    quantity: number;
};
interface AppProps {
    changeTab: (tabKey: string) => void;
}

const App: React.FC<AppProps> = ({ changeTab }) => {
    const [form] = Form.useForm();
    const [products, setProducts] = useState<ProductType[]>([]);
    const [editingProductIndex, setEditingProductIndex] = useState<number | null>(null);
    const [nameSuggest, setNameSuggest] = useState<{ name: string, id: string }[]>([]);

    const { data: session } = useSession();
    const dispatch = useDispatch();

    useEffect(() => {
        const getName = async () => {
            try {
                const data = await SearchProductWithOptions(null);
                setNameSuggest(data?.data || []);
            } catch (error) {
                console.error("Error fetching product names", error);
            }
        };
        getName();
    }, []);

    const onFinish = async (values: FieldType) => {
        const { firstName, lastName, email, phoneNumber, notes, isPaid, address, discount } = values;


        const dto: CreateOrderDto = {
            customerInfo: {
                email: email || '',
                firstName: firstName || '',
                lastName: lastName || '',
                phoneNumber: phoneNumber ? phoneNumber.toString() : '',
            },
            deliveryInfo: {
                address: address || '',
                city: '',
                district: '',
            },
            notes: notes || '',
            orderProducts: products?.map(product => ({
                productId: Number(product.id),
                quantity: Number(product.quantity),
                discount: discount ? Number(discount) : 0,
            })) || [],
            status: isPaid ? 'paid' : 'unpaid',
        };

        try {
            const response = await makeRequestApi(CreateOrderApi, dto, session?.refresh_token, session?.access_token);

            if (response) {

                message.success("Bill created successfully:");
                form.resetFields();
                resetTable()

            } else {
                message.error("Bill creation failed.");
            }
        } catch (error) {
            message.error("Error creating bill:");
        }
    };


    const onFinishFailed = (errorInfo: any) => {
        console.log("Failed:", errorInfo);
    };

    const handleAddProduct = () => {
        const productIds = form.getFieldValue("productId");
        const quantity = form.getFieldValue("quantity");
        if (productIds && quantity) {
            const currentProducts = form.getFieldValue("products") || [];
            const newProducts = productIds.map((productId: string) => {
                const selectedProduct = nameSuggest.find((product) => product.id === productId);
                return {
                    id: productId,
                    name: selectedProduct?.name || '',
                    quantity,
                };
            });
            setProducts([...currentProducts, ...newProducts]);
            form.setFieldsValue({ productId: [], quantity: undefined });
        }
    };

    const handleEditProduct = (index: number) => {
        const productToEdit = products[index];
        form.setFieldsValue({
            productId: [productToEdit.id],
            quantity: productToEdit.quantity,
        });
        setEditingProductIndex(index);
    };

    const handleDeleteProduct = (index: number) => {
        const newProducts = [...products];
        newProducts.splice(index, 1);
        setProducts(newProducts);
    };

    const handleSaveProduct = () => {
        const productIds = form.getFieldValue("productId");
        const quantity = form.getFieldValue("quantity");
        if (productIds && quantity) {
            const updatedProducts = [...products];
            if (editingProductIndex !== null) {
                productIds.forEach((productId: string) => {
                    const selectedProduct = nameSuggest.find((product) => product.id === productId);
                    updatedProducts[editingProductIndex] = {
                        id: productId,
                        name: selectedProduct?.name || '',
                        quantity,
                    };
                });
            }
            setProducts(updatedProducts);
            setEditingProductIndex(null);
            form.resetFields(["productId", "quantity"]);
        }
    };

    const resetTable = () => {
        setProducts([])
    }

    const columns = [
        {
            title: "Product Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, __: any, index: number) => (
                <Space>
                    <Button onClick={() => handleEditProduct(index)}>Edit</Button>
                    <Button danger onClick={() => handleDeleteProduct(index)}>
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Form
            className="mt-8 box-border w-full"
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            form={form}
        >
            <div className="m-8">
                <Form.Item wrapperCol={{ offset: 12, span: 16, style: { textAlign: "right" } }}>
                    <div className="flex flex-row justify-end">
                        <UploadFile changeTab={changeTab}/>
                        <Button type="primary" htmlType="submit" style={{ marginRight: "12px", marginLeft: '12px' }}>
                            Submit
                        </Button>
                        <Button htmlType="reset" onClick={resetTable}>Reset</Button>
                    </div>
                </Form.Item>
                <div className="flex flex-row">
                    <div className="w-[40%] mr-[5%]">
                        <Form.Item<FieldType> label="firstName" name="firstName"
                            rules={[{ required: true, message: 'Please input!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<FieldType> label="lastName" name="lastName"
                            rules={[{ required: true, message: 'Please input!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<FieldType> label="email" name="email">
                            <Input />
                        </Form.Item>

                        <Form.Item<FieldType> label="phoneNumber" name="phoneNumber">
                            <Input />
                        </Form.Item>
                        <Form.Item<FieldType> label="address" name="address">
                            <Input />
                        </Form.Item>
                        <Form.Item<FieldType> label="discount" name="discount">
                            <InputNumber style={{ width: "100%" }} />
                        </Form.Item>
                        <Form.Item<FieldType> label="isPaid" name="isPaid"
                            rules={[{ required: true, message: 'Please input!' }]}
                        >
                            <Radio.Group>
                                <Radio value="true">true</Radio>
                                <Radio value="false">false</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </div>
                    <div className="w-[55%]">
                        <div className="flex flex-row">
                            <div className="flex-1">
                                <Form.Item<FieldType> label="productId" name="productId">
                                    <Select mode="multiple" placeholder="Select products">
                                        {nameSuggest.map((product) => (
                                            <Select.Option key={product.id} value={product.id}>
                                                {product.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item<FieldType> label="quantity" name="quantity">
                                    <InputNumber style={{ width: "100%" }} />
                                </Form.Item>
                            </div>
                            {editingProductIndex === null ? (
                                <Button className="w-8 ml-4 h-[88px]" onClick={handleAddProduct}>
                                    +
                                </Button>
                            ) : (
                                <Button className="w-8 ml-4 h-[88px]" onClick={handleSaveProduct}>
                                    Save
                                </Button>
                            )}
                        </div>

                        <Form.Item<FieldType> label="notes" name="notes" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                            <TextArea showCount maxLength={300} placeholder="..." />
                        </Form.Item>
                    </div>
                </div>
                <Table
                    dataSource={products.map((product, index) => ({
                        key: index,
                        ...product,
                    }))}
                    columns={columns}
                    pagination={false}
                />
            </div>
        </Form>
    );
};

export default App;
