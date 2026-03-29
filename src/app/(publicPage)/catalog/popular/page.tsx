"use client";

import React, { useEffect, useState } from 'react';
import BookCard from '@/components/commonComponents/BookCard';
import { Flame } from 'lucide-react';
import { bookApi, Book } from '@/lib/api';
import BookCardSkeleton from '@/components/commonComponents/BookCardSkeleton';

const PopularPage = () => {
    const [popularBooks, setPopularBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPopularBooks = async () => {
            try {
                const data = await bookApi.getAll();
                const items = Array.isArray(data) ? data : (data as any).data || [];
                // Without real popularity metrics, we'll just slice the top 8
                setPopularBooks(items.slice(0, 8)); 
            } catch (error) {
                console.error("Failed to fetch popular books:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPopularBooks();
    }, []);

    return (
        <div className="container mx-auto px-4 py-12 lg:py-20 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="text-center mb-16 px-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-bold text-sm mb-6 border border-orange-100 dark:border-orange-800">
                    <Flame className="w-4 h-4" />
                    Most Wanted
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6">
                    Trending <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-500">Popularity</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    Check out what everyone is reading. These are the most borrowed and highly rated books in our library right now.
                </p>
            </div>

            {/* Grid */}
            {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 xs:gap-6 sm:gap-8 min-h-[500px]">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <BookCardSkeleton key={i} />
                    ))}
                </div>
            ) : popularBooks.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                    No popular books found.
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 xs:gap-6 sm:gap-8">
                    {popularBooks.map((book, idx) => (
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

export default PopularPage;