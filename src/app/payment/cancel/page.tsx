"use client";

import { useSearchParams } from "next/navigation";
import { XCircle, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function PaymentCancelPage() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transactionId");

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-slate-50">
      <Card className="max-w-md w-full border-slate-200 bg-white/80 backdrop-blur">
        <CardContent className="pt-8 pb-8 text-center space-y-6">
          <div className="w-20 h-20 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mx-auto">
            <XCircle className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-800">Payment Cancelled</h1>
            <p className="text-muted-foreground">
              Your payment was cancelled. No charges have been made to your account.
            </p>
          </div>

          {transactionId && (
            <div className="bg-slate-50 rounded-lg p-4 text-sm">
              <p className="text-slate-700 font-medium">Transaction Reference</p>
              <p className="text-slate-500 text-xs mt-1">
                ID: <code>{transactionId}</code>
              </p>
            </div>
          )}

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
            Changed your mind? Our membership plans are still available whenever you&apos;re ready.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
