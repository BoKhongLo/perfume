"use client"
import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const Tabs = dynamic(() => import('antd').then(mod => mod.Tabs), { ssr: false });
const AddUser = dynamic(() => import('./addUser'), { ssr: false });
const InfomationUser = dynamic(() => import('./infomationUser'), { ssr: false });
const UpdateUser = dynamic(() => import('./updateUser'), { ssr: false });

export default function Page() {
    const [activeKey, setActiveKey] = useState<string>('1')

    const changeActiveKey = (id: string) => {
        setActiveKey(id);
    }

    const items = [
        {
            key: '1',
            label:  <div onClick={() => { changeActiveKey('1') }}>Thêm người dùng</div>,
            children: <AddUser />,
        },
        {
            key: '2',
            label: <div onClick={() => { changeActiveKey('2') }}>Thông tin người dùng</div>,
            children: <InfomationUser changeTab={changeActiveKey}/>,
        },
        
        {
            key: '3',
            label: <div onClick={() => { changeActiveKey('3') }}>Chỉnh sửa người dùng</div>,
            children: <UpdateUser changeTab={changeActiveKey} />,
        },
    ];

    return (
        <Tabs defaultActiveKey="1"  activeKey={activeKey} items={items} tabPosition="left" className="min-h-screen" />
    );
}
