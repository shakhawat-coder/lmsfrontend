"use client";

import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const Cta = () => {
  return (
    <section className="w-full relative py-24 bg-white dark:bg-black overflow-hidden relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="bg-gradient-to-br from-blue-400 to-indigo-600 rounded-3xl p-8 md:p-16 lg:p-20 shadow-2xl relative overflow-hidden">
          
          {/* Abstract Background Shapes */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-blue-500 rounded-full blur-[80px] opacity-50 mix-blend-overlay"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-purple-500 rounded-full blur-[80px] opacity-40 mix-blend-overlay"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl mb-4 backdrop-blur-sm border border-white/20">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                Ready to Start Your Reading Journey?
              </h2>
              
              <p className="text-lg md:text-lg text-blue-100 mb-10 leading-relaxed max-w-2xl mx-auto">
                Join our library today to access thousands of exclusive books, premium study rooms, and expert research assistance. Your next great adventure is just a click away.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/register">
                <button className="w-full sm:w-auto px-8 py-4 cursor-pointer bg-white text-blue-700 font-bold rounded-xl text-lg hover:bg-blue-50 transition-all shadow-[0_4px_14px_0_rgba(255,255,255,0.39)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.23)] hover:-translate-y-1 transform duration-300 flex items-center justify-center gap-2">
                  Create Account <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              
              <Link href="/catalog/all">
                <button className="w-full sm:w-auto px-8 py-4 cursor-pointer bg-blue-700/50 text-white font-bold rounded-xl text-lg backdrop-blur-md border border-blue-400/30 hover:bg-blue-700/70 transition-all hover:-translate-y-1 transform duration-300">
                  Explore Books
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cta;