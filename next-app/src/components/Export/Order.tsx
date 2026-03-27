import React, { useState } from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';
import { SearchOrderDto } from '@/lib/dtos/order';
import { exportOrdersToCSV, makeRequestApi } from '@/lib/api';
import { saveAs } from 'file-saver';
import { useSession } from 'next-auth/react';

const ExportOrderModal: React.FC<{ visible: boolean; onCancel: () => void; }> = ({ visible, onCancel }) => {
    const [form] = Form.useForm();
    const { data: session } = useSession();

    form.setFieldsValue({
        index: 1,
        count: 10
    });

const handleExport = async (values: any) => {
    try {

        const dto: SearchOrderDto = {
            orderId: values.orderId || undefined,
            email: values.email || undefined,
            firstName: values.firstName || undefined,
            lastName: values.lastName || undefined,
            rangeMoney: values.rangeMoney ? values.rangeMoney.split(',').map(Number) : undefined,
            phoneNumber: values.phoneNumber || undefined,
            index: values.index ? parseInt(values.index, 10) : 1, 
            count: values.count ? parseInt(values.count, 10) : 10, 
            sort: values.sort || undefined,
        };


            const response = await makeRequestApi(exportOrdersToCSV, dto, session?.refresh_token, session?.access_token);
            if (response && response.data) {
                const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8' });
                saveAs(blob, 'orders.csv');
                message.success('Export successful!');
                onCancel();
            } else {
                message.error('No data available for export.');
            }
        } catch (error) {
            message.error('Export failed!');
        }
    };

    return (
        <Modal
            title="Export Orders to CSV"
            visible={visible}
            onCancel={onCancel}
            footer={null}
        >
            <Form form={form} onFinish={handleExport}>
                <Form.Item name="orderId" label="Order ID">
                    <Input type="number" />
                </Form.Item>
                <Form.Item name="email" label="Email">
                    <Input />
                </Form.Item>
                <Form.Item name="firstName" label="First Name">
                    <Input />
                </Form.Item>
                <Form.Item name="lastName" label="Last Name">
                    <Input />
                </Form.Item>
                <Form.Item name="rangeMoney" label="Range Money">
                    <Input placeholder="e.g., 100, 200" />
                </Form.Item>
                <Form.Item name="phoneNumber" label="Phone Number">
                    <Input />
                </Form.Item>
                <Form.Item name="index" label="Index">
                    <Input type="number" defaultValue={1} />
                </Form.Item>
                <Form.Item name="count" label="Count">
                    <Input type="number" defaultValue={10} />
                </Form.Item>
                <Form.Item name="sort" label="Sort">
                    <Select>
                        <Select.Option value="price_asc">Price Ascending</Select.Option>
                        <Select.Option value="price_desc">Price Descending</Select.Option>
                        <Select.Option value="created_at_asc">Created At Ascending</Select.Option>
                        <Select.Option value="created_at_desc">Created At Descending</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Export
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ExportOrderModal;
