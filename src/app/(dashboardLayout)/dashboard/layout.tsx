"use client";

import { useAuth } from "@/providers/auth-provider";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { RoleProxy } from "../../../../proxy";
import { ModeToggle } from "@/components/layout/ModeToggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?message=Please login to access dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Checking authentication...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header with Logo and Toggle */}
        <header className="flex h-11 shrink-0 items-center justify-between border-b px-4 sticky top-0 z-40 bg-background">
          {/* Mobile Logo on Left */}
          <div className="flex md:hidden items-center gap-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <img src="/logo.png" alt="logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-semibold">LMS</span>
          </div>

          {/* Desktop Breadcrumb on Left */}
          {/* <div className="hidden lg:flex items-center gap-2">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div> */}

          {/* Toggle on Right */}
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-mr-1" />
            <ModeToggle />
          </div>
        </header>
        <div className="p-6">
          <RoleProxy>{children}</RoleProxy>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
