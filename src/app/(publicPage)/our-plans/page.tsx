"use client";

import React from "react";
import { motion } from "motion/react";
import MembershipPlan from "@/components/modules/homePage/MembershipPlan";
import {
  ShieldCheck,
  Zap,
  Globe,
  Clock,
  HelpCircle,
  ChevronDown
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Can I change my plan later?",
    answer: "Yes, you can upgrade or downgrade your plan at any time from your account settings. If you upgrade, the new features will be available immediately."
  },
  {
    question: "Is there a limit on how many books I can borrow?",
    answer: "The limit depends on your plan. Basic members can borrow up to 2 books at a time, while Silver and Gold members enjoy increased limits and longer borrow periods."
  },
  {
    question: "Are there any hidden fees?",
    answer: "No, our pricing is transparent. There are no hidden fees. Late returns may incur a small fee, which is clearly outlined in our library policy."
  },
  {
    question: "Can I cancel my membership?",
    answer: "Yes, you can cancel your paid membership at any time. You will continue to have access to benefits until the end of your current billing period."
  }
];

const features = [
  {
    title: "Secure Access",
    description: "Your data and reading history are protected with industry-standard encryption.",
    icon: ShieldCheck,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20"
  },
  {
    title: "Instant Activation",
    description: "Get started immediately after subscribing. No waiting periods or complex setup.",
    icon: Zap,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20"
  },
  {
    title: "Global Collection",
    description: "Access thousands of books, journals, and archives from authors worldwide.",
    icon: Globe,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/20"
  },
  {
    title: "24/7 Availability",
    description: "Our digital library is open around the clock, every single day of the year.",
    icon: Clock,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-900/20"
  }
];

const OurPlanPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black">
      {/* Hero Section */}
      <section className="relative pt-40 pb-32 overflow-hidden bg-slate-950">
        {/* Generated Premium Background */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat blur-[2px] opacity-60"
          style={{ backgroundImage: "url('/membership_hero_bg.png')" }}
        />
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-white dark:to-black"></div>

        <div className="container relative z-10 px-4 mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block px-6 py-2 mb-8 text-xs font-black tracking-[0.3em] text-blue-400 uppercase bg-blue-500/10 border border-blue-500/20 rounded-full backdrop-blur-md"
            >
              Membership Experience
            </motion.span>
            <h1 className="mb-8 text-5xl font-black tracking-tight text-white md:text-7xl lg:text-8xl leading-[1.1]">
              Knowledge <br /> Without <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Boundaries</span>
            </h1>
            <p className="max-w-2xl mx-auto mb-12 text-lg text-slate-300 md:text-xl font-medium leading-relaxed">
              Step into a world of curated intelligence. Whether you're an explorer or a scholar, our specialized membership plans empower your journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative z-20 -mt-16">
        <MembershipPlan />
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white dark:bg-black">
        <div className="container px-4 mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">Why Choose BookNest?</h2>
            <p className="max-w-2xl mx-auto text-slate-600 dark:text-slate-400">
              We provide more than just books. We offer a premium reading environment designed for modern learners.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 transition-all duration-300 border border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/30 rounded-3xl hover:shadow-xl dark:hover:bg-zinc-900/50 active:scale-95 group"
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 mb-6 rounded-2xl ${feature.bg} ${feature.color} group-hover:scale-110 transition-transform duration-500`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">{feature.title}</h3>
                <p className="leading-relaxed text-slate-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-slate-50 dark:bg-black/40">
        <div className="container max-w-4xl px-4 mx-auto">
          <div className="flex items-center justify-center gap-3 mb-12">
            <div className="flex items-center justify-center w-12 h-12 text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">Common Questions</h2>
          </div>

          <div className="bg-white dark:bg-zinc-900/40 border border-slate-200 dark:border-zinc-800 shadow-sm rounded-3xl overflow-hidden">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className={`px-8 border-slate-100 dark:border-zinc-800 ${index === faqs.length - 1 ? 'border-b-0' : ''}`}
                >
                  <AccordionTrigger className="py-6 text-left hover:no-underline font-bold text-slate-900 dark:text-gray-200 text-lg group">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 text-slate-600 dark:text-gray-400 text-base leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurPlanPage;
