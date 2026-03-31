"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Loader2Icon, BookOpen, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { paymentApi, MembershipPlan } from "@/lib/api";

function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transactionId");

  const [isVerifying, setIsVerifying] = useState(true);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!transactionId) {
        setError("Invalid transaction");
        setIsVerifying(false);
        return;
      }

      try {
        const response = await paymentApi.verify(transactionId) as any;
        // fetchApi returns the full { success, message, data } wrapper
        const payment = response?.data || response;
        if (payment?.status === "PAID") {
          setPaymentVerified(true);
        } else {
          setError("Payment not confirmed");
        }
      } catch (err) {
        console.error("Verification error:", err);
        setError("Could not verify payment status");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [transactionId]);

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2Icon className="w-16 h-16 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (!paymentVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-6 space-y-4">
            <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold">Payment Status Unknown</h1>
            <p className="text-muted-foreground">
              {error || "We couldn't verify your payment. Please contact support with your transaction ID."}
            </p>
            <div className="space-y-2">
              {transactionId && (
                <p className="text-sm text-muted-foreground">
                  Transaction ID: <code className="bg-muted px-2 py-1 rounded">{transactionId}</code>
                </p>
              )}
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" asChild className="flex-1">
                <Link href="/dashboard/my-membership">View Membership</Link>
              </Button>
              <Button asChild className="flex-1">
                <Link href="/">Go Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-emerald-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <Card className="border-green-200 bg-white/80 backdrop-blur">
          <CardContent className="pt-8 pb-8 text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto"
            >
              <CheckCircle className="w-10 h-10" />
            </motion.div>

            <div className="space-y-2">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-green-800"
              >
                Payment Successful!
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground"
              >
                Your membership has been activated. Welcome to our library!
              </motion.p>
            </div>

            {transactionId && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-green-50 rounded-lg p-4 text-sm"
              >
                <p className="text-green-700 font-medium">Transaction Confirmed</p>
                <p className="text-green-600 text-xs mt-1">
                  ID: <code>{transactionId}</code>
                </p>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-center gap-2 text-green-700">
                <BookOpen className="w-5 h-5" />
                <span className="font-medium">Start exploring our collection</span>
              </div>

              <div className="flex flex-col gap-3">
                <Button asChild size="lg" className="w-full">
                  <Link href="/catalog/book">
                    Browse Books
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/dashboard/memberships">View My Membership</Link>
                </Button>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-xs text-muted-foreground"
            >
              A confirmation email has been sent to your registered email address.
            </motion.p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

const PaymentSuccessPageWrapper = () => (
  <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading payment confirmation...</div>}>
    <PaymentSuccessPage />
  </Suspense>
);

export default PaymentSuccessPageWrapper;

