"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Loader2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { z } from "zod";

const otpSchema = z.object({
  otp: z.string().length(6, "Please enter all 6 digits").regex(/^\d+$/, "OTP must contain only numbers"),
});


export function OTPVerificationForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Filter out error message if user starts typing
    if (error) setError("");

    // Move focus to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const data = e.clipboardData.getData("text").replace(/\D/g, "").substring(0, 6);
    if (!data) return;

    const newOtp = [...otp];
    for (let i = 0; i < data.length; i++) {
        newOtp[i] = data[i];
    }
    setOtp(newOtp);
    
    // Focus the last input or the next one
    const nextIndex = Math.min(data.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");
    
    const result = otpSchema.safeParse({ otp: otpString });
    
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setIsSubmitting(true);

    
    // Simulate API call
    console.log("OTP submitted:", otpString);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    
    // Redirect to reset password
    router.push("/reset-password");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Verify OTP</CardTitle>
          <CardDescription className="text-center">
            We&apos;ve sent a 6-digit code to your email. Enter it below to verify.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <div className="flex justify-between gap-2">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el: HTMLInputElement | null) => { inputRefs.current[index] = el; }}
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className={cn(
                        "h-12 w-full text-center text-lg font-bold focus:ring-primary focus:border-primary border-2",
                        error ? "border-destructive" : ""
                      )}
                    />
                  ))}
                </div>
                {error && <FieldError errors={[{ message: error }]} className="text-center" />}
              </Field>
              <Field>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Verify OTP
                </Button>
                <div className="text-center text-sm text-muted-foreground">
                  Didn&apos;t receive any code?{" "}
                  <button type="button" className="text-primary hover:underline font-medium">
                    Resend
                  </button>
                </div>
                <FieldDescription className="text-center">
                  <Link href="/forgot-password" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    Back to forgot password
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
