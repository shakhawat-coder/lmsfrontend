"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { bookApi, categoryApi, Category } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeftIcon, UploadCloudIcon, XIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";

export default function AddBookPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCats, setIsLoadingCats] = useState(true);
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
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryApi.getAll();
        setCategories(Array.isArray(data) ? data : (data as any).data || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setIsLoadingCats(false);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 2 * 1024 * 1024) {
         setError("Cover image size should be less than 2MB");
         return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.author || !formData.categoryId) {
        setError("Title, Author, and Category are required");
        return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      const fd = new FormData();
      // The backend expects 'data' field containing stringified JSON for creating books with multer
      fd.append("data", JSON.stringify({
        ...formData,
        pages: formData.pages ? parseInt(formData.pages) : undefined
      }));
      
      if (file) {
        fd.append("coverImage", file);
      }

      await bookApi.create(fd);
      router.push("/dashboard/books");
      router.refresh();
    } catch (error: any) {
      console.error("Failed to add book:", error);
      setError(error.message || "Failed to add book. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/books">
            <ArrowLeftIcon className="h-4 w-4" />
          </Link>
        </Button>
        <div>
           <h1 className="text-2xl font-bold">Add New Book</h1>
           <p className="text-muted-foreground">Register a new book in the library collection</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border/40 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Basic Information</CardTitle>
                <CardDescription>Major details about the book</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-semibold text-foreground/80">Book Title <span className="text-destructive">*</span></Label>
                  <Input id="title" value={formData.title} onChange={handleInputChange} placeholder="Ex. Clean Code" required className="h-10 border-border/60" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="author" className="text-sm font-semibold text-foreground/80">Author <span className="text-destructive">*</span></Label>
                    <Input id="author" value={formData.author} onChange={handleInputChange} placeholder="Robert C. Martin" required className="h-10 border-border/60" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categoryId" className="text-sm font-semibold text-foreground/80">Category <span className="text-destructive">*</span></Label>
                    <select
                      id="categoryId"
                      className="flex h-10 w-full rounded-md border border-border/60 bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/20"
                      value={formData.categoryId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ) )}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-semibold text-foreground/80">Description</Label>
                  <Textarea id="description" value={formData.description} onChange={handleInputChange} placeholder="A short overview of the book contents..." rows={4} className="border-border/60 resize-none" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Specifications</CardTitle>
                <CardDescription>Technical details and identification</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 pt-0">
                <div className="space-y-2">
                  <Label htmlFor="isbn" className="text-sm font-semibold text-foreground/80">ISBN</Label>
                  <Input id="isbn" value={formData.isbn} onChange={handleInputChange} placeholder="13-digit code" className="h-10 border-border/60" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language" className="text-sm font-semibold text-foreground/80">Language</Label>
                  <Input id="language" value={formData.language} onChange={handleInputChange} className="h-10 border-border/60" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year" className="text-sm font-semibold text-foreground/80">Publish Year</Label>
                  <Input id="year" value={formData.year} onChange={handleInputChange} placeholder="2023" className="h-10 border-border/60" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pages" className="text-sm font-semibold text-foreground/80">Total Pages</Label>
                  <Input id="pages" type="number" value={formData.pages} onChange={handleInputChange} placeholder="350" className="h-10 border-border/60" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-border/40 shadow-sm overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-center">Cover Image</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                {!preview ? (
                  <div 
                    className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl w-full aspect-[3/4] cursor-pointer hover:bg-accent/50 hover:border-primary/50 transition-all border-border/60 group px-4 text-center"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <UploadCloudIcon className="h-10 w-10 text-muted-foreground/60 transition-transform group-hover:-translate-y-1" />
                    <p className="mt-4 font-semibold text-sm">Upload Cover</p>
                    <p className="text-xs text-muted-foreground mt-1 underline">Click to browse</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                ) : (
                  <div className="relative group rounded-xl overflow-hidden border border-border shadow-xl w-full aspect-[3/4]">
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                          <Button 
                            type="button" 
                            variant="destructive" 
                            size="icon" 
                            className="h-9 w-9 shadow-xl rounded-full" 
                            onClick={removeFile}
                          >
                              <XIcon className="h-4 w-4" />
                          </Button>
                      </div>
                  </div>
                )}
                {file && <p className="text-[10px] text-muted-foreground truncate max-w-full px-2 mt-2">Ready: {file.name}</p>}
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3">
              <Button type="submit" disabled={isSubmitting} className="h-11 shadow-lg shadow-primary/5 transition-all hover:translate-y-[-1px]">
                {isSubmitting ? (
                   <>
                     <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                     Creating...
                   </>
                ) : (
                   "Publish Book"
                )}
              </Button>
              <Button type="button" variant="ghost" asChild disabled={isSubmitting} className="h-11 border border-border/40">
                <Link href="/dashboard/books">Discard Draft</Link>
              </Button>
            </div>
            
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg animate-in fade-in slide-in-from-top-1">
                {error}
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
