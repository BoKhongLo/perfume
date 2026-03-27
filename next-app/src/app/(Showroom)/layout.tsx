import React from 'react'
import Footer from "@/components/Footer/index";
import Header from "@/components/Header";
import { GetTagsProduct, getTopPerfume } from '@/lib/api'
import { perfumeType } from '@/types'
import { center } from '@antv/g2plot/lib/plots/sankey/sankey';


export default async function HomeLayout({
    children
}: {
    children: React.ReactNode
}) {

    const { brandName, topBrandName, perfumeType } = await getBrandData()

    return (
        <div className="relative">
            <Header brandName={brandName as string[]} topBrandName={topBrandName} perfumeType={perfumeType as perfumeType[]} /> {/*z-index: 50*/}
            <main id="main-content" style={{ position: "relative", zIndex: 10, marginBottom: "95vh", marginTop: '112px'  }}>
                {children}
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
