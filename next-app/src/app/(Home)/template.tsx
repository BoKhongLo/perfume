import React from 'react'
import Footer from "@/components/Footer/index";
import Header from "@/components/Header";
import Carousel from '@/components/Carousel';
import { GetTagsProduct, getTopPerfume } from '@/lib/api'
import { perfumeType } from '@/types'
export const revalidate = 86400;

export default async function HomeTemplate({
    children
}: {
    children: React.ReactNode
}) {

    const { brandName, topBrandName, perfumeType } = await getBrandData()

    return (
        <div className="relative">
            <Header brandName={brandName as string[]} topBrandName={topBrandName} perfumeType={perfumeType as perfumeType[]} /> {/*z-index: 50*/}
            <div id="main-carousel" className="overflow-hidden"><Carousel></Carousel></div>
            <main className="bg-base-100" style={{ position: "relative", zIndex: 10, marginBottom: "95vh", width: "100%" }}>
                {children}
                <div className="end h-10 bg-neutral w-full glass"></div>
            </main>
            <Footer /> {/*z-index: 0*/}
        </div>
    );
}

async function getBrandData() {

    const brandName = (await GetTagsProduct("brand")).map(item => item.value).sort()
    const topBrandName = (await getTopPerfume())
    const perfumeType = [
        {
            role: "sex",
            type: (await GetTagsProduct("sex")).map(item => item.value).sort()
        },
        {
            role: "fragranceNotes",
            type: (await GetTagsProduct("fragranceNotes")).map(item => item.value).sort()
        },
        {
            role: "concentration",
            type: (await GetTagsProduct("concentration")).map(item => item.value).sort()
        },
        {
            role: "size",
            type: (await GetTagsProduct("size")).map(item => item.value).sort()
        }
    ];

    return { brandName, topBrandName, perfumeType };
}

