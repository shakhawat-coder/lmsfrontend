"use client";

import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { categoryApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeftIcon, UploadCloudIcon, XIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Field, FieldError } from "@/components/ui/field";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  image: z.any().refine((file) => file instanceof File, "Category image is required"),
});

export default function AddCategoryPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 2 * 1024 * 1024) {
         setErrors({ image: "Image size should be less than 2MB" });
         return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setErrors({});
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = categorySchema.safeParse({ name, image: file });
    if (!result.success) {
      const fieldErrors: any = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    setApiError(null);
    
    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", file as File);

    try {
      await categoryApi.create(formData);
      router.push("/dashboard/categories");
      router.refresh(); // Trigger a revalidation of categories list
    } catch (error: any) {
      console.error("Failed to create category:", error);
      setApiError(error.message || "Failed to create category. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/categories">
            <ArrowLeftIcon className="h-4 w-4" />
          </Link>
        </Button>
        <div>
           <h1 className="text-2xl font-bold">Add New Category</h1>
           <p className="text-muted-foreground">Create a new category for your LMS books</p>
        </div>
      </div>

      <Card className="border-border/40 shadow-sm">
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
          <CardDescription>Fill in the details for the new category.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Field>
              <Label htmlFor="name" className="text-sm font-semibold">Category Name</Label>
              <Input
                id="name"
                placeholder="Ex. Web Development, UI/UX Design..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={cn("h-10 border-border/60 focus:ring-primary/20", errors.name ? "border-destructive" : "")}
              />
              {errors.name && <FieldError errors={[{ message: errors.name }]} />}
            </Field>

            <Field className="space-y-3">
              <Label className="text-sm font-semibold">Category Image</Label>
              {!preview ? (
                <div 
                  className={cn(
                    "flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-10 cursor-pointer hover:bg-accent/50 hover:border-primary/50 transition-all group",
                    errors.image ? "border-destructive/50" : "border-border"
                  )}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="bg-primary/10 p-3 rounded-full group-hover:bg-primary/20 transition-colors">
                    <UploadCloudIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="mt-4 text-center">
                    <p className="font-medium">Click to upload or drag & drop</p>
                    <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG (max 2MB)</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    id="image-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              ) : (
                <div className="relative group rounded-xl overflow-hidden border border-border shadow-sm max-w-xs mx-auto">
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className="w-full aspect-square object-cover" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button 
                          type="button" 
                          variant="destructive" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile();
                          }}
                        >
                            <XIcon className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
              )}
              {errors.image && <FieldError errors={[{ message: errors.image }]} />}
            </Field>

            {apiError && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-md mb-4">
                {apiError}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
              <Button type="button" variant="ghost" asChild disabled={isSubmitting}>
                <Link href="/dashboard/categories">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
                {isSubmitting ? (
                   <>
                     <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                     Creating...
                   </>
                ) : (
                   "Create Category"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
