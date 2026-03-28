"use client";

import { useEffect, useState, useMemo } from "react";
import { membershipApi, Membership } from "@/lib/api";
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
import { CreditCardIcon, UserIcon, Trash2Icon, CheckCircle2Icon, AlertCircleIcon, ShieldCheckIcon, CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "motion/react";
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

export default function MembershipsPage() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMemberships = async () => {
    try {
      const data = await membershipApi.getAll();
      setMemberships(Array.isArray(data) ? data : (data as any).data || []);
    } catch (error) {
      console.error("Failed to fetch memberships:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, []);

  const stats = useMemo(() => {
    const total = memberships.length;
    const active = memberships.filter(m => m.status === 'ACTIVE').length;
    const revenue = memberships.reduce((acc, current) => acc + current.price, 0);
    return [
      { title: "Total Memberships", value: total, icon: CreditCardIcon, color: "text-blue-500", bg: "bg-blue-500/10" },
      { title: "Active Plans", value: active, icon: CheckCircle2Icon, color: "text-emerald-500", bg: "bg-emerald-500/10" },
      { title: "Lifetime Revenue", value: `$${revenue.toLocaleString()}`, icon: ShieldCheckIcon, color: "text-amber-500", bg: "bg-amber-500/10" },
      { title: "Plans Expiring Soon", value: memberships.filter(m => m.endDate && new Date(m.endDate).getTime() < Date.now() + 7 * 24 * 60 * 60 * 1000).length || 0, icon: AlertCircleIcon, color: "text-rose-500", bg: "bg-rose-500/10" }
    ];
  }, [memberships]);

  const handleDelete = async (id: string) => {
    try {
      await membershipApi.delete(id);
      setMemberships(prev => prev.filter(m => m.id !== id));
      alert("Membership record removed");
    } catch (error: any) {
      alert(error.message || "Failed to delete membership");
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await membershipApi.update(id, { status: newStatus as any });
      setMemberships(prev => prev.map(m => m.id === id ? { ...m, status: newStatus as any } : m));
      alert(`Membership status set to ${newStatus}`);
    } catch (error: any) {
        alert(error.message || "Failed to update status");
    }
  };

  if (isLoading) return <div className="p-4 flex h-64 items-center justify-center text-muted-foreground">Loading memberships...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">User Memberships</h1>
          <p className="text-sm text-muted-foreground">Monitor and manage all active and past memberships.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
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
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="rounded-xl border shadow-sm bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/20">
            <TableRow>
              <TableHead className="pl-6">User</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {memberships.map((item) => (
              <TableRow key={item.id} className="group hover:bg-muted/5 transition-colors">
                <TableCell className="pl-6">
                   <div className="flex flex-col">
                      <span className="font-semibold text-foreground text-sm">{item.user?.name || "Unknown"}</span>
                      <span className="text-xs text-muted-foreground font-normal">{item.user?.email || ""}</span>
                   </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline"
                    className={`gap-1 font-bold ${
                      item.membershipPlan?.name === "GOLD" ? "border-amber-500 text-amber-500" :
                      item.membershipPlan?.name === "SILVER" ? "border-slate-500 text-slate-500" :
                      "border-primary text-primary"
                    }`}
                  >
                    {item.membershipPlan?.name || "BASIC"}
                  </Badge>
                </TableCell>
                <TableCell className="text-[11px] font-normal text-muted-foreground">
                   <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1">
                         <CalendarIcon className="h-3 w-3 opacity-50" />
                         <span>Start: {new Date(item.startDate).toLocaleDateString()}</span>
                      </div>
                      {item.endDate && (
                         <div className="flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3 opacity-50" />
                            <span>End: {new Date(item.endDate).toLocaleDateString()}</span>
                         </div>
                      )}
                   </div>
                </TableCell>
                <TableCell className="font-medium text-sm">${item.price.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={item.status === "ACTIVE" ? "success" : "outline"} className="font-bold">
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                    {item.status === "ACTIVE" ? (
                        <Button variant="ghost" size="sm" onClick={() => updateStatus(item.id, "INACTIVE")} className="text-xs h-8">
                           Deactivate
                        </Button>
                    ) : (
                        <Button variant="ghost" size="sm" onClick={() => updateStatus(item.id, "ACTIVE")} className="text-xs h-8">
                           Activate
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
                            This will permanetly delete the membership record for <span className="font-bold text-foreground">"{item.user?.name}"</span>.
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
            {memberships.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                     No membership records found.
                  </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
