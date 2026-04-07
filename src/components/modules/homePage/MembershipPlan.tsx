"use client";

import React, { useEffect, useState } from 'react';
import { Check, Loader2Icon } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { membershipPlanApi, MembershipPlan as IMembershipPlan } from '@/lib/api';
import { useAuth } from '@/providers/auth-provider';
import { Skeleton } from "@/components/ui/skeleton";

const MembershipPlan = () => {
  const [plans, setPlans] = useState<IMembershipPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await membershipPlanApi.getAll();
        console.log(res);
        const data = Array.isArray(res) ? res : (res as any).data || [];
        setPlans(data);
      } catch (error) {
        console.error("Failed to fetch membership plans:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handlePlanSelect = (planId: string) => {
    if (!authLoading && !user) {
      const returnUrl = encodeURIComponent(`/checkout?planId=${planId}`);
      router.push(`/login?redirect=${returnUrl}`);
      return;
    }
    router.push(`/checkout?planId=${planId}`);
  };

  const getButtonText = (name: string) => {
    if (name === "BASIC") return "Join for Free";
    if (name === "SILVER") return "Upgrade to Premium";
    return "Get Scholar Access";
  };

  const getPriceDisplay = (price: number) => {
    return price === 0 ? "Free" : `$${price}`;
  };

  return (
    <section className="py-20 bg-background w-full">
      <div className=" mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Choose Your Library Plan</h2>
          <p className="text-lg text-muted-foreground">
            Unlock the world of knowledge with our flexible library membership options. Whether you're a casual reader or a dedicated researcher, we have the right plan for you.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex flex-wrap justify-center gap-8 max-w-7xl mx-auto py-10">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-full md:w-[350px] aspect-[4/5] bg-white rounded-2xl border border-gray-100 p-8 space-y-6 shadow-sm animate-pulse">
                <div className="space-y-3 flex flex-col items-center">
                   <Skeleton className="h-4 w-24 rounded-full" />
                   <Skeleton className="h-8 w-48 rounded-lg" />
                   <Skeleton className="h-4 w-full rounded-md" />
                </div>
                <div className="pt-6 space-y-3">
                   <Skeleton className="h-10 w-32 rounded-xl" />
                </div>
                <div className="space-y-4 pt-10">
                   {Array.from({ length: 4 }).map((_, j) => (
                     <div key={j} className="flex items-center gap-3">
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <Skeleton className="h-4 flex-1 rounded-md" />
                     </div>
                   ))}
                </div>
                <Skeleton className="h-12 w-full rounded-xl mt-10" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-10 max-w-7xl mx-auto items-stretch py-10">
            {plans.length > 0 ? (
              plans.map((plan, index) => {
                const isPopular = plan.name === "SILVER";
                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    whileHover={{ y: -10 }}
                    className="flex"
                  >
                    <div className={`relative w-full md:w-[360px] bg-card rounded-[2.5rem] border ${isPopular ? 'border-blue-600 shadow-3xl z-10 md:scale-105 ring-4 ring-blue-500/5' : 'border-border shadow-xl shadow-gray-200/50 dark:shadow-none'
                      } p-10 flex flex-col w-full h-full transition-all duration-500`}
                    >
                      {isPopular && (
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <span className="bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest py-2 px-6 rounded-full shadow-2xl shadow-blue-500/40">
                            Recommended
                          </span>
                        </div>
                      )}
    
                      <div className="mb-8">
                        <h3 className="text-3xl font-black text-foreground mb-2 capitalize italic">{plan.name.toLowerCase()}</h3>
                        <p className="text-muted-foreground font-medium leading-relaxed text-sm">{plan.description}</p>
                      </div>
    
                      <div className="mb-10 flex items-baseline gap-1">
                        <span className="text-5xl font-black text-foreground tracking-tighter">{getPriceDisplay(plan.price)}</span>
                        <span className="text-muted-foreground font-bold text-xs uppercase tracking-widest">/ {plan.interval}</span>
                      </div>
    
                      <div className="space-y-5 flex-1 mb-12">
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest border-b border-blue-50 pb-2 inline-block">Plan Features</p>
                        <ul className="space-y-4">
                          {plan.features?.map((feature: string, i: number) => (
                            <li key={i} className="flex items-center gap-4 group">
                              <div className="p-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600">
                                 <Check className="h-3 w-3" />
                              </div>
                              <span className="text-foreground/80 font-bold text-sm group-hover:text-blue-600 transition-colors">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
    
                      <button
                        onClick={() => handlePlanSelect(plan.id)}
                        className={`w-full py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] transition-all duration-500 shadow-xl ${isPopular
                            ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-500/40 hover:-translate-y-1'
                            : 'bg-gray-900 text-white hover:bg-black hover:shadow-gray-900/40'
                          }`}
                      >
                        {getButtonText(plan.name)}
                      </button>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground bg-white p-8 rounded-2xl shadow-sm border">No membership plans available at the moment. Please check back later.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default MembershipPlan;