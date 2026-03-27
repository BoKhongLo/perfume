import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, message, Upload } from 'antd';
import { ReadFileDto } from '@/lib/dtos/media';
import { createListOrder, makeRequestApi, readFileApi } from '@/lib/api';
import { useSession } from 'next-auth/react';
import { CreateOrderDto } from '@/lib/dtos/order';
import { useAppDispatch } from '@/app/redux/hooks';
import { OrderType } from '@/types';
import { AddListOrder } from '@/app/redux/features/orderData';

interface AppProps {
    changeTab: (tabKey: string) => void;
}

const App: React.FC<AppProps> = ({ changeTab }) => {
    const { data: session } = useSession();
    const dispatch = useAppDispatch()
    const props: UploadProps = {
        name: 'file',
        multiple: false,
        customRequest: async ({ file, onSuccess, onError }) => {
            try {
                const convertedFile = file as File;

                const dto1: ReadFileDto = {
                    file: convertedFile,
                    type: "CreateOrder",
                };
                const data1: CreateOrderDto[] = await makeRequestApi(readFileApi, dto1, session?.refresh_token, session?.access_token);
                if (!data1) {
                    message.error(`File format is incorrect!`);
                    onError && onError(new Error('Upload failed.'));
                    return
                }
                data1.forEach(item => {
                    item.customerInfo.phoneNumber = `+84${item.customerInfo.phoneNumber.toString()}`;
                });

                const data2: OrderType[] = await makeRequestApi(createListOrder, data1, session?.refresh_token, session?.access_token);
                if (!data2) {
                    message.error(`Create list order failed!`);
                    onError && onError(new Error('Upload failed.'));
                    return
                }
                else {
                    onSuccess && onSuccess('ok');
                    message.success(`file uploaded successfully.`);
                    dispatch(AddListOrder(data2))
                    changeTab('2')
                }
                console.log(data2)
            } catch (error) {
                message.error(`File upload failed.`);
                onError && onError(new Error('Upload failed.'));
            }
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };


    return (
        <div className="flex flex-col justify-center content-center items-center ">
            <Upload {...props}>
            <Button icon={<UploadOutlined />}>Upload CSV</Button>
            </Upload>
            <a
            href="https://localhost:3434/media/uploads/TemplateOrder.csv"
            download
            className="text-blue-500 underline hover:text-blue-700 transition-colors duration-200"
            >
            Template.csv
            </a>
      </div>
    )
};

export default App;