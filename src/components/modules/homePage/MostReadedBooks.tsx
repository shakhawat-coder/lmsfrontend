"use client";

import React from 'react';
import { motion } from 'motion/react';
import BookCard from '@/components/commonComponents/BookCard';
import { Book } from '@/lib/mockData';

const booksData: Book[] = [
    {
        id: 1,
        title: "The Midnight Library",
        author: "Matt Haig",
        category: "Fiction",
        availability: true,
        coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1887&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "Atomic Habits",
        author: "James Clear",
        category: "Self-Help",
        availability: true,
        coverImage: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2112&auto=format&fit=crop"
    },
    {
        id: 3,
        title: "Sapiens: A Brief History",
        author: "Yuval Noah Harari",
        category: "History",
        availability: false,
        coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1974&auto=format&fit=crop"
    },
    {
        id: 4,
        title: "Dune",
        author: "Frank Herbert",
        category: "Science Fiction",
        availability: true,
        coverImage: "https://images.unsplash.com/photo-1614546377218-c0bbae0c7be6?q=80&w=2080&auto=format&fit=crop"
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            delayChildren: 0.2,
            staggerChildren: 0.15
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring" as const, stiffness: 100, damping: 15 }
    }
};

const MostReadedBooks = () => {
    return (
        <section className="w-full py-20 bg-white dark:bg-black overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
                            Most Read Books
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Discover the books that our community can't put down. Uncover trending titles and dive into your next great adventure.
                        </p>
                    </div>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
                >
                    {booksData.map((book) => (
                        <BookCard key={book.id} book={book} variants={itemVariants} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default MostReadedBooks;