"use client";

import React from 'react';
import CategoryCard, { Category } from '@/components/commonComponents/CategoryCard';

const mockCategories: Category[] = [
    {
        id: 1,
        name: "Fiction",
        bookCount: 1250,
        image: "https://images.unsplash.com/photo-1474933148563-f9ed4151bc29?auto=format&fit=crop&q=80&w=800",
    },
    {
        id: 2,
        name: "Science",
        bookCount: 840,
        image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=800",
    },
    {
        id: 3,
        name: "Technology",
        bookCount: 2100,
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
    },
    {
        id: 4,
        name: "History",
        bookCount: 620,
        image: "https://images.unsplash.com/photo-1447069387593-a5de0862481e?auto=format&fit=crop&q=80&w=800",
    },
    {
        id: 5,
        name: "Biography",
        bookCount: 450,
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800",
    },
    {
        id: 6,
        name: "Non-Fiction",
        bookCount: 980,
        image: "https://images.unsplash.com/photo-1491843351663-7304c9af659c?auto=format&fit=crop&q=80&w=800",
    },
    {
        id: 7,
        name: "Mystery",
        bookCount: 730,
        image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800",
    },
    {
        id: 8,
        name: "Romance",
        bookCount: 560,
        image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&q=80&w=800",
    }
];

const CategoriesPage = () => {
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                {mockCategories.map((category, idx) => (
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
                    <button className="px-8 py-3.5 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold rounded-2xl border border-gray-200 dark:border-gray-700 transition-all shadow-sm hover:scale-105 active:scale-95">
                        Browse All Books
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CategoriesPage;