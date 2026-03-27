"use client"
import React from 'react';
import Link from 'next/link';
import { Breadcrumb } from 'antd';

const App: React.FC<string[]> = (pathnames) => {


    return (
        <Breadcrumb
            separator=">"
            items={pathnames.map((url, index) => (
                {
                    title: url.charAt(0).toUpperCase() + url.slice(1),
                    href: `/${pathnames.slice(0, index + 1).join('/')}`
                }
            ))}
        />
);
}


export default App;