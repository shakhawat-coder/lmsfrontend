"use client";

import React from 'react';
import BookCard, { Book } from '@/components/commonComponents/BookCard';
import { Flame } from 'lucide-react';

const popularBooks: Book[] = [
    {
        id: 201,
        title: "Clean Code",
        author: "Robert C. Martin",
        category: "Technology",
        availability: true,
        coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
    },
    {
        id: 202,
        title: "The Alchemist",
        author: "Paulo Coelho",
        category: "Fiction",
        availability: true,
        coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800",
    },
    {
        id: 203,
        title: "Sapiens",
        author: "Yuval Noah Harari",
        category: "History",
        availability: false,
        coverImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800",
    },
    {
        id: 204,
        title: "The Pragmatic Programmer",
        author: "Andrew Hunt",
        category: "Technology",
        availability: true,
        coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800",
    },
    {
        id: 205,
        title: "Dune",
        author: "Frank Herbert",
        category: "Sci-Fi",
        availability: true,
        coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800",
    },
    {
        id: 206,
        title: "The Psychology of Money",
        author: "Morgan Housel",
        category: "Finance",
        availability: true,
        coverImage: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800",
    },
    {
        id: 207,
        title: "Deep Work",
        author: "Cal Newport",
        category: "Productivity",
        availability: false,
        coverImage: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=800",
    },
    {
        id: 208,
        title: "Man's Search for Meaning",
        author: "Viktor Frankl",
        category: "Psychology",
        availability: true,
        coverImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800",
    }
];

const PopularPage = () => {
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
        </div>
    );
};

export default PopularPage;