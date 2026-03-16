"use client";

import React from 'react';
import { motion, Variants } from 'motion/react';
import { BookOpen, User, Tag, CheckCircle, XCircle } from 'lucide-react';

export interface Book {
    id: number;
    title: string;
    author: string;
    category: string;
    availability: boolean;
    coverImage: string;
}

export interface BookCardProps {
    book: Book;
    variants?: Variants;
}

const BookCard: React.FC<BookCardProps> = ({ book, variants }) => {
    return (
        <motion.div
            variants={variants}
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
    );
};

export default BookCard;
