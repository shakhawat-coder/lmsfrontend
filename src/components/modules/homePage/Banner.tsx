"use client";

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { motion } from "motion/react";
import { bannerApi, Banner as BannerType } from "@/lib/api";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Link from 'next/link';

// Global cache variable to store banners between component mounts
let cachedBanners: BannerType[] | null = null;

const BannerSkeleton = () => (
    <div className="w-full h-[80vh] lg:min-h-150 relative bg-zinc-950 overflow-hidden">
        {/* Pulsing overlay to mimic the dark banner feel */}
        <div className="absolute inset-0 bg-black/40 animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4 max-w-4xl mx-auto flex flex-col items-center w-full">
                <Skeleton className="h-12 md:h-16 w-3/4 mb-6 bg-white/10" />
                <Skeleton className="h-6 md:h-8 w-1/2 mb-8 bg-white/5" />
                <Skeleton className="h-12 md:h-14 w-40 rounded-full bg-blue-600/20" />
            </div>
        </div>
        {/* Navigation buttons skeleton */}
        <div className="hidden md:flex absolute inset-y-0 left-4 items-center">
            <Skeleton className="h-12 w-12 rounded-full bg-white/5" />
        </div>
        <div className="hidden md:flex absolute inset-y-0 right-4 items-center">
            <Skeleton className="h-12 w-12 rounded-full bg-white/5" />
        </div>
        {/* Pagination dots skeleton */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-3">
            <Skeleton className="h-2 w-8 rounded-full bg-blue-600/30" />
            <Skeleton className="h-2 w-2 rounded-full bg-white/10" />
            <Skeleton className="h-2 w-2 rounded-full bg-white/10" />
        </div>
    </div>
);

const Banner = () => {
    const [banners, setBanners] = useState<BannerType[]>(cachedBanners || []);
    const [isLoading, setIsLoading] = useState(!cachedBanners);

    useEffect(() => {
        // If we already have banners in cache, don't fetch again
        if (cachedBanners) {
            return;
        }

        const fetchBanners = async () => {
            try {
                const res = await bannerApi.getAll(true);
                const data = Array.isArray(res) ? res : (res as any)?.data || [];
                setBanners(data);
                cachedBanners = data; // Store in cache for future renders
            } catch (error) {
                console.error("Failed to fetch banners:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBanners();
    }, []);

    if (isLoading) { 
        return <BannerSkeleton />;
    }

    if (banners.length === 0) {
        return null; // Or show static fallback
    }

    return (
        <div className="w-full h-[80vh] lg:min-h-150 relative group overflow-hidden">
            < Swiper
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