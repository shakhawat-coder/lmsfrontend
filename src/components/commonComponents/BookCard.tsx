"use client";

import React from 'react';
import { motion, Variants } from 'motion/react';
import { BookOpen, User, Tag, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { Book } from '@/lib/api';

export interface BookCardProps {
    book: Book;
    variants?: Variants;
}

const BookCard: React.FC<BookCardProps> = ({ book, variants }) => {
    return (
        <motion.div
            variants={variants}
            className="group flex flex-col bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-gray-100 dark:border-gray-800 transition-all duration-300 h-full"
        >
            {/* Book Cover Container */}
            <Link href={`/catalog/book/${book.id}`} className="block relative h-48 xs:h-60 sm:h-72 md:h-80 overflow-hidden bg-gray-100 dark:bg-gray-800">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{ backgroundImage: `url(${book.coverImage || '/placeholder-book.png'})` }}
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
                
                {/* Availability Badge Over Image */}
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-bold rounded-full backdrop-blur-md shadow-sm ${book.availability ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
                        {book.availability ? <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" /> : <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />}
                        <span className="hidden xs:inline">{book.availability ? 'Available' : 'Borrowed'}</span>
                        <span className="xs:hidden">{book.availability ? 'Available' : 'Borrowed'}</span>
                    </span>
                </div>
            </Link>
            
            {/* Book Info */}
            <div className="p-3 sm:p-4 md:p-6 flex flex-col flex-grow">
                <Link href={`/catalog/book/${book.id}`}>
                    <h3 className="text-sm sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 md:mb-3 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {book.title}
                    </h3>
                </Link>
                
                <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4 md:mb-6">
                    <div className="flex items-center text-gray-600 dark:text-gray-400 text-[10px] sm:text-xs md:text-sm font-medium">
                        <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2.5 text-gray-400" />
                        <span className="truncate">{book.author}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400 text-[10px] sm:text-xs md:text-sm font-medium">
                        <Tag className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2.5 text-gray-400" />
                        <span>{book.category?.name || "Uncategorized"}</span>
                    </div>
                </div>
                
                <div className="mt-auto">
                    <Link 
                        href={`/catalog/book/${book.id}`}
                        aria-disabled={!book.availability}
                        className={`w-full py-2 md:py-3 rounded-lg md:rounded-xl flex items-center justify-center gap-1.5 md:gap-2 text-[10px] sm:text-xs md:text-sm font-bold transition-all duration-300 ${
                            book.availability 
                            ? 'bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white border-2 border-transparent hover:shadow-[0_8px_16px_rgba(37,99,235,0.2)] dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white pointer-events-auto' 
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500 pointer-events-none'
                        }`}
                    >
                        <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                        <span className="hidden xs:inline">{book.availability ? 'Borrow Book' : 'Not Available'}</span>
                        <span className="xs:hidden">{book.availability ? 'Borrow' : 'Empty'}</span>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default BookCard;

