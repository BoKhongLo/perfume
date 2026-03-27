"use client"
import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const Tabs = dynamic(() => import('antd').then(mod => mod.Tabs), { ssr: false });
const AnalyticsRevenue = dynamic(() => import('./analyticsRevenue'), { ssr: false });
const AnalyticsFavorite = dynamic(() => import('./analyticsFavorite'), { ssr: false });
const AnalyticsProduct = dynamic(() => import('./analyticsProduct'), { ssr: false });

export default function Page() {
    const items = [
        {
            key: '1',
            label: 'Biểu đồ danh thu',
            children: <AnalyticsRevenue />,
        },
        {
            key: '2',
            label: 'Biểu đồ xu hướng',
            children: <AnalyticsFavorite />,
        },
        {
            key: '3',
            label: 'Biểu đồ sản phẩm',
            children: <AnalyticsProduct />,
        },

    ];

    return (
        <Tabs defaultActiveKey="1" items={items} tabPosition="left" className="min-h-screen" />
    );
}
