"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import CategoryCard from '@/components/commonComponents/CategoryCard';
import CategoryCardSkeleton from '@/app/(publicPage)/catalog/categories/CategoryCardSkeleton';
import { categoryApi, Category } from '@/lib/api';
import Link from 'next/link';

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
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryApi.getAll();
                const items = Array.isArray(data) ? data : (data as any).data || [];
                // Sort by book count descending if possible, or just limit to top 6
                setCategories(items.slice(0, 6)); 
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

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
                        <Link href="/catalog/categories" className="group flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                            View All Categories
                            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <CategoryCardSkeleton key={i} />
                        ))}
                    </div>
                ) : (
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
                )}
            </div>
        </section>
    );
};

export default Categories;