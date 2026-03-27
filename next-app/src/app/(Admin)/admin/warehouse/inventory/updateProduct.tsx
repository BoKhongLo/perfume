"use client";
import React, { useEffect } from "react";
import { Button, Form, Input, InputNumber, message } from "antd";
import { InputAdd, Editor, UploadImage } from "@/components/Input";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { GetProductById, makeRequestApi, UpdateProductApi } from "@/lib/api";
import { UpdateOneProduct, UpdateProductEdit, UpdateProductEditId } from "@/app/redux/features/iventoryData";
import { ProductType } from "@/types";
import { useSession } from "next-auth/react";
import { UpdateProductDto } from "@/lib/dtos/product";

type updateProductprops = {
    updateKey?: number,
    changeTab?: (a: string) => void
}

const App: React.FC<updateProductprops> = ({ updateKey, changeTab }) => {
    const { data: session } = useSession()
    const dataEditId = useAppSelector((state) => state.InventoryData.productEditId);
    const dataEdit = useAppSelector((state) => state.InventoryData.productEdit);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const fetchData = async () => {
            if (dataEditId) { 
                const data = await GetProductById(dataEditId);
                console.log(data.details?.imgDisplay)
                if (data) {
                    dispatch(UpdateProductEdit(data));
                }
            }
        };
        fetchData();
    }, [dataEditId, dispatch]);

    if (!dataEdit && dataEditId) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
                <h1 className="text-3xl font-bold">Loading Data ...</h1>
            </div>
        );
    }

    if (!dataEdit) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <h1 className="text-3xl font-bold">Không có dữ liệu để chỉnh sửa</h1>
            </div>
        );
    }

    const onFinish = async (values: ProductType) => {

        const dto: UpdateProductDto = {
            productId: Number(values.id),
            name: values.name,
            originCost: Number(values.originCost),
            displayCost: Number(values.displayCost),
            stockQuantity: Number(values.stockQuantity),
            details: values.details ? {
                brand: values.details?.brand ? { value: values.details?.brand.value as string, type: 'brand' } : undefined,
                longevity: values.details?.longevity ? { value: values.details.longevity.value as string,  type: 'longevity'} : undefined,
                concentration: values.details?.concentration ? { value: values.details.concentration.value as string,  type: 'concentration' } : undefined,
                fragranceNotes: values.details?.fragranceNotes  ? { value: values.details.fragranceNotes.value as string,  type: 'fragranceNotes' } : undefined,
                sex: values.details?.sex ? { value: values.details.sex.value as string,  type: 'sex' } : undefined,
                sillage: values.details?.sillage ? { value: values.details.sillage.value as string,  type: 'sillage' } : undefined,
                size: Array.isArray(values.details?.size) ? values.details.size.map((size: any) => ({
                    type: 'size',
                    value: size.value ? size.value : size as string,
                })) : undefined,
                description: values.details?.description,
                tutorial: values.details?.tutorial,
                imgDisplay: Array.isArray(values.details?.imgDisplay) ? values.details.imgDisplay.map((img: any) => ({
                    link: img.link,
                    url: img.url
                })) : undefined
            } : undefined
        };
        console.log(dto.details?.imgDisplay)

        try {
            const response : ProductType = await makeRequestApi(UpdateProductApi, dto, session?.refresh_token, session?.access_token);
    
            if (response) {

                dispatch(UpdateOneProduct(response))
                dispatch(UpdateProductEdit(null))
                dispatch(UpdateProductEditId(null))
                if (changeTab) {
                    changeTab("2"); 
                }
                message.success("Update product successfully!")
            } else {
                console.log("Product update failed.");
            }
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };
    

    const onFinishFailed = (errorInfo: any) => {
        console.log("Failed:", errorInfo);
    };

    return (
        <Form
            className="m-8 box-border"
            name="updateProduct"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            initialValues={dataEdit}
        >
            <div className="flex w-full flex-row">
                <div className="w-[60%] mr-[5%]">
                    <Form.Item<ProductType>
                        label="ID"
                        name="id"
                        rules={[{ required: true, message: "Must fill" }]}
                    >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item<ProductType>
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: "Must fill" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<ProductType>
                        label="Origin Cost"
                        name="originCost"
                        rules={[{ required: true, message: "Must fill" }]}
                    >
                        <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item<ProductType>
                        label="Display Cost"
                        name="displayCost"
                        rules={[{ required: true, message: "Must fill" }]}
                    >
                        <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item<ProductType>
                        label="stockQuantity"
                        name="stockQuantity"
                        rules={[{ required: true, message: "Must fill" }]}
                    >
                        <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item<ProductType>
                        label="Brand"
                        name={['details', 'brand', "value"]}
                        rules={[{ required: true, message: "Must fill" }]}
                    >
                        <InputAdd typeTag="brand" />
                    </Form.Item>

                    <Form.Item<ProductType>
                        label="Longevity"
                        name={['details', 'longevity', "value"]}
                        rules={[{ required: true, message: "Must fill" }]}
                    >
                        <InputAdd typeTag="longevity" />
                    </Form.Item>

                    <Form.Item<ProductType>
                        label="Concentration"
                        name={['details', 'concentration', "value"]}
                        rules={[{ required: true, message: "Must fill" }]}
                    >
                        <InputAdd typeTag="concentration" />
                    </Form.Item>

                    <Form.Item<ProductType>
                        label="Fragrance Notes"
                        name={['details', 'fragranceNotes', "value"]}
                        rules={[{ required: true, message: "Must fill" }]}
                    >
                        <InputAdd typeTag="fragranceNotes" />
                    </Form.Item>

                    <Form.Item<ProductType>
                        label="Sex"
                        name={['details', 'sex', "value"]}
                        rules={[{ required: true, message: "Must fill" }]}
                    >
                        <InputAdd typeTag="sex" />
                    </Form.Item>

                    <Form.Item<ProductType>
                        label="Sillage"
                        name={['details', 'sillage', "value"]}
                        rules={[{ required: true, message: "Must fill" }]}
                    >
                        <InputAdd typeTag="sillage" />
                    </Form.Item>

                    <Form.Item<ProductType>
                        label="Size"
                        name={['details', 'size']}
                        rules={[{ required: true, message: "Must fill" }]}
                    >
                        <InputAdd typeTag="size" multi={true} />
                    </Form.Item>
                </div>
                <div>
                    <Form.Item<ProductType>
                        label="Description"
                        name={['details', 'description']}
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                    >
                        <Editor typeTag="description" />
                    </Form.Item>

                    <Form.Item<ProductType>
                        label="Tutorial"
                        name={['details', 'tutorial']}
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                    >
                        <Editor typeTag="tutorial" />
                    </Form.Item>
                    <div className="flex flex row">
                        <Form.Item<ProductType>
                            label="Image"
                            name={['details', 'imgDisplay']}
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                        >
                            <UploadImage typeTag="link" isOpen={true}/>
                        </Form.Item>
                    </div>
                </div>
            </div>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit" style={{ marginRight: "12px" }}> Submit </Button>
                <Button htmlType="reset">Reset</Button>
            </Form.Item>
        </Form>
    );
};

export default App;
