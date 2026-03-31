"use client"
import React from 'react';
import type { FormProps } from 'antd';
import { Button, Form, message, Popconfirm } from 'antd';
import { FileUpload } from '@/components/Input'
import EditableTable from '@/components/Table/editableTable'
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { useSession } from 'next-auth/react';
import { UpdateWarehouseDto } from '@/types';
import { makeRequestApi, updateWareHouse } from '@/lib/api';
import { UpdateTempWarehouser } from '@/app/redux/features/tempWarehouse';
import type { PopconfirmProps } from 'antd'

type FieldType = {
    username?: string;
    password?: string;
    remember?: string;
};

export default function AddByFile() {
    
    const data = useAppSelector((state) => state.TempWarehouse.value);
    const dispatch = useAppDispatch();
    const { data: session } = useSession();


    const handleSubmit = async () => {
        if (data.length === 0) {
            message.error('No data for upload!');
            return;
        }
        try {
            const dto: UpdateWarehouseDto[] = data
                .filter(item => item.id) 
                .map(item => ({
                    productId: item.id ? Number(item.id) : -1,
                    stockQuantity: item.count,
                }));
    
            const dataReturn = await makeRequestApi(updateWareHouse, dto, session?.refresh_token, session?.access_token);
            if (dataReturn) {
                message.success('Data uploaded successfully.');
                dispatch(UpdateTempWarehouser([]));
            }
            else {
                message.error('Failed to upload data.');
            }
        } catch (error) {
            console.error('Error updating warehouse:', error);
            message.error('Failed to upload data.');
        }
    };

    const confirm: PopconfirmProps['onConfirm'] = () => {
        handleSubmit();
    };

    const cancel: PopconfirmProps['onCancel'] = () => {
        message.error('Upload cancelled.');
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <Form
                className="box-border w-full"
                name="basic"
                layout="vertical"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                onFinish={handleSubmit} 
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <div className="m-8">
                    <Form.Item wrapperCol={{
                        offset: 8, span: 16, style: { textAlign: 'right' }
                    }}>
                        <Popconfirm
                            title="Are you sure you want to submit the data?"
                            onConfirm={confirm}
                            onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="primary" htmlType="button">
                                Submit
                        </Button>

                        </Popconfirm>
                        <a
                            href="http://160.25.81.4:3434/media/uploads/TemplateWarehouse.csv"
                            download
                            className="btn ml-2"
                            data-theme='light'
                            >
                            Template.csv
                            </a>
                    </Form.Item>
                    <FileUpload />
                    <EditableTable />
                </div>
            </Form>
        </>
    )
}
