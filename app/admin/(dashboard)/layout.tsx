import { checkAuth } from "@/lib/checkAuth";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import React from "react";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return redirect("/admin/login");

  return (
    <SidebarProvider>
      <AdminSidebar user={session.user} />
      <SidebarInset className="bg-[#FAF6F0] min-h-screen flex flex-col">
        {/* Persistent Premium Admin Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-[#EBE4DC] px-4 bg-[#FDFBF7] shadow-xs">
          <SidebarTrigger className="-ml-1 text-[#8C7A6B] hover:text-primary hover:bg-primary/5 transition-all duration-200" />
          <div className="h-4 w-px bg-[#EBE4DC]" />
          <span className="font-semibold text-sm text-[#4E3E2F] font-sans">
            Admin Portal
          </span>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
