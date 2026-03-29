"use client";

import React, { useEffect, useState } from 'react';
import BookCard from '@/components/commonComponents/BookCard';
import { Sparkles } from 'lucide-react';
import { bookApi, Book } from '@/lib/api';
import BookCardSkeleton from '@/components/commonComponents/BookCardSkeleton';

const NewArrivalsPage = () => {
    const [newArrivals, setNewArrivals] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNewArrivals = async () => {
            try {
                const data = await bookApi.getAll();
                const items = Array.isArray(data) ? data : (data as any).data || [];
                // Sorting by createdAt assuming newer first
                const sorted = items.sort((a: Book, b: Book) => 
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setNewArrivals(sorted.slice(0, 8)); // Top 8 new arrivals
            } catch (error) {
                console.error("Failed to fetch new arrivals:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNewArrivals();
    }, []);

    return (
        <div className="container mx-auto px-4 py-12 lg:py-20 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="text-center mb-16 px-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-sm mb-6 border border-blue-100 dark:border-blue-800">
                    <Sparkles className="w-4 h-4" />
                    Just Landed
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6">
                    New <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Arrivals</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    Be the first to explore our latest additions. From fresh bestsellers to new academic resources, discover what just arrived on our shelves.
                </p>
            </div>

            {/* Grid */}
            {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 xs:gap-6 sm:gap-8 min-h-[500px]">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <BookCardSkeleton key={i} />
                    ))}
                </div>
            ) : newArrivals.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                    No new arrivals found.
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 xs:gap-6 sm:gap-8">
                    {newArrivals.map((book, idx) => (
                        <BookCard 
                            key={book.id} 
                            book={book} 
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0, transition: { delay: idx * 0.1, duration: 0.5 } }
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default NewArrivalsPage;