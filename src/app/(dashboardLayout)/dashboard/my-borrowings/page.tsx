"use client";

import { useEffect, useState } from "react";
import { borrowingApi, Borrowing } from "@/lib/api";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Info,
  ChevronRight,
  Search,
  History
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "motion/react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

export default function MyBorrowingsPage() {
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchBorrowings = async () => {
    try {
      const data = await borrowingApi.getMyBorrowings();
      setBorrowings(Array.isArray(data) ? data : (data as any).data || []);
    } catch (error) {
      console.error("Failed to fetch my borrowings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowings();
  }, []);

  const filteredBorrowings = borrowings.filter(b => 
    b.book?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.book?.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusDisplay = (borrowing: Borrowing) => {
    const isOverdue = new Date(borrowing.dueDate) < new Date() && borrowing.status === 'BORROWED';
    
    if (isOverdue) {
      return {
        label: "LATE / OVERDUE",
        variant: "destructive" as const,
        icon: <AlertCircle className="h-3 w-3" />
      };
    }

    switch (borrowing.status) {
      case "BORROWED":
        return {
          label: "BORROWED",
          variant: "primary" as const,
          icon: <Clock className="h-3 w-3" />
        };
      case "RETURNED":
        return {
          label: "RETURNED",
          variant: "success" as const,
          icon: <CheckCircle2 className="h-3 w-3" />
        };
      case "OVERDUE":
        return {
          label: "RETURNED LATE",
          variant: "warning" as const,
          icon: <History className="h-3 w-3" />
        };
      default:
        return {
          label: borrowing.status,
          variant: "outline" as const,
          icon: <Info className="h-3 w-3" />
        };
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground animate-pulse">Fetching your reading history...</p>
        </div>
      </div>
    );
  }

  const activeBorrowings = borrowings.filter(b => b.status === 'BORROWED');
  const returnedBorrowings = borrowings.filter(b => b.status !== 'BORROWED');

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            My Borrowed Books
          </h1>
          <p className="text-muted-foreground max-w-lg">
            Manage your active loans, track due dates, and explore your reading history.
          </p>
        </div>
        
        <div className="relative w-full md:w-64 mt-4 md:mt-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search books or authors..."
            className="pl-9 h-10 border-muted-foreground/20 rounded-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="bg-primary/5 border-primary/10 hover:shadow-md transition-shadow">
            <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
               <div>
                  <CardTitle className="text-sm font-medium text-primary">Active Loans</CardTitle>
                  <div className="text-2xl font-bold mt-1">{activeBorrowings.length}</div>
               </div>
               <BookOpen className="h-8 w-8 text-primary opacity-20" />
            </CardHeader>
         </Card>
      
         <Card className="bg-emerald-500/5 border-emerald-500/10 hover:shadow-md transition-shadow">
            <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
               <div>
                  <CardTitle className="text-sm font-medium text-emerald-600">Total Returned</CardTitle>
                  <div className="text-2xl font-bold mt-1">{returnedBorrowings.length}</div>
               </div>
               <CheckCircle2 className="h-8 w-8 text-emerald-500 opacity-20" />
            </CardHeader>
         </Card>

         <Card className="bg-rose-500/5 border-rose-500/10 hover:shadow-md transition-shadow">
            <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
               <div>
                  <CardTitle className="text-sm font-medium text-rose-600">Pending Fines</CardTitle>
                  <div className="text-2xl font-bold mt-1">${borrowings.reduce((acc, b) => acc + (b.fine || 0), 0).toFixed(2)}</div>
               </div>
               <AlertCircle className="h-8 w-8 text-rose-500 opacity-20" />
            </CardHeader>
         </Card>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border shadow-sm bg-card overflow-hidden"
      >
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-[350px] pl-6">Book Details</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Fines</TableHead>
              <TableHead className="text-right pr-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBorrowings.map((borrowing) => {
              const statusInfo = getStatusDisplay(borrowing);
              return (
                <TableRow key={borrowing.id} className="group hover:bg-muted/5 transition-colors">
                  <TableCell className="pl-6 py-4">
                    <div className="flex gap-4">
                       <div className="h-16 w-11 shrink-0 rounded-md overflow-hidden border shadow-sm group-hover:shadow-md transition-shadow">
                          {borrowing.book?.coverImage ? (
                             <img 
                               src={borrowing.book.coverImage} 
                               alt={borrowing.book.title}
                               className="h-full w-full object-cover" 
                             />
                          ) : (
                             <div className="h-full w-full bg-muted flex items-center justify-center">
                                <BookOpen className="h-4 w-4 opacity-30" />
                             </div>
                          )}
                       </div>
                       <div className="flex flex-col gap-0.5 min-w-0">
                          <span className="font-bold text-sm truncate block">{borrowing.book?.title}</span>
                          <span className="text-xs text-muted-foreground truncate block">by {borrowing.book?.author}</span>
                          <span className="text-[10px] uppercase tracking-wider text-primary mt-1 font-semibold">
                            {borrowing.book?.category?.name || "Uncategorized"}
                          </span>
                       </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1.5 text-xs">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Calendar className="h-3 w-3 opacity-70" />
                        <span>Borrowed: {new Date(borrowing.borrowDate).toLocaleDateString()}</span>
                      </div>
                      <div className={`flex items-center gap-1.5 font-medium ${statusInfo.variant === 'destructive' ? 'text-destructive font-bold' : 'text-foreground'}`}>
                        <Clock className="h-3 w-3 opacity-70" />
                        <span>Due: {new Date(borrowing.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusInfo.variant} className="gap-1.5 px-3 py-1 text-[11px] font-bold rounded-full">
                      {statusInfo.icon}
                      {statusInfo.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`text-sm font-semibold ${borrowing.fine > 0 ? 'text-rose-500 font-black' : 'text-muted-foreground opacity-50'}`}>
                      {borrowing.fine > 0 ? `$${borrowing.fine.toFixed(2)}` : "—"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Link href={`/catalog/categories`}>
                       <Button variant="ghost" size="icon" className="group/btn h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary transition-all">
                          <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-0.5 transition-transform" />
                       </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
            {filteredBorrowings.length === 0 && !isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="h-[300px] text-center">
                   <div className="flex flex-col items-center justify-center py-10">
                      <div className="bg-muted p-4 rounded-full mb-4">
                         <BookOpen className="h-8 w-8 text-muted-foreground opacity-30" />
                      </div>
                      <h3 className="text-lg font-bold">No borrowings found</h3>
                      <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-6">
                        {searchQuery 
                          ? `No books matching "${searchQuery}" in your borrowing history.` 
                          : "You haven't borrowed any books yet. Explore our catalog to find something interesting!"}
                      </p>
                      {!searchQuery && (
                         <Link href="/catalog/categories">
                            <Button className="rounded-full shadow-lg gap-2">
                               Browse Catalog <ChevronRight className="h-4 w-4" />
                            </Button>
                         </Link>
                      )}
                   </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </motion.div>
      
      {/* Help Card */}
      <Card className="border-dashed border-2 bg-muted/20">
         <CardContent className="pt-6 flex flex-col md:flex-row items-center gap-6">
            <div className="bg-primary/10 p-4 rounded-2xl shrink-0">
               <Info className="h-8 w-8 text-primary" />
            </div>
            <div>
               <h4 className="font-bold text-lg">Borrowing Policy</h4>
               <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                 Books must be returned by the due date to avoid fines. Our standard overdue fee is <strong>$5.00 per day</strong>. 
                 If you need more time, you can visit the library or use our upcoming "Renew" feature in the next update.
               </p>
            </div>
         </CardContent>
      </Card>
    </div>
  );
}
