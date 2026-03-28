"use client";

import { useEffect, useState } from "react";
import { categoryApi, Category } from "@/lib/api";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2Icon, Trash2Icon, PlusIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
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
import Image from "next/image";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const data = await categoryApi.getAll();
      setCategories(Array.isArray(data) ? data : (data as any).data || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await categoryApi.delete(id);
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (error: any) {
      console.error("Failed to delete category:", error);
      alert(error.message || "Failed to delete category");
    }
  };

  if (isLoading) return <div className="p-4">Loading categories...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Category Management</h1>
        <Button asChild size="sm">
          <Link href="/dashboard/categories/add">
            <PlusIcon className="mr-2 h-4 w-4" /> Add Category
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableCaption>A list of available categories.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Category Name</TableHead>
              <TableHead>Active Books</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  <div className="h-10 w-10 overflow-hidden rounded-md border">
                    <img 
                      src={category.image || "/placeholder.png"} 
                      alt={category.name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{(category as any).books?.length || 0}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/dashboard/categories/edit/${category.id}`}>
                        <Edit2Icon className="h-4 w-4" />
                      </Link>
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="group text-destructive">
                          <Trash2Icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="sm:max-w-[425px]">
                        {category.books && category.books.length > 0 ? (
                          <>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                                <span className="bg-destructive/10 p-2 rounded-full">
                                  <Trash2Icon className="h-5 w-5" />
                                </span>
                                Deletion Restricted
                              </AlertDialogTitle>
                              <AlertDialogDescription className="pt-2 text-base text-foreground/80">
                                You cannot delete the category 
                                <span className="block font-bold mt-2 text-foreground underline decoration-destructive/30 decoration-2 underline-offset-4 tracking-tight text-lg italic">
                                  "{category.name}"
                                </span> 
                                because it currently contains <span className="font-bold text-destructive">{category.books.length}</span> associated book(s).
                              </AlertDialogDescription>
                              <p className="text-xs text-muted-foreground mt-4 border-l-2 border-primary/20 pl-3 py-1 bg-accent/30 rounded-r-sm">
                                Tip: Delete or move all books in this category before attempting to delete it.
                              </p>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-4 border-t border-border/50 pt-4">
                              <AlertDialogAction className="w-full sm:w-auto h-11 px-8 rounded-lg">
                                I Understand
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </>
                        ) : (
                          <>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-xl">Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription className="pt-2">
                                This action is permanent. This will delete the category 
                                <span className="font-bold text-foreground mx-1">"{category.name}"</span> 
                                and it cannot be recovered.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-6 border-t border-border/50 pt-4">
                              <AlertDialogCancel className="h-11 px-6 rounded-lg text-foreground hover:bg-accent/60">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(category.id)}
                                className="h-11 px-8 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all active:scale-95 shadow-lg shadow-destructive/10"
                              >
                                Delete Category
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </>
                        )}
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
