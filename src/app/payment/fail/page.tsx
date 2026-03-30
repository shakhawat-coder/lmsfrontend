"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { XCircle, RefreshCw, ArrowLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

function PaymentFailPage() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transactionId");

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 to-orange-50">
      <Card className="max-w-md w-full border-red-200 bg-white/80 backdrop-blur">
        <CardContent className="pt-8 pb-8 text-center space-y-6">
          <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <XCircle className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-red-800">Payment Failed</h1>
            <p className="text-muted-foreground">
              We couldn&apos;t process your payment. Please try again or use a different payment method.
            </p>
          </div>

          {transactionId && (
            <div className="bg-red-50 rounded-lg p-4 text-sm">
              <p className="text-red-700 font-medium">Transaction Reference</p>
              <p className="text-red-600 text-xs mt-1">
                ID: <code>{transactionId}</code>
              </p>
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-left">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-800">Common reasons for payment failure:</p>
                <ul className="text-amber-700 mt-2 space-y-1 text-left">
                  <li>• Insufficient funds in your account</li>
                  <li>• Card details entered incorrectly</li>
                  <li>• Bank declined the transaction</li>
                  <li>• Network connectivity issues</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button asChild size="lg" className="w-full">
              <Link href="/checkout">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return Home
              </Link>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            If you believe this is an error, please contact our support team with your transaction ID.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

const PaymentFailPageWrapper = () => (
  <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading payment result...</div>}>
    <PaymentFailPage />
  </Suspense>
);

export default PaymentFailPageWrapper;

