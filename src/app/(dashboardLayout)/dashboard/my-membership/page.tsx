"use client";

import { useEffect, useState } from "react";
import { membershipApi, Membership, membershipPlanApi, MembershipPlan } from "@/lib/api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Calendar,
  CreditCard,
  ShieldCheck,
  Clock,
  ArrowRight,
  Sparkles,
  Zap,
  Crown
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";

export default function MyMembershipPage() {
  const [membership, setMembership] = useState<Membership | null>(null);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membershipData, plansData] = await Promise.all([
          membershipApi.getActive().catch(() => null),
          membershipPlanApi.getAll()
        ]);

        if (membershipData) {
          const actualData = (membershipData as any).data || membershipData;
          if (actualData && actualData.id) {
            setMembership(actualData);
          } else {
            setMembership(null);
          }
        }
        setPlans(Array.isArray(plansData) ? plansData : (plansData as any).data || []);
      } catch (error) {
        console.error("Failed to fetch membership data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground animate-pulse">Loading your membership details...</p>
        </div>
      </div>
    );
  }

  const getPlanIcon = (planName: string = "") => {
    switch (planName.toUpperCase()) {
      case "GOLD": return <Crown className="h-5 w-5 text-amber-500" />;
      case "SILVER": return <Zap className="h-5 w-5 text-slate-400" />;
      default: return <Sparkles className="h-5 w-5 text-primary" />;
    }
  };

  const isExpiringSoon = !!(membership?.endDate &&
    new Date(membership.endDate).getTime() < Date.now() + 7 * 24 * 60 * 60 * 1000);

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          My Membership
        </h1>
        <p className="text-muted-foreground">
          Review and manage your library subscription plans and benefits.
        </p>
      </div>

      {membership && membership.id ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-6 md:grid-cols-12"
        >
          {/* Current Membership Card */}
          <Card className="md:col-span-8 border-primary/20 shadow-lg overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-500">
              <ShieldCheck className="w-32 h-32 text-primary" />
            </div>

            <CardHeader className="border-b bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Active Subscription</CardTitle>
                    <CardDescription>You are currently on the {membership.membershipPlan?.name} plan</CardDescription>
                  </div>
                </div>
                <Badge variant={membership.status === "ACTIVE" ? "success" : "outline"} className="px-3 py-1 font-bold">
                  {membership.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-6 grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase font-semibold">Start Date</p>
                    <p className="font-medium">{new Date(membership.startDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className={`w-8 h-8 rounded-full ${isExpiringSoon ? 'bg-orange-500/10' : 'bg-muted'} flex items-center justify-center`}>
                    <Clock className={`h-4 w-4 ${isExpiringSoon ? 'text-orange-600' : 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase font-semibold">Valid Until</p>
                    <p className={`font-medium ${isExpiringSoon ? 'text-orange-600' : ''}`}>
                      {membership.endDate ? new Date(membership.endDate).toLocaleDateString(undefined, { dateStyle: 'long' }) : "Lifetime"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase font-semibold">Borrow Limit</p>
                    <p className="font-medium">{membership.membershipPlan?.borrowLimit || 0} Books at a time</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase font-semibold">Plan Price</p>
                    <p className="font-medium">${Number(membership.price || 0).toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {isExpiringSoon && (
                <div className="md:col-span-2 p-4 rounded-lg bg-orange-50 border border-orange-200 flex items-center gap-3">
                  <Zap className="h-5 w-5 text-orange-600 animate-pulse" />
                  <p className="text-sm text-orange-800">
                    Your membership is expiring soon. Renew now to keep your benefits!
                  </p>
                </div>
              )}
            </CardContent>

            <CardFooter className="bg-muted/30 border-t flex justify-between items-center p-6">
              <span className="text-xs text-muted-foreground italic">
                Last updated: {new Date().toLocaleDateString()}
              </span>
              <Link href="/catalog/categories#plans">
                <Button variant="outline" className="gap-2 group/btn">
                  Upgrade Plan <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Quick Stats/Info */}
          <div className="md:col-span-4 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Plan Benefits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {membership.membershipPlan?.features?.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm leading-tight text-foreground/80">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6 space-y-4">
                <div className="flex gap-4">
                  <div className="bg-primary/10 p-3 rounded-full h-fit">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Premium Account</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Your current status gives you early access to new book arrivals and exclusive member events.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-2xl bg-muted/20"
        >
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="h-8 w-8 text-muted-foreground opacity-50" />
          </div>
          <h2 className="text-xl font-bold mb-2">No Active Membership</h2>
          <p className="text-muted-foreground text-center max-w-md mb-8">
            Subscribe to a membership plan to unlock borrowing privileges and exclusive library features.
          </p>
          <Link href="/our-plans">
            <Button size="lg" className="rounded-full px-8 gap-2 group shadow-lg">
              Choose a Plan <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
