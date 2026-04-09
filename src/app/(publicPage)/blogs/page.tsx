"use client";

import React, { useEffect, useState } from 'react';
import { blogApi, Blog } from '@/lib/api';
import Link from 'next/link';
import { Calendar, User, ArrowRight, Tag, BookOpen, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

const BlogsPage = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const data = await blogApi.getPublished();
                const items = Array.isArray(data) ? data : (data as any).data || [];
                setBlogs(items);
            } catch (error) {
                console.error("Failed to fetch blogs:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background animate-pulse">
                {/* Header Skeleton */}
                <section className="pt-32 pb-20 bg-background border-b border-border">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl space-y-6">
                            <div className="h-6 w-32 bg-muted rounded-full" />
                            <div className="h-16 md:h-20 w-3/4 bg-muted rounded-3xl" />
                            <div className="h-8 w-2/3 bg-muted rounded-xl" />
                            <div className="h-8 w-1/2 bg-muted rounded-xl" />
                        </div>
                    </div>
                </section>

                {/* Grid Skeleton */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="bg-card rounded-3xl overflow-hidden border border-border h-[500px] flex flex-col">
                                    <div className="h-64 bg-muted w-full" />
                                    <div className="p-10 flex flex-col flex-1 space-y-6">
                                        <div className="h-4 w-32 bg-muted rounded-full" />
                                        <div className="h-8 w-full bg-muted rounded-xl" />
                                        <div className="h-8 w-3/4 bg-muted rounded-xl" />
                                        <div className="h-4 w-full bg-muted rounded-md mt-auto" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header Section */}
            <section className="pt-32 pb-20 bg-background border-b border-border">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl">

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-extrabold text-foreground mb-8 tracking-tight"
                        >
                            News & <span className="text-blue-600 dark:text-blue-400">Insights</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl leading-relaxed"
                        >
                            Your daily destination for library news, author interviews, and expertly curated reading recommendations.
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Grid Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    {blogs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center gap-4 opacity-50">
                            <Tag className="w-16 h-16 text-muted-foreground/30" />
                            <h3 className="text-2xl font-bold text-foreground">No Articles Yet</h3>
                            <p className="text-muted-foreground">Check back later for new stories and updates from our library.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {blogs.map((blog, idx) => (
                                <motion.div
                                    key={blog.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group bg-card rounded-3xl overflow-hidden border border-border shadow-sm hover:shadow-2xl transition-all duration-500 h-full flex flex-col"
                                >
                                    <Link href={`/blogs/${blog.id}`} className="block h-64 relative overflow-hidden">
                                        {blog.image ? (
                                            <img
                                                src={blog.image}
                                                alt={blog.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-blue-50 flex items-center justify-center">
                                                <BookOpen className="w-12 h-12 text-blue-200" />
                                            </div>
                                        )}
                                        <div className="absolute top-6 right-6">
                                            <span className="px-4 py-1.5 bg-background/90 backdrop-blur-md text-blue-600 dark:text-blue-400 text-xs font-extrabold rounded-xl shadow-lg border border-border uppercase tracking-widest">
                                                {blog.category}
                                            </span>
                                        </div>
                                    </Link>

                                    <div className="p-10 flex flex-col flex-1">
                                        <div className="flex items-center gap-6 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-blue-300" />
                                                {new Date(blog.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-blue-300" />
                                                {blog.author}
                                            </div>
                                        </div>

                                        <h2 className="text-2xl font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-6 leading-snug">
                                            <Link href={`/blogs/${blog.id}`}>{blog.title}</Link>
                                        </h2>

                                        <p className="text-muted-foreground line-clamp-3 mb-8 font-medium leading-relaxed">
                                            {blog.content.replace(/<[^>]*>/g, '')}
                                        </p>

                                        <div className="mt-auto pt-8 border-t border-border flex items-center justify-between">
                                            <Link
                                                href={`/blogs/${blog.id}`}
                                                className="inline-flex items-center gap-2 font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                                            >
                                                Read full story
                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default BlogsPage;
