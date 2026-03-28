"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
    BookOpen,
    User,
    Tag,
    CheckCircle,
    XCircle,
    ArrowLeft,
    Calendar,
    Hash,
    Globe,
    Info,
    Heart,
    Share2,
    BookMarked,
    Loader2Icon
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { bookApi, borrowingApi, Book } from '@/lib/api';
import BookCard from '@/components/commonComponents/BookCard';

const BookDetailsPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const bookId = id as string;

    const [book, setBook] = useState<Book | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
    const [isBorrowing, setIsBorrowing] = useState(false);

    useEffect(() => {
        // ... unchanged existing effect ...
        const fetchBookAndRelated = async () => {
            try {
                // Fetch the specific book
                const fetchedBook = await bookApi.getById(bookId);
                const actualBook = (fetchedBook as any).data || fetchedBook;
                setBook(actualBook);

                // For related books, we could just fetch all books and filter, or use a specific endpoint
                const allBooksData = await bookApi.getAll();
                const allBooks = Array.isArray(allBooksData) ? allBooksData : (allBooksData as any).data || [];
                
                // Filter books by same category if possible
                const related = allBooks
                    .filter((b: Book) => b.categoryId === actualBook.categoryId && b.id !== actualBook.id)
                    .slice(0, 3);
                
                setRelatedBooks(related);
            } catch (error) {
                console.error("Error fetching book:", error);
                setBook(null);
            } finally {
                setIsLoading(false);
            }
        };

        if (bookId) {
            fetchBookAndRelated();
        }
    }, [bookId]);

    const handleBorrow = async () => {
        if (!book) return;
        setIsBorrowing(true);
        try {
            await borrowingApi.create({ bookId: book.id });
            alert("Book borrowed successfully! Check your dashboard.");
            setBook(prev => prev ? { ...prev, availability: false } : prev);
        } catch (error: any) {
            console.error(error);
            const msg = error.message?.toLowerCase() || '';
            if (msg.includes("unauthorized") || msg.includes("not logged in")) {
                alert("Please log in to borrow books.");
                router.push("/auth/sign-in");
            } else if (msg.includes("active membership")) {
                alert("You need an active membership to borrow books. Please subscribe to a plan.");
                router.push("/dashboard/membership-plans");
            } else {
                alert(error.message || "Failed to borrow book");
            }
        } finally {
            setIsBorrowing(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <Loader2Icon className="h-12 w-12 animate-spin text-primary opacity-50" />
            </div>
        );
    }

    if (!book) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                    <Info className="w-12 h-12 text-gray-400" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Book Not Found</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md text-center">
                    The book you are looking for might have been removed or the ID is incorrect.
                </p>
                <Button onClick={() => router.push('/catalog/book')} className="rounded-full px-8">
                    Back to Catalog
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 py-20">
            <main className="container mx-auto px-4">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
                    {/* Left Column: Image & Quick Actions */}
                    <div className="lg:col-span-5 xl:col-span-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="relative group"
                        >
                            {/* Glass background effect */}
                            <div className="absolute -inset-4 bg-linear-to-tr from-blue-500/10 to-purple-500/10 blur-2xl rounded-[3rem] -z-10" />

                            <div className="aspect-3/4 rounded-[2rem] overflow-hidden shadow-2xl border border-gray-100 dark:border-white/10 relative">
                                <img
                                    src={book.coverImage || '/placeholder-book.png'}
                                    alt={book.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />

                                {/* Availability Badge Overlay */}
                                <div className="absolute top-6 left-6">
                                    <span className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-full backdrop-blur-md shadow-lg ${book.availability ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
                                        {book.availability ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                        {book.availability ? 'Available for Borrowing' : 'Currently Borrowed'}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Book Details */}
                    <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                <span className="px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                                    {book.category?.name || "Uncategorized"}
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-[1.1]">
                                {book.title}
                            </h1>

                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-blue-600">
                                    <User className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Written by</p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">{book.author}</p>
                                </div>
                            </div>

                            <Separator className="my-8" />

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 uppercase font-bold tracking-widest">
                                        <Hash className="w-3 h-3 text-blue-600" /> ISBN
                                    </p>
                                    <p className="text-base font-bold dark:text-gray-200">{book.isbn || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 uppercase font-bold tracking-widest">
                                        <Globe className="w-3 h-3 text-blue-600" /> Language
                                    </p>
                                    <p className="text-base font-bold dark:text-gray-200">{book.language || 'English'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 uppercase font-bold tracking-widest">
                                        <Calendar className="w-3 h-3 text-blue-600" /> Year
                                    </p>
                                    <p className="text-base font-bold dark:text-gray-200">{book.year || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 uppercase font-bold tracking-widest">
                                        <BookOpen className="w-3 h-3 text-blue-600" /> Pages
                                    </p>
                                    <p className="text-base font-bold dark:text-gray-200">{book.pages ? `${book.pages}+` : 'N/A'}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 mb-10">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">About this Book</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                                    {book.description || "Discover a world of possibilities within these pages. This curated selection brings together profound insights and engaging narratives designed to inspire and inform readers of all levels."}
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    size="lg"
                                    onClick={handleBorrow}
                                    disabled={!book.availability || isBorrowing}
                                    className={`h-16 px-10 text-lg font-bold rounded-2xl flex-1 shadow-xl transition-all ${book.availability
                                        ? 'bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98]'
                                        : 'bg-gray-200 text-gray-500 cursor-not-allowed hidden' // hidden if not available or just disabled
                                        }`}
                                >
                                    {isBorrowing ? <Loader2Icon className="w-6 h-6 mr-3 animate-spin" /> : <BookOpen className="w-6 h-6 mr-3" />}
                                    {isBorrowing ? 'Borrowing...' : book.availability ? 'Borrow This Book' : 'Currently Unavailable'}
                                </Button>
                                <Button size="lg" variant="outline" className="h-16 px-10 text-lg font-bold rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-all border-2">
                                    Read Preview
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Related Books Section */}
                {relatedBooks.length > 0 && (
                    <section className="mt-32">
                        <div className="flex items-center justify-between mb-10 pb-4 border-b border-gray-100 dark:border-gray-800">
                            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                                You Might Also <span className="text-blue-600">Like</span>
                            </h2>
                            <Link href="/catalog/book" className="text-blue-600 font-bold hover:underline flex items-center gap-1 text-sm">
                                View all <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {relatedBooks.map((relatedBook, idx) => (
                                <BookCard
                                    key={relatedBook.id}
                                    book={relatedBook}
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0, transition: { delay: idx * 0.1 } }
                                    }}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

// Simple ChevronRight component since I missed it in imports
const ChevronRight = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
    </svg>
);

export default BookDetailsPage;
