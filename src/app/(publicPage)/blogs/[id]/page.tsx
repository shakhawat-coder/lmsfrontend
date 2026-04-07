"use client";

import React, { useEffect, useState } from 'react';
import { blogApi, Blog } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, User, ArrowLeft, Tag, Share2, Facebook, Twitter, Linkedin, Copy, Check, MessageSquareIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const BlogDetailsPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const data = await blogApi.getById(id as string);
                const item = (data as any).data || data;
                setBlog(item);
            } catch (error) {
                console.error("Failed to fetch blog:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchBlog();
    }, [id]);

    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen pt-40 pb-20 flex flex-col items-center justify-center gap-6">
                <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                <p className="font-bold text-gray-400 uppercase tracking-widest text-sm">Opening Journal...</p>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen pt-40 pb-20 text-center flex flex-col items-center justify-center gap-6">
                <MessageSquareIcon className="w-20 h-20 text-gray-200" />
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Article Not Found</h1>
                <p className="text-gray-500 max-w-md mx-auto">The resource you're looking for might have been removed or moved to another location.</p>
                <Button variant="outline" className="rounded-xl px-8" asChild>
                    <Link href="/blogs">Back to Journal</Link>
                </Button>
            </div>
        );
    }

    return (
        <article className="min-h-screen bg-background">
            {/* Minimal Header */}
            <header className="pt-32 pb-16 bg-muted/30 dark:bg-muted/10 border-b border-border">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-12"
                    >
                        <Link 
                            href="/blogs" 
                            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors uppercase tracking-widest"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Return to Journal
                        </Link>
                    </motion.div>

                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                             initial={{ opacity: 0, scale: 0.9 }}
                             animate={{ opacity: 1, scale: 1 }}
                             className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl text-xs font-extrabold uppercase tracking-widest mb-10 border border-blue-500/20 shadow-sm"
                        >
                            <Tag className="w-3.5 h-3.5" />
                            {blog.category}
                        </motion.div>
                        
                        <motion.h1 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-extrabold text-foreground mb-12 tracking-tight leading-tight"
                        >
                            {blog.title}
                        </motion.h1>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm font-bold text-muted-foreground uppercase tracking-widest"
                        >
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-md">
                                    {blog.author.charAt(0)}
                                </div>
                                <div className="text-left">
                                    <p className="text-foreground block font-black">{blog.author}</p>
                                    <p className="text-[10px] opacity-70">Editorial Staff</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Calendar className="w-5 h-5 text-blue-400" />
                                {new Date(blog.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </header>

            {/* Post Content */}
            <div className="container mx-auto px-4 py-20 relative">
                <div className="max-w-4xl mx-auto">
                    {blog.image && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="relative aspect-video rounded-[3rem] overflow-hidden mb-20 shadow-2xl border-8 border-card ring-1 ring-border"
                        >
                            <img 
                                src={blog.image} 
                                alt={blog.title} 
                                className="w-full h-full object-cover" 
                            />
                        </motion.div>
                    )}

                    <div className="flex flex-col lg:flex-row gap-16">
                        {/* Sidebar Share */}
                        <aside className="lg:w-20 order-2 lg:order-1 sticky top-32 h-fit">
                            <div className="flex lg:flex-col gap-4 justify-center">
                                <Button variant="outline" size="icon" className="w-12 h-12 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm border-border">
                                    <Facebook className="w-5 h-5" />
                                </Button>
                                <Button variant="outline" size="icon" className="w-12 h-12 rounded-2xl hover:bg-blue-400 hover:text-white transition-all shadow-sm border-border">
                                    <Twitter className="w-5 h-5" />
                                </Button>
                                <Button variant="outline" size="icon" className="w-12 h-12 rounded-2xl hover:bg-blue-700 hover:text-white transition-all shadow-sm border-border">
                                    <Linkedin className="w-5 h-5" />
                                </Button>
                                <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="w-12 h-12 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm border-border relative"
                                    onClick={handleCopy}
                                >
                                    <AnimatePresence mode="wait">
                                        {copied ? (
                                            <motion.div key="check" initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }}>
                                                <Check className="w-5 h-5" />
                                            </motion.div>
                                        ) : (
                                            <motion.div key="copy" initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }}>
                                                <Copy className="w-5 h-5" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </Button>
                            </div>
                        </aside>

                        {/* Article Text */}
                        <div className="flex-1 order-1 lg:order-2">
                             <div 
                                className="prose prose-blue dark:prose-invert prose-lg max-w-none text-foreground/80 font-medium leading-relaxed
                                    prose-headings:font-extrabold prose-headings:text-foreground prose-headings:tracking-tight
                                    prose-p:mb-8 prose-p:leading-[1.8] prose-p:text-lg
                                    prose-strong:text-foreground prose-strong:font-black
                                    prose-img:rounded-3xl prose-img:shadow-xl
                                    prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:bg-blue-500/10 dark:prose-blockquote:bg-blue-900/20 prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:rounded-r-3xl prose-blockquote:italic"
                                dangerouslySetInnerHTML={{ __html: blog.content }} 
                            />
                            
                            <div className="mt-20 pt-16 border-t border-border flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                     <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Share this story:</span>
                                </div>
                                <div className="flex gap-2">
                                     <span className="px-5 py-2 bg-muted/50 rounded-full text-xs font-bold text-muted-foreground uppercase tracking-widest border border-border cursor-default">
                                         # {blog.category.toLowerCase().replace(/\s+/g, '')}
                                     </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA / Footer Suggestion */}
            <section className="py-32 bg-gray-950 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>
                
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-8 tracking-tight">Stay updated with our <span className="text-blue-500">latest stories</span></h2>
                    <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-medium">Join our growing community of readers and never miss an update from BookNest.</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button className="rounded-2xl h-14 px-8 text-lg font-bold bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/20" asChild>
                            <Link href="/">Back to Home</Link>
                        </Button>
                        <Button variant="outline" className="rounded-2xl h-14 px-8 text-lg font-bold border-white/20 hover:bg-white/10" asChild>
                            <Link href="/blogs">Explore more articles</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </article>
    );
};

export default BlogDetailsPage;
