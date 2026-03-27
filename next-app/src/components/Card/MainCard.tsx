"use client"
import { Perfume } from '@/types/Perfume';
import React from 'react';
import Image from 'next/image';

const MainCard: React.FC<{ item: Perfume }> = ({ item }) => {
    return (
        <div className="group relative flex w-full flex-col overflow-hidden border rounded-xl bg-white transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
            {/* Image Section với tỉ lệ 1:1 và hiệu ứng Zoom */}
            <div className="relative aspect-square w-full overflow-hidden]">
                <a href={`/product/${item.id}`} className="block h-full w-full">
                    <Image
                        src={item.img || 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'}
                        alt={item.name}
                        fill
                        className="object-contain p-6 transition-transform duration-700 ease-out group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                </a>
                
                {/* Badge "New" hoặc "Sale" tinh tế (Nếu có data) */}
                <div className="absolute left-3 top-3">
                    <span className="bg-white/80 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-[#3E4A61] backdrop-blur-md">
                        Premium
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-col p-5">
                {/* Brand name - Indigo Color */}
                <span className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#4B5D7E]/60">
                    {item.brand || "Perfume House"}
                </span>

                {/* Product Name - Indigo Color */}
                <h3 className="line-clamp-2 min-h-[3rem] text-sm font-medium leading-relaxed text-[#3E4A61] transition-colors group-hover:text-[#D4AF37]">
                    <a href={`/product/${item.id}`}>{item.name}</a>
                </h3>

                {/* Divider nhẹ nhàng */}
                <div className="my-3 h-[1px] w-8 bg-[#D4AF37]/30 transition-all duration-500 group-hover:w-full"></div>

                {/* Price Section */}
                <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-[#3E4A61]">
                        {item.cost}
                    </span>
                    
                    {/* Nút bấm giả hoặc link chi tiết */}
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 -translate-x-2">
                        Khám phá →
                    </span>
                </div>
            </div>
        </div>
    );
};

export default MainCard;