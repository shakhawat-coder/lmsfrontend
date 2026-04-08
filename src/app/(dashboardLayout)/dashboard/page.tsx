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
  TrendingUpIcon,
  CalendarIcon
} from "lucide-react";
import { DashboardLoading } from "@/components/layout/DashboardLoading";
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
  const [counts, setCounts] = useState({ totalBooks: 0, availableBooks: 0, borrowedBooks: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPERADMIN';
        const normalize = (res: any) => Array.isArray(res) ? res : (res?.data || []);

        const [booksRes, categoriesRes] = await Promise.all([
          bookApi.getAll().catch(() => ({ data: [], meta: { total: 0, available: 0, borrowed: 0 } })),
          categoryApi.getAll().catch(() => [])
        ]);

        const books = normalize(booksRes);
        const categories = normalize(categoriesRes);
        const meta = (booksRes as any).meta || { total: 0, available: 0, borrowed: 0 };
        setCounts({
          totalBooks: meta.total || books.length,
          availableBooks: meta.available !== undefined ? meta.available : books.filter((b: any) => b.availability).length,
          borrowedBooks: meta.borrowed !== undefined ? meta.borrowed : (meta.total || books.length) - (meta.available || 0)
        });

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
    { title: "Total Books", value: counts.totalBooks, icon: BookOpenIcon, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Categories", value: data.categories.length, icon: LayersIcon, color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "Active Borrowings", value: data.borrowings.filter(b => b.status === 'BORROWED').length, icon: ShoppingBagIcon, color: "text-rose-500", bg: "bg-rose-500/10" }
  ], [data, counts]);

  // Stats for User
  const userStats = useMemo(() => [
    { title: "My Borrowings", value: data.myBorrowings.length, icon: ShoppingBagIcon, color: "text-rose-500", bg: "bg-rose-500/10" },
    { title: "Available Books", value: counts.availableBooks, icon: BookOpenIcon, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Membership", value: data.membership?.status || "INACTIVE", icon: CreditCardIcon, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Status", value: user?.status || "PENDING", icon: CheckCircle2Icon, color: "text-amber-500", bg: "bg-amber-500/10" }
  ], [data, user, counts]);

  if (isLoading) {
    return <DashboardLoading />;
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-8">
        {/* Availability Distribution Chart */}
        <Card className="col-span-1 lg:col-span-3 border-none shadow-md bg-gradient-to-br from-indigo-500/5 to-purple-500/5 overflow-hidden group">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <BookOpenIcon className="w-4 h-4 text-indigo-500" /> Availability Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pt-4 pb-8">
            <div className="relative w-40 h-40">
              {/* SVG Donut Chart */}
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {/* Background Circle */}
                <circle
                  cx="50" cy="50" r="40"
                  fill="transparent"
                  strokeWidth="12"
                  className="stroke-muted/20"
                />
                {/* Available Segment */}
                {counts.totalBooks > 0 && (
                  <motion.circle
                    cx="50" cy="50" r="40"
                    fill="transparent"
                    strokeWidth="12"
                    strokeDasharray={`${(counts.availableBooks / counts.totalBooks) * 251.2} 251.2`}
                    className="stroke-indigo-500"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "0 251.2" }}
                    animate={{ strokeDasharray: `${(counts.availableBooks / counts.totalBooks) * 251.2} 251.2` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                )}
              </svg>
              {/* Chart Center Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                  {counts.totalBooks > 0 ? Math.round((counts.availableBooks / counts.totalBooks) * 100) : 0}%
                </span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Available</span>
              </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-4 w-full mt-6">
              <div className="flex flex-col items-center p-2 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                <span className="text-xs font-bold text-indigo-500">{counts.availableBooks}</span>
                <span className="text-[10px] text-muted-foreground font-medium uppercase">Active</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-xl bg-muted/5 border border-border">
                <span className="text-xs font-bold text-muted-foreground">{counts.borrowedBooks}</span>
                <span className="text-[10px] text-muted-foreground font-medium uppercase">Borrowed</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution Chart */}
        {isAdmin ? (
          <Card className="col-span-1 lg:col-span-5 border-none shadow-md overflow-hidden bg-gradient-to-br from-card to-secondary/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold">Category Distribution</CardTitle>
                  <CardDescription>Book assets per knowledge domain</CardDescription>
                </div>
                <LayersIcon className="w-5 h-5 text-amber-500 opacity-50" />
              </div>
            </CardHeader>
            <CardContent className="h-[280px] flex items-end justify-between px-6 pb-10 gap-3 relative overflow-x-auto scrollbar-thin scrollbar-thumb-amber-500/20 scrollbar-track-transparent">
              {data.categories.length > 0 ? (
                data.categories.map((cat, i) => {
                  const count = data.books.filter(b => b.categoryId === cat.id).length;
                  const maxCount = Math.max(...data.categories.map(c => data.books.filter(b => b.categoryId === c.id).length), 1);
                  const height = (count / maxCount) * 180;

                  return (
                    <div key={cat.id} className="flex flex-col items-center flex-1 gap-3 group relative">
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height, opacity: 1 }}
                        transition={{ duration: 1, delay: 0.2 + (i * 0.1), ease: "backOut" }}
                        className="w-full max-w-[32px] bg-gradient-to-t from-amber-500/80 to-amber-400 hover:from-amber-600 hover:to-amber-500 transition-all duration-300 rounded-t-lg relative shadow-lg shadow-amber-500/10"
                      >
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-black bg-amber-500 text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {count}
                        </div>
                      </motion.div>
                      <span className="text-[9px] font-black text-muted-foreground uppercase tracking-wider rotate-[30deg] origin-left translate-y-2 whitespace-nowrap">
                        {cat.name.length > 10 ? cat.name.slice(0, 8) + ".." : cat.name}
                      </span>
                    </div>
                  )
                })
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground italic">No category insights available</div>
              )}

              {/* Horizontal Grid */}
              <div className="absolute inset-x-6 top-10 bottom-10 flex flex-col justify-between opacity-10 pointer-events-none">
                {[...Array(5)].map((_, i) => <div key={i} className="border-t border-foreground w-full h-0" />)}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="col-span-1 lg:col-span-5 border-none shadow-md overflow-hidden bg-gradient-to-br from-emerald-500/5 to-teal-500/5">
            <CardHeader className="pb-0">
              <CardTitle className="text-sm font-bold">Reading Progress</CardTitle>
            </CardHeader>
            <CardContent className="p-8 flex items-center justify-center">
              <div className="text-center">
                <TrendingUpIcon className="w-12 h-12 text-emerald-500 mx-auto mb-4 opacity-20" />
                <p className="text-3xl font-black text-foreground">{data.myBorrowings.length}</p>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Total Read</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Users card */}
        <Card className={isAdmin ? "col-span-1 lg:col-span-4" : "col-span-full"}>
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

        {/* Recent Borrowings Table — same row as Recent Users (admin only) */}
        {isAdmin && (
          <Card className="col-span-1 lg:col-span-4 border-none shadow-md overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <ShoppingBagIcon className="h-4 w-4 text-rose-500" />
                    Recent Borrowings
                  </CardTitle>
                  <CardDescription className="text-xs mt-0.5">Latest borrowing activity across the platform</CardDescription>
                </div>
                <Badge className="bg-rose-500/10 text-rose-500 border border-rose-500/20 text-[10px]">
                  {data.borrowings.filter(b => b.status === 'BORROWED').length} ACTIVE
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {data.borrowings.length > 0 ? (
                <Table>
                  <TableHeader className="bg-muted/10">
                    <TableRow>
                      <TableHead className="pl-5 text-[11px]">User</TableHead>
                      <TableHead className="text-[11px]">Book</TableHead>
                      <TableHead className="text-[11px]">Due Date</TableHead>
                      <TableHead className="text-[11px]">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.borrowings.slice(0, 6).map((b, i) => (
                      <motion.tr
                        key={b.id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * i }}
                        className="group hover:bg-muted/5 transition-colors border-b border-border/40 last:border-0"
                      >
                        <TableCell className="pl-5 py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold shrink-0">
                              {(b.user?.name || b.userId || "?").charAt(0).toUpperCase()}
                            </div>
                            <span className="text-xs font-medium truncate max-w-[90px]">
                              {b.user?.name || b.userId || "Unknown"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-2.5">
                          <div className="flex items-center gap-1.5">
                            <BookOpenIcon className="h-3 w-3 text-muted-foreground shrink-0" />
                            <span className="text-xs truncate max-w-[110px]">
                              {b.book?.title || "Unknown Book"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground py-2.5">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            {b.dueDate ? new Date(b.dueDate).toLocaleDateString() : "N/A"}
                          </div>
                        </TableCell>
                        <TableCell className="py-2.5">
                          <Badge
                            variant={
                              b.status === 'RETURNED' ? 'success' :
                                b.status === 'BORROWED' ? 'destructive' : 'outline'
                            }
                            className="text-[10px] font-bold"
                          >
                            {b.status}
                          </Badge>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-10 flex flex-col items-center justify-center text-center gap-2 opacity-40">
                  <ShoppingBagIcon className="h-8 w-8" />
                  <p className="text-sm">No borrowing records yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
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
