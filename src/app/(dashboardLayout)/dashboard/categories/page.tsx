"use client";

import { useEffect, useState, useMemo } from "react";
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
import { Edit2Icon, Trash2Icon, PlusIcon, Loader2Icon, LayersIcon, BookOpenIcon, CheckCircle2Icon } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";

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

  const stats = useMemo(() => {
    const total = categories.length;
    const withBooks = categories.filter(c => (c as any).books?.length > 0).length;
    const totalBooks = categories.reduce((acc, curr) => acc + ((curr as any).books?.length || 0), 0);
    return [
      { title: "Total Categories", value: total, icon: LayersIcon, color: "text-amber-500", bg: "bg-amber-500/10" },
      { title: "With Books", value: withBooks, icon: CheckCircle2Icon, color: "text-emerald-500", bg: "bg-emerald-500/10" },
      { title: "Empty Categories", value: total - withBooks, icon: LayersIcon, color: "text-rose-500", bg: "bg-rose-500/10" },
      { title: "Global Books", value: totalBooks, icon: BookOpenIcon, color: "text-blue-500", bg: "bg-blue-500/10" }
    ];
  }, [categories]);

  const handleDelete = async (id: string) => {
    try {
      await categoryApi.delete(id);
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (error: any) {
      console.error("Failed to delete category:", error);
      alert(error.message || "Failed to delete category");
    }
  };

  if (isLoading) return <div className="p-4 flex h-64 items-center justify-center text-muted-foreground"><Loader2Icon className="animate-spin mr-2" /> Loading categories...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Category Management</h1>
          <p className="text-sm text-muted-foreground">Classify and organize your library books.</p>
        </div>
        <Button asChild size="sm">
          <Link href="/dashboard/categories/add">
            <PlusIcon className="mr-2 h-4 w-4" /> Add Category
          </Link>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`${stat.bg} p-2 rounded-lg`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="rounded-xl border shadow-sm bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/20">
            <TableRow>
              <TableHead className="w-[100px] pl-6">Image</TableHead>
              <TableHead>Category Name</TableHead>
              <TableHead>Active Books</TableHead>
              <TableHead className="text-right pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id} className="group hover:bg-muted/5 transition-colors">
                <TableCell className="pl-6">
                  <div className="h-10 w-10 overflow-hidden rounded-lg border bg-muted">
                    <img 
                      src={category.image || "/placeholder.png"} 
                      alt={category.name} 
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-semibold text-foreground/90">{category.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="px-3 rounded-full font-bold">
                    {(category as any).books?.length || 0}
                  </Badge>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                      <Link href={`/dashboard/categories/edit/${category.id}`}>
                        <Edit2Icon className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2Icon className="h-3.5 w-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="sm:max-w-[425px]">
                        {category.books && category.books.length > 0 ? (
                          <>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                                Deletion Restricted
                              </AlertDialogTitle>
                              <AlertDialogDescription className="pt-2 text-base">
                                You cannot delete <span className="font-bold">"{category.name}"</span> while it contains books.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-4 border-t border-border/50 pt-4">
                              <AlertDialogAction className="h-10 rounded-lg">I Understand</AlertDialogAction>
                            </AlertDialogFooter>
                          </>
                        ) : (
                          <>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently remove the <span className="font-bold">"{category.name}"</span> category.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-6 border-t pt-4">
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(category.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
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
