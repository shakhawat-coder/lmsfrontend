"use client";

import React from "react";
import { motion } from "motion/react";
import { Search, UserPlus, BookCopy, RotateCcw, ArrowRight } from "lucide-react";

const steps = [
  {
    title: "Explore the Collection",
    description: "Browse thousands of books, journals, and digital resources across dozens of genres and categories.",
    icon: Search,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    title: "Choose Membership",
    description: "Select a plan that fits your reading habits. From Basic to Gold, we have options for every type of reader.",
    icon: UserPlus,
    color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  },
  {
    title: "Borrow & Enjoy",
    description: "Instantly borrow your favorite titles with just a click. Read on your devices or visit our local branch.",
    icon: BookCopy,
    color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  {
    title: "Renew or Return",
    description: "Easily renew your books or return them to let others enjoy. Every return earns you community points!",
    icon: RotateCcw,
    color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 w-full bg-slate-50 dark:bg-zinc-950/20 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4"
          >
            Simple Process
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tight"
          >
            How It <span className="text-blue-600">Works</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 dark:text-gray-400 font-medium"
          >
            Joining BookNest is easy. Follow these four simple steps to unlock your gateway to a world of endless reading and discovery.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-24 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-800 -z-0"></div>

          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="relative group flex flex-col items-center text-center px-4"
            >
              {/* Step Icon */}
              <div className={`w-20 h-20 rounded-[2rem] ${step.color} shadow-lg flex items-center justify-center mb-8 relative z-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                <step.icon className="w-8 h-8" />
                {/* Step Number Badge */}
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 border-2 border-blue-600 dark:border-blue-400 flex items-center justify-center text-xs font-black shadow-md">
                  0{idx + 1}
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {step.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed font-medium">
                {step.description}
              </p>

              {/* Decorative Arrow (Mobile/Tablet) */}
              {idx < steps.length - 1 && (
                <div className="lg:hidden mt-8 text-blue-200 dark:text-zinc-800">
                  <ArrowRight className="w-6 h-6 rotate-90" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
