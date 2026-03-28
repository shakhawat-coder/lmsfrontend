"use client";

import React, { useEffect, useState } from 'react';
import { Check, Loader2Icon } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { membershipPlanApi, MembershipPlan as IMembershipPlan } from '@/lib/api';
import { useAuth } from '@/providers/auth-provider';

const MembershipPlan = () => {
  const [plans, setPlans] = useState<IMembershipPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await membershipPlanApi.getAll();
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
    <section className="py-20 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Choose Your Library Plan</h2>
          <p className="text-lg text-gray-600">
            Unlock the world of knowledge with our flexible library membership options. Whether you're a casual reader or a dedicated researcher, we have the right plan for you.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2Icon className="w-12 h-12 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto items-center">
            {plans.map((plan, index) => {
              const isPopular = plan.name === "SILVER";
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  whileHover={{ y: -10 }}
                  className={`relative bg-white rounded-2xl border ${isPopular ? 'border-blue-600 shadow-2xl z-10 md:scale-105' : 'border-gray-200 shadow-sm'
                    } p-8 flex flex-col h-full`}
                >
                  {isPopular && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <span className="bg-blue-600 text-white text-sm font-semibold py-1 px-4 rounded-full shadow-md">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 capitalize">{plan.name.toLowerCase()}</h3>
                    <p className="text-gray-600 h-12 leading-tight flex items-center">{plan.description}</p>
                  </div>

                  <div className="mb-6 flex items-baseline">
                    <span className="text-4xl font-extrabold text-gray-900">{getPriceDisplay(plan.price)}</span>
                    <span className="text-gray-500 font-medium ml-2">{plan.interval}</span>
                  </div>

                  <ul className="mb-8 flex-1 space-y-4">
                    {plan.features?.map((feature: string, i: number) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-blue-600 mr-3 shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handlePlanSelect(plan.id)}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${isPopular
                        ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                      }`}
                  >
                    {getButtonText(plan.name)}
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default MembershipPlan;