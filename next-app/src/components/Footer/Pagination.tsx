"use client"
import { useState, useEffect } from "react"
import { SearchProductDto } from '@/lib/dtos/product'
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { UpdateFilter } from '@/app/redux/features/filterSearch';


export default function Pagination() {
    const dispatch = useAppDispatch()
    const filters = useAppSelector((state) => state.filterSearch.value)
    const maxProduct = useAppSelector((state) => state.filterSearch.maxValue)
    const currentPage = useAppSelector((state) => state.filterSearch.value.index) || 1
    const productPerPage = useAppSelector((state) => state.filterSearch.value.count)
    const [maxPage, setMaxPage] = useState<number>(1)

    const handleClick = (page: number) => {
        const SM: SearchProductDto = {
            ...filters,
            index: page
        }
        dispatch(UpdateFilter({ value: SM }))
    };

    useEffect(() => {
        setMaxPage(Math.ceil((maxProduct && productPerPage) ? (maxProduct / productPerPage) : 1))
    }, [maxProduct, productPerPage, filters])


    return (
        <div className="join mt-6">
            <button
                className="join-item btn"
                onClick={() => handleClick(1)}
                disabled={currentPage === 1}
            >
                &lt;&lt;
            </button>
            {currentPage - 3 > 0 && (
                <button className="join-item btn" onClick={() => handleClick(currentPage - 3)}>
                    {currentPage - 3}
                </button>
            )}
            {currentPage - 2 > 0 && (
                <button className="join-item btn" onClick={() => handleClick(currentPage - 2)}>
                    {currentPage - 2}
                </button>
            )}
            {currentPage - 1 > 0 && (
                <button className="join-item btn" onClick={() => handleClick(currentPage - 1)}>
                    {currentPage - 1}
                </button>
            )}
            <button className="join-item btn btn-active">{currentPage}</button>
            {currentPage + 1 <= maxPage && (
                <button className="join-item btn" onClick={() => handleClick(currentPage + 1)}>
                    {currentPage + 1}
                </button>
            )}
            {currentPage + 2 <= maxPage && (
                <button className="join-item btn" onClick={() => handleClick(currentPage + 2)}>
                    {currentPage + 2}
                </button>
            )}
            {currentPage + 3 <= maxPage && (
                <button className="join-item btn" onClick={() => handleClick(currentPage + 3)}>
                    {currentPage + 3}
                </button>
            )}
            {currentPage + 3 < maxPage && (
                <button className="join-item btn btn-disable">
                    {maxPage}
                </button>
            )}
            <button
                className="join-item btn"
                onClick={() => handleClick(maxPage)}
                disabled={currentPage === maxPage}
            >
                &gt;&gt;
            </button>
        </div>
    );
}
