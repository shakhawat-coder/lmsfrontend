"use client";

import React, { useEffect, useState } from "react";
import { blogApi, Blog } from "@/lib/api";
import Link from "next/link";
import { ArrowRight, Calendar, User, Tag } from "lucide-react";
import { motion } from "motion/react";

const BlogSection = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await blogApi.getPublished();
        const items = Array.isArray(data) ? data : (data as any).data || [];
        setBlogs(items.slice(0, 3));
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
          <div className="py-20 bg-gray-50/50">
              <div className="container mx-auto px-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {[1, 2, 3].map((i) => (
                          <div key={i} className="bg-white rounded-3xl h-96 animate-pulse border border-gray-100 shadow-sm" />
                      ))}
                  </div>
              </div>
          </div>
      );
  }

  if (blogs.length === 0) return null;

  return (
    <section className="py-24 w-full relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-200 to-transparent opacity-30"></div>
        
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4"
            >
              <Tag className="w-3 h-3" />
              <span>Library Insights</span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight"
            >
              Latest from <span className="text-blue-600">Our Blog</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-600 font-medium"
            >
              Explore our collection of articles, library news, and reading recommendations curated by our editors.
            </motion.p>
          </div>
          <motion.div
             initial={{ opacity: 0, x: 20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
          >
            <Link 
              href="/blogs" 
              className="inline-flex items-center gap-2 font-bold text-blue-600 hover:text-blue-700 transition-colors group"
            >
              View all articles
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, idx) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full"
            >
              <Link href={`/blogs/${blog.id}`} className="block overflow-hidden h-60 relative">
                {blog.image ? (
                  <img 
                    src={blog.image} 
                    alt={blog.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                ) : (
                  <div className="w-full h-full bg-blue-50 flex items-center justify-center">
                    <Tag className="w-12 h-12 text-blue-200" />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-blue-600 text-xs font-bold rounded-lg shadow-sm uppercase tracking-wide">
                        {blog.category}
                    </span>
                </div>
              </Link>
              
              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-xs font-semibold text-gray-400 mb-4 uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    {blog.author}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors leading-snug">
                  <Link href={`/blogs/${blog.id}`}>{blog.title}</Link>
                </h3>
                
                <p className="text-gray-500 text-sm line-clamp-3 mb-6 font-medium leading-relaxed">
                  {blog.content.replace(/<[^>]*>/g, '')}
                </p>
                
                <div className="mt-auto pt-6 border-t border-gray-50">
                    <Link 
                        href={`/blogs/${blog.id}`} 
                        className="inline-flex items-center gap-2 text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors"
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
  );
};

export default BlogSection;
