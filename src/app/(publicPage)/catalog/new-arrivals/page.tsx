"use client";

import React from 'react';
import BookCard, { Book } from '@/components/commonComponents/BookCard';
import { Sparkles } from 'lucide-react';

const newArrivals: Book[] = [
    {
        id: 101,
        title: "The Midnight Library",
        author: "Matt Haig",
        category: "Fiction",
        availability: true,
        coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800",
    },
    {
        id: 102,
        title: "Atomic Habits",
        author: "James Clear",
        category: "Self-Help",
        availability: true,
        coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
    },
    {
        id: 103,
        title: "Project Hail Mary",
        author: "Andy Weir",
        category: "Sci-Fi",
        availability: true,
        coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800",
    },
    {
        id: 104,
        title: "Klara and the Sun",
        author: "Kazuo Ishiguro",
        category: "Fiction",
        availability: false,
        coverImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800",
    },
    {
        id: 105,
        title: "Think Again",
        author: "Adam Grant",
        category: "Psychology",
        availability: true,
        coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800",
    },
    {
        id: 106,
        title: "Malibu Rising",
        author: "Taylor Jenkins Reid",
        category: "Fiction",
        availability: true,
        coverImage: "https://images.unsplash.com/photo-1626618012641-bfbca5a31239?auto=format&fit=crop&q=80&w=800",
    }
];

const NewArrivalsPage = () => {
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
        </div>
    );
};

export default NewArrivalsPage;