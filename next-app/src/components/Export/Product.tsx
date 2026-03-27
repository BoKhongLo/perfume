import React from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';
import { SearchProductDto } from '@/lib/dtos/product';
import { makeRequestApi,  exportProductToCSV } from '@/lib/api';
import { useSession } from 'next-auth/react';
import { saveAs } from 'file-saver';

const ExportProductModal: React.FC<{ visible: boolean; onCancel: () => void; }> = ({ visible, onCancel }) => {
    const [form] = Form.useForm();
    const { data: session } = useSession();

    form.setFieldsValue({
        index: 1,
        count: 10
    });

    const handleExport = async (values: any) => {
 
        const dto: SearchProductDto = {
            name: values.name,
            rangeMoney: values.rangeMoney ? values.rangeMoney.split(',').map(Number) : undefined, 
            size: values.size,
            brand: values.brand,
            fragranceNotes: values.fragranceNotes,
            concentration: values.concentration,
            sex: values.sex,
            index: values.index ? Number(values.index) : 1, 
            count: values.count ? Number(values.count) : 10, 
            sort: values.sort,
        };

        try {

            const response = await makeRequestApi(exportProductToCSV, dto, session?.refresh_token, session?.access_token);
            if (response && response.data) {
                const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8' });
                saveAs(blob, 'products.csv');
                message.success('Export successful!');
                onCancel(); 
            } else {
                message.error('No data available for export.');
            }
        } catch (error) {
            console.error('Export error:', error);
            message.error('Export failed!');
        }
    };

    return (
        <Modal
            title="Export to CSV"
            visible={visible}
            onCancel={onCancel}
            footer={null}
        >
            <Form form={form} onFinish={handleExport} initialValues={{ index: 1, count: 10 }}>
                <Form.Item name="name" label="Name">
                    <Input />
                </Form.Item>
       
                <Form.Item name="rangeMoney" label="Range Money">
                    <Input placeholder="e.g., 100, 200" />
                </Form.Item>
                <Form.Item name="size" label="Size">
                    <Input />
                </Form.Item>
                <Form.Item name="brand" label="Brand">
                    <Input />
                </Form.Item>
                <Form.Item name="fragranceNotes" label="Fragrance Notes">
                    <Input />
                </Form.Item>
                <Form.Item name="concentration" label="Concentration">
                    <Input />
                </Form.Item>
                <Form.Item name="sex" label="Sex">
                    <Input />
                </Form.Item>
                <Form.Item name="index" label="Index">
                    <Input type="number" />
                </Form.Item>
                <Form.Item name="count" label="Count">
                    <Input type="number" />
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

export default ExportProductModal;
