import { 
  UsersIcon, 
  BookOpenIcon, 
  LayoutDashboardIcon, 
  SettingsIcon, 
  ShoppingBagIcon, 
  LayersIcon,
  CreditCardIcon,
  UserCheckIcon,
  PlusCircleIcon,
  ListIcon
} from "lucide-react";

export interface DashboardLink {
  title: string;
  url: string;
  icon: any;
  roles?: string[]; // If empty, all roles can access
  items?: {
    title: string;
    url: string;
    icon?: any;
  }[];
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
    title: "Categories",
    url: "/dashboard/categories",
    icon: LayersIcon,
    roles: ["ADMIN", "SUPERADMIN"],
    items: [
      { title: "All Categories", url: "/dashboard/categories", icon: ListIcon },
      { title: "Add Category", url: "/dashboard/categories/add", icon: PlusCircleIcon },
    ]
  },
  {
    title: "Books",
    url: "/dashboard/books",
    icon: BookOpenIcon,
    roles: ["ADMIN", "SUPERADMIN"],
    items: [
      { title: "All Books", url: "/dashboard/books", icon: ListIcon },
      { title: "Add Book", url: "/dashboard/books/add", icon: PlusCircleIcon },
    ]
  },

  // User Specific (Can also have dropdowns if needed)
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
