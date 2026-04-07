"use client";

import { useEffect, useState, useMemo } from "react";
import { blogApi, Blog } from "@/lib/api";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2Icon, Trash2Icon, PlusIcon, CheckCircle2Icon, XCircleIcon, NewspaperIcon, UserIcon, TagIcon, EyeIcon } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
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

export default function BlogsManagementPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      const data = await blogApi.getAll();
      setBlogs(Array.isArray(data) ? data : (data as any).data || []);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const stats = useMemo(() => {
    const total = blogs.length;
    const published = blogs.filter(b => b.published).length;
    const draft = total - published;
    return [
      { title: "Total Articles", value: total, icon: NewspaperIcon, color: "text-blue-500", bg: "bg-blue-500/10" },
      { title: "Published", value: published, icon: CheckCircle2Icon, color: "text-emerald-500", bg: "bg-emerald-500/10" },
      { title: "Drafts", value: draft, icon: XCircleIcon, color: "text-rose-500", bg: "bg-rose-500/10" },
    ];
  }, [blogs]);

  const handleDelete = async (id: string) => {
    try {
      await blogApi.delete(id);
      setBlogs(prev => prev.filter(b => b.id !== id));
    } catch (error: any) {
      console.error("Failed to delete blog:", error);
      alert(error.message || "Failed to delete blog");
    }
  };

  if (isLoading) return <div className="p-4 flex items-center justify-center h-64"><p className="text-muted-foreground">Loading articles...</p></div>;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Blog Management</h1>
          <p className="text-sm text-muted-foreground">Manage your library's journal, news, and insights.</p>
        </div>
        <Button asChild size="sm">
          <Link href="/dashboard/blogs/add">
            <PlusIcon className="mr-2 h-4 w-4" /> Create Article
          </Link>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
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

      {/* Main Content Area */}
      <Card className="border-none shadow-md overflow-hidden bg-white">
        <CardHeader className="bg-muted/30 pb-4">
          <CardTitle className="text-lg">Journal Inventory</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/10">
              <TableRow>
                <TableHead className="pl-6 w-[80px]">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground font-medium">
                    No articles found. Start writing your library's story today.
                  </TableCell>
                </TableRow>
              ) : (
                blogs.map((blog) => (
                  <TableRow key={blog.id} className="group hover:bg-muted/5 transition-colors">
                    <TableCell className="pl-6">
                      <div className="h-10 w-10 overflow-hidden rounded-lg border shadow-sm bg-muted flex items-center justify-center">
                        {blog.image ? (
                          <img 
                            src={blog.image} 
                            alt={blog.title} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <NewspaperIcon className="h-4 w-4 text-muted-foreground/30" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-foreground/90 max-w-[200px] truncate">{blog.title}</TableCell>
                    <TableCell className="text-muted-foreground font-normal text-xs uppercase tracking-wider">
                        <div className="flex items-center gap-1.5">
                            <UserIcon className="w-3 h-3" />
                            {blog.author}
                        </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-bold text-[10px] gap-1 border-blue-200 text-blue-600 bg-blue-50">
                        <TagIcon className="w-2.5 h-2.5" />
                        {blog.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={blog.published ? "success" : "outline"} 
                        className={`text-[10px] font-bold ${blog.published ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-zinc-50 text-zinc-500 border-zinc-200"}`}
                      >
                        {blog.published ? "PUBLISHED" : "DRAFT"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{new Date(blog.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                         <Button variant="ghost" size="icon" asChild className="h-8 w-8 hover:text-blue-600">
                          <Link href={`/blogs/${blog.id}`} target="_blank">
                            <EyeIcon className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild className="h-8 w-8 hover:text-blue-600">
                          <Link href={`/dashboard/blogs/edit/${blog.id}`}>
                            <Edit2Icon className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                              <Trash2Icon className="h-3.5 w-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-xl font-bold">Unpublish & Delete?</AlertDialogTitle>
                              <AlertDialogDescription className="text-muted-foreground font-medium">
                                This will permanently remove <span className="text-foreground font-black">"{blog.title}"</span> and all its associated data from our public records.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-6 pt-4 border-t border-gray-100">
                              <AlertDialogCancel className="rounded-xl border-none bg-zinc-100 hover:bg-zinc-200">Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(blog.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
                              >
                                Confirm Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
