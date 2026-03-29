"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { bookApi, categoryApi, Category } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeftIcon, UploadCloudIcon, XIcon, Loader2Icon, CheckCircle2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { Field, FieldError } from "@/components/ui/field";
import Link from "next/link";

const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  categoryId: z.string().min(1, "Category is required"),
  isbn: z.string().optional(),
  language: z.string().optional(),
  year: z.string().optional(),
  pages: z.string().refine(v => !v || !isNaN(Number(v)), "Pages must be a number").optional(),
  description: z.string().optional(),
  image: z.any().optional(),
});

export default function EditBookPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    language: "English",
    year: "",
    pages: "",
    description: "",
    categoryId: ""
  });
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookData, catsData] = await Promise.all([
          bookApi.getById(id),
          categoryApi.getAll()
        ]);
        
        const book = (bookData as any).data || bookData;
        const cats = Array.isArray(catsData) ? catsData : (catsData as any).data || [];
        
        setCategories(cats);
        setFormData({
          title: book.title,
          author: book.author,
          isbn: book.isbn || "",
          language: book.language || "English",
          year: book.year || "",
          pages: book.pages?.toString() || "",
          description: book.description || "",
          categoryId: book.categoryId
        });
        setExistingImage(book.coverImage);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch book details:", err);
        setApiError("Failed to load book or categories.");
        setIsLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 2 * 1024 * 1024) {
         setErrors({ image: "Cover image size should be less than 2MB" });
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
    
    const result = bookSchema.safeParse({ ...formData, image: file });
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
      fd.append("data", JSON.stringify({
        ...formData,
        pages: formData.pages ? parseInt(formData.pages) : undefined
      }));
      
      if (file) {
        fd.append("coverImage", file);
      }

      await bookApi.update(id, fd);
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/books");
        router.refresh();
      }, 1500);
    } catch (error: any) {
      console.error("Failed to update book:", error);
      setApiError(error.message || "Failed to update book.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center -mt-20">
        <div className="flex flex-col items-center gap-4">
          <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">Checking records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild className="rounded-full h-10 w-10">
          <Link href="/dashboard/books">
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex flex-col">
           <h1 className="text-2xl font-bold tracking-tight">Edit Book</h1>
           <p className="text-muted-foreground text-sm">Managing: <span className="font-semibold text-foreground italic">"{formData.title}"</span></p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <Card className="border-border/40 shadow-sm relative overflow-hidden">
               {success && (
                 <div className="absolute top-0 left-0 right-0 bg-emerald-500 text-white py-3 px-4 z-10 text-center font-bold animate-in slide-in-from-top duration-300">
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle2Icon className="h-4 w-4" /> Updating repository...
                    </div>
                 </div>
               )}
              <CardHeader>
                <CardTitle className="text-lg font-bold uppercase tracking-widest opacity-60 flex items-center gap-2">
                  <div className="h-1 w-8 bg-primary rounded-full" />
                  General Details
                </CardTitle>
              </CardHeader>
               <CardContent className="space-y-6 pt-0">
                <Field>
                  <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wide opacity-80">Book Title <span className="text-destructive">*</span></Label>
                  <Input id="title" value={formData.title} onChange={handleInputChange} className={cn("h-11 border-border/80 font-semibold text-lg", errors.title ? "border-destructive text-destructive" : "")} />
                  {errors.title && <FieldError errors={[{ message: errors.title }]} />}
                </Field>
                <div className="grid grid-cols-2 gap-6">
                  <Field>
                    <Label htmlFor="author" className="text-xs font-bold uppercase tracking-wide opacity-80">Author <span className="text-destructive">*</span></Label>
                    <Input id="author" value={formData.author} onChange={handleInputChange} className={cn("h-10 border-border/80", errors.author ? "border-destructive" : "")} />
                    {errors.author && <FieldError errors={[{ message: errors.author }]} />}
                  </Field>
                  <Field>
                    <Label htmlFor="categoryId" className="text-xs font-bold uppercase tracking-wide opacity-80">Category <span className="text-destructive">*</span></Label>
                    <select
                      id="categoryId"
                      className={cn(
                        "flex h-10 w-full rounded-md border border-border/80 bg-transparent px-3 py-2 text-sm ring-offset-background focus:ring-1 focus:ring-primary/40 font-medium",
                        errors.categoryId ? "border-destructive" : ""
                      )}
                      value={formData.categoryId}
                      onChange={handleInputChange}
                    >
                      <option value="">Choose Repository</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ) )}
                    </select>
                    {errors.categoryId && <FieldError errors={[{ message: errors.categoryId }]} />}
                  </Field>
                </div>
                <Field>
                  <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wide opacity-80">Synopsis / Description</Label>
                  <Textarea id="description" value={formData.description} onChange={handleInputChange} rows={8} className={cn("border-border/80 resize-none rounded-xl", errors.description ? "border-destructive" : "")} placeholder="Describe the soul of this book..." />
                  {errors.description && <FieldError errors={[{ message: errors.description }]} />}
                </Field>
              </CardContent>
            </Card>

            <Card className="border-border/40 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xs font-bold uppercase tracking-widest opacity-60">Metadata Specifications</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-x-8 gap-y-4 pt-0">
                <Field className="space-y-1.5 px-1">
                  <Label htmlFor="isbn" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">ISBN Identitifier</Label>
                  <Input id="isbn" value={formData.isbn} onChange={handleInputChange} className={cn("h-10 border-border/80", errors.isbn ? "border-destructive text-destructive" : "")} />
                  {errors.isbn && <FieldError errors={[{ message: errors.isbn }]} />}
                </Field>
                <Field className="space-y-1.5 px-1">
                  <Label htmlFor="language" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Publication Language</Label>
                  <Input id="language" value={formData.language} onChange={handleInputChange} className={cn("h-10 border-border/80", errors.language ? "border-destructive text-destructive" : "")} />
                  {errors.language && <FieldError errors={[{ message: errors.language }]} />}
                </Field>
                <Field className="space-y-1.5 px-1">
                  <Label htmlFor="year" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Publish Year</Label>
                  <Input id="year" value={formData.year} onChange={handleInputChange} className={cn("h-10 border-border/80", errors.year ? "border-destructive text-destructive" : "")} />
                  {errors.year && <FieldError errors={[{ message: errors.year }]} />}
                </Field>
                <Field className="space-y-1.5 px-1">
                  <Label htmlFor="pages" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Page Collection</Label>
                  <Input id="pages" type="number" value={formData.pages} onChange={handleInputChange} className={cn("h-10 border-border/80", errors.pages ? "border-destructive text-destructive" : "")} />
                  {errors.pages && <FieldError errors={[{ message: errors.pages }]} />}
                </Field>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-border/40 shadow-sm">
              <CardHeader className="p-4">
                <CardTitle className="text-xs font-bold text-center uppercase tracking-widest opacity-60">Cover Art</CardTitle>
              </CardHeader>
               <CardContent className="space-y-6 pt-0 px-4 flex flex-col items-center">
                <div className="w-full">
                   {existingImage && !preview && (
                      <div className="space-y-3">
                         <div className="border border-border/80 p-2 rounded-xl h-64 w-full relative group">
                            <img src={existingImage} alt="Current" className="h-full w-full object-cover rounded-lg shadow-sm" />
                            <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-2 py-1 text-[8px] font-bold rounded uppercase">Active</div>
                         </div>
                      </div>
                   )}
                   
                   <Field className="space-y-2 mt-4">
                       {!preview ? (
                           <Button 
                            type="button" 
                            variant="outline" 
                            className={cn(
                              "w-full h-12 border-dashed border-2 hover:bg-accent hover:border-primary/50",
                              errors.image ? "border-destructive text-destructive" : ""
                            )}
                            onClick={() => fileInputRef.current?.click()}
                           >
                             <UploadCloudIcon className="h-4 w-4 mr-2" />
                             New Cover Upload
                           </Button>
                       ) : (
                           <div className="relative group rounded-xl overflow-hidden border-2 border-primary/20 shadow-2xl h-64 w-full">
                               <img src={preview} alt="New Preview" className="h-full w-full object-cover" />
                               <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                                   <p className="text-xs text-white font-bold uppercase tracking-wider">Release current preview?</p>
                                   <Button 
                                     type="button" 
                                     variant="destructive" 
                                     size="icon" 
                                     className="h-10 w-10 shadow-xl rounded-full" 
                                     onClick={removeFile}
                                   >
                                       <XIcon className="h-5 w-5" />
                                   </Button>
                               </div>
                           </div>
                       )}
                       {errors.image && <FieldError errors={[{ message: errors.image }]} />}
                       <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                       />
                   </Field>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3">
              <Button type="submit" disabled={isSubmitting} className="h-12 shadow-xl hover:translate-y-[-1px] transition-transform">
                {isSubmitting ? (
                   <>
                     <Loader2Icon className="mr-2 h-5 w-5 animate-spin" />
                     Updating...
                   </>
                ) : (
                   "Commit Changes"
                )}
              </Button>
              <Button type="button" variant="ghost" asChild disabled={isSubmitting} className="h-11 border border-border/40 font-medium">
                <Link href="/dashboard/books">Discard Edits</Link>
              </Button>
            </div>
            
            {apiError && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm font-semibold rounded-lg">
                {apiError}
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
