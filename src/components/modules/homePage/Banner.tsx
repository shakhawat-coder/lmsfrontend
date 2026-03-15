"use client";

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { motion } from "motion/react";

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const slidesData = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop",
        title: "Unlock Your Potential",
        subtitle: "Learn from the best instructors around the globe and build your future.",
        buttonText: "Get Started",
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop",
        title: "Master New Skills",
        subtitle: "Explore thousands of courses in tech, business, arts, and more.",
        buttonText: "Browse Courses",
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop",
        title: "Achieve Your Goals",
        subtitle: "Join a community of learners and advance your career today.",
        buttonText: "Join Now",
    }
];

const Banner = () => {
    return (
        <div className="w-full h-[80vh] min-h-150 relative group overflow-hidden">
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
                {slidesData.map((slide) => (
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
                                                    <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-lg transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                                                        {slide.buttonText}
                                                    </button>
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