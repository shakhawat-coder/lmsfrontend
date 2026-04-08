"use client";

import { useEffect, useState, useMemo } from "react";
import { bannerApi, Banner } from "@/lib/api";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2Icon, Trash2Icon, PlusIcon, ImageIcon, CheckCircle2Icon, XCircleIcon } from "lucide-react";
import { DashboardLoading } from "@/components/layout/DashboardLoading";
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
import { Switch } from "@/components/ui/switch";

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBanners = async () => {
    try {
      const data = await bannerApi.getAll();
      setBanners(Array.isArray(data) ? data : (data as any).data || []);
    } catch (error) {
      console.error("Failed to fetch banners:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const stats = useMemo(() => {
    const total = banners.length;
    const active = banners.filter(b => b.isActive).length;
    return [
      { title: "Total Banners", value: total, icon: ImageIcon, color: "text-blue-500", bg: "bg-blue-500/10" },
      { title: "Active Banners", value: active, icon: CheckCircle2Icon, color: "text-emerald-500", bg: "bg-emerald-500/10" },
      { title: "Inactive Banners", value: total - active, icon: XCircleIcon, color: "text-rose-500", bg: "bg-rose-500/10" },
    ];
  }, [banners]);

  const handleDelete = async (id: string) => {
    try {
      await bannerApi.delete(id);
      setBanners(prev => prev.filter(b => b.id !== id));
    } catch (error: any) {
      console.error("Failed to delete banner:", error);
      alert(error.message || "Failed to delete banner");
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await bannerApi.update(id, { isActive: !currentStatus });
      setBanners(prev => prev.map(b => b.id === id ? { ...b, isActive: !currentStatus } : b));
    } catch (error) {
      console.error("Failed to update banner status:", error);
    }
  };

  if (isLoading) return <DashboardLoading />;

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Banner Management</h1>
          <p className="text-sm text-muted-foreground">Manage the promotional slides on your homepage.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/banners/add">
            <PlusIcon className="mr-2 h-4 w-4" /> Add New Banner
          </Link>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-none shadow-sm bg-gradient-to-br from-card to-secondary/20">
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
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-[120px] pl-6">Preview</TableHead>
              <TableHead>Banner Info</TableHead>
              <TableHead>Button</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {banners.length > 0 ? (
              banners.map((banner) => (
                <TableRow key={banner.id} className="group hover:bg-muted/5 transition-colors">
                  <TableCell className="pl-6">
                    <div className="h-16 w-24 overflow-hidden rounded-lg border bg-muted relative group">
                      <img 
                        src={banner.image || "/placeholder.png"} 
                        alt={banner.title} 
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-foreground underline decoration-primary/30 underline-offset-4">{banner.title}</span>
                      <span className="text-xs text-muted-foreground line-clamp-1 max-w-[300px]">{banner.subtitle}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge variant="outline" className="w-fit text-[10px] uppercase font-bold">{banner.buttonText}</Badge>
                      <span className="text-[10px] text-muted-foreground font-mono truncate max-w-[150px]">{banner.buttonLink}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                       <Switch 
                         checked={banner.isActive} 
                         onCheckedChange={() => toggleStatus(banner.id, banner.isActive)}
                       />
                       <Badge variant={banner.isActive ? "success" : "secondary"} className="text-[10px]">
                         {banner.isActive ? "ACTIVE" : "INACTIVE"}
                       </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild className="h-8 w-8 hover:bg-blue-500/10 hover:text-blue-500">
                        <Link href={`/dashboard/banners/edit/${banner.id}`}>
                          <Edit2Icon className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                            <Trash2Icon className="h-3.5 w-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the banner <span className="font-bold">"{banner.title}"</span>. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(banner.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete Banner
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground italic">
                  No banners found. Create your first one!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
