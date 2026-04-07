"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import BookCard from '@/components/commonComponents/BookCard';
import { bookApi, Book } from '@/lib/api';
import BookCardSkeleton from '@/components/commonComponents/BookCardSkeleton';

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
    const [books, setBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const data = await bookApi.getAll();
                const items = Array.isArray(data) ? data : (data as any).data || [];
                setBooks(items.slice(0, 4));
            } catch (error) {
                console.error("Failed to fetch books:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBooks();
    }, []);

    return (
        <section className="w-full py-20 bg-background overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
                            Most Read Books
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Discover the books that our community can't put down. Uncover trending titles and dive into your next great adventure.
                        </p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 min-h-[400px]">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <BookCardSkeleton key={i} />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
                    >
                        {books.map((book) => (
                            <BookCard key={book.id} book={book} variants={itemVariants} />
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default MostReadedBooks;