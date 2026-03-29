"use client";

import { useAuth } from "@/providers/auth-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, User, Category, Borrowing, bookApi, userApi, categoryApi, borrowingApi, membershipApi, Membership } from "@/lib/api";
import { useEffect, useState, useMemo } from "react";
import { 
  UsersIcon, 
  BookOpenIcon, 
  LayersIcon, 
  ShoppingBagIcon, 
  CreditCardIcon, 
  CheckCircle2Icon, 
  AlertCircleIcon, 
  Loader2Icon,
  TrendingUpIcon,
  CalendarIcon
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<{
    books: Book[];
    users: User[];
    categories: Category[];
    borrowings: Borrowing[];
    myBorrowings: Borrowing[];
    membership: Membership | null;
  }>({
    books: [],
    users: [],
    categories: [],
    borrowings: [],
    myBorrowings: [],
    membership: null
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPERADMIN';
        const normalize = (res: any) => Array.isArray(res) ? res : (res?.data || []);
        
        const [booksRes, categoriesRes] = await Promise.all([
          bookApi.getAll().catch(() => []),
          categoryApi.getAll().catch(() => [])
        ]);

        const books = normalize(booksRes);
        const categories = normalize(categoriesRes);

        let users: User[] = [];
        let borrowings: Borrowing[] = [];
        let myBorrowings: Borrowing[] = [];
        let membership: Membership | null = null;

        if (isAdmin) {
          try {
            const uRes = await userApi.getAll();
            users = normalize(uRes);
          } catch (e) { console.warn("Users API failed", e); }
          
          try {
            const bRes = await borrowingApi.getAll();
            borrowings = normalize(bRes);
          } catch (e) { console.warn("Borrowings API failed", e); }
        } else {
          try {
            const mbRes = await borrowingApi.getMyBorrowings();
            myBorrowings = normalize(mbRes);
          } catch (e) { console.warn("My Borrowings API failed", e); }
          
          try {
            const mRes = await membershipApi.getActive();
            membership = mRes && (mRes as any).data ? (mRes as any).data : mRes;
          } catch (e) { console.warn("Membership API failed", e); }
        }

        setData({ books, users, categories, borrowings, myBorrowings, membership });
      } catch (error) {
        console.error("Dashboard data fetch failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPERADMIN';

  // Stats for Admin
  const adminStats = useMemo(() => [
    { title: "Total Users", value: data.users.length, icon: UsersIcon, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Total Books", value: data.books.length, icon: BookOpenIcon, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Categories", value: data.categories.length, icon: LayersIcon, color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "Active Borrowings", value: data.borrowings.filter(b => b.status === 'BORROWED').length, icon: ShoppingBagIcon, color: "text-rose-500", bg: "bg-rose-500/10" }
  ], [data]);

  // Stats for User
  const userStats = useMemo(() => [
    { title: "My Borrowings", value: data.myBorrowings.length, icon: ShoppingBagIcon, color: "text-rose-500", bg: "bg-rose-500/10" },
    { title: "Available Books", value: data.books.filter(b => b.availability).length, icon: BookOpenIcon, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Membership", value: data.membership?.status || "INACTIVE", icon: CreditCardIcon, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Status", value: user?.status || "PENDING", icon: CheckCircle2Icon, color: "text-amber-500", bg: "bg-amber-500/10" }
  ], [data, user]);

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2Icon className="h-10 w-10 animate-spin text-primary opacity-20" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-1"
      >
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Hello, {user?.name.split(' ')[0]} 👋
        </h1>
        <p className="text-muted-foreground">
          Welcome to your <span className="font-medium text-primary capitalize">{user?.role?.toLowerCase()}</span> dashboard.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {(isAdmin ? adminStats : userStats).map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`${stat.bg} p-2 rounded-lg`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1 gap-1">
                  <TrendingUpIcon className="h-3 w-3 text-emerald-500" />
                  <span>+4% from last month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Main Chart Card - Vertical Bars */}
        {isAdmin && (
          <Card className="col-span-4 overflow-hidden border-none bg-gradient-to-br from-card to-secondary/30 shadow-lg">
            <CardHeader>
              <CardTitle>Activity Insights</CardTitle>
              <CardDescription>
                Book distribution across all categories
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-end justify-between px-6 pb-12 gap-2 relative">
               {/* Simple visual chart using bars */}
               {data.categories.length > 0 ? (
                 data.categories.slice(0, 6).map((cat, i) => {
                   const count = data.books.filter(b => b.categoryId === cat.id).length;
                   const maxCount = Math.max(...data.categories.map(c => data.books.filter(b => b.categoryId === c.id).length), 1);
                   const height = Math.max(20, (count / maxCount) * 200);
                   
                   return (
                     <div key={cat.id} className="flex flex-col items-center flex-1 gap-2 group z-10">
                       <motion.div 
                         initial={{ height: 0 }}
                         animate={{ height }}
                         transition={{ duration: 0.8, delay: 0.5 + (i * 0.1) }}
                         className="w-full max-w-[40px] bg-primary/20 hover:bg-primary transition-colors rounded-t-lg relative"
                       >
                         <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                            {count}
                         </div>
                       </motion.div>
                       <span className="text-[10px] text-muted-foreground font-medium truncate w-full text-center">
                         {cat.name}
                       </span>
                     </div>
                   )
                 })
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-muted-foreground">No category data available</div>
               )}
               
               {/* Background Grid Lines */}
               <div className="absolute inset-x-6 top-10 bottom-12 border-b border-muted pointer-events-none flex flex-col justify-between opacity-30 z-0">
                  <div className="border-t border-muted w-full h-1" />
                  <div className="border-t border-muted w-full h-1" />
                  <div className="border-t border-muted w-full h-1" />
               </div>
            </CardContent>
          </Card>
        )}
 
        {/* Status/Recent Card */}
        <Card className={isAdmin ? "col-span-3" : "col-span-full"}>
          <CardHeader>
            <CardTitle>{isAdmin ? "Recent Users" : "Latest Borrowings"}</CardTitle>
            <CardDescription>
              {isAdmin ? "Latest members who joined the platform" : "Your most recent book acquisitions"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isAdmin ? (
                data.users.length > 0 ? (
                  data.users.slice(0, 5).map((u, i) => (
                    <motion.div 
                      key={u.id} 
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex items-center gap-3 border-b border-muted pb-3 last:border-0"
                    >
                      <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center font-bold text-xs">
                        {u.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{u.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                      </div>
                      <Badge variant={u.status === 'ACTIVE' ? 'success' : 'outline'} className="text-[10px]">
                        {u.status}
                      </Badge>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-8 flex flex-col items-center justify-center text-center gap-2 opacity-50">
                    <UsersIcon className="h-8 w-8" />
                    <p className="text-sm">No users found</p>
                  </div>
                )
              ) : (
                data.myBorrowings.length > 0 ? (
                  data.myBorrowings.slice(0, 5).map((b, i) => (
                    <motion.div 
                      key={b.id} 
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex items-center gap-3 border-b border-muted pb-3 last:border-0"
                    >
                      <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <BookOpenIcon className="h-4 w-4 text-emerald-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{b.book?.title || "Unknown Book"}</p>
                        <div className="flex items-center text-[10px] text-muted-foreground gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          <span>Due: {new Date(b.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px]">
                        {b.status}
                      </Badge>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-8 flex flex-col items-center justify-center text-center gap-2 opacity-50">
                    <ShoppingBagIcon className="h-8 w-8" />
                    <p className="text-sm">No recent borrowings</p>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table Section */}
      <Card className="border-none shadow-md overflow-hidden">
        <CardHeader className="bg-muted/30 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{isAdmin ? "Complete Inventory Status" : "My Reading Vault"}</CardTitle>
              <CardDescription>Overview of available assets and their current state</CardDescription>
            </div>
            <Badge className="bg-primary hover:bg-primary/90 text-[10px]">REAL-TIME</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/10">
              <TableRow>
                <TableHead className="pl-6">Asset Name</TableHead>
                <TableHead>{isAdmin ? "Author" : "Borrow Date"}</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(isAdmin 
                ? data.books.slice(0, 6) 
                : data.myBorrowings.slice(0, 6).map(b => ({ ...b.book, borrowDate: b.borrowDate, id: b.id }))
              ).map((item: any) => (
                <TableRow key={item.id} className="group hover:bg-muted/5 transition-colors">
                  <TableCell className="font-medium pl-6">{item.title || "Unknown Asset"}</TableCell>
                  <TableCell className="text-muted-foreground font-normal">
                    {isAdmin ? item.author : (item.borrowDate ? new Date(item.borrowDate).toLocaleDateString() : "N/A")}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={isAdmin ? (item.availability ? "success" : "destructive") : "secondary"} 
                      className="text-[10px] font-bold"
                    >
                      {isAdmin ? (item.availability ? "AVAILABLE" : "OUT") : "BORROWED"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <button className="text-xs text-primary font-semibold hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                      View details
                    </button>
                  </TableCell>
                </TableRow>
              ))}
              
              {((isAdmin && data.books.length === 0) || (!isAdmin && data.myBorrowings.length === 0)) && (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                       <AlertCircleIcon className="h-6 w-6 opacity-20" />
                       <p>No records found in inventory</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
