"use client";

import { useState } from "react";
import { userApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Field,
  FieldLabel,
  FieldGroup,
  FieldError
} from "@/components/ui/field";
import {
  ShieldCheckIcon,
  UserPlusIcon,
  Loader2Icon,
  MailIcon,
  UserIcon,
  LockIcon,
  CheckCircleIcon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { z } from "zod";

const adminSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type AdminFormData = z.infer<typeof adminSchema>;

export default function AddAdminPage() {
  const [formData, setFormData] = useState<AdminFormData>({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof AdminFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    // Clear field error
    if (errors[id as keyof AdminFormData]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id as keyof AdminFormData];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validation = adminSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: any = {};
      validation.error.issues.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      await userApi.createAdmin(formData);
      setIsSuccess(true);
      toast.success("New admin created successfully!");
      setFormData({ name: "", email: "", password: "" });

      // Navigate back after delay
      setTimeout(() => {
        router.push("/dashboard/users");
      }, 3000);
    } catch (error: any) {
      console.error("Create Admin Error:", error);
      toast.error(error.message || "Failed to create new admin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto py-8 lg:p-12 space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-1.5"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShieldCheckIcon className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-blue-600 font-bold uppercase tracking-widest text-xs">Security Control</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Grant Administrative Rights</h1>
          <p className="text-muted-foreground text-lg">Create a new dashboard administrator for the LMS platform.</p>
        </motion.div>

        <Button variant="outline" className="rounded-full px-6" onClick={() => router.back()}>
          Back to User List
        </Button>
      </div>

      <div className="grid lg:grid-cols-12 gap-12 items-start">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-4 space-y-6 px-4"
        >
          <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <LockIcon className="w-5 h-5 text-blue-600" />
              Security Protocol
            </h3>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Admins have access to all system categories and books.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Can manage all user accounts and block memberships.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Cannot create other admins or manage SuperAdmin rights.</span>
              </li>
            </ul>
          </div>

          <div className="px-4 py-8 bg-blue-600 rounded-[2rem] text-white shadow-xl shadow-blue-500/20">
            <h4 className="font-bold flex items-center gap-2 mb-2 text-lg">
              <UserPlusIcon className="w-5 h-5" /> Quick Tips
            </h4>
            <p className="text-blue-100 text-sm leading-relaxed">
              New admins will use their email and password to access the specialized dashboard layout. Encourage them to enable MFA upon first login.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-8 px-4"
        >
          <Card className="border-none shadow-3xl rounded-[2.5rem] overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 w-full" />
            <CardHeader className="p-10 pb-6">
              <CardTitle className="text-3xl font-bold">Admin Credentials</CardTitle>
              <CardDescription className="text-lg">
                Fill in the details below to initialize the high-privilege account.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-10 pt-0">
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="py-12 text-center space-y-6"
                  >
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                      <CheckCircleIcon className="w-10 h-10" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Success!</h3>
                      <p className="text-muted-foreground text-lg">
                        Administrative access has been granted to <span className="text-foreground font-bold">{formData.email}</span>.
                      </p>
                    </div>
                    <div className="pt-4 animate-pulse text-blue-600 font-semibold">
                      Redirecting to management center...
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <FieldGroup className="gap-8">
                      <Field>
                        <FieldLabel htmlFor="name" className="text-base font-bold text-slate-700 dark:text-slate-300">
                          Full Name
                        </FieldLabel>
                        <div className="relative group">
                          <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                          <Input
                            id="name"
                            placeholder="John Smith"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="pl-12 py-7 rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50/50 focus:bg-white transition-all text-lg font-medium"
                          />
                        </div>
                        {errors.name && <FieldError errors={[{ message: errors.name }]} />}
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="email" className="text-base font-bold text-slate-700 dark:text-slate-300">
                          Corporate Email Address
                        </FieldLabel>
                        <div className="relative group">
                          <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                          <Input
                            id="email"
                            placeholder="admin@booknest.com"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="pl-12 py-7 rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50/50 focus:bg-white transition-all text-lg font-medium"
                          />
                        </div>
                        {errors.email && <FieldError errors={[{ message: errors.email }]} />}
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="password" className="text-base font-bold text-slate-700 dark:text-slate-300">
                          Secure System Password
                        </FieldLabel>
                        <div className="relative group">
                          <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                          <Input
                            id="password"
                            placeholder="••••••••"
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="pl-12 py-7 rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50/50 focus:bg-white transition-all text-lg font-medium"
                          />
                        </div>
                        {errors.password && <FieldError errors={[{ message: errors.password }]} />}
                      </Field>

                      <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                        className="w-full rounded-[1.5rem] py-8 text-xl font-bold bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all transform hover:-translate-y-0.5 active:scale-[0.98]"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2Icon className="mr-3 h-6 w-6 animate-spin" />
                            Establishing Connection...
                          </>
                        ) : (
                          <>Initialize Admin Account</>
                        )}
                      </Button>
                    </FieldGroup>
                  </form>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
