"use client"
import { useState, useEffect, ChangeEvent } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { UpdateFilter } from '@/app/redux/features/filterSearch';
import { SearchProductDto } from '@/lib/dtos/product'
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import $ from 'jquery'
import { Divider } from 'antd';

export default function FilterNavbar() {
    const dispatch = useAppDispatch()
    const filters = useAppSelector((state) => state.filterSearch.value)
    const maxProduct = useAppSelector((state) => state.filterSearch.maxValue) || 1
    const [maxPage, setMaxPage] = useState<number>(1)

    useEffect(() => {
        setMaxPage(Math.ceil((filters.index && filters.count) ? (maxProduct / filters.count) : 1))
    }, [filters.index, maxProduct])

    const handleClick = (page: number) => {
        const SM: SearchProductDto = {
            ...filters,
            index: page
        }
        dispatch(UpdateFilter({ value: SM }))
    };

    const handleSelect = (type: string, value: string) => {
        const SM: SearchProductDto = {
            ...filters,
            [type]: value,
            index: 1
        }
        dispatch(UpdateFilter({ value: SM }))
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = $(e.currentTarget).val();
        console.log(newValue)
        if (!isNaN(Number(newValue))) {
            const SM: SearchProductDto = {
                ...filters,
                index: Number(e.target.value)
            }
            dispatch(UpdateFilter({ value: SM }))
            e.target.value = '';
        }
        else { e.target.value = '' }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === "Enter") { e.currentTarget.blur() } }

    const openFilter = () => {
        $("#filter-toggle").trigger('click');
    }

    return (
        <div className="flex flex-col items-end gap-4 border-b border-slate-100 pb-6">
            {/* Left Side: Filters & Sorting */}
            <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto">
                {/* Mobile Filter Button */}
                <button 
                    className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-[#3E4A61] transition-all hover:bg-slate-50 xl:hidden"
                    onClick={() => openFilter()}
                >
                    <FilterAltIcon fontSize="small" />
                    <span>Lọc</span>
                </button>

                {/* Custom Styled Selects */}
                <div className="relative">
                    <select 
                        onChange={(e) => handleSelect("count", e.target.value)}
                        className="appearance-none rounded-lg border border-slate-200 bg-white px-4 py-2 pr-10 text-sm font-medium text-[#3E4A61] outline-none transition-all focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                        value={filters.count}
                    >
                        <option value="12">12 mỗi trang</option>
                        <option value="24">24 mỗi trang</option>
                        <option value="48">48 mỗi trang</option>
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                </div>

                <div className="relative">
                    <select 
                        onChange={(e) => handleSelect("sort", e.target.value)}
                        className="appearance-none rounded-lg border border-slate-200 bg-white px-4 py-2 pr-10 text-sm font-medium text-[#3E4A61] outline-none transition-all focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                        value={filters.sort}
                    >
                        <option value="created_at_desc">Mới nhất</option>
                        <option value="created_at_asc">Cũ nhất</option>
                        <option value="price_desc">Giá: Cao đến Thấp</option>
                        <option value="price_asc">Giá: Thấp đến Cao</option>
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                </div>

                <div className="relative">
                    <select 
                        onChange={(e) => handleSelect("hotSales", e.target.value)}
                        className="appearance-none rounded-lg border border-slate-200 bg-white px-4 py-2 pr-10 text-sm font-medium text-[#3E4A61] outline-none transition-all focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                        value=""
                    >
                        <option value="">Xu hướng</option>
                        <option value="week">Bán chạy trong tuần</option>
                        <option value="month">Bán chạy trong tháng</option>
                        <option value="year">Bán chạy trong năm</option>
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                </div>
            </div>

            {/* Right Side: Pagination */}
            <div className="flex items-center gap-2">
                <div className="flex items-center overflow-hidden rounded-lg border border-slate-200 bg-white">
                     <span className="ml-2 text-xs font-medium text-slate-400">
                    Trang {filters.index} / {maxPage}
                </span>
                    <button 
                        className="px-3 py-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-[#D4AF37] disabled:opacity-30"
                        disabled={filters.index === 1} 
                        onClick={() => handleClick(1)}
                    >
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
                    </button>
                    <button 
                        className="px-3 py-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-[#D4AF37] disabled:opacity-30"
                        disabled={filters.index === 1} 
                        onClick={() => handleClick(Number(filters.index) - 1)}
                    >
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    
                    <input 
                        type="text" 
                        placeholder={String(filters.index)} 
                        onKeyDown={handleKeyDown} 
                        onBlur={handleChange} 
                        className="w-12 border-x border-slate-100 bg-transparent text-center text-sm font-bold text-[#3E4A61] outline-none"
                    />
                    
                    <button 
                        className="px-3 py-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-[#D4AF37] disabled:opacity-30"
                        disabled={maxPage === filters.index} 
                        onClick={() => handleClick(Number(filters.index) + 1)}
                    >
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </button>
                    <button 
                        className="px-3 py-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-[#D4AF37] disabled:opacity-30"
                        disabled={maxPage === filters.index} 
                        onClick={() => handleClick(maxPage)}
                    >
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </div>
        </div>
    )
}