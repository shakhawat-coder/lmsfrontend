"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { bookApi, Book } from "@/lib/api";
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
import { Edit2Icon, Trash2Icon, PlusIcon, BookOpenIcon, CheckCircle2Icon, XCircleIcon, ShoppingBagIcon, LayersIcon } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import Pagination from "@/components/modules/bookPage/Pagination";
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
import { DashboardLoading } from "@/components/layout/DashboardLoading";


export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [meta, setMeta] = useState({ total: 0, available: 0, borrowed: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isPageChanging, setIsPageChanging] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const isFirstLoad = useRef(true);
  const BOOKS_PER_PAGE = 10;

  const fetchBooks = async (page: number = 1) => {
    try {
      if (isFirstLoad.current) {
        setIsLoading(true);
      } else {
        setIsPageChanging(true);
      }
      const response = await bookApi.getAll({
        page,
        limit: BOOKS_PER_PAGE
      });

      const bookItems = (response as any).data || [];
      const metaResponse = (response as any).meta || { total: 0, available: 0, borrowed: 0, limit: BOOKS_PER_PAGE };
      
      const metaData = {
        total: metaResponse.total || 0,
        available: metaResponse.available ?? 0,
        borrowed: metaResponse.borrowed ?? 0
      };

      setBooks(bookItems);
      setMeta(metaData);
      setTotalPages(Math.ceil(metaData.total / BOOKS_PER_PAGE));
    } catch (error) {
      console.error("Failed to fetch books:", error);
    } finally {
      isFirstLoad.current = false;
      setIsLoading(false);
      setIsPageChanging(false);
    }
  };

  useEffect(() => {
    fetchBooks(currentPage);
  }, [currentPage]);

  const stats = useMemo(() => {
    const total = meta.total;
    const available = meta.available;
    const borrowed = meta.borrowed;
    const categories = new Set(books.map(b => b.categoryId)).size;
    return [
      { title: "Total Books", value: total, icon: BookOpenIcon, color: "text-blue-500", bg: "bg-blue-500/10" },
      { title: "Available", value: available, icon: CheckCircle2Icon, color: "text-emerald-500", bg: "bg-emerald-500/10" },
      { title: "Borrowed", value: borrowed, icon: ShoppingBagIcon, color: "text-rose-500", bg: "bg-rose-500/10" },
      { title: "Active Categories", value: categories, icon: LayersIcon, color: "text-amber-500", bg: "bg-amber-500/10" }
    ];
  }, [books, meta]);

  const handleDelete = async (id: string) => {
    try {
      await bookApi.delete(id);
      setBooks(prev => prev.filter(b => b.id !== id));
    } catch (error: any) {
      console.error("Failed to delete book:", error);
      alert(error.message || "Failed to delete book");
    }
  };

  if (isLoading) return <DashboardLoading />;  // only shown on first load

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Book Management</h1>
          <p className="text-sm text-muted-foreground">Manage your library's assets and availability.</p>
        </div>
        <Button asChild size="sm">
          <Link href="/dashboard/books/add">
            <PlusIcon className="mr-2 h-4 w-4" /> Add Book
          </Link>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
      <div className="grid gap-6 md:grid-cols-7">
        <div className="md:col-span-5">
          <Card className="border-none shadow-md h-full">
            <CardHeader className="bg-muted/30 pb-4 rounded-t-xl">
              <CardTitle className="text-lg text-foreground/80">Inventory Assets</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[70vh] overflow-auto relative">
                {isPageChanging && (
                  <div className="absolute inset-0 z-20 bg-background/60 backdrop-blur-sm flex items-center justify-center rounded-b-xl">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                      <span className="text-xs text-muted-foreground font-medium">Loading page {currentPage}…</span>
                    </div>
                  </div>
                )}
                <Table>
                  <TableHeader className="bg-muted/10 sticky top-0 z-10 backdrop-blur-md">
                    <TableRow>
                      <TableHead className="pl-6 w-[80px]">Cover</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right pr-6">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {books.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                          No books found. Try adding a new book to the system.
                        </TableCell>
                      </TableRow>
                    ) : (
                      books.map((book) => (
                        <TableRow key={book.id} className="group hover:bg-muted/5 transition-colors">
                          <TableCell className="pl-6">
                            <div className="h-12 w-9 overflow-hidden rounded border shadow-sm bg-muted flex items-center justify-center">
                              {book.coverImage ? (
                                <img
                                  src={book.coverImage}
                                  alt={book.title}
                                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                              ) : (
                                <BookOpenIcon className="h-5 w-5 text-muted-foreground/30" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold text-foreground/90">{book.title}</TableCell>
                          <TableCell className="text-muted-foreground font-normal">{book.author}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-normal text-[10px]">
                              {book.category?.name || "Uncategorized"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={book.availability ? "success" : "destructive"}
                              className="text-[10px] font-bold"
                            >
                              {book.availability ? "AVAILABLE" : "BORROWED"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                              <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                                <Link href={`/dashboard/books/edit/${book.id}`}>
                                  <Edit2Icon className="h-3.5 w-3.5" />
                                </Link>
                              </Button>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                    <Trash2Icon className="h-3.5 w-3.5" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Deleting <span className="font-bold text-foreground">"{book.title}"</span> is an irreversible action.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter className="mt-4 border-t pt-4">
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(book.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
              </div>
              {/* Dashboard Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 bg-muted/20 border-t">
                  <p className="text-xs text-muted-foreground font-medium">
                    Showing <span className="text-foreground">{(currentPage - 1) * BOOKS_PER_PAGE + 1}</span> to <span className="text-foreground">{Math.min(currentPage * BOOKS_PER_PAGE, meta.total)}</span> of <span className="text-foreground">{meta.total}</span> entries
                  </p>
                  <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={setCurrentPage} 
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card className="border-none shadow-md overflow-hidden bg-gradient-to-br from-card to-secondary/10">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Availability Split</CardTitle>
            </CardHeader>
            <CardContent className="h-[200px] flex items-center justify-center p-6 pb-10">
              {/* Custom CSS Chart for Availability */}
              {books.length > 0 ? (
                <div className="relative w-36 h-36 rounded-full border-[12px] border-emerald-500/20 flex items-center justify-center group">
                  <motion.div
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-[-12px] rounded-full border-[12px] border-emerald-500 border-t-transparent border-r-transparent"
                    style={{
                      clipPath: `polygon(50% 50%, 50% 0%, ${books.filter(b => b.availability).length / books.length * 100}% 0%, 100% 100%, 0% 100%, 0% 0%)`,
                      transform: `rotate(${(books.filter(b => !b.availability).length / books.length) * 360}deg)`
                    }}
                  />
                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-500">
                      {Math.round((books.filter(b => b.availability).length / Math.max(books.length, 1)) * 100)}%
                    </p>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Available</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No data for chart</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button variant="outline" className="justify-start text-xs h-9 gap-2" asChild>
                <Link href="/dashboard/borrowings">
                  <ShoppingBagIcon className="h-3.5 w-3.5" /> Manage Borrowings
                </Link>
              </Button>
              <Button variant="outline" className="justify-start text-xs h-9 gap-2" asChild>
                <Link href="/dashboard/categories">
                  <LayersIcon className="h-3.5 w-3.5" /> View Categories
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
