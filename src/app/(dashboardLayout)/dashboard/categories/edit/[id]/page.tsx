"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { categoryApi, Category } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeftIcon, UploadCloudIcon, XIcon, Loader2Icon, CheckCircle2Icon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { Field, FieldError } from "@/components/ui/field";

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  image: z.any().optional(),
});

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await categoryApi.getById(id);
        const category = (data as any).data || data;
        setName(category.name);
        setExistingImage(category.image);
        setIsLoading(false);
      } catch (error: any) {
        console.error("Failed to fetch category:", error);
        setApiError("Category not found or failed to load.");
        setIsLoading(false);
      }
    };
    if (id) fetchCategory();
  }, [id]);

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

  const removeNewFile = () => {
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
    setSuccess(false);
    
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (file) {
        formData.append("image", file);
      }

      await categoryApi.update(id, formData);
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/categories");
        router.refresh();
      }, 1500);
    } catch (error: any) {
      console.error("Failed to update category:", error);
      setApiError(error.message || "Failed to update category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading category details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/categories">
            <ArrowLeftIcon className="h-4 w-4" />
          </Link>
        </Button>
        <div>
           <h1 className="text-2xl font-bold">Edit Category</h1>
           <p className="text-muted-foreground">Modify details for <span className="text-foreground font-medium">{name}</span></p>
        </div>
      </div>

      <Card className="border-border/40 shadow-sm overflow-hidden">
        {success && (
          <div className="bg-emerald-500 text-white p-3 text-center text-sm font-medium animate-in fade-in slide-in-from-top-full transition-all">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2Icon className="h-4 w-4" />
              Category updated successfully! Redirecting...
            </div>
          </div>
        )}
        <CardHeader>
          <CardTitle>Category details</CardTitle>
          <CardDescription>Update name or image for this category.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <Field>
              <Label htmlFor="name" className="text-sm font-semibold">Category Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={cn("h-10 border-border/60 focus:ring-primary/20", errors.name ? "border-destructive" : "")}
                placeholder="Ex. Web Development"
              />
              {errors.name && <FieldError errors={[{ message: errors.name }]} />}
            </Field>

            <div className="space-y-4">
              <Label className="text-sm font-semibold">Category image</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {existingImage && (
                   <div className="space-y-2">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest pl-1">Current Image</p>
                      <div className="border border-border/60 rounded-xl overflow-hidden h-40 w-full relative group">
                         <img src={existingImage} alt="Current" className="h-full w-full object-cover" />
                         <div className="absolute inset-0 bg-black/5" />
                      </div>
                   </div>
                )}
                
                <Field className="space-y-2">
                    <p className="text-[10px] text-primary font-bold uppercase tracking-widest pl-1">
                       {preview ? "New preview" : "Upload new"}
                    </p>
                    {!preview ? (
                        <div 
                          className={cn(
                             "flex flex-col items-center justify-center border-2 border-dashed rounded-xl h-40 cursor-pointer hover:bg-primary/5 hover:border-primary/50 transition-all border-border/60 group",
                             errors.image ? "border-destructive/50" : ""
                          )}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <div className="bg-muted p-2 rounded-full group-hover:bg-primary/10 transition-colors">
                            <UploadCloudIcon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                          <span className="text-xs text-muted-foreground mt-3 font-medium">Change image</span>
                          <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                        </div>
                    ) : (
                        <div className="relative group rounded-xl overflow-hidden border border-primary/20 shadow-lg shadow-primary/5 h-40 w-full">
                            <img src={preview} alt="New Preview" className="h-full w-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                <Button 
                                  type="button" 
                                  variant="destructive" 
                                  size="icon" 
                                  className="h-9 w-9 rounded-full shadow-xl" 
                                  onClick={removeNewFile}
                                >
                                    <XIcon className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    )}
                    {errors.image && <FieldError errors={[{ message: errors.image }]} />}
                </Field>
              </div>
              <p className="text-[11px] text-muted-foreground italic">Note: Image update may require additional backend support.</p>
            </div>

            {apiError && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-md animate-shake">
                {apiError}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-6 border-t border-border/40">
              <Button type="button" variant="ghost" asChild disabled={isSubmitting}>
                <Link href="/dashboard/categories">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting} className="min-w-[140px] shadow-sm">
                {isSubmitting ? (
                   <>
                     <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                     Saving...
                   </>
                ) : (
                   "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
