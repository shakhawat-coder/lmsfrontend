"use client";

import React, { useState } from "react";
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
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { z } from "zod";
import { Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { authApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof SignupFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id as keyof SignupFormData]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id as keyof SignupFormData];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = signupSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: any = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0]] = err.message;
        }
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    // API call
    try {
      setApiError(null);
      const { confirmPassword, ...signupData } = result.data;
      await authApi.signUp(signupData);

      // Successfully signed up - Better Auth sends verification email
      // We might want to redirect to a 'verification-sent' page or login
      router.push("/login?message=Account created! Please check your email to verify.");
    } catch (error: any) {
      setApiError(error.message || "Failed to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSocialCallbackURL = () => {
    const frontendOrigin =
      process.env.NEXT_PUBLIC_FRONTEND_URL ||
      window.location.origin ||
      "https://booknest-tau-virid.vercel.app";
    return `${frontendOrigin}/dashboard`;
  };

  const handleGoogleLogin = async () => {
    try {
      setIsSubmitting(true);
      setApiError(null);
      const callbackURL = getSocialCallbackURL();
      await authClient.signIn.social({
        provider: "google",
        callbackURL,
        newUserCallbackURL: callbackURL,
        errorCallbackURL: `${window.location.origin}/signup?error=social`,
      });
    } catch (error: any) {
      setApiError(error.message || "Failed to sign up with Google.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information to create an account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {apiError && (
            <div className="mb-4 flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <p>{apiError}</p>
            </div>
          )}
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <FieldError errors={[{ message: errors.name }]} />}
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && <FieldError errors={[{ message: errors.email }]} />}
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "border-destructive pr-10" : "pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <FieldError errors={[{ message: errors.password }]} />}
            </Field>
            <Field>
              <FieldLabel htmlFor="confirmPassword">
                Confirm Password
              </FieldLabel>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? "border-destructive pr-10" : "pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  title={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && <FieldError errors={[{ message: errors.confirmPassword }]} />}
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleGoogleLogin}
                >
                  <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                  </svg>
                  Sign up with Google
                </Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <Link href="/login" className="underline underline-offset-4 hover:text-primary">Login</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
