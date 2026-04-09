"use client";

import React, { useEffect, useState } from 'react';
import { blogApi, Blog } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, User, ArrowLeft, ArrowRight, Tag, Share2, Facebook, Twitter, Linkedin, Copy, Check, MessageSquareIcon, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const BlogDetailsPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [randomBlogs, setRandomBlogs] = useState<Blog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await blogApi.getById(id as string);
                const item = (data as any).data || data;
                setBlog(item);

                // Fetch other published blogs for the "Read More" section
                const allData = await blogApi.getPublished();
                const allBlogs = Array.isArray(allData) ? allData : (allData as any).data || [];
                
                // Exclude current blog and pick 3 random
                const filtered = allBlogs.filter((b: Blog) => b.id !== item.id);
                const shuffled = filtered.sort(() => 0.5 - Math.random());
                setRandomBlogs(shuffled.slice(0, 3));
            } catch (error) {
                console.error("Failed to fetch blog:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchData();
    }, [id]);

    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background animate-pulse">
                {/* Header Skeleton */}
                <div className="h-[80vh] bg-muted w-full relative">
                    <div className="absolute inset-0 flex flex-col items-center justify-center px-4 space-y-6">
                        <div className="h-8 w-24 bg-muted-foreground/20 rounded-full" />
                        <div className="h-16 md:h-24 w-3/4 max-w-4xl bg-muted-foreground/20 rounded-3xl" />
                        <div className="flex gap-4">
                            <div className="h-12 w-48 bg-muted-foreground/20 rounded-full" />
                            <div className="h-12 w-48 bg-muted-foreground/20 rounded-full" />
                        </div>
                    </div>
                </div>

                {/* Content Skeleton */}
                <div className="container mx-auto px-4 py-20 max-w-4xl">
                    <div className="space-y-6">
                        <div className="h-6 w-full bg-muted rounded-xl" />
                        <div className="h-6 w-11/12 bg-muted rounded-xl" />
                        <div className="h-6 w-10/12 bg-muted rounded-xl" />
                        <div className="h-6 w-full bg-muted rounded-xl" />
                        <div className="h-6 w-9/12 bg-muted rounded-xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen pt-40 pb-20 text-center flex flex-col items-center justify-center gap-6">
                <MessageSquareIcon className="w-20 h-20 text-muted-foreground/30" />
                <h1 className="text-4xl font-extrabold text-foreground tracking-tight">Article Not Found</h1>
                <p className="text-muted-foreground max-w-md mx-auto">The resource you're looking for might have been removed or moved to another location.</p>
                <Button variant="outline" className="rounded-xl px-8" asChild>
                    <Link href="/blogs">Back to Journal</Link>
                </Button>
            </div>
        );
    }

    return (
        <article className="min-h-screen bg-background">
            {/* Immersive Hero Header */}
            <header className="relative min-h-[80vh] max-h-[90vh] flex flex-col items-center justify-center overflow-hidden border-b border-border">
                {/* Background Image / Blur */}
                <div 
                    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: blog.image ? `url(${blog.image})` : "none",
                        filter: "brightness(0.4)"
                    }}
                >
                    {!blog.image && (
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-indigo-900 z-0" />
                    )}
                </div>

                <div className="container relative z-10 mx-auto px-4 text-center text-white max-w-4xl pt-10">
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-8 hidden md:block"
                    >
                        <Link 
                            href="/blogs" 
                            className="inline-flex items-center gap-2 text-sm font-bold text-blue-300 hover:text-white transition-colors uppercase tracking-widest"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Return to Journal
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-5 py-2 bg-white/20 backdrop-blur-md text-white rounded-full text-xs font-extrabold uppercase tracking-widest mb-8 border border-white/30 shadow-sm"
                    >
                        <Tag className="w-4 h-4" />
                        {blog.category}
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl lg:text-7xl font-bold mb-10 tracking-tight leading-[1.1]"
                    >
                        {blog.title}
                    </motion.h1>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap items-center justify-center gap-6 sm:gap-12"
                    >
                        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm pr-6 pl-2 py-2 rounded-full border border-white/20 shadow-sm">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-md">
                                {blog.author.charAt(0)}
                            </div>
                            <div className="text-left leading-tight text-white">
                                <p className="text-sm font-black">{blog.author}</p>
                                <p className="text-xs text-white/70 font-semibold uppercase tracking-wider">Editorial Staff</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm font-bold text-white uppercase tracking-widest bg-white/10 backdrop-blur-sm px-6 py-4 rounded-full border border-white/20 shadow-sm">
                            <Calendar className="w-5 h-5 text-blue-300" />
                            {new Date(blog.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* Post Content */}
            <div className="container mx-auto px-4 py-16 lg:py-24 relative">
                <div className="max-w-4xl mx-auto">

                    <div className="flex flex-col lg:flex-row gap-16">
                        {/* Sidebar Share */}
                        <aside className="lg:w-20 order-2 lg:order-1 sticky top-32 h-fit hidden sm:block">
                            <div className="flex lg:flex-col gap-4 justify-center">
                                <Button variant="outline" size="icon" className="w-12 h-12 rounded-2xl hover:bg-[#1877F2] hover:text-white transition-all shadow-sm border-border hover:border-[#1877F2]">
                                    <Facebook className="w-5 h-5" />
                                </Button>
                                <Button variant="outline" size="icon" className="w-12 h-12 rounded-2xl hover:bg-[#1DA1F2] hover:text-white transition-all shadow-sm border-border hover:border-[#1DA1F2]">
                                    <Twitter className="w-5 h-5" />
                                </Button>
                                <Button variant="outline" size="icon" className="w-12 h-12 rounded-2xl hover:bg-[#0A66C2] hover:text-white transition-all shadow-sm border-border hover:border-[#0A66C2]">
                                    <Linkedin className="w-5 h-5" />
                                </Button>
                                <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="w-12 h-12 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm border-border relative overflow-hidden group"
                                    onClick={handleCopy}
                                >
                                    <AnimatePresence mode="wait">
                                        {copied ? (
                                            <motion.div key="check" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
                                                <Check className="w-5 h-5" />
                                            </motion.div>
                                        ) : (
                                            <motion.div key="copy" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} className="group-hover:scale-110 transition-transform">
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
                                className="prose prose-slate dark:prose-invert prose-lg md:prose-xl max-w-none text-foreground/80 font-medium leading-relaxed
                                    prose-headings:font-extrabold prose-headings:text-foreground prose-headings:tracking-tight
                                    prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                                    prose-p:mb-8 prose-p:leading-[1.9]
                                    prose-strong:text-foreground prose-strong:font-black
                                    prose-img:rounded-3xl prose-img:shadow-xl prose-img:my-10
                                    prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:bg-blue-50/50 dark:prose-blockquote:bg-blue-950/20 prose-blockquote:py-6 prose-blockquote:px-8 prose-blockquote:rounded-r-3xl prose-blockquote:italic prose-blockquote:text-xl prose-blockquote:text-foreground/90 prose-blockquote:shadow-sm"
                                dangerouslySetInnerHTML={{ __html: blog.content }} 
                            />
                            
                            <div className="mt-20 flex sm:hidden gap-4 justify-center">
                                {/* Mobile Share Buttons */}
                                <Button variant="outline" size="sm" className="rounded-xl"><Facebook className="w-4 h-4 mr-2"/> Share</Button>
                                <Button variant="outline" size="sm" className="rounded-xl"><Twitter className="w-4 h-4 mr-2"/> Tweet</Button>
                                <Button variant="outline" size="sm" className="rounded-xl" onClick={handleCopy}>
                                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />} Link
                                </Button>
                            </div>

                            <div className="mt-16 pt-10 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                     <span className="text-sm font-black text-muted-foreground uppercase tracking-widest">Tagged in:</span>
                                     <span className="px-4 py-1.5 bg-secondary hover:bg-secondary/80 transition-colors rounded-full text-xs font-bold text-foreground uppercase tracking-widest border border-border cursor-pointer shadow-sm">
                                         # {blog.category.toLowerCase().replace(/\s+/g, '')}
                                     </span>
                                </div>
                                <Button variant="ghost" asChild className="hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950/50 dark:hover:text-blue-400 group">
                                    <Link href="/blogs">
                                        More Articles
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Read More Posts - Random Blogs */}
            {randomBlogs.length > 0 && (
                <section className="py-24 bg-muted/30 border-t border-border">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-4">Read more stories</h2>
                                <p className="text-muted-foreground text-lg">Discover more articles carefully selected for you.</p>
                            </div>
                            <Button variant="outline" className="rounded-full shadow-sm" asChild>
                                <Link href="/blogs">View All Articles</Link>
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {randomBlogs.map((randomBlog, idx) => (
                                <motion.div
                                    key={randomBlog.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="group bg-card rounded-[2rem] overflow-hidden border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                                >
                                    <Link href={`/blogs/${randomBlog.id}`} className="block h-52 relative overflow-hidden">
                                        {randomBlog.image ? (
                                            <img 
                                                src={randomBlog.image} 
                                                alt={randomBlog.title} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center">
                                                <BookOpen className="w-12 h-12 text-blue-200 dark:text-blue-800" />
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4">
                                            <span className="px-3 py-1 bg-background/90 backdrop-blur-md text-foreground text-[10px] font-extrabold rounded-full shadow-sm uppercase tracking-widest">
                                                {randomBlog.category}
                                            </span>
                                        </div>
                                    </Link>
                                    
                                    <div className="p-8 flex flex-col flex-1">
                                        <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">
                                            <span>{new Date(randomBlog.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            <span className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
                                            <span>{randomBlog.author}</span>
                                        </div>
                                        
                                        <h3 className="text-xl font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-4 leading-tight">
                                            <Link href={`/blogs/${randomBlog.id}`}>{randomBlog.title}</Link>
                                        </h3>
                                        
                                        <div className="mt-auto pt-6 border-t border-border flex items-center justify-between">
                                            <Link 
                                                href={`/blogs/${randomBlog.id}`} 
                                                className="inline-flex items-center gap-2 text-sm font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                                            >
                                                Read article
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </article>
    );
};

export default BlogDetailsPage;
