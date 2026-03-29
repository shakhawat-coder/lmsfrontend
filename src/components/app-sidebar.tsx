"use client";

import * as React from "react";
import { useAuth } from "@/providers/auth-provider";
import { sidebarLinks } from "@/lib/navItems";
import { NavUser } from "@/components/nav-user";
import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { LibraryBigIcon } from "lucide-react";
import Link from "next/link";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  // Filter links based on user role
  const filteredLinks = sidebarLinks.filter((link) => {
    if (!link.roles || link.roles.length === 0) return true;
    return user?.role && link.roles.includes(user.role);
  });

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <img src="/logo.png" alt="logo" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none text-left">
                  <span className="font-semibold">LMS System</span>
                  <span className="text-xs text-muted-foreground">v1.0.0</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent>
        <NavMain items={filteredLinks} label="Dashboard Menu" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user ? {
          name: user.name,
          email: user.email,
          avatar: user.image || "",
        } : {
          name: "Guest",
          email: "",
          avatar: "",
        }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
