"use client";

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import CategoryCard from '@/components/commonComponents/CategoryCard';

const categories = [
    {
        id: 1,
        name: "Fiction",
        bookCount: 1240,
        image: "/fiction.jpg",
    },
    {
        id: 2,
        name: "Science & Technology",
        bookCount: 850,
        image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=2070&auto=format&fit=crop",
    },
    {
        id: 3,
        name: "History & Biography",
        bookCount: 632,
        image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=2074&auto=format&fit=crop",
    },
    {
        id: 4,
        name: "Arts & Photography",
        bookCount: 420,
        image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=2080&auto=format&fit=crop",
    },
    {
        id: 5,
        name: "Business & Finance",
        bookCount: 512,
        image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2071&auto=format&fit=crop",
    },
    {
        id: 6,
        name: "Self-Help & Wellness",
        bookCount: 965,
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2002&auto=format&fit=crop",
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            delayChildren: 0.2,
            staggerChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring" as const, stiffness: 100, damping: 15 }
    }
};

const Categories = () => {
    return (
        <section className="w-full py-20 bg-gray-50 dark:bg-gray-900 overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
                            Explore Top Categories
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Discover thousands of books across multiple disciplines. Find your next great read by browsing our extensive collections.
                        </p>
                    </div>

                    <div className="mt-6 md:mt-0">
                        <button className="group flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                            View All Categories
                            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                >
                    {categories.map((category) => (
                        <CategoryCard key={category.id} category={category} variants={itemVariants} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Categories;