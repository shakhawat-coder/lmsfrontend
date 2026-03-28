"use client";

import { useEffect, useState } from "react";
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
import { ShieldCheckIcon, UserIcon, Trash2Icon, UserPlusIcon } from "lucide-react";
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

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const data = await userApi.getAll();
      // Ensure we have an array, handle different API response formats
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

  if (isLoading) return <div className="p-4">Loading users...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button asChild size="sm">
          <Link href="/dashboard/admins">
            <UserPlusIcon className="mr-2 h-4 w-4" /> Add Admin
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableCaption>A list of all users and their roles.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  {item.name}
                </TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>
                  <Badge variant={item.role === "SUPERADMIN" ? "default" : item.role === "ADMIN" ? "secondary" : "outline"}>
                    {item.role === "SUPERADMIN" ? <ShieldCheckIcon className="mr-1 h-3 w-3" /> : <UserIcon className="mr-1 h-3 w-3" />}
                    {item.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={item.status === "ACTIVE" ? "success" : "destructive"}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {item.role === "USER" && (
                      <Button variant="ghost" size="sm" onClick={() => updateRole(item.id, "ADMIN")}>
                        Make Admin
                      </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will soft-delete the user 
                            <span className="font-semibold px-1">"{item.name}"</span>.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
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
