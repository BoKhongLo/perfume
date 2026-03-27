import React from 'react'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from "@/components/Footer/index";
import Header from "@/components/Header";
import { GetTagsProduct, getTopPerfume } from '@/lib/api'
import { perfumeType } from '@/types'

type Perfume = {
    img?: string;
    name: string;
    description: string;
    href?: string;
    cost: string;
}

export default async function HomeTemplate({
    children
}: {
    children: React.ReactNode
}) {

    const { brandName, topBrandName, perfumeType } = await getBrandData()

    return (
        <div className="relative">
            <Header brandName={brandName as string[]} topBrandName={topBrandName} perfumeType={perfumeType as perfumeType[]} /> {/*z-index: 50*/}
            <main id="main-page" style={{ position: "relative", zIndex: 10, marginBottom: "95vh" }}>
                { children }
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
