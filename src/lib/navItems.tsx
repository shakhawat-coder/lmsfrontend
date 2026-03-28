import { 
  UsersIcon, 
  BookOpenIcon, 
  LayoutDashboardIcon, 
  SettingsIcon, 
  ShoppingBagIcon, 
  LayersIcon,
  CreditCardIcon,
  UserCheckIcon
} from "lucide-react";

export interface DashboardLink {
  title: string;
  url: string;
  icon: any;
  roles?: string[]; // If empty, all roles can access
}

export const sidebarLinks: DashboardLink[] = [
  // Common Links
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboardIcon,
  },
  
  // SuperAdmin Only
  {
    title: "Manage Admins",
    url: "/dashboard/admins",
    icon: UserCheckIcon,
    roles: ["SUPERADMIN"],
  },

  // Admin and SuperAdmin
  {
    title: "Users Management",
    url: "/dashboard/users",
    icon: UsersIcon,
    roles: ["ADMIN", "SUPERADMIN"],
  },
  {
    title: "Category Management",
    url: "/dashboard/categories",
    icon: LayersIcon,
    roles: ["ADMIN", "SUPERADMIN"],
  },
  {
    title: "Books Library",
    url: "/dashboard/books",
    icon: BookOpenIcon,
    roles: ["ADMIN", "SUPERADMIN"],
  },

  // User Specific
  {
    title: "My Borrowings",
    url: "/dashboard/my-borrowings",
    icon: ShoppingBagIcon,
    roles: ["USER"],
  },
  {
    title: "My Memberships",
    url: "/dashboard/membership",
    icon: CreditCardIcon,
    roles: ["USER"],
  },

  // Common Settings
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: SettingsIcon,
  },
];
