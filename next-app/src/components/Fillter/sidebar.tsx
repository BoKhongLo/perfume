"use client"
import { ChangeEvent, useEffect, useState, useRef } from 'react'
import { Slider, ConfigProvider } from "antd";
import { SearchProductDto } from "@/lib/dtos/product/"
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { UpdateFilter, initialState, UpdateLoadedState } from '@/app/redux/features/filterSearch';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';


type FilterSidebarProps = {
    brand: string[],
    perfumeType: {
        role: string,
        type: string[]
    }[]
}

type filterStorageDto = {
    brand?: string[],
    concentration?: string[],
    sex?: string[],
    size?: string[],
    rangeMoney?: [number, number],
    fragranceNotes?: string[],
}

export default function FilterSidebar({ brand, perfumeType }: FilterSidebarProps) {
    const staticRender = useRef<boolean>(false)
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000])
    const [searchName, setSearchName] =  useState<string>('')
    const [brandStorage, setBrandStorage] = useState<string[]>([])
    const [filterStorage, setFilterStorage] = useState<filterStorageDto>({})
    const dispatch = useAppDispatch()
    const filters = useAppSelector((state) => state.filterSearch.value)
    const loaded = useAppSelector((state) => state.filterSearch.loaded)

    useEffect(() => { setBrandStorage(brand); }, [brand]) 

    useEffect(() => {
        console.log("staticrender: ", staticRender)
        console.log("pass1")
        if (!loaded) return;
        console.log("pass2")
        if (!staticRender.current) return;
        console.log("pass3")
        const SM: SearchProductDto = {
            ...filters,
            index: 1,
            brand: filterStorage.brand?.map(item => ({ type: "brand", value: item })),
            sex: filterStorage.sex?.map(item => ({ type: "sex", value: item })),
            concentration: filterStorage.concentration?.map(item => ({ type: "concentration", value: item })),
            fragranceNotes: filterStorage.fragranceNotes?.map(item => ({ type: "fragranceNotes", value: item })),
            size: filterStorage.size?.map(item => ({ type: "size", value: item })),
            rangeMoney: filterStorage.rangeMoney,
        }
        dispatch(UpdateFilter({ value: SM }))
    }, [filterStorage])

    useEffect(() => {
        if (!loaded) return;
        if (!staticRender.current) { staticRender.current = true; return}
        else {
            setFilterStorage({
                brand: filters.brand?.map(e => e.value!),
                concentration: filters.concentration?.map(e => e.value!),
                sex: filters.sex?.map(e => e.value!),
                size: filters.size?.map(e => e.value!),
                rangeMoney: filters.rangeMoney ? [filters.rangeMoney[0], filters.rangeMoney[1]] : undefined,
                fragranceNotes: filters.fragranceNotes?.map(e => e.value!),
            })
            console.log("FS:", filterStorage)
            setPriceRange([
                filters.rangeMoney?.[0] !== undefined ? filters.rangeMoney[0] / 1000 : 0,
                filters.rangeMoney?.[1] !== undefined ? filters.rangeMoney[1] / 1000 : 50000
            ]);
            setSearchName(filters.name!)
        }
    }, [loaded])

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const SM: SearchProductDto = {
            ...filters,
            name: $(e.currentTarget).val()
        }
        dispatch(UpdateFilter({ value: SM }))
    }

    const handleClear = () => {
        setSearchName("")
        const SM: SearchProductDto = {
            ...filters,
            name: ''
        }
        dispatch(UpdateFilter({ value: SM }))
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === "Enter") { e.currentTarget.blur() } }

    const filterBrand = (e: ChangeEvent<HTMLInputElement>) => {
        const target = $(e.currentTarget);
        const value = target.val()?.toLocaleLowerCase();
        setBrandStorage(() => brand.filter(item => item.toLocaleLowerCase().includes(value || "")));
    }

    const changeRangeMoney = (value: number[]) => {
        setFilterStorage((preStorage) => ({
            ...preStorage,
            rangeMoney: [value[0]*1000, value[1]*1000]
        }))
    }

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = $(event.currentTarget)
        const value = target.attr("value")
        const isChecked = target.is(':checked')
        const forFilter = target.attr('custume-for')!

        setFilterStorage((prevStorage: filterStorageDto) => {
            if (isChecked) {
                return {
                    ...prevStorage,
                    [forFilter]: [...(prevStorage[forFilter as keyof typeof prevStorage] || []), value]
                };
            } else {
                return {
                    ...prevStorage,
                    [forFilter]: (prevStorage[forFilter as keyof typeof prevStorage] || []).filter(item => item !== value)
                };
            }
        });
    };

    const resetFilter = () => {
        $("input[type=checkbox]").prop('checked', false)
        setSearchName('')
        setPriceRange([0, 50000])
        dispatch(UpdateFilter({
            value: {
                sort: filters.sort,
                count: filters.count,
                index: 1
            }
        }))
        setFilterStorage({})
    }


    return (
        <div className="block w-full">
            <div className="input-search hidden xl:block  w-[250px] p-4">
                <button onClick={resetFilter} className="btn btn-outline w-full rounded-none"><FilterAltOffIcon /></button>
                <div className="divider"></div>
                <div className="join w-full border rounded-none border-neutral">
                    <input type="text"
                        value={searchName}
                        onChange={(e) => {setSearchName(e.currentTarget.value)}}
                        onBlur={handleChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Search by name"
                        className="input w-full max-w-xs rounded-none"
                    />
                    <button className="join-item btn rounded-none bg-base-100" onClick={handleClear}>x</button>
                </div>
                <div className="divider"></div>
                <label className="form-control w-full max-w-xs">
                    <input type="text"
                        onChange={filterBrand}
                        placeholder="Search brand" className="input input-bordered w-full max-w-xs rounded-none"
                    />
                </label>
                <div className="max-h-72 overflow-y-scroll">
                    <div className="form-control brand-search">
                        {brandStorage ? brandStorage.map((item, index) => (
                            <label className="label cursor-pointer justify-start" key={index}>
                                <input type="checkbox"
                                    checked={filters.brand?.some((e) => e.value === item)}
                                    value={item}
                                    custume-for="brand"
                                    onChange={handleCheckboxChange} className="checkbox mx-2 rounded-none" />
                                <span className="label-text capitalize">{item}</span>
                            </label>
                        )) : null}
                    </div>
                </div>
                <div className="divider"></div>
                <div>
                    <h4>Giá</h4>
                    <div className="flex flex-row justify-between">
                        <h6>{(priceRange[0] * 1000).toLocaleString('vi-VN')}</h6>
                        <h6>{(priceRange[1] * 1000).toLocaleString('vi-VN')} VND</h6>
                    </div>
                    <ConfigProvider theme={{
                        components: {
                            Slider: {
                                handleColor: "rgb(220 165 76)",
                                handleActiveOutlineColor: "rgb(220 165 76)",
                                trackBg: "rgb(220 165 76)",
                                trackHoverBg: "rgb(220 165 76)"
                            },
                        },
                    }}>
                        <Slider range={true} defaultValue={[0, 50000]}
                            min={0}
                            max={50000}
                            value={[priceRange[0], priceRange[1]]}
                            tooltip={{ open: false }}
                            className="flex-1"
                            onChange={(e) => setPriceRange([e[0], e[1]])}
                            onChangeComplete={changeRangeMoney}
                        />
                    </ConfigProvider>
                </div>
                <div className="divider"></div>
                <div>
                    <h4>Giới tính</h4>
                    <div className="form-control flex-wrap flex flex-row">
                        <label className="label cursor-pointer justify-start">
                            <input
                                checked={filters.sex?.some((e) => e.value == "nam")}
                                type="checkbox" value="nam" custume-for="sex"
                                onChange={handleCheckboxChange} className="checkbox mx-2 rounded-none" />
                            <span className="label-text">Nam</span>
                        </label>
                        <label className="label cursor-pointer justify-start">
                            <input
                                checked={filters.sex?.some((e) => e.value == "nữ")}
                                type="checkbox" value="nữ" custume-for="sex"
                                onChange={handleCheckboxChange} className="checkbox mx-2 rounded-none" />
                            <span className="label-text">Nữ</span>
                        </label>
                        <label className="label cursor-pointer justify-start">
                            <input
                                checked={filters.sex?.some((e) => e.value == "unisex")}
                                type="checkbox" value="unisex" custume-for="sex"
                                onChange={handleCheckboxChange} className="checkbox mx-2 rounded-none" />
                            <span className="label-text">Unisex</span>
                        </label>
                    </div>
                </div>
                <div className="divider"></div>
                <div>
                    <h4>Nhóm hương</h4>
                    <div className="form-control flex-wrap flex flex-row">
                        {perfumeType ? perfumeType.find(perfume => perfume.role === "FRAGRANCE GROUP")?.type.map((item, index) => (
                            <label className="label cursor-pointer justify-start w-1/2" key={index}>
                                <input type="checkbox"
                                    value={item}
                                    checked={filters.fragranceNotes?.some((e) => e.value === item)}
                                    custume-for="fragranceNotes"
                                    onChange={handleCheckboxChange}
                                    className="checkbox mx-2 rounded-none" />
                                <span className="label-text capitalize">{item}</span>
                            </label>
                        )) : null}
                    </div>
                </div>
                <div className="divider"></div>
                <div>
                    <h4>Nồng độ</h4>
                    <div className="form-control">
                        {perfumeType ? perfumeType.find(perfume => perfume.role === "CONCENTRATION")?.type.map((item, index) => (
                            <label className="label cursor-pointer justify-start" key={index}>
                                <input type="checkbox"
                                    value={item}
                                    checked={filters.concentration?.some((e) => e.value === item)}
                                    custume-for="concentration"
                                    onChange={handleCheckboxChange}
                                    className="checkbox mx-2 rounded-none" />
                                <span className="label-text capitalize">{item}</span>
                            </label>
                        )) : null}
                    </div>
                </div>
                <div className="divider"></div>
                <div>
                    <h4>Dung tích</h4>
                    <div className="form-control flex-wrap flex flex-row">
                        {perfumeType ? perfumeType.find(perfume => perfume.role === "CAPACITY")?.type.map((item, index) => (
                            <label className="label cursor-pointer justify-start w-1/2" key={index}>
                                <input type="checkbox"
                                    value={item}
                                    checked={filters.size?.some((e) => e.value === item)}
                                    custume-for="size"
                                    onChange={handleCheckboxChange}
                                    className="checkbox mx-2 rounded-none" />
                                <span className="label-text capitalize">{item}</span>
                            </label>
                        )) : null}
                    </div>
                </div>
            </div>
            <div className="drawer z-[999]">
                <input id="filter-toggle" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content hidden">
                    <label htmlFor="filter-toggle" className="btn hidden btn-primary drawer-button">Open drawer</label>
                </div>
                <div className="drawer-side">
                    <label htmlFor="filter-toggle" aria-label="close sidebar" className="drawer-overlay"></label>
                    <div className="input-search w-[350px] bg-base-100 p-4 mt-[112px]">
                        <button onClick={resetFilter} className="btn btn-outline w-full rounded-none"><FilterAltOffIcon /></button>
                        <div className="divider"></div>
                        <div className="join w-full border rounded-none border-neutral">
                            <input type="text"
                                value={searchName}
                                onChange={(e) => { setSearchName(e.currentTarget.value) }}
                                onBlur={handleChange}
                                onKeyDown={handleKeyDown}
                                placeholder="Search by name"
                                className="input w-full max-w-xs rounded-none"
                            />
                            <button className="join-item btn rounded-none" onClick={handleClear}>x</button>
                        </div>
                        <div className="divider"></div>
                        <label className="form-control w-full max-w-xs">
                            <input type="text"
                                onChange={filterBrand}
                                placeholder="Search brand" className="input input-bordered w-full max-w-xs rounded-none"
                            />
                        </label>
                        <div className="max-h-72 overflow-y-scroll">
                            <div className="form-control brand-search">
                                {brandStorage ? brandStorage.map((item, index) => (
                                    <label className="label cursor-pointer justify-start" key={index}>
                                        <input type="checkbox"
                                            checked={filters.brand?.some((e) => e.value === item)}
                                            value={item}
                                            custume-for="brand"
                                            onChange={handleCheckboxChange} className="checkbox mx-2 rounded-none" />
                                        <span className="label-text capitalize">{item}</span>
                                    </label>
                                )) : null}
                            </div>
                        </div>
                        <div className="divider"></div>
                        <div>
                            <h4>Giá</h4>
                            <div className="flex flex-row justify-between">
                                <h6>{(priceRange[0] * 1000).toLocaleString('vi-VN')}</h6>
                                <h6>{(priceRange[1] * 1000).toLocaleString('vi-VN')} VND</h6>
                            </div>
                            <ConfigProvider theme={{
                                components: {
                                    Slider: {
                                        handleColor: "rgb(220 165 76)",
                                        handleActiveOutlineColor: "rgb(220 165 76)",
                                        trackBg: "rgb(220 165 76)",
                                        trackHoverBg: "rgb(220 165 76)"
                                    },
                                },
                            }}>
                                <Slider range={true} defaultValue={[0, 50000]}
                                    min={0}
                                    max={50000}
                                    value={[priceRange[0], priceRange[1]]}
                                    tooltip={{ open: false }}
                                    className="flex-1"
                                    onChange={(e) => setPriceRange([e[0], e[1]])}
                                    onChangeComplete={changeRangeMoney}
                                />
                            </ConfigProvider>
                        </div>
                        <div className="divider"></div>
                        <div>
                            <h4>Giới tính</h4>
                            <div className="form-control flex-wrap flex flex-row">
                                <label className="label cursor-pointer justify-start">
                                    <input
                                        checked={filters.sex?.some((e) => e.value == "nam")}
                                        type="checkbox" value="nam" custume-for="sex"
                                        onChange={handleCheckboxChange} className="checkbox mx-2 rounded-none" />
                                    <span className="label-text">Nam</span>
                                </label>
                                <label className="label cursor-pointer justify-start">
                                    <input
                                        checked={filters.sex?.some((e) => e.value == "nữ")}
                                        type="checkbox" value="nữ" custume-for="sex"
                                        onChange={handleCheckboxChange} className="checkbox mx-2 rounded-none" />
                                    <span className="label-text">Nữ</span>
                                </label>
                                <label className="label cursor-pointer justify-start">
                                    <input
                                        checked={filters.sex?.some((e) => e.value == "unisex")}
                                        type="checkbox" value="unisex" custume-for="sex"
                                        onChange={handleCheckboxChange} className="checkbox mx-2 rounded-none" />
                                    <span className="label-text">Unisex</span>
                                </label>
                            </div>
                        </div>
                        <div className="divider"></div>
                        <div>
                            <h4>Nhóm hương</h4>
                            <div className="form-control flex-wrap flex flex-row">
                                {perfumeType ? perfumeType.find(perfume => perfume.role === "FRAGRANCE GROUP")?.type.map((item, index) => (
                                    <label className="label cursor-pointer justify-start w-1/2" key={index}>
                                        <input type="checkbox"
                                            value={item}
                                            checked={filters.fragranceNotes?.some((e) => e.value === item)}
                                            custume-for="fragranceNotes"
                                            onChange={handleCheckboxChange}
                                            className="checkbox mx-2 rounded-none" />
                                        <span className="label-text capitalize">{item}</span>
                                    </label>
                                )) : null}
                            </div>
                        </div>
                        <div className="divider"></div>
                        <div>
                            <h4>Nồng độ</h4>
                            <div className="form-control">
                                {perfumeType ? perfumeType.find(perfume => perfume.role === "CONCENTRATION")?.type.map((item, index) => (
                                    <label className="label cursor-pointer justify-start" key={index}>
                                        <input type="checkbox"
                                            value={item}
                                            checked={filters.concentration?.some((e) => e.value === item)}
                                            custume-for="concentration"
                                            onChange={handleCheckboxChange}
                                            className="checkbox mx-2 rounded-none" />
                                        <span className="label-text capitalize">{item}</span>
                                    </label>
                                )) : null}
                            </div>
                        </div>
                        <div className="divider"></div>
                        <div>
                            <h4>Dung tích</h4>
                            <div className="form-control flex-wrap flex flex-row">
                                {perfumeType ? perfumeType.find(perfume => perfume.role === "CAPACITY")?.type.map((item, index) => (
                                    <label className="label cursor-pointer justify-start w-1/2" key={index}>
                                        <input type="checkbox"
                                            value={item}
                                            checked={filters.size?.some((e) => e.value === item)}
                                            custume-for="size"
                                            onChange={handleCheckboxChange}
                                            className="checkbox mx-2 rounded-none" />
                                        <span className="label-text capitalize">{item}</span>
                                    </label>
                                )) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{`
                h4{
                    text-transform: uppercase;
                    font-weight: 700;
                }
            `}</style>
        </div>
    )
}