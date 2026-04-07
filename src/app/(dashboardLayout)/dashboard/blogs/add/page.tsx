"use client";

import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { blogApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeftIcon, UploadCloudIcon, XIcon, Loader2Icon, CheckCircle2Icon } from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import { Field, FieldError } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

const blogSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  category: z.string().min(1, "Category is required"),
  author: z.string().min(1, "Author name is required"),
  published: z.boolean().default(true),
  image: z.any().optional(),
});

export default function AddBlogPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "Library News",
    author: "Library Editor",
    published: true,
  });
  
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    
    const result = blogSchema.safeParse({ ...formData, image: file });
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
    
    try {
      const fd = new FormData();
      fd.append("data", JSON.stringify(formData));
      
      if (file) {
        fd.append("image", file);
      }

      await blogApi.create(fd);
      router.push("/dashboard/blogs");
      router.refresh();
    } catch (error: any) {
      console.error("Failed to add blog:", error);
      setApiError(error.message || "Failed to create article. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="rounded-xl" asChild>
          <Link href="/dashboard/blogs">
            <ArrowLeftIcon className="h-4 w-4" />
          </Link>
        </Button>
        <div>
           <h1 className="text-3xl font-extrabold tracking-tight">Create New Article</h1>
           <p className="text-muted-foreground font-medium">Compose a new story for the library journal</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <Card className="border-none shadow-xl shadow-zinc-200/50 rounded-[2rem] overflow-hidden">
              <CardHeader className="bg-zinc-50/50 pb-8">
                <CardTitle className="text-xl font-bold">Article Content</CardTitle>
                <CardDescription className="font-medium">Write the main body and title of your blog post</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-8">
                <Field>
                  <Label htmlFor="title" className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2 block">Article Title <span className="text-destructive">*</span></Label>
                  <Input 
                    id="title" 
                    value={formData.title} 
                    onChange={handleInputChange} 
                    placeholder="Enter a compelling title..." 
                    className={cn("h-12 border-zinc-200 rounded-xl focus:ring-blue-100", errors.title ? "border-destructive ring-destructive/20" : "")} 
                  />
                  {errors.title && <FieldError errors={[{ message: errors.title }]} />}
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field>
                      <Label htmlFor="author" className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2 block">Author Name <span className="text-destructive">*</span></Label>
                      <Input 
                        id="author" 
                        value={formData.author} 
                        onChange={handleInputChange} 
                        placeholder="Ex. Jane Doe" 
                        className={cn("h-12 border-zinc-200 rounded-xl", errors.author ? "border-destructive ring-destructive/20" : "")} 
                      />
                      {errors.author && <FieldError errors={[{ message: errors.author }]} />}
                    </Field>
                    
                    <Field>
                      <Label htmlFor="category" className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2 block">Category <span className="text-destructive">*</span></Label>
                      <Input 
                        id="category" 
                        value={formData.category} 
                        onChange={handleInputChange} 
                        placeholder="Ex. Announcements" 
                        className={cn("h-12 border-zinc-200 rounded-xl", errors.category ? "border-destructive ring-destructive/20" : "")} 
                      />
                      {errors.category && <FieldError errors={[{ message: errors.category }]} />}
                    </Field>
                </div>

                <Field>
                  <Label htmlFor="content" className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2 block">Main Content (HTML Supported) <span className="text-destructive">*</span></Label>
                  <Textarea 
                    id="content" 
                    value={formData.content} 
                    onChange={handleInputChange} 
                    placeholder="Tell your story here..." 
                    rows={15} 
                    className={cn("border-zinc-200 rounded-2xl resize-none py-4 px-4 leading-relaxed", errors.content ? "border-destructive ring-destructive/20" : "")} 
                  />
                  {errors.content && <FieldError errors={[{ message: errors.content }]} />}
                  <p className="text-[10px] text-muted-foreground mt-2 font-bold uppercase tracking-widest flex items-center gap-1">
                      <CheckCircle2Icon className="w-3 h-3 text-blue-500" />
                      Markdown and HTML formatting is fully supported
                  </p>
                </Field>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            {/* Status Card */}
            <Card className="border-none shadow-xl shadow-zinc-200/50 rounded-[2rem] overflow-hidden">
                <CardHeader className="bg-zinc-50/50 pb-6">
                    <CardTitle className="text-lg font-bold">Publishing</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                    <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                        <Label htmlFor="published" className="font-bold text-sm text-gray-700">Go Live?</Label>
                        <Switch 
                            id="published" 
                            checked={formData.published} 
                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))} 
                        />
                    </div>
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                        If enabled, this article will be immediately visible on the public journal page.
                    </p>
                </CardContent>
            </Card>

            {/* Feature Image Card */}
            <Card className="border-none shadow-xl shadow-zinc-200/50 rounded-[2rem] overflow-hidden">
              <CardHeader className="bg-zinc-50/50 pb-6">
                <CardTitle className="text-lg font-bold">Feature Image</CardTitle>
              </CardHeader>
               <CardContent className="p-6">
                <Field className="w-full">
                  {!preview ? (
                    <div 
                      className={cn(
                        "flex flex-col items-center justify-center border-2 border-dashed rounded-3xl w-full aspect-square cursor-pointer hover:bg-blue-50/50 hover:border-blue-300 transition-all border-zinc-200 group px-4 text-center",
                        errors.image ? "border-destructive/50" : ""
                      )}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <UploadCloudIcon className="h-10 w-10 text-blue-200 transition-transform group-hover:-translate-y-1" />
                      <p className="mt-4 font-bold text-sm text-gray-700">Upload Header</p>
                      <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest">JPG, PNG up to 5MB</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </div>
                  ) : (
                    <div className="relative group rounded-3xl overflow-hidden border border-zinc-100 shadow-lg w-full aspect-square bg-zinc-50">
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                            <Button 
                              type="button" 
                              variant="destructive" 
                              className="h-10 px-4 shadow-xl rounded-xl font-bold gap-2" 
                              onClick={removeFile}
                            >
                                <XIcon className="h-4 w-4" />
                                Remove Image
                            </Button>
                        </div>
                    </div>
                  )}
                  {errors.image && <FieldError errors={[{ message: errors.image }]} />}
                </Field>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-4">
              <Button type="submit" disabled={isSubmitting} className="h-14 rounded-2xl text-lg font-bold shadow-xl shadow-blue-600/20 bg-blue-600 hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-95">
                {isSubmitting ? (
                   <>
                     <Loader2Icon className="mr-2 h-5 w-5 animate-spin" />
                     Saving Changes...
                   </>
                ) : (
                   "Post Article"
                )}
              </Button>
              <Button type="button" variant="outline" asChild disabled={isSubmitting} className="h-14 rounded-2xl border-zinc-200 font-bold hover:bg-zinc-50">
                <Link href="/dashboard/blogs">Discard Article</Link>
              </Button>
            </div>
            
            {apiError && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold rounded-2xl animate-in fade-in slide-in-from-top-2">
                {apiError}
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
