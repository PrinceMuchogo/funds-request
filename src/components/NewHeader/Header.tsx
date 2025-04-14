"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CircleDollarSign, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  if (pathname === "/signin" || pathname === "/signup") {
    return null;
  }

  const handleSignout = () => {
    console.log("logout");
    router.push("/auth/signin");
    signOut();
  };

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center space-x-2">
          <CircleDollarSign className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold text-blue-600">IPMS</span>
        </Link>
        {session && (
          <Button onClick={handleSignout} variant="ghost" size="icon">
            <LogOut className="h-5 w-5" />
          </Button>
        )}
      </div>
    </header>
  );
}
