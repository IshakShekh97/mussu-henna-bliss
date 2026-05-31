"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  ShoppingBag,
  Package,
  Globe,
  LogOut,
  ChevronsUpDown,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";

interface AdminSidebarProps {
  user?: {
    name: string;
    email: string;
    image?: string | null;
  } | null;
}

const NAV_ITEMS = [
  {
    title: "Overview",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Bookings",
    url: "/admin/bookings",
    icon: Calendar,
  },
  {
    title: "Orders",
    url: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    title: "Products",
    url: "/admin/products",
    icon: Package,
  },
];

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Get user initials for avatar placeholder
  const getInitials = (name?: string) => {
    if (!name) return "A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-[#EBE4DC] bg-[#FDFBF7]"
    >
      <SidebarHeader className="border-b border-[#EBE4DC] p-4 min-h-16 flex justify-center">
        <Link href="/admin" className="flex items-center gap-2 overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white font-serif font-bold text-lg shadow-sm">
            M
          </div>
          {!isCollapsed && (
            <div className="flex flex-col truncate">
              <span className="font-serif font-bold text-sm text-[#4E3E2F] leading-none">
                Mussu's Admin
              </span>
              <span className="text-[10px] text-muted-foreground mt-0.5">
                Henna Bliss Portal
              </span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[#8C7A6B] font-medium tracking-wide">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-2">
            <SidebarMenu>
              {NAV_ITEMS.map((item) => {
                const isActive =
                  item.url === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.url + "/") ||
                      pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={`hover:bg-primary/5 hover:text-primary transition-all duration-200 ${
                        isActive
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-[#5C4D3E]"
                      }`}
                    >
                      <Link href={item.url} className="flex items-center gap-3">
                        <item.icon
                          className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-primary" : "text-[#8C7A6B]"}`}
                        />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="text-[#8C7A6B] font-medium tracking-wide">
            Shortcuts
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Back to Website"
                  className="hover:bg-primary/5 hover:text-primary text-[#5C4D3E] transition-all duration-200"
                >
                  <Link href="/" className="flex items-center gap-3">
                    <Globe className="h-4.5 w-4.5 shrink-0 text-[#8C7A6B]" />
                    <span>Back to Website</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-[#EBE4DC] p-3 bg-[#FAF6F0]">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="w-full justify-between hover:bg-primary/5 text-[#5C4D3E] transition-all duration-200"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    {user?.image ? (
                      <img
                        src={user.image}
                        alt={user.name}
                        className="h-8 w-8 rounded-full border border-primary/20 object-cover"
                      />
                    ) : (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold text-xs">
                        {getInitials(user?.name)}
                      </div>
                    )}
                    {!isCollapsed && (
                      <div className="flex flex-col text-left truncate max-w-[120px]">
                        <span className="text-xs font-semibold text-[#4E3E2F] truncate">
                          {user?.name || "Admin User"}
                        </span>
                        <span className="text-[10px] text-muted-foreground truncate">
                          {user?.email || "admin@hennabliss.com"}
                        </span>
                      </div>
                    )}
                  </div>
                  {!isCollapsed && (
                    <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-[#FDFBF7] border border-[#EBE4DC] p-1 shadow-md"
              >
                <div className="px-2 py-1.5 text-xs text-muted-foreground">
                  Logged in as{" "}
                  <span className="font-semibold text-foreground">
                    {user?.email}
                  </span>
                </div>
                <DropdownMenuSeparator className="bg-[#EBE4DC]" />
                <DropdownMenuItem asChild>
                  <Link
                    href="/"
                    className="flex items-center gap-2 cursor-pointer hover:bg-primary/5 hover:text-primary rounded-md p-2"
                  >
                    <Globe className="h-4 w-4 text-[#8C7A6B]" />
                    <span>Visit website</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#EBE4DC]" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-2 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive rounded-md p-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
