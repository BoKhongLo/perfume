"use client";
import React from "react";
import { Button, Form, Input, InputNumber, message } from "antd";
import { InputAdd, Editor, UploadImage } from "@/components/Input";
import ProductUploadFile from "@/components/Input/productUploadFile";
import { CreateProductDto, ImageDetailInp } from "@/lib/dtos/product";
import { useSession } from "next-auth/react";
import { createProduct, makeRequestApi } from "@/lib/api";

type FieldType = {
    name: string;
    displayCost: number;
    originCost?: number;
    brand?: string;
    longevity?: string;
    concentration?: string;
    fragranceNotes?: string;
    sex?: string;
    sillage?: string;
    size?: string[];
    description?: string;
    tutorial?: string;
    stockQuantity: number;
    imgDisplay?: ImageDetailInp[];
};
interface AppProps {
    changeTab: (tabKey: string) => void;
}

const App: React.FC<AppProps> = ({ changeTab }) => {
    const { data: session } = useSession();
    const [form] = Form.useForm();
    const onFinish = async (values: FieldType) => {
        
        try {
            const dto: CreateProductDto = {
                category: "Perfume",
                details: {
                    brand: values?.brand ? { type: 'brand', value: values?.brand } : undefined,
                    concentration: values?.concentration ? { type: 'concentration', value: values?.concentration } : undefined,
                    description: values.description || undefined,
                    fragranceNotes: values.fragranceNotes ? { type: 'fragranceNotes', value: values?.fragranceNotes } : undefined,
                    imgDisplay: values.imgDisplay || undefined, 
                    longevity: values.longevity  ? { type: 'longevity', value: values?.longevity } : undefined,
                    sex: values.sex ? { type: 'sex', value: values?.sex } : undefined,
                    sillage: values.sillage ? { type: 'sillage', value: values?.sillage } : undefined,
                    size: values.size ? values.size.map(e => ({ type: 'size', value: e })) : [],
                    tutorial: values.tutorial || undefined,
                },
                displayCost: values.displayCost ? Number(values.displayCost) : 0,
                name: values.name,
                originCost: values.originCost ? Number(values.originCost) : 0, 
                stockQuantity: values.stockQuantity ? Number(values.stockQuantity) : 0, 
            };

            const dataReturn = await makeRequestApi(createProduct, dto, session?.refresh_token, session?.access_token);
            if (dataReturn) {
                message.success('Create product successfully.');
                form.resetFields();
            }
            else {
                message.error('Failed to upload data.');
            }
        } catch (error) {
            message.error('Failed to upload data.');
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log("Failed:", errorInfo);
    };

    return (
        <Form
            form={form}
            className="m-8 box-border"
            name="createProduct"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >

            <Form.Item wrapperCol={{ offset: 12, span: 16, style: { textAlign: "right" } }}>
                    <div className="flex flex-row justify-end">
                        <ProductUploadFile changeTab={changeTab} />
                        <Button type="primary" htmlType="submit" style={{ marginRight: "12px", marginLeft: '12px' }}> Submit </Button>
                        <Button htmlType="reset">reset</Button>
                    </div>
                </Form.Item>
            <div className="flex w-full flex-row">

                <div className="w-[60%] mr-[5%]">
                    <Form.Item<FieldType>
                        label="name"
                        name="name"
                        rules={[{ required: true, message: "Must fill" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="originCost"
                        name="originCost"
                        rules={[{ required: true, message: "Must fill" }]}
                    >
                        <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="displayCost"
                        name="displayCost"
                        rules={[{ required: true, message: "Must fill" }]}
                    >
                        <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="stockQuantity"
                        name="stockQuantity"
                        rules={[{ required: true, message: "Must fill" }]}
                    >
                        <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="brand"
                        name="brand"
                        rules={[{ required: true, message: "Must fill" }]}
                    >
                        <InputAdd typeTag="brand" />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="longevity"
                        name="longevity"
                        rules={[{ required: true, message: "Must fill" }]}
                    >
                        <InputAdd typeTag="longevity" />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="concentration"
                        name="concentration"
                        rules={[{ required: true, message: "Must fill" }]}
                    >
                        <InputAdd typeTag="concentration" />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="fragranceNotes"
                        name="fragranceNotes"
                        rules={[{ required: true, message: "Must fill" }]}
                    >
                        <InputAdd typeTag="fragranceNotes" />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="sex"
                        name="sex"
                        rules={[{ required: true, message: "Must fill" }]}
                    >
                        <InputAdd typeTag="sex" />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="sillage"
                        name="sillage"
                        rules={[{ required: true, message: "Must fill" }]}
                    >
                        <InputAdd typeTag="sillage" />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="size"
                        name="size"
                        rules={[{ required: true, message: "Must fill" }]}
                    >
                        <InputAdd typeTag="size" multi={true} />
                    </Form.Item>
                </div>
                <div>
                    <Form.Item<FieldType>
                        label="description"
                        name="description"
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                    >
                        <Editor typeTag="description" />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="tutorial"
                        name="tutorial"
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                    >
                        <Editor typeTag="tutorial" />
                    </Form.Item>
                    <div className="flex flex row">

                        <Form.Item<FieldType>
                            label="image"
                            name="imgDisplay"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                        >
                            <UploadImage typeTag="url" isOpen={false}/>
                        </Form.Item>
                    </div>
                </div>
            </div>
        </Form>
    );
};

export default App;
