'use client'
import React, { useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
import ShapeCard from '@/components/Card/ShapeCard'
import { Perfume } from '@/types/Perfume'
import { GetProductForSearch } from "@/lib/api"
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { UpdatePerfume, UpdateMaxValue, UpdateFilter, UpdateLoadedState } from '@/app/redux/features/filterSearch';
import { SearchProductDto } from '@/lib/dtos/product'
import { encodeDto, encodeParams, decodeParams } from '@/lib/helper/urlHandler'


export default function Page() {
    const staticRender = useRef<Boolean>(true)
    const router = useRouter();
    const searchParams = useSearchParams();
    const filters = useAppSelector((state) => state.filterSearch.value)
    const perfumes = useAppSelector((state) => state.filterSearch.perfumes)
    const maxValue = useAppSelector((state) => state.filterSearch.maxValue)
    const dispatch = useAppDispatch()

    const fetchData = async () => {
        const { data: responseData, maxValue: pageMax }: { data: Perfume[], maxValue: number } = await GetProductForSearch(filters);
        dispatch(UpdatePerfume({ value: responseData }))
        dispatch(UpdateMaxValue({ maxValue: pageMax }))
    };

    const decodeMount = () => {
        const decodedParams = decodeParams({
            name: searchParams.get("name") || undefined,
            brand: searchParams.get("brand") || undefined,
            concentration: searchParams.get("concentration") || undefined,
            sex: searchParams.get("sex") || undefined,
            size: searchParams.get("size") || undefined,
            count: searchParams.get("count") || undefined,
            page: searchParams.get("page") || undefined,
            sort: searchParams.get("sort") || undefined,
            hotSales: searchParams.get("hotSales") || undefined,
            rangeMoney: searchParams.get("rangeMoney") || undefined,
            fragranceNotes: searchParams.get("fragranceNotes") || undefined
        });
        console.log("decode:", decodedParams)

        const SM: SearchProductDto = {
            name: decodedParams.name || filters.name,
            brand: decodedParams.brand?.map((item) => ({ type: "brand", value: item })) || filters.brand,
            concentration: decodedParams.concentration?.map((item) => ({ type: "concentration", value: item })) || filters.concentration,
            sex: decodedParams.sex?.map((item) => ({ type: "sex", value: item })) || filters.sex,
            size: decodedParams.size?.map((item) => ({ type: "size", value: item })) || filters.size,
            count: decodedParams.count || filters.count,
            index: decodedParams.page || filters.index,
            sort: decodedParams.sort || filters.sort,
            hotSales: decodedParams.hotSales || filters.hotSales,
            rangeMoney: decodedParams.rangeMoney || filters.rangeMoney,
            fragranceNotes: decodedParams.fragranceNotes?.map((item) => ({ type: "fragranceNotes", value: item })) || filters.fragranceNotes,
        }
        console.log("SM: ", SM)
        dispatch(UpdateFilter({ value: SM }))
    }

    useEffect(() => {
        console.log('block page')
        if (staticRender.current) {
            staticRender.current = false
            decodeMount();
            dispatch(UpdateLoadedState({ value: true }))
        } else {
            console.log("filters: ", filters)
            const newPath: encodeDto = {
                name: filters.name,
                brand: filters.brand?.map(item => item.value!),
                concentration: filters.concentration?.map(item => item.value!),
                sex: filters.sex?.map(item => item.value!),
                size: filters.size?.map(item => item.value!),
                count: filters.count,
                page: filters.index,
                sort: filters.sort,
                hotSales: filters.hotSales,
                rangeMoney: filters.rangeMoney,
                fragranceNotes: filters.fragranceNotes?.map(item => item.value!)
            }
            console.log("encodeDTO: ", newPath)
            console.log("encode: ", encodeParams(newPath))
            router.push(`/showroom${encodeParams(newPath)}`)
            fetchData();
        }
    }, [filters])

   return (
        <div className="container mx-auto px-4 py-8">
            {/* CSS Grid: 1 cột di động, 2 cột tablet, 3-4 cột desktop */}
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-3">
                {perfumes && perfumes.length > 0 ? (
                    perfumes.map((perfume, index) => (
                        <ShapeCard
                            key={perfume.id || index}
                            id={perfume.id}
                            name={perfume.name}
                            brand={perfume.brand}
                            img={perfume.img}
                            cost={perfume.cost} 
                        />
                    ))
                ) : (
                    // Hiệu ứng Loading Skeleton đơn giản (tùy chọn)
                    Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="h-80 w-full animate-pulse rounded-lg bg-slate-100"></div>
                    ))
                )}
            </div>
        </div>
    )
}