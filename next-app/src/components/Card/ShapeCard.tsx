"use client"
import { Perfume } from "@/types/Perfume"
import Image from 'next/image';

export default function ShapeCard({ name, img, brand, cost, id }: Perfume) {
    return (
        <div className="group relative flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white transition-all duration-300 ">
            {/* Image Container */}
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-white">
                <a href={`/product/${id}`} target="_blank" rel="noopener noreferrer">
                    <Image
                        src={img as string || 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'}
                        alt={name}
                        fill
                        className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                </a>
            </div>

            {/* Content Container */}
            <div className="flex flex-col flex-1 p-4 pt-2">
                {/* Brand - Subtle Style */}
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {brand}
                </span>
                
                {/* Product Name */}
                <h5 className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm font-medium text-slate-800 group-hover:text-indigo-600">
                    <a href={`/product/${id}`}>{name}</a>
                </h5>

                {/* Bottom Section: Price */}
                <div className="mt-auto pt-3 flex items-center justify-between">
                    <span className="text-base font-bold text-slate-900">
                        {cost}
                    </span>
                    {/* <button className="rounded-full bg-slate-900 p-2 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M8 1a.5.5 0 0 1 .5.5v6.5h6.5a.5.5 0 0 1 0 1h-6.5v6.5a.5.5 0 0 1-1 0v-6.5h-6.5a.5.5 0 0 1 0-1h6.5v-6.5A.5.5 0 0 1 8 1z"/>
                        </svg>
                    </button> */}
                </div>
            </div>
        </div>
    )
}