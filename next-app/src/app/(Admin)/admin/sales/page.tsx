"use client"
import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const Tabs = dynamic(() => import('antd').then(mod => mod.Tabs), { ssr: false });
const CreateBill = dynamic(() => import('./createBill'), { ssr: false });
const TraceabilityBill = dynamic(() => import('./traceabilityBill'), { ssr: false });

export default function Page() {
    const [activeKey, setActiveKey] = useState<string>('1')

    const changeActiveKey = (id: string) => {
        setActiveKey(id);
    }

    const items = [
        {
            key: '1',
            label:  <div onClick={() => { changeActiveKey('1') }}>Thêm hoá đơn</div>,
            children: <CreateBill changeTab={changeActiveKey}/>,
        },
        {
            key: '2',
            label:  <div onClick={() => { changeActiveKey('2') }}>Truy vấn hoá đơn</div>,
            children: <TraceabilityBill />,
        },
    ];

    return (
        <Tabs defaultActiveKey="1" items={items} activeKey={activeKey}  tabPosition="left" className="min-h-screen" />
    );
}
