"use client";

import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'motion/react';

export interface MembershipPlanData {
  name: string;
  description: string;
  price: string;
  interval: string;
  features: string[];
  buttonText: string;
  popular: boolean;
}

const plans: MembershipPlanData[] = [
  {
    name: "Basic Reader",
    description: "Perfect for casual readers looking to explore our standard collection.",
    price: "$0",
    interval: "/year",
    features: [
      "Borrow up to 2 books at a time",
      "Standard reading room access",
      "14-day loan period",
      "Access to public events",
    ],
    buttonText: "Join for Free",
    popular: false,
  },
  {
    name: "Avid Bookworm",
    description: "Ideal for passionate readers who want extended access and perks.",
    price: "$149",
    interval: "/year",
    features: [
      "Borrow up to 10 books at a time",
      "30-day extended loan period",
      "Free book reservations",
      "Access to premium & rare collections",
      "Discounted printing & copying",
    ],
    buttonText: "Upgrade to Premium",
    popular: true,
  },
  {
    name: "Scholar & Researcher",
    description: "Designed for academics, students, and intensive researchers.",
    price: "$349",
    interval: "/year",
    features: [
      "Borrow up to 30 books at a time",
      "Access to private study rooms",
      "Unlimited digital database access",
      "Inter-library loan service",
      "Dedicated research assistance",
    ],
    buttonText: "Get Scholar Access",
    popular: false,
  }
];

const MembershipPlan = () => {
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto items-center">
          {plans.map((plan, index) => (
            <motion.div 
              key={plan.name} 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className={`relative bg-white rounded-2xl border ${
                plan.popular ? 'border-blue-600 shadow-2xl z-10 md:scale-105' : 'border-gray-200 shadow-sm'
              } p-8 flex flex-col h-full`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-blue-600 text-white text-sm font-semibold py-1 px-4 rounded-full shadow-md">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 h-12">{plan.description}</p>
              </div>
              
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                <span className="text-gray-500 font-medium">{plan.interval}</span>
              </div>
              
              <ul className="mb-8 flex-1 space-y-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-blue-600 mr-3 shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button 
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                  plan.popular 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg' 
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                {plan.buttonText}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MembershipPlan;