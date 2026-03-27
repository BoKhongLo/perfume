import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Image, Upload, UploadFile, UploadProps, message } from 'antd';
import type { RcFile } from 'antd/es/upload/interface';
import { ImageDetailType } from '@/types';
import { makeRequestApi, uploadFile } from '@/lib/api';
import { useSession } from 'next-auth/react';

const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

export const UploadImage: React.FC<{
    typeTag: string,
    maxImage?: number,
    value?: ImageDetailType | ImageDetailType[],
    isOpen: boolean,
    onChange?: (value: any) => void;
}> = ({ typeTag, maxImage, value, isOpen, onChange }) => {
    const [previewOpen, setPreviewOpen] = useState(isOpen);
    const [previewImage, setPreviewImage] = useState<string>('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const { data: session } = useSession();

    useEffect(() => {
        if (Array.isArray(value)) {
            setFileList(value.map((img, index) => ({
                uid: `${index}`,
                name: `image-${index}`,
                status: 'done',
                url: img.url,
            })));
        }  else {
            setFileList([]);
        }
    }, [value]);

    const handlePreview = async (file: UploadFile) => {
        console.log("handlePreview")
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as File);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList, file }) => {
        if (file.status === 'done') {
            message.success(`${file.name} file uploaded successfully`);
        } else if (file.status === 'error') {
            message.error(`${file.name} file upload failed.`);
        }

        setFileList(newFileList);
    };

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );
    const customRequest: UploadProps['customRequest'] = async ({ file, onSuccess, onError }) => {

        if (fileList.some(f => f.name === `image-${fileList.length}`)) {
            message.error(`File image-${fileList.length} already exists.`);
            if (onError) {
                onError(new Error('Duplicate file detected.'));
            }
            return;
        }

        try {
            const url = await makeRequestApi(uploadFile, file as RcFile, session?.refresh_token, session?.access_token);

            const newFile: UploadFile = {
                uid: `${fileList.length}`,
                name: `image-${fileList.length}`,
                status: 'done',
                url: url,

            };

            setFileList(prevFileList => {
                const newFileList = [...prevFileList, newFile];
                if (onChange) {
                    const filteredFileList = newFileList
                        .map(file => ({
                            url: file.url as string,
                            link: []
                        }))
                        .filter(file => file.url != undefined);

                    onChange(filteredFileList);
                }
                return newFileList;
            });

            onSuccess && onSuccess(url);
        } catch (error) {

            if (onError) {
                const uploadError = {
                    name: 'Upload Error',
                    message: error as string
                };
                onError(uploadError);
            }
        }
    };

    return (
        <>
            <Upload
                customRequest={customRequest}
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                maxCount={maxImage}
                defaultFileList={[]}
            >
                {fileList.length >= (maxImage || 8) ? null : uploadButton}
            </Upload>
            {previewImage && (
                <Image
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                    alt="img.jpg"
                />
            )}
        </>
    );
};
