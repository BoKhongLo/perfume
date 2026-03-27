"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';

import { Autoplay, EffectFade } from 'swiper/modules';

export default function Carousel () {
    return (
        <div className="relative h-screen w-full overflow-hidden">
            <div className="top-[30%] h-[60%] absolute z-20 block flex w-full flex-col text-center">
                <h2 className="dancingScript text-8xl">Perfume</h2>
                <p className="text-3xl inline hidden lg:block expand-background">“Pefume : For the Modern Gentleman and the Elegant Lady”</p>
                <div className="flex-1"></div>
                <p className="w-full m-auto font-semibold hidden lg:block expand-background" ><span className="w-[80%] m-auto block">Discover the captivating world of Pèume, where every fragrance is crafted to embody the perfect blend of sophistication and allure.</span></p>
                <a href="/showroom"><button className="btn glass w-1/5 min-w-[150px] h-[60px] m-auto mt-3">DISCOVER</button></a>
            </div>
            <Swiper
                className="h-full"
                modules={[Autoplay, EffectFade]}
                spaceBetween={0}
                slidesPerView={1}
                effect="fade"
                speed={2000}
                autoplay={{
                    delay: 10000,
                    disableOnInteraction: false,
                }}
                allowTouchMove={true}
            >
                <SwiperSlide>
                    <img src="images/C2.jpg" alt="Slide 1" style={{ width: '100%', height: '100%', objectFit: "cover" }} />
                </SwiperSlide>
                <SwiperSlide>
                    <img src="images/C4.jpg" alt="Slide 2" style={{ width: '100%', height: '100%', objectFit: "cover" }} />
                </SwiperSlide>
                <SwiperSlide>
                    <img src="images/C5.jpg" alt="Slide 3" style={{ width: '100%', height: '100%', objectFit: "cover" }} />
                </SwiperSlide>
            </Swiper>
        </div>
    );
};
