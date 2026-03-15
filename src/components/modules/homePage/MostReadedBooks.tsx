"use client";

import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, User, Tag, CheckCircle, XCircle } from 'lucide-react';

const booksData = [
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
                        <motion.div
                            key={book.id}
                            variants={itemVariants}
                            className="group flex flex-col bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-gray-100 dark:border-gray-800 transition-all duration-300"
                        >
                            {/* Book Cover Container */}
                            <div className="relative h-72 sm:h-80 overflow-hidden bg-gray-100 dark:bg-gray-800">
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                                    style={{ backgroundImage: `url(${book.coverImage})` }}
                                />
                                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
                                
                                {/* Availability Badge Over Image */}
                                <div className="absolute top-4 right-4">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full backdrop-blur-md shadow-sm ${book.availability ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
                                        {book.availability ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                        {book.availability ? 'Available' : 'Borrowed'}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Book Info */}
                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {book.title}
                                </h3>
                                
                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm font-medium">
                                        <User className="w-4 h-4 mr-2.5 text-gray-400" />
                                        <span className="truncate">{book.author}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm font-medium">
                                        <Tag className="w-4 h-4 mr-2.5 text-gray-400" />
                                        <span>{book.category}</span>
                                    </div>
                                </div>
                                
                                <div className="mt-auto">
                                    <button 
                                        disabled={!book.availability}
                                        className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all duration-300 ${
                                            book.availability 
                                            ? 'bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white border-2 border-transparent hover:shadow-[0_8px_16px_rgba(37,99,235,0.2)] dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white' 
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500'
                                        }`}
                                    >
                                        <BookOpen className="w-5 h-5" />
                                        {book.availability ? 'Borrow Book' : 'Not Available'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default MostReadedBooks;