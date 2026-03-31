"use client";

import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { bannerApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeftIcon, UploadCloudIcon, XIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Field, FieldError } from "@/components/ui/field";
import { z } from "zod";

const bannerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  buttonText: z.string().min(1, "Button text is required"),
  buttonLink: z.string().min(1, "Button link is required"),
  image: z.any().refine((file) => file instanceof File, "Banner image is required"),
});

export default function AddBannerPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    buttonText: "",
    buttonLink: "",
  });
  
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
         setErrors({ image: "Image size should be less than 5MB" });
         return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setErrors(prev => ({ ...prev, image: undefined }));
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = bannerSchema.safeParse({ ...formData, image: file });
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
    
    const submitData = new FormData();
    submitData.append("data", JSON.stringify({
      ...formData,
      isActive: true
    }));
    submitData.append("image", file as File);

    try {
      await bannerApi.create(submitData);
      router.push("/dashboard/banners");
      router.refresh();
    } catch (error: any) {
      console.error("Failed to create banner:", error);
      setApiError(error.message || "Failed to create banner. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/banners">
            <ArrowLeftIcon className="h-4 w-4" />
          </Link>
        </Button>
        <div>
           <h1 className="text-2xl font-bold">Create Homepage Banner</h1>
           <p className="text-muted-foreground">Add a new promotional slide to your landing page</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Details</CardTitle>
              <CardDescription>Primary text and information for the banner.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field>
                <Label htmlFor="title">Main Title</Label>
                <Input
                  id="title"
                  placeholder="Ex: Start Your Learning Journey"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={cn(errors.title && "border-destructive")}
                />
                {errors.title && <FieldError errors={[{ message: errors.title }]} />}
              </Field>

              <Field>
                <Label htmlFor="subtitle">Subtitle / Description</Label>
                <Input
                  id="subtitle"
                  placeholder="Ex: Join thousands of students..."
                  value={formData.subtitle}
                  onChange={handleInputChange}
                  className={cn(errors.subtitle && "border-destructive")}
                />
                {errors.subtitle && <FieldError errors={[{ message: errors.subtitle }]} />}
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <Label htmlFor="buttonText">Button Text</Label>
                  <Input
                    id="buttonText"
                    placeholder="Ex: Get Started"
                    value={formData.buttonText}
                    onChange={handleInputChange}
                    className={cn(errors.buttonText && "border-destructive")}
                  />
                  {errors.buttonText && <FieldError errors={[{ message: errors.buttonText }]} />}
                </Field>

                <Field>
                  <Label htmlFor="buttonLink">Button URL</Label>
                  <Input
                    id="buttonLink"
                    placeholder="Ex: /courses or https://..."
                    value={formData.buttonLink}
                    onChange={handleInputChange}
                    className={cn(errors.buttonLink && "border-destructive")}
                  />
                  {errors.buttonLink && <FieldError errors={[{ message: errors.buttonLink }]} />}
                </Field>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Banner Image</CardTitle>
              <CardDescription>High-resolution background image (16:9 recommended).</CardDescription>
            </CardHeader>
            <CardContent>
              {!preview ? (
                <div 
                  className={cn(
                    "flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 h-64 cursor-pointer hover:bg-accent/50 hover:border-primary transition-all",
                    errors.image ? "border-destructive" : "border-border"
                  )}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadCloudIcon className="h-8 w-8 text-primary opacity-50" />
                  <p className="mt-2 text-sm font-medium">Click to upload image</p>
                  <p className="text-xs text-muted-foreground mt-1 text-center">Max 5MB. Recommended size 1920x1080.</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              ) : (
                <div className="relative group rounded-xl overflow-hidden border border-border">
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className="w-full aspect-video object-cover" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button 
                          type="button" 
                          variant="destructive" 
                          size="sm" 
                          onClick={removeFile}
                        >
                            <XIcon className="h-4 w-4 mr-2" /> Remove Image
                        </Button>
                    </div>
                </div>
              )}
              {errors.image && <FieldError errors={[{ message: errors.image }]} className="mt-2" />}
            </CardContent>
          </Card>

          {apiError && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-md">
              {apiError}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={isSubmitting} size="lg">
              {isSubmitting ? (
                 <>
                   <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                   Processing...
                 </>
              ) : (
                 "Publish Banner"
              )}
            </Button>
            <Button type="button" variant="ghost" asChild disabled={isSubmitting}>
              <Link href="/dashboard/banners">Cancel</Link>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
