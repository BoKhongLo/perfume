import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps, UploadFile } from 'antd';
import { message, Upload } from 'antd';
import { useSession } from 'next-auth/react';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { getTempWareHouse, makeRequestApi, readFileApi } from '@/lib/api';
import { ReadFileDto } from '@/lib/dtos/media';
import { GetTempWarehouseDto } from '@/types';
import { UpdateTempWarehouser } from '@/app/redux/features/tempWarehouse';

const { Dragger } = Upload;

export const FileUpload: React.FC = () => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const { data: session } = useSession();

    const dispatch = useAppDispatch()

    const props: UploadProps = {
        name: 'file',
        multiple: false,
        fileList: fileList,
        customRequest: async ({ file, onSuccess, onError }) => {
            try {
                const convertedFile = file as File;

                const dto1: ReadFileDto = {
                    file: convertedFile,
                    type: "UpdateWarehouse",
                };
                const data1 = await makeRequestApi(readFileApi, dto1, session?.refresh_token, session?.access_token);

                const dto2: GetTempWarehouseDto[] = data1.map((item: { id: any; count: any; }) => ({
                    productId: item.id,
                    stockQuantity: item.count
                }));


                const data2 = await makeRequestApi(getTempWareHouse, dto2, session?.refresh_token, session?.access_token);
                
                if (data2) {
                    onSuccess && onSuccess('ok');
                    message.success(`File uploaded successfully.`);

                    dispatch(UpdateTempWarehouser(data2))
                }
            } catch (error) {
                message.error(` file upload failed.`);
                onError && onError(new Error('Upload failed.'));
            }
        },
        onChange(info) {
            const { status, name } = info.file;

            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }

            if (status === 'done') {

                setFileList([info.file]);
            } else if (status === 'error') {
                message.error(`${name} file upload failed.`);
            }
        },

        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    return (
        <Dragger {...props}>
            <p className="ant-upload-drag-icon">
                <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
                Support for a single file upload. Strictly prohibited from uploading company data or other banned files.
            </p>
        </Dragger>
    );
};
