"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { bannerApi, Banner } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeftIcon, UploadCloudIcon, XIcon, Loader2Icon, CheckCircle2Icon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { Field, FieldError } from "@/components/ui/field";

const bannerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  buttonText: z.string().min(1, "Button text is required"),
  buttonLink: z.string().min(1, "Button link is required"),
  image: z.any().optional(),
});

export default function EditBannerPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    buttonText: "",
    buttonLink: "",
    isActive: true,
  });
  
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const data = await bannerApi.getById(id);
        const banner = (data as any).data || data;
        setFormData({
          title: banner.title,
          subtitle: banner.subtitle,
          buttonText: banner.buttonText,
          buttonLink: banner.buttonLink,
          isActive: banner.isActive,
        });
        setExistingImage(banner.image);
        setIsLoading(false);
      } catch (error: any) {
        console.error("Failed to fetch banner:", error);
        setApiError("Banner not found or failed to load.");
        setIsLoading(false);
      }
    };
    if (id) fetchBanner();
  }, [id]);

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

  const removeNewFile = () => {
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
    setSuccess(false);
    
    try {
      const submitData = new FormData();
      submitData.append("data", JSON.stringify(formData));
      if (file) {
        submitData.append("image", file);
      }

      await bannerApi.update(id, submitData);
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/banners");
        router.refresh();
      }, 1500);
    } catch (error: any) {
      console.error("Failed to update banner:", error);
      setApiError(error.message || "Failed to update banner.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2Icon className="h-8 w-8 animate-spin text-primary rotate-45" />
          <p className="text-sm font-medium">Crunching data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild className="rounded-full">
          <Link href="/dashboard/banners">
            <ArrowLeftIcon className="h-4 w-4" />
          </Link>
        </Button>
        <div>
           <h1 className="text-3xl font-bold tracking-tight">Edit Banner</h1>
           <p className="text-muted-foreground italic">Finetuning: <span className="text-primary font-bold not-italic">"{formData.title}"</span></p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-lg overflow-hidden relative">
            {success && (
              <div className="absolute top-0 inset-x-0 bg-emerald-500 text-white py-2 px-4 text-center text-xs font-bold z-10 animate-in slide-in-from-top duration-300">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle2Icon className="h-3 w-3" />
                  CHANGES SAVED SUCCESSFULLY
                </div>
              </div>
            )}
            <CardHeader className="bg-muted/10">
              <CardTitle>Core Information</CardTitle>
              <CardDescription>Update the primary text and CTA details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <Field>
                <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider opacity-60">Main Heading</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={cn("h-12 text-lg font-medium", errors.title && "border-destructive")}
                />
                {errors.title && <FieldError errors={[{ message: errors.title }]} />}
              </Field>

              <Field>
                <Label htmlFor="subtitle" className="text-xs font-bold uppercase tracking-wider opacity-60">Supporting Subtitle</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={handleInputChange}
                  className={cn(errors.subtitle && "border-destructive")}
                />
                {errors.subtitle && <FieldError errors={[{ message: errors.subtitle }]} />}
              </Field>

              <div className="grid grid-cols-2 gap-6">
                <Field>
                  <Label htmlFor="buttonText" className="text-xs font-bold uppercase tracking-wider opacity-60">Button Text</Label>
                  <Input
                    id="buttonText"
                    value={formData.buttonText}
                    onChange={handleInputChange}
                    className={cn(errors.buttonText && "border-destructive")}
                  />
                  {errors.buttonText && <FieldError errors={[{ message: errors.buttonText }]} />}
                </Field>

                <Field>
                  <Label htmlFor="buttonLink" className="text-xs font-bold uppercase tracking-wider opacity-60">Action URL</Label>
                  <Input
                    id="buttonLink"
                    value={formData.buttonLink}
                    onChange={handleInputChange}
                    className={cn(errors.buttonLink && "border-destructive font-mono text-xs")}
                  />
                  {errors.buttonLink && <FieldError errors={[{ message: errors.buttonLink }]} />}
                </Field>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-muted/10">
              <CardTitle>Visual Assets</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-8">
              <div className="space-y-3">
                 <Label className="text-[10px] font-black uppercase text-muted-foreground block">Active Imagery</Label>
                 <div className="aspect-video rounded-xl overflow-hidden border-2 border-muted relative shadow-inner">
                    <img src={preview || existingImage || "/placeholder.png"} alt="Preview" className="h-full w-full object-cover" />
                    {preview && (
                       <Button 
                         type="button" 
                         variant="destructive" 
                         size="icon" 
                         className="absolute top-2 right-2 h-7 w-7 rounded-full shadow-lg" 
                         onClick={removeNewFile}
                       >
                          <XIcon className="h-3.5 w-3.5" />
                       </Button>
                    )}
                 </div>
              </div>

              <div 
                className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl py-8 px-4 cursor-pointer hover:bg-primary/5 hover:border-primary transition-all border-muted group"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloudIcon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-xs font-bold mt-2 text-muted-foreground">{preview ? "Switch Image" : "Replace Background"}</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              {errors.image && <FieldError errors={[{ message: errors.image }]} />}
            </CardContent>
          </Card>

          {apiError && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium rounded-xl animate-shake">
              {apiError}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Button type="submit" disabled={isSubmitting} size="lg" className="rounded-xl shadow-md shadow-primary/20">
              {isSubmitting ? (
                 <>
                   <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                   UPDATING...
                 </>
              ) : (
                 "SAVE ALL CHANGES"
              )}
            </Button>
            <Button type="button" variant="ghost" asChild disabled={isSubmitting} className="rounded-xl">
              <Link href="/dashboard/banners">DISCARD</Link>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
