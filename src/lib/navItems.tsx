import { 
  UsersIcon, 
  BookOpenIcon, 
  LayoutDashboardIcon, 
  UserIcon,
  ShoppingBagIcon, 
  LayersIcon,
  CreditCardIcon,
  UserCheckIcon,
  PlusCircleIcon,
  ListIcon,
  MailIcon,
  BookCopyIcon,
  ImageIcon
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
  {
    title: "Banners",
    url: "/dashboard/banners",
    icon: ImageIcon,
    roles: ["ADMIN", "SUPERADMIN"],
    items: [
      { title: "All Banners", url: "/dashboard/banners", icon: ListIcon },
      { title: "Add Banner", url: "/dashboard/banners/add", icon: PlusCircleIcon },
    ]
  },
  {
    title: "Borrowings",
    url: "/dashboard/borrowings",
    icon: BookCopyIcon,
    roles: ["ADMIN", "SUPERADMIN"],
  },
  {
    title: "Memberships",
    url: "/dashboard/memberships",
    icon: CreditCardIcon,
    roles: ["ADMIN", "SUPERADMIN"],
    items: [
      { title: "User Memberships", url: "/dashboard/memberships", icon: UsersIcon },
      { title: "Membership Plans", url: "/dashboard/membership-plans", icon: ListIcon },
    ]
  },
  {
    title: "Messages",
    url: "/dashboard/contacts",
    icon: MailIcon,
    roles: ["ADMIN", "SUPERADMIN"],
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
    url: "/dashboard/my-membership",
    icon: CreditCardIcon,
    roles: ["USER"],
  },

  // Common Profile Management
  {
    title: "Manage Profile",
    url: "/dashboard/profile",
    icon: UserIcon,
  },
];
