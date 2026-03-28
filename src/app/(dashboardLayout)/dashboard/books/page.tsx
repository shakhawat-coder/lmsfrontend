"use client";

import { useEffect, useState } from "react";
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
import { Edit2Icon, Trash2Icon, PlusIcon, BookOpenIcon, CheckCircle2Icon, XCircleIcon } from "lucide-react";
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

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBooks = async () => {
    try {
      const data = await bookApi.getAll();
      setBooks(Array.isArray(data) ? data : (data as any).data || []);
    } catch (error) {
      console.error("Failed to fetch books:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await bookApi.delete(id);
      setBooks(prev => prev.filter(b => b.id !== id));
    } catch (error: any) {
      console.error("Failed to delete book:", error);
      alert(error.message || "Failed to delete book");
    }
  };

  if (isLoading) return <div className="p-4 flex items-center justify-center h-64"><p className="text-muted-foreground">Loading books...</p></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Book Management</h1>
        <Button asChild size="sm">
          <Link href="/dashboard/books/add">
            <PlusIcon className="mr-2 h-4 w-4" /> Add Book
          </Link>
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableCaption>A list of available books in the system.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Cover</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No books found. Try adding a new book.
                </TableCell>
              </TableRow>
            ) : (
              books.map((book) => (
                <TableRow key={book.id}>
                  <TableCell>
                    <div className="h-12 w-9 overflow-hidden rounded border shadow-sm bg-muted flex items-center justify-center">
                      {book.coverImage ? (
                        <img 
                          src={book.coverImage} 
                          alt={book.title} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <BookOpenIcon className="h-5 w-5 text-muted-foreground/50" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">
                      {book.category?.name || "Uncategorized"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {book.availability ? (
                      <Badge variant="success" className="gap-1 bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                        <CheckCircle2Icon className="h-3 w-3" /> Available
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="gap-1 bg-rose-500/10 text-rose-500 border-rose-500/20">
                        <XCircleIcon className="h-3 w-3" /> Borrowed
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/books/edit/${book.id}`}>
                          <Edit2Icon className="h-4 w-4" />
                        </Link>
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash2Icon className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="sm:max-w-[425px]">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription className="pt-2">
                              Deleting <span className="font-bold text-foreground">"{book.title}"</span> is an irreversible action. This will disconnect it from all its previous borrowings and statistics.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="mt-4 border-t pt-4 border-border/50">
                            <AlertDialogCancel className="rounded-lg h-10 px-5">Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(book.id)}
                              className="rounded-lg h-10 px-6 bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all active:scale-95 shadow shadow-destructive/10"
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
    </div>
  );
}
