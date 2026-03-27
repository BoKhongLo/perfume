"use client"
import React, { useState, useEffect, use } from 'react';
import dynamic from 'next/dynamic';

const Tabs = dynamic(() => import('antd').then(mod => mod.Tabs), { ssr: false });
const AddNewProduct = dynamic(() => import('./addNewProduct'), { ssr: false });
const AddProductByFile = dynamic(() => import('./addProductByFile'), { ssr: false });
const SearchProduct = dynamic(() => import('./searchProduct'), { ssr: false });
const UpdateProduct = dynamic(() => import('./updateProduct'), { ssr: false });

export default function Page() {
    const [activeKey, setActiveKey] = useState<string>('1')
    const [updateKey, setUpdateKey] = useState<number>()

    const chageActiveKey = (id: string) => {
        setActiveKey(id);
    }

    const changeUpdateKey = (id: number) => {
        setUpdateKey(id);
    }

    const onChange = (key: any) => {
        console.log(key);
    };

    const items = [
        {
            key: '1',
            label: <div onClick={() => {chageActiveKey('1')} }>Thêm sản phẩm</div>,
            children: <AddNewProduct changeTab={chageActiveKey}/>,
        },
        {
            key: '2',
            label: <div onClick={() => { chageActiveKey('2') }}>Danh mục sản phẩm</div>,
            children: <SearchProduct setUpdateKey={changeUpdateKey} changeTab={chageActiveKey} />,
        },
        {
            key: '3',
            label: <div onClick={() => { chageActiveKey('3') }}>Nhập hàng</div>,
            children: <AddProductByFile />,
        },
        {
            key: '4',
            label: <div onClick={() => { chageActiveKey('4') }}>Sửa thông tin</div>,
            children: <UpdateProduct changeTab={chageActiveKey} />,
        },
    ];

    return (<Tabs defaultActiveKey="1" activeKey={activeKey} items={items} onChange={onChange} tabPosition="left" className="min-h-screen" />)
}