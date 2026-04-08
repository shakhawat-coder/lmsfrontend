"use client";

import React from "react";
import { useRouter } from 'next/navigation';
import { motion, Variants } from "motion/react";
import {
  BookOpen,
  Users,
  Globe,
  Award,
  Heart,
  Shield,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "Total Books", value: "50,000+", icon: BookOpen },
  { label: "Active Readers", value: "12,000+", icon: Users },
  { label: "Countries Served", value: "25+", icon: Globe },
  { label: "Years of Excellence", value: "15+", icon: Award },
];

const values = [
  {
    title: "Accessibility",
    description:
      "We believe that knowledge should be accessible to everyone, regardless of their background or location.",
    icon: Globe,
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    title: "Community First",
    description:
      "Our readers are at the heart of everything we do. We build spaces where thinkers and dreamers belong.",
    icon: Heart,
    color: "bg-red-500/10 text-red-600",
  },
  {
    title: "Integrity",
    description:
      "We maintain the highest standards of data privacy and intellectual property rights in our collection.",
    icon: Shield,
    color: "bg-emerald-500/10 text-emerald-600",
  },
];

const AboutPage = () => {
  const router = useRouter();
  const navigate = () => {
    router.push("/catalog/book");
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return ( 
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/about_hero_library.png')",
            filter: "brightness(0.5)"
          }}
        />
        <div className="container relative z-10 text-center text-white px-4">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
          >
            Empowering Minds <br /> Through <span className="text-blue-400">Knowledge</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg md:text-xl max-w-2xl mx-auto text-gray-200"
          >
            BookNest is more than just a library; it's a global community dedicated to the pursuit of learning, discovery, and growth.
          </motion.p>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-24 container px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={itemVariants}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-6">
              Our Mission to <span className="text-blue-600">Democratize</span> Education
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Founded in 2010, BookNest started with a simple belief: that everyone should have a world-class library in their pocket. Today, we serve thousands of individuals daily, offering a seamless blend of digital innovation and traditional literary excellence.
            </p>
            <div className="space-y-4">
              {[
                "Global access to digital archives",
                "Community-driven book sourcing",
                "Advanced AI-powered recommendations",
                "Partnerships with major universities"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="text-blue-500 w-5 h-5 flex-shrink-0" />
                  <span className="font-medium text-foreground">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-10">
              <Button onClick={navigate} size="lg" className="rounded-full px-8">
                Explore Our Collection <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[450px] rounded-3xl overflow-hidden shadow-2xl"
          >
            <img
              src="/library_collaboration.png"
              alt="Collaboration"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-blue-600/10 mix-blend-multiply" />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-50 dark:bg-zinc-900/10 py-20">
        <div className="container px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-transparent dark:border-zinc-800 shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-3xl font-bold text-foreground">{stat.value}</h3>
                <p className="text-muted-foreground font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 container px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            The Principles That Drive Us
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            We operate with a commitment to excellence, transparency, and a deep love for the written word.
          </motion.p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-3xl border border-gray-100 dark:border-zinc-800 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-white dark:bg-zinc-900/50"
            >
              <div className={`w-14 h-14 rounded-2xl ${value.color} flex items-center justify-center mb-6`}>
                <value.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-4">{value.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;