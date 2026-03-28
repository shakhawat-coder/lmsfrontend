"use client";

import React, { useEffect, useState } from 'react';
import CategoryCard from '@/components/commonComponents/CategoryCard';
import { categoryApi, Category } from '@/lib/api';
import { Loader2Icon } from 'lucide-react';
import Link from 'next/link';

const CategoriesPage = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryApi.getAll();
                const items = Array.isArray(data) ? data : (data as any).data || [];
                setCategories(items);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8 lg:py-16 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="max-w-3xl mb-12 sm:mb-16">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
                    Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Categories</span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                    Discover your next favorite read through our carefully curated categories. From high-stakes fiction to insightful biographies, find the perfect genre for your journey.
                </p>
            </div>

            {/* Category Grid */}
            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2Icon className="h-10 w-10 animate-spin text-primary opacity-50" />
                </div>
            ) : categories.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                    No categories found.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                    {categories.map((category, idx) => (
                        <CategoryCard 
                            key={category.id} 
                            category={category} 
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                visible: { opacity: 1, y: 0, transition: { delay: idx * 0.1, duration: 0.5 } }
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Call to Action Section */}
            <div className="mt-20 p-8 sm:p-12 rounded-[2.5rem] bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl opacity-50" />
                
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 relative z-10">
                    Can't find a specific category?
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8 relative z-10 max-w-xl mx-auto">
                    We're constantly expanding our collection and adding more genres to our library every single day.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
                    <button className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/25 hover:scale-105 active:scale-95">
                        Request a Category
                    </button>
                    <Link href="/catalog/all" className="px-8 py-3.5 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold rounded-2xl border border-gray-200 dark:border-gray-700 transition-all shadow-sm hover:scale-105 active:scale-95">
                        Browse All Books
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CategoriesPage;