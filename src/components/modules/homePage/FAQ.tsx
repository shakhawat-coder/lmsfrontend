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
      <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/30 -z-0 rounded-l-full blur-3xl opacity-60"></div>
      
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
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                <HelpCircle className="w-4 h-4" />
                <span>Support Center</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
                Frequently Asked <br />
                <span className="text-blue-600">Questions</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-md">
                Find answers to common questions about our library services, memberships, and digital resources. Still need help? Contact our support team.
              </p>
              
              <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100 flex items-center gap-4 group hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-blue-600 group-hover:scale-110 transition-transform">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Have more questions?</h4>
                  <p className="text-sm text-gray-500">Reach out to us at <span className="text-blue-600 font-medium">support@booknest.com</span></p>
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
                    className="border border-zinc-100 rounded-2xl bg-white px-2 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <AccordionTrigger className="text-lg font-bold text-gray-800 hover:text-blue-600 py-6 px-4 no-underline hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-zinc-600 leading-relaxed text-[16px] pb-6 px-4 pt-0">
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
