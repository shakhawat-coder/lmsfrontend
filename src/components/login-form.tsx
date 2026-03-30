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
import { Loader2, AlertCircle, Info } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { authApi } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import { authClient } from "@/lib/auth-client";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();
  const { refreshSession } = useAuth();
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const redirect = searchParams.get("redirect");

  const getSocialCallbackURL = () => {
    const frontendOrigin =
      process.env.NEXT_PUBLIC_FRONTEND_URL ||
      window.location.origin ||
      "https://booknest-tau-virid.vercel.app";
    const targetPath = redirect || "/dashboard";
    return `${frontendOrigin}${targetPath.startsWith("/") ? targetPath : `/${targetPath}`}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id as keyof LoginFormData]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id as keyof LoginFormData];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = loginSchema.safeParse(formData);

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
      console.log("Attempting login for:", result.data.email);
      const session = await authApi.login(result.data);
      console.log("Login response:", session);

      // Store token in localStorage as a primary persistence mechanism for cross-origin setups
      const sessionData = (session as any);
      const token = sessionData.token ||
        sessionData.session?.token ||
        sessionData.session?.sessionToken ||
        sessionData.data?.token ||
        sessionData.data?.session?.sessionToken;

      if (token) {
        console.log("Token found and stored:", token.substring(0, 5) + "...");
        localStorage.setItem("token", token);
        localStorage.setItem("better-auth.session-token", token);
      } else {
        console.warn("No token found in login response. Auth might rely purely on cookies.");
      }

      // Update global auth state immediately
      await refreshSession();

      // User role-based redirection
      const userRole = session.user?.role || (session as any).data?.user?.role;
      console.log("User role:", userRole);

      if (userRole === "ADMIN" || userRole === "SUPERADMIN") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }

      setTimeout(() => {
        router.refresh();
      }, 100);
    } catch (error: any) {
      console.error("Login error details:", error);
      setApiError(error.message || "Invalid email or password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsSubmitting(true);
      setApiError(null);

      const callbackURL = getSocialCallbackURL();

      // We will handle role-based redirection on the homepage or dashboard
      // since social login is a full page redirect.
      await authClient.signIn.social({
        provider: "google",
        callbackURL,
        newUserCallbackURL: callbackURL,
        errorCallbackURL: `${window.location.origin}/login?error=social`,
      });
    } catch (error: any) {
      setApiError(error.message || "Failed to login with Google.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email and password to log in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {message && (
              <div className="mb-4 flex items-center gap-2 rounded-md bg-blue-500/15 p-3 text-sm text-blue-500">
                <Info className="h-4 w-4" />
                <p>{message}</p>
              </div>
            )}
            {apiError && (
              <div className="mb-4 flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <p>{apiError}</p>
              </div>
            )}
            <FieldGroup>
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
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "border-destructive" : ""}
                />
                {errors.password && <FieldError errors={[{ message: errors.password }]} />}
              </Field>
              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Login
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
                  Login with Google
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <Link href="/signup" className="underline underline-offset-4 group-hover:text-primary">Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
