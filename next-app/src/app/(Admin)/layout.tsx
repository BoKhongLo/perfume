'use client'
import React from 'react'
import Header from "@/components/Header/(admin)header"
import Breadcrumb from '@/components/Breadcrumb'

export default function layout({
    children
}: {
    children: React.ReactNode
}) {

    return (
        <div  className="bg-white min-h-screen ">
            <Header />
            {/*<Breadcrumb />*/}
            <main className="">
                {children}
            </main>
        </div>
    )
}