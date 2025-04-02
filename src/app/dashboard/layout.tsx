"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  CircleDollarSign,
  FileText,
  Settings,
  Users,
  ClipboardList,
} from "lucide-react";

const navigation = {
  employee: [
    { name: "New Claim", href: "/claims/new", icon: FileText },
    { name: "My Claims", href: "/claims", icon: ClipboardList },
    { name: "Profile", href: "/profile", icon: Settings },
  ],
  checker: [
    { name: "Pending Claims", href: "/checker/claims", icon: ClipboardList },
  ],
  approver: [
    { name: "Pending Approvals", href: "/approver/claims", icon: ClipboardList },
  ],
  admin: [
    { name: "User Management", href: "/admin/users", icon: Users },
  ],
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const role = "employee"; // TODO: Get from auth context

  return (
    <div className="flex min-h-screen">
      <div className="w-64 bg-white border-r">
        <div className="flex h-16 items-center px-6">
          <Link href="/" className="flex items-center space-x-2">
            <CircleDollarSign className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-blue-600">FundFlow</span>
          </Link>
        </div>
        <nav className="px-4 py-4">
          {navigation[role as keyof typeof navigation].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 text-sm rounded-lg mb-1",
                pathname === item.href
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex-1 min-w-0 overflow-auto">
        <div className="py-6 px-8">
          {children}
        </div>
      </div>
    </div>
  );
}