"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { BookOpen, Users, Star, Award } from 'lucide-react';
import { statisticsApi } from '@/lib/api';

export interface Statistic {
  id: number;
  title: string;
  value: number;
  icon: React.ElementType;
  suffix: string;
  color: string;
  bgColor: string;
}

const AnimatedCounter: React.FC<{ value: number }> = ({ value }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      if (start === value) return;
      
      let timer: number;
      const duration = 2000;
      const increment = value / (duration / 16); 
      
      const updateCounter = () => {
        start += increment;
        if (start < value) {
          setCount(Math.ceil(start));
          timer = requestAnimationFrame(updateCounter);
        } else {
          setCount(value);
        }
      };
      
      timer = requestAnimationFrame(updateCounter);
      return () => cancelAnimationFrame(timer);
    }
  }, [value, isInView]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
};

const Statistics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [statsData, setStatsData] = useState({
    totalBooks: 0,
    activeMembers: 0,
    premiumMembers: 0,
    awardsWon: 12
  });

  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const stats = await statisticsApi.get();
        if (stats) {
          setStatsData(prev => ({
            ...prev,
            totalBooks: stats.totalBooks || prev.totalBooks,
            activeMembers: stats.activeMembers || prev.activeMembers,
            premiumMembers: stats.premiumMembers || prev.premiumMembers,
          }));
        }
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRealData();
  }, []);

  const stats: Statistic[] = [
    {
      id: 1,
      title: 'Total Books',
      value: statsData.totalBooks,
      icon: BookOpen,
      suffix: '+',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      id: 2,
      title: 'Active Members',
      value: statsData.activeMembers,
      icon: Users,
      suffix: '+',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      id: 3,
      title: 'Premium Members',
      value: statsData.premiumMembers,
      icon: Star,
      suffix: '+',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      id: 4,
      title: 'Awards Won',
      value: statsData.awardsWon,
      icon: Award,
      suffix: '',
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden w-full bg-background">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-48 -left-48 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 w-full max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Library in Numbers</h2>
          <p className="text-lg text-muted-foreground">
            A growing community of readers and an ever-expanding collection of knowledge.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading ? (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card rounded-2xl p-8 border border-border flex flex-col items-center text-center animate-pulse">
                <div className="w-16 h-16 bg-muted rounded-2xl mb-6"></div>
                <div className="h-10 w-24 bg-muted rounded-xl mb-3"></div>
                <div className="h-4 w-32 bg-muted rounded-full"></div>
              </div>
            ))
          ) : (
            stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card rounded-2xl p-8 border border-border shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group"
                >
                  <div className={`w-16 h-16 ${stat.bgColor} ${stat.color} rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-4xl font-extrabold text-foreground mb-2 flex items-center whitespace-nowrap">
                    <AnimatedCounter value={stat.value} />
                    <span className={`ml-1 ${stat.color}`}>{stat.suffix}</span>
                  </h3>
                  <p className="text-muted-foreground font-medium uppercase tracking-wider text-sm">{stat.title}</p>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
