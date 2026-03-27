'use client'
import $ from 'jquery';
import dynamic from 'next/dynamic'
import React, { useState, useEffect } from 'react';
import ListIcon from '@mui/icons-material/List';
const ThemeController = dynamic(() => import('@/components/themeController'), { ssr: false });


interface PerfumeType {
    role: string;
    type: string[];
}

interface HeaderProps {
    brandName?: string[];
    topBrandName?: string[];
    perfumeType?: PerfumeType[];
}


const Header: React.FC<HeaderProps> = ({ brandName, topBrandName, perfumeType }) => {

    const [brands, setBrands] = useState<string[]>(brandName ? [...brandName] : []);
    const [letterSort, setLetterSort] = useState<string[]>([])

    const resetBrandSort = () => { setLetterSort([]) }

    const handleSortBrand = (e: React.MouseEvent<HTMLElement>) => {
        const target = $(e.currentTarget);
        const key = target.text();
        if (key) {
            setLetterSort((preletters) => {
                if (preletters.includes(key)) { return preletters.filter(letter => letter !== key) }
                else { return [...preletters, key] }
            });
        }
    }

    useEffect(() => {
        setBrands(() =>
            letterSort.length && brandName
                ? brandName.filter((brand) => letterSort.includes(brand[0].toUpperCase()))
                : (brandName ? [...brandName] : [])
        );
    }, [letterSort]);


    const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

    const openNavbarOptionLg = (e: React.MouseEvent<HTMLElement>) => {
        const detailsRef: HTMLElement = e.currentTarget
        if (detailsRef) {
            detailsRef.setAttribute('open', '');
        }
        const ulRef: HTMLElement | null = detailsRef?.querySelector('ul')
        if (ulRef) {
            ulRef.style.display = 'flex';
        }
    };

    const closeNavbarOptionLg = (e: React.MouseEvent<HTMLElement>) => {
        const detailsRef: HTMLElement = e.currentTarget
        const ulRef: HTMLElement | null = detailsRef.querySelector('ul')
        if (detailsRef && ulRef) {
            detailsRef.removeAttribute('open');
            ulRef.style.display = 'none';
        }
    }

    const handleDrawer = () => { $('#my-drawer').trigger('click') }

    const handleDrawerDropdown = (e: React.MouseEvent<HTMLElement>) => {
        const $summary = $(e.currentTarget);
        const $ul = $summary.next('ul');
        $ul.toggleClass('hidden');
    };

    useEffect(() => {
        const header = $('#header');
        const hideableElement = $('#header > .hideable');
        const handleScroll = () => {
            const headerHideableHeight = hideableElement.outerHeight();
            const scrollTop = $(window).scrollTop();
            if (scrollTop! < headerHideableHeight!) {
                header.css('top', `-${scrollTop}px`);
            } else {
                header.css('top', `-${headerHideableHeight}px`);
            }
        };
        $(window).on('scroll', handleScroll);
        return () => {
            $(window).off('scroll', handleScroll);
        };
    }, []);

    return (
        <header className="top-0 left-0 bg-base-100 fixed z-50 flex w-full flex-col border-b "
            id="header"
            style={{ transition: 'top 0.3s ease-in-out' }}
        >
            <header className="navbar bg-base-100 border-b h-12 m-auto hideable  max-w-[1200px]" style={{
                minHeight: '0px'
            }}>
                <a href="/"><div className="flex relative md:block" 
                    style={{
                        width: '30px',
                        height: '30px',
                        WebkitMask: 'url(/images/logo-full.png) no-repeat center',
                        mask: 'url(/images/logo-full.png) no-repeat center',
                        backgroundColor: '#dca44c',
                        transition: 'background-color 0.3s ease',
                        boxShadow: '3px 3px 5px rgba(100,100,100,0.5)',
                    }}
                >
                    <img
                        src="/images/logo-full.png"
                        alt="Logo"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            visibility: 'hidden',
                        }}
                    />
                </div></a>
                <div className="flex flex-col justify-center md:hidden" onClick={() => handleDrawer()}>
                    <ListIcon fontSize="large" />
                </div>
                <a href="/"><h1 className="ml-4 font-bold text-4xl hover-up luxuriousFont">Perfume</h1></a>
                <div className="flex-1"></div>
                <div className="flex-none">
                    <div className="dropdown dropdown-end flex flex-row">
                        <ThemeController />
                    </div>
                </div>
            </header>
            <header className="md:block box-border navbar bg-base-100 flex h-10 m-auto max-w-[1200px] header-option relative" style={{
                minHeight: '0px',
                padding: 0
            }}>
                <ul className="menu menu-horizontal navbar-option w-full h-full justify-between content-center">
                    <li><a href="/">Trang chủ</a></li>
                    <li><a href="/#main-introduce">Về PefumeDK</a></li>
                    <li className="pesudo-class  remove-li-before" style={{ position: "static" }}
                        onMouseOver={openNavbarOptionLg}
                        onMouseOut={closeNavbarOptionLg}
                    >
                        <details>
                            <summary>Thương hiệu</summary>
                        </details>
                        <ul
                            className="menu xl:menu-horizontal bg-base-100"
                            style={{
                                display: 'none',
                                position: "absolute",
                                top: "50px",
                                left: 0,
                                maxWidth: "90vw",
                                maxHeight: "70vh",
                                marginLeft: "15vw",
                                marginRight: "15vw",
                                flexDirection: "row",
                                boxSizing: "border-box",
                                overflowY: "auto",
                                animationName: "popup-ani",
                                animationDuration: "1s",
                                boxShadow: "0px 2px 3px"
                            }}>
                            <div className="w-1/3">
                                <h2 className="uppercase text-lg my-3" style={{
                                    marginInlineStart: "1rem",
                                    paddingInlineStart: "0.5rem"
                                }}>Trending</h2>
                                <ul className="steps steps-vertical">
                                    {topBrandName ? topBrandName.map((brand: string, index: number) => (
                                        <li key={index} className="step uppercase"><a href={`/showroom?brand=${brand}`}>{brand}</a></li>
                                    )) : null}
                                </ul>
                            </div>
                            <div className="w-2/3">
                                <h2 className="uppercase text-center my-3" style={{
                                    marginInlineStart: "1rem",
                                    paddingInlineStart: "0.5rem"
                                }}>Các thương hiệu nước hoa</h2>
                                <div className="flex flex-wrap justify-center">
                                    <button className={`btn btn-square btn-outline m-px h-8 min-h-0 w-20 mr-6 ${letterSort.length ? "" : "btn-active"}`} onClick={resetBrandSort}>All</button>
                                    {alphabet.map((letter) => (
                                        <button key={letter}
                                            onClick={handleSortBrand}
                                            className={`btn btn-square btn-outline m-px w-8 h-8 min-h-0 ${letterSort.includes(letter) ? "btn-active" : ""}`}>
                                            {letter}
                                        </button>
                                    ))}
                                </div>
                                <div className="mt-5">
                                    <ul className="brand-item flex flex-row flex-wrap">
                                        {brands ? brands.map((brand: string, index: number) => (
                                            <li key={index} className="w-1/2 2xl:w-1/3 uppercase mt-1"><a href={`/showroom?brand=${brand}`}>{brand}</a></li>
                                        )) : null}
                                    </ul>
                                </div>
                            </div>
                        </ul>
                    </li>
                    <li className="pesudo-class bg-base-100" style={{ position: "static" }}
                        onMouseOver={openNavbarOptionLg}
                        onMouseOut={closeNavbarOptionLg}>
                        <details>
                            <summary><a href="/showroom">Nước hoa</a></summary>
                        </details>
                        <ul className="menu xl:menu-horizontal bg-base-100 lg:min-w-max w-full"
                            style={{
                                display: 'none',
                                position: "absolute",
                                top: "50px",
                                left: 0,
                                maxWidth: "90vw",
                                maxHeight: "70vh",
                                flexDirection: "row",
                                justifyContent: "space-around",
                                boxSizing: "border-box",
                                animationName: "popup-ani",
                                animationDuration: "1s",
                                boxShadow: "0px 2px 3px",
                                overflow: "auto"
                            }}>
                            {perfumeType ? perfumeType.map((item, index) => (
                                <li key={index} className="uppercase">
                                    <h2 className="removeHoverBG">{item.role}</h2>
                                    {item.type && (
                                        <ul>
                                            {item.type.map((subItem, subIndex) => (
                                                <li key={subIndex} className="uppercase">
                                                    <a href={`/showroom?${item.role}=${subItem}`}>{subItem}</a>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            )) : null}
                        </ul>
                    </li>
                    {/*<li className="pesudo-class relative"
                        onMouseOver={openNavbarOptionLg}
                        onMouseOut={closeNavbarOptionLg}>
                        <details>
                            <summary><a href="/news">Tin tức</a></summary>
                        </details>
                        <ul className="menu xl:menu-horizontal bg-base-100 w-max-[250px]"
                            style={{
                                display: 'none',
                                position: "absolute",
                                top: "50px",
                                left: 0,
                                flexDirection: "column",
                                boxSizing: "border-box",
                                animationName: "popup-ani",
                                animationDuration: "1s",
                                boxShadow: "0px 2px 3px"
                            }}>
                            <li><a>Giới thiệu nước hoa</a></li>
                            <li><a>Kinh nghiệm chọn nước hoa</a></li>
                        </ul>
                    </li>*/}
                    <li><a href="/#contact">Liên hệ</a></li>
                </ul>
            </header>
            <header>
                <div className="drawer">
                    <input id="my-drawer" type="checkbox" className="drawer-toggle hidden" />
                    <div className="drawer-content hidden">
                        <label htmlFor="my-drawer" className="btn btn-primary drawer-button">Open drawer</label>
                    </div>
                    <div className="drawer-side">
                        <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                        <ul className="menu bg-base-100 text-base-content min-h-full w-80 p-4">
                            <li><a href="/" className="uppercase">Trang chủ</a></li>
                            <li><a href="/about" className="uppercase">Về DK</a></li>
                            <li>
                                <details onClick={handleDrawerDropdown}>
                                    <summary className="uppercase">Thương hiệu</summary>
                                </details>
                                <ul className="hidden">
                                    {brandName ? brandName.map((brand: string, index: number) => (
                                        <li key={index} className="uppercase mt-1"><a href={`/showroom?brand=${brand}`}>{brand}</a></li>
                                    )) : null}
                                </ul>
                            </li>
                            <li>
                                <details onClick={handleDrawerDropdown}>
                                    <summary className="uppercase"><a href="/showroom">Perfume</a></summary>
                                </details>
                                <ul className="hidden">
                                    {perfumeType ? perfumeType.map((item, index) => (
                                        <li key={index} className="uppercase">
                                            <details onClick={handleDrawerDropdown}>
                                                <summary className="uppercase">{item.role}</summary>
                                            </details>
                                            {item.type && (
                                                <ul className="hidden">
                                                    {item.type.map((subItem, subIndex) => (
                                                        <li key={subIndex} className="uppercase">
                                                            <a href={`/showroom?${item.role}=${subItem}`}>{subItem}</a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                    )) : null}
                                </ul>
                            </li>
{/*                            <li>
                                <details onClick={handleDrawerDropdown}>
                                    <summary><a href="/news" className="uppercase">Tin tức</a></summary>
                                </details>
                                <ul className="hidden">
                                    <li><a href="/news/review" className="uppercase">Giới thiệu nước hoa</a></li>
                                    <li><a href="/news/tips" className="uppercase">Kinh nghiệm chọn nước hoa</a></li>
                                </ul>
                            </li>*/}
                            <li><a href="/#contact" className="uppercase">Liên hệ</a></li>
                        </ul>
                    </div>
                </div>
            </header>
            <style jsx>{`
                .navbar-option li a:hover,
                .navbar-option li summary:hover {
                    background-color: transparent;
                    color: #E7E7E7
                }
                .removeHoverBG {
                    background-color: transparent;
                    cursor: auto
                }
                .remove-li-before :where(li ul)::before {
                    width: 0px
                }
                .navbar-option .pesudo-class::after {
                    content: '';
                    display: none;
                    position: absolute;
                    bottom: -15px;
                    left: 0;
                    width: 70%;
                    margin-left: 15%;
                    margin-right: 15%;
                    height: 22px;
                }
                .navbar-option li[open] summary::after{
                    transform: rotate(225deg);
                    margin-top: 0;
                }
                .navbar-option .pesudo-class:hover::after {
                    display: block;
                }
                .navbar-option>li {
                    font-weight: bold;
                }
                @keyframes popup-ani {
                  from {
                      opacity: 0;
                  }
                  to {
                      opacity: 1;
                  }
                }
                #header {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 1000;
                }
            `}</style>
        </header>
    )
}

export default Header;