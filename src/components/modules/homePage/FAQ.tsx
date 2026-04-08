"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "motion/react";
import { HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How can I borrow a book?",
    answer: "Borrowing is easy! First, create an account and select a membership plan that suits your needs. Once your account is active, browse our catalog, find the book you want, and click 'Borrow'. You can pick it up from our branch or have it delivered depending on your location.",
  },
  {
    question: "What are the library's physical operating hours?",
    answer: "Our main library is open Monday through Friday from 9:00 AM to 8:00 PM, and on Saturdays and Sundays from 10:00 AM to 5:00 PM. Our digital catalog and member dashboard are accessible 24/7 for browsing and renewals.",
  },
  {
    question: "Are there late fees for overdue books?",
    answer: "Yes, to ensure all members have access to our collection, we charge a small late fee of $0.50 per day for overdue items. We'll send you email reminders 3 days before your book is due to help you avoid these fees.",
  },
  {
    question: "Can I renew my book if I need more time?",
    answer: "Absolutely! You can renew your books online via your personal dashboard. As long as the book hasn't been reserved by another member, you can typically extend your borrowing period twice.",
  },
  {
    question: "How many books can I have out at one time?",
    answer: "The borrowing limit depends on your membership tier. Basic members can borrow up to 3 books, Silver members up to 7, and Gold members can enjoy up to 15 books at once.",
  },
  {
    question: "Do you have digital resources like e-books or audiobooks?",
    answer: "Yes! Our Gold membership includes full access to our extensive digital vault, featuring thousands of e-books, audiobooks, and academic journals that you can enjoy right on your devices.",
  },
];

const FAQ = () => {
  return (
    <section className="py-24 w-full relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/30 dark:bg-blue-900/10 -z-0 rounded-l-full blur-3xl opacity-60"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-5 gap-12 items-start">
          
          {/* Header Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="sticky top-24"
            >
             
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
                Frequently Asked <br />
                <span className="text-blue-600 dark:text-blue-500">Questions</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md">
                Find answers to common questions about our library services, memberships, and digital resources. Still need help? Contact our support team.
              </p>
              
              <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex items-center gap-4 group hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-xl flex items-center justify-center shadow-sm text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Have more questions?</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Reach out to us at <span className="text-blue-600 dark:text-blue-400 font-medium">support@booknest.com</span></p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Accordion Section */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`}
                    className="border border-zinc-100 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900/40 px-2 overflow-hidden shadow-sm hover:shadow-md dark:hover:bg-zinc-900/60 transition-all"
                  >
                    <AccordionTrigger className="text-lg font-bold text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 py-6 px-4 no-underline hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-[16px] pb-6 px-4 pt-0">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default FAQ;
