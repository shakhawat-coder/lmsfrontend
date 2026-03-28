"use client";

import { useEffect, useState, useMemo } from "react";
import { userApi, User } from "@/lib/api";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheckIcon, UserIcon, Trash2Icon, UserPlusIcon, UsersIcon, CheckCircle2Icon, ShieldIcon } from "lucide-react";
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
import { useAuth } from "@/providers/auth-provider";

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const data = await userApi.getAll();
      setUsers(Array.isArray(data) ? data : (data as any).data || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const stats = useMemo(() => {
    const total = users.length;
    const admins = users.filter(u => u.role === 'ADMIN' || u.role === 'SUPERADMIN').length;
    const activeMembers = users.filter(u => u.status === 'ACTIVE').length;
    return [
      { title: "Total Users", value: total, icon: UsersIcon, color: "text-blue-500", bg: "bg-blue-500/10" },
      { title: "Active Members", value: activeMembers, icon: CheckCircle2Icon, color: "text-emerald-500", bg: "bg-emerald-500/10" },
      { title: "Dashboard Admins", value: admins, icon: ShieldIcon, color: "text-amber-500", bg: "bg-amber-500/10" },
      { title: "New This Week", value: users.filter(u => (u as any).createdAt && new Date((u as any).createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000).length || 0, icon: UserPlusIcon, color: "text-rose-500", bg: "bg-rose-500/10" }
    ];
  }, [users]);

  const handleDelete = async (id: string) => {
    try {
      await userApi.softDelete(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (error: any) {
      console.error("Failed to delete user:", error);
      alert(error.message || "Failed to delete user");
    }
  };

  const updateRole = async (id: string, newRole: string) => {
    try {
      await userApi.update(id, { role: newRole as any });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole as any } : u));
    } catch (error) {
      console.error("Failed to update role:", error);
      alert("Failed to update role");
    }
  };

  if (isLoading) return <div className="p-4 flex h-64 items-center justify-center text-muted-foreground">Loading users...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-sm text-muted-foreground">Monitor and manage access for all platform members.</p>
        </div>
        {currentUser?.role === "SUPERADMIN" && (
          <Button asChild size="sm">
            <Link href="/dashboard/admins">
              <UserPlusIcon className="mr-2 h-4 w-4" /> Add Admin
            </Link>
          </Button>
        )}
      </div>

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

      <div className="rounded-xl border shadow-sm bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/20">
            <TableRow>
              <TableHead className="pl-6">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((item) => (
              <TableRow key={item.id} className="group hover:bg-muted/5 transition-colors">
                <TableCell className="font-semibold pl-6">{item.name}</TableCell>
                <TableCell className="text-muted-foreground">{item.email}</TableCell>
                <TableCell>
                  <Badge 
                    variant={item.role === "SUPERADMIN" ? "default" : item.role === "ADMIN" ? "secondary" : "outline"}
                    className="gap-1 border-none shadow-none font-bold"
                  >
                    {item.role === "SUPERADMIN" ? <ShieldCheckIcon className="h-3 w-3" /> : <UserIcon className="h-3 w-3" />}
                    {item.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={item.status === "ACTIVE" ? "success" : "outline"} className="font-bold">
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                    {currentUser?.role === "SUPERADMIN" && item.role === "USER" && (
                      <Button variant="ghost" size="sm" onClick={() => updateRole(item.id, "ADMIN")} className="text-xs h-8">
                        Promote
                      </Button>
                    )}
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
                            This will restrict access for <span className="font-bold text-foreground">"{item.name}"</span>. 
                            This action is soft-delete.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-4 border-t pt-4">
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(item.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
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
