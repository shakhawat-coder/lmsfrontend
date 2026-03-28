"use client";

import { useAuth } from "@/providers/auth-provider";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { sidebarLinks } from "@/lib/navItems";
import { Loader2Icon } from "lucide-react";

interface RoleProxyProps {
  children: ReactNode;
}

export function RoleProxy({ children }: RoleProxyProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Find the security rule for the current path
  const securityRule = sidebarLinks.find(link => 
    pathname.startsWith(link.url) && link.roles && link.roles.length > 0
  );

  // Synchronous authorization check
  const isAuthorized = !securityRule || (user?.role && securityRule.roles?.includes(user.role));

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.push("/login?message=Authentication required");
      return;
    }

    if (!isAuthorized) {
      console.warn(`[RoleProxy] Access denied for ${user.email} on ${pathname}`);
      router.push("/dashboard?message=Unauthorized access attempt detected");
    }
  }, [user, isLoading, pathname, router, isAuthorized]);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loader2Icon className="h-10 w-10 animate-spin text-primary opacity-20" />
      </div>
    );
  }

  // Prevent rendering if not authorized or not logged in
  if (!user || !isAuthorized) return null;

  return <>{children}</>;
}
