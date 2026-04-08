"use client";

import { useEffect, useState } from "react";
import { membershipPlanApi, MembershipPlan } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon, PencilIcon, Trash2Icon, CreditCardIcon, ArrowLeftIcon, SaveIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion, AnimatePresence } from "motion/react";
import { DashboardLoading } from "@/components/layout/DashboardLoading";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field, FieldError } from "@/components/ui/field";
import { z } from "zod";

const planSchema = z.object({
  name: z.enum(["BASIC", "SILVER", "GOLD"]),
  price: z.number().min(0, "Price must be at least 0"),
  borrowLimit: z.number().min(0, "Borrow limit must be at least 0"),
  durationDays: z.number().min(1, "Duration must be at least 1 day"),
  description: z.string().min(1, "Description is required"),
  interval: z.string().min(1, "Interval is required"),
  features: z.array(z.string().min(1, "Feature description cannot be empty")).min(1, "At least one feature is required"),
});

export default function MembershipPlansPage() {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<"list" | "form">("list");
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);
  const [formData, setFormData] = useState({
    name: "BASIC",
    price: 0 as number | "",
    borrowLimit: 5 as number | "",
    durationDays: 30 as number | "",
    description: "",
    interval: "/month",
    features: [""] as string[]
  });
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      const data = await membershipPlanApi.getAll();
      setPlans(Array.isArray(data) ? data : (data as any).data || []);
    } catch (error) {
      console.error("Failed to fetch plans:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleOpenForm = (plan?: MembershipPlan) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        name: plan.name,
        price: plan.price,
        borrowLimit: plan.borrowLimit,
        durationDays: plan.durationDays,
        description: plan.description || "",
        interval: plan.interval || "/month",
        features: plan.features?.length > 0 ? plan.features : [""]
      });
    } else {
      setEditingPlan(null);
      setFormData({
        name: "BASIC",
        price: 0,
        borrowLimit: 5,
        durationDays: 30,
        description: "",
        interval: "/month",
        features: [""]
      });
    }
    setView("form");
    setErrors({});
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      price: Number(formData.price) || 0,
      borrowLimit: Number(formData.borrowLimit) || 0,
      durationDays: Number(formData.durationDays) || 0,
      features: formData.features.filter(f => f.trim().length > 0)
    };

    const result = planSchema.safeParse(payload);
    if (!result.success) {
      const fieldErrors: any = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    try {
      if (editingPlan) {
        await membershipPlanApi.update(editingPlan.id, result.data);
        alert("Membership plan updated successfully");
      } else {
        await membershipPlanApi.create(result.data);
        alert("Membership plan created successfully");
      }
      setView("list");
      fetchPlans();
    } catch (error: any) {
      alert(error.message || "Failed to save plan");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await membershipPlanApi.delete(id);
      setPlans(prev => prev.filter(p => p.id !== id));
      alert("Membership plan removed");
    } catch (error: any) {
      alert(error.message || "Failed to delete plan");
    }
  };

  if (isLoading && view === "list") return <DashboardLoading />;

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {view === "list" ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Membership Plans</h1>
                <p className="text-sm text-muted-foreground">Define and manage available membership tiers.</p>
              </div>
              <Button size="sm" onClick={() => handleOpenForm()} className="gap-2">
                <PlusCircleIcon className="h-4 w-4" /> Create Plan
              </Button>
            </div>

            <div className="rounded-xl border shadow-sm bg-card overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/20">
                  <TableRow>
                    <TableHead className="pl-6 w-[200px]">Plan Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Borrow Limit</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead className="text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans.map((plan) => (
                    <TableRow key={plan.id} className="group hover:bg-muted/5 transition-colors">
                      <TableCell className="font-semibold pl-6">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-md ${plan.name === "GOLD" ? "bg-amber-500/10 text-amber-500" :
                              plan.name === "SILVER" ? "bg-slate-300/20 text-slate-500" :
                                "bg-primary/10 text-primary"
                            }`}>
                            <CreditCardIcon className="h-4 w-4" />
                          </div>
                          {plan.name}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">${plan.price.toFixed(2)}</TableCell>
                      <TableCell>{plan.borrowLimit} Books</TableCell>
                      <TableCell>{plan.durationDays} Days</TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenForm(plan)}>
                            <PencilIcon className="h-3.5 w-3.5" />
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                <Trash2Icon className="h-3.5 w-3.5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Plan?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will remove the "{plan.name}" plan. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(plan.id)} className="bg-destructive text-destructive-foreground">
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {plans.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                        No plans found. Create one to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-xl mx-auto"
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4 mb-2">
                  <Button variant="ghost" size="icon" onClick={() => setView("list")} className="h-8 w-8">
                    <ArrowLeftIcon className="h-4 w-4" />
                  </Button>
                  <div>
                    <CardTitle>{editingPlan ? "Update Plan" : "New Membership Plan"}</CardTitle>
                    <CardDescription>Fill in the details for your membership tier.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Tier Name</Label>
                    <div className="flex gap-2">
                      {["BASIC", "SILVER", "GOLD"].map(tier => (
                        <Button
                          key={tier}
                          type="button"
                          variant={formData.name === tier ? "default" : "outline"}
                          size="sm"
                          onClick={() => setFormData(prev => ({ ...prev, name: tier as any }))}
                          className="flex-1"
                        >
                          {tier}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Field>
                      <Label htmlFor="price">Price ($)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value === "" ? "" : parseFloat(e.target.value) }))}
                        className={errors.price ? "border-destructive" : ""}
                      />
                      {errors.price && <FieldError errors={[{ message: errors.price }]} />}
                    </Field>
                    <Field>
                      <Label htmlFor="borrowLimit">Borrow Limit</Label>
                      <Input
                        id="borrowLimit"
                        type="number"
                        value={formData.borrowLimit}
                        onChange={(e) => setFormData(prev => ({ ...prev, borrowLimit: e.target.value === "" ? "" : parseInt(e.target.value) }))}
                        className={errors.borrowLimit ? "border-destructive" : ""}
                      />
                      {errors.borrowLimit && <FieldError errors={[{ message: errors.borrowLimit }]} />}
                    </Field>
                  </div>

                  <Field>
                    <Label htmlFor="description">Description (Short)</Label>
                    <Input
                      id="description"
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className={errors.description ? "border-destructive" : ""}
                    />
                    {errors.description && <FieldError errors={[{ message: errors.description }]} />}
                  </Field>

                  <div className="grid grid-cols-2 gap-4">
                    <Field>
                      <Label htmlFor="durationDays">Duration (Days)</Label>
                      <Input
                        id="durationDays"
                        type="number"
                        value={formData.durationDays}
                        onChange={(e) => setFormData(prev => ({ ...prev, durationDays: e.target.value === "" ? "" : parseInt(e.target.value) }))}
                        className={errors.durationDays ? "border-destructive" : ""}
                      />
                      {errors.durationDays && <FieldError errors={[{ message: errors.durationDays }]} />}
                    </Field>
                    <Field>
                      <Label htmlFor="interval">Interval (Text)</Label>
                      <Input
                        id="interval"
                        type="text"
                        value={formData.interval}
                        onChange={(e) => setFormData(prev => ({ ...prev, interval: e.target.value }))}
                        placeholder="e.g. /month"
                        className={errors.interval ? "border-destructive" : ""}
                      />
                      {errors.interval && <FieldError errors={[{ message: errors.interval }]} />}
                    </Field>
                  </div>

                   <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center mb-1">
                      <Label>Include Plan Features</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setFormData(prev => ({ ...prev, features: [...prev.features, ""] }))}
                        className="h-8 shadow-sm"
                      >
                        <PlusCircleIcon className="h-4 w-4 mr-1.5" /> Add
                      </Button>
                    </div>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                      {formData.features.map((feature, idx) => (
                        <div key={idx} className="flex flex-col gap-1">
                          <div className="flex gap-2 items-center">
                            <Input
                              value={feature}
                              onChange={(e) => {
                                const newFeatures = [...formData.features];
                                newFeatures[idx] = e.target.value;
                                setFormData(prev => ({ ...prev, features: newFeatures }));
                              }}
                              placeholder={`e.g. Borrow up to ${formData.borrowLimit} books`}
                              className={cn("bg-transparent", errors.features && !feature ? "border-destructive" : "")}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              className="text-destructive shrink-0 h-9 w-9 p-0"
                              onClick={() => {
                                const newFeatures = formData.features.filter((_, i) => i !== idx);
                                setFormData(prev => ({ ...prev, features: newFeatures.length > 0 ? newFeatures : [""] }));
                              }}
                            >
                              <Trash2Icon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {errors.features && <FieldError errors={[{ message: errors.features }]} />}
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <Button type="button" variant="outline" className="flex-1" onClick={() => setView("list")}>
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1 gap-2">
                      <SaveIcon className="h-4 w-4" /> {editingPlan ? "Update" : "Save"} Plan
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
