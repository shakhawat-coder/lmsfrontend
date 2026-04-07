"use client";

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { motion } from "motion/react";
import { bannerApi, Banner as BannerType } from "@/lib/api";
import { useState, useEffect } from "react";
import { Loader2Icon } from "lucide-react";

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Link from 'next/link';

const Banner = () => {
    const [banners, setBanners] = useState<BannerType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await bannerApi.getAll(true);
                setBanners(Array.isArray(res) ? res : (res as any)?.data || []);
            } catch (error) {
                console.error("Failed to fetch banners:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBanners();
    }, []);

    if (isLoading) { 
        return (
            <div className="w-full h-[80vh] min-h-150 flex items-center justify-center bg-gray-900">
                <Loader2Icon className="h-10 w-10 animate-spin text-blue-500 opacity-50" />
            </div>
        );
    }

    if (banners.length === 0) {
        return null; // Or show static fallback
    }

    return (
        <div className="w-full h-[80vh] lg:min-h-150 relative group overflow-hidden">
            <Swiper
                spaceBetween={0}
                effect={'fade'}
                navigation={true}
                pagination={{
                    clickable: true,
                }}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                modules={[Autoplay, EffectFade, Navigation, Pagination]}
                className="mySwiper w-full h-full"
            >
                {banners.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        {({ isActive }) => (
                            <div className="relative w-full h-full">
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-6000 ease-out"
                                    style={{
                                        backgroundImage: `url(${slide.image})`,
                                        transform: isActive ? 'scale(1.05)' : 'scale(1)'
                                    }}
                                />
                                <div className="absolute inset-0 bg-black/50" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
                                        {isActive && (
                                            <>
                                                <motion.h1
                                                    initial={{ opacity: 0, y: 30 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                                                    className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-md"
                                                >
                                                    {slide.title}
                                                </motion.h1>
                                                <motion.p
                                                    initial={{ opacity: 0, y: 30 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
                                                    className="text-lg md:text-2xl text-gray-200 mb-8 max-w-2xl drop-shadow-sm"
                                                >
                                                    {slide.subtitle}
                                                </motion.p>
                                                <motion.div
                                                    initial={{ opacity: 0, y: 30 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.7 }}
                                                >
                                                    <Link href={slide.buttonLink} className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-lg transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                                                        {slide.buttonText}
                                                    </Link>
                                                </motion.div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </SwiperSlide>
                ))}
            </Swiper>

            <style dangerouslySetInnerHTML={{
                __html: `
                .swiper-button-next,
                .swiper-button-prev {
                    color: rgba(255, 255, 255, 0.8) !important;
                    transition: all 0.3s ease;
                    background: rgba(0, 0, 0, 0.2);
                    width: 50px !important;
                    height: 50px !important;
                    border-radius: 50%;
                    backdrop-filter: blur(4px);
                }
                    .swiper-button-next svg,
                .swiper-button-prev svg {
                    width: 20px !important;
                    height: 20px !important;
                }
                .swiper-button-next:after,
                .swiper-button-prev:after {
                    font-size: 15px !important;
                }
                .swiper-button-next:hover,
                .swiper-button-prev:hover {
                    color: white !important;
                    background: rgba(37, 99, 235, 0.8);
                }
                .swiper-pagination-bullet {
                    background: white !important;
                    opacity: 0.5;
                    width: 10px;
                    height: 10px;
                    transition: all 0.3s ease;
                }
                .swiper-pagination-bullet-active {
                    opacity: 1;
                    width: 30px;
                    border-radius: 8px;
                    background: #2563eb !important;
                }
            `}} />
        </div>
    );
};

export default Banner;