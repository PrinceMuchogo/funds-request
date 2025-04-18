"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  CircleDollarSign,
  FileText,
  Settings,
  Users,
  ClipboardList,
  Menu,
  X,
  Receipt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";

const navigation = {
  employee: [
    { name: "New Claim", href: "/dashboard/claims/new", icon: FileText },
    { name: "My Claims", href: "/dashboard/claims", icon: ClipboardList },
    { name: "Acquittals", href: "/dashboard/acquittal", icon: Receipt },
    { name: "Profile", href: "/dashboard/profile", icon: Settings },
  ],
  checker: [
    {
      name: "Pending Claims",
      href: "/dashboard/checker/claims",
      icon: ClipboardList,
    },
    {
      name: "Pending Acquittals",
      href: "/dashboard/checker/acquittals",
      icon: Receipt,
    },
  ],
  approver: [
    {
      name: "Pending Approvals",
      href: "/dashboard/approver/claims",
      icon: ClipboardList,
    },
    {
      name: "Pending Acquittals",
      href: "/dashboard/approver/acquittals",
      icon: Receipt,
    },
  ],
  admin: [
    { name: "User Management", href: "/dashboard/admin/users", icon: Users },
  ],
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const role = session?.user.role; // TODO: Get from auth context
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="flex min-h-screen">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 transform border-r bg-white transition-transform duration-200 ease-in-out lg:static lg:z-auto lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <nav className="px-4 py-4">
          {navigation[role as keyof typeof navigation]?.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "mb-1 flex items-center space-x-2 rounded-lg px-4 py-2 text-sm transition-colors",
                pathname === item.href
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50",
              )}
              onClick={() => setIsSidebarOpen(false)}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="min-w-0 flex-1 overflow-auto">
        {/* Mobile header */}
        <div className="flex items-center justify-between border-b bg-white p-4 lg:hidden">
          <Link href="/" className="flex items-center space-x-2">
            <CircleDollarSign className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-blue-600">FundFlow</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </div>
    </div>
  );
}
