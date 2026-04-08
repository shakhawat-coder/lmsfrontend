"use client";

import React, { useEffect, useState } from 'react';
import CategoryCard from '@/components/commonComponents/CategoryCard';
import { categoryApi, bookApi, Category } from '@/lib/api';
import CategoryCardSkeleton from './CategoryCardSkeleton';

const CategoriesPage = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const [catData, bookData] = await Promise.all([
                    categoryApi.getAll(),
                    bookApi.getAll({ limit: 1000 }),
                ]);

                const items: Category[] = Array.isArray(catData) ? catData : (catData as any).data || [];
                const books: any[] = Array.isArray(bookData) ? bookData : (bookData as any).data || [];

                // Build a Set of categoryIds that have at least one book
                const categoryIdsWithBooks = new Set(books.map((b: any) => b.categoryId));

                // Keep categories that either have books in their nested array
                // OR appear in the cross-referenced books list
                const withBooks = items.filter(cat =>
                    (cat.books && cat.books.length > 0) ||
                    categoryIdsWithBooks.has(cat.id)
                );

                setCategories(withBooks);
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <CategoryCardSkeleton key={i} />
                    ))}
                </div>
            ) : categories.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                    No categories found.
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
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
        </div>
    );
};

export default CategoriesPage;