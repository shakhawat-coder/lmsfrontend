"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, CreditCard, Loader2Icon, ArrowLeft, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { membershipPlanApi, MembershipPlan, paymentApi } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import Link from "next/link";

function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("planId");
  const { user, isLoading: authLoading } = useAuth();

  const [plan, setPlan] = useState<MembershipPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      const returnUrl = encodeURIComponent(window.location.href);
      router.push(`/login?redirect=${returnUrl}`);
      return;
    }

    const fetchPlan = async () => {
      if (!planId) {
        setError("No plan selected. Please select a membership plan.");
        setIsLoading(false);
        return;
      }

      try {
        const plans = await membershipPlanApi.getAll();
        const plansArray = Array.isArray(plans) ? plans : (plans as any).data || [];
        const selectedPlan = plansArray.find((p: MembershipPlan) => p.id === planId);

        if (!selectedPlan) {
          setError("Plan not found. Please select a valid membership plan.");
        } else {
          setPlan(selectedPlan);
        }
      } catch (err) {
        console.error("Failed to fetch plan:", err);
        setError("Failed to load plan details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchPlan();
    }
  }, [planId, user, authLoading, router]);

  const handlePayment = async () => {
    if (!plan || !user) return;

    setIsProcessing(true);
    setError(null);

    try {
      const result = await paymentApi.initiate({
        membershipPlanId: plan.id,
        amount: plan.price,
        currency: "BDT",
      }) as any;

      // fetchApi returns the full { success, message, data } wrapper
      const paymentUrl = result?.data?.paymentUrl || result?.paymentUrl;

      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        console.error("No paymentUrl in response:", result);
        setError("Failed to initiate payment. Please try again.");
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      setError(err.message || "Payment initiation failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const getTierColor = (name: string) => {
    switch (name) {
      case "GOLD":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "SILVER":
        return "bg-slate-500/10 text-slate-600 border-slate-500/20";
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2Icon className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">Please login to continue with checkout</p>
            <Button asChild>
              <Link href="/login">Go to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Checkout Error</CardTitle>
            <CardDescription>{error || "Something went wrong"}</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Button variant="outline" asChild className="flex-1">
              <Link href="/#membership-plans">Browse Plans</Link>
            </Button>
            <Button asChild className="flex-1">
              <Link href="/">Go Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/#membership-plans" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Plans
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getTierColor(plan.name)}`}>
                  {plan.name} Plan
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plan Duration</span>
                    <span className="font-medium">{plan.durationDays} Days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Borrow Limit</span>
                    <span className="font-medium">{plan.borrowLimit} Books</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Billing</span>
                    <span className="font-medium">{plan.interval || "One-time"}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-3xl font-bold text-primary">
                      {plan.price === 0 ? "Free" : `$${plan.price.toFixed(2)}`}
                    </span>
                  </div>
                  {plan.price > 0 && (
                    <p className="text-xs text-muted-foreground text-right mt-1">
                      Including VAT (if applicable)
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              <span>Secure payment powered by SSLCommerz</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Membership Details</CardTitle>
                <CardDescription>What you&apos;ll get with {plan.name} plan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h4 className="font-semibold text-lg">{plan.description}</h4>
                  <p className="text-sm text-muted-foreground">
                    Valid for {plan.durationDays} days from the date of purchase
                  </p>
                </div>

                <ul className="space-y-3">
                  {plan.features?.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Account Information</h4>
                  <div className="text-sm space-y-1">
                    <p><span className="text-muted-foreground">Name:</span> {user.name}</p>
                    <p><span className="text-muted-foreground">Email:</span> {user.email}</p>
                  </div>
                </div>

                {error && (
                  <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">
                    {error}
                  </div>
                )}

                <Button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full h-12 text-lg"
                >
                  {isProcessing ? (
                    <>
                      <Loader2Icon className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : plan.price === 0 ? (
                    "Activate Free Membership"
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      {`Pay $${plan.price.toFixed(2)} with SSLCommerz`}
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By proceeding, you agree to our Terms of Service and Privacy Policy
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

const CheckoutPageWrapper = () => (
  <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading checkout...</div>}>
    <CheckoutPage />
  </Suspense>
);

export default CheckoutPageWrapper;
