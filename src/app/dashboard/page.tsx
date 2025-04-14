"use client"
import AdminLandingPage from "@/components/Dashboard/Admin/AdminLandingPage";
import EployeeLandingPage from "@/components/Dashboard/Employee/EmployeeLandingPage";
import CheckerLandingPage from "@/components/Dashboard/Checker/CheckerLandingPage";
import ApproverLandingPage from "@/components/Dashboard/Approver/ApproverLandingPage";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  return (
    <div>
      {session?.user.role == "admin" && <AdminLandingPage />}
      {session?.user.role == "employee" && <EployeeLandingPage />}
      {session?.user.role == "checker" && <CheckerLandingPage />}
      {session?.user.role == "approver" && <ApproverLandingPage />}
    </div>
  );
}
