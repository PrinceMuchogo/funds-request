"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Plus,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const statusColors = {
  pending_checker: "bg-yellow-100 text-yellow-800",
  pending_approval: "bg-blue-100 text-blue-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const statusOptions = [
  { value: "all", label: "All Claims" },
  { value: "PENDING CHECKER", label: "Pending Checker" },
  { value: "PENDING APPROVAL", label: "Pending Approval" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

export default function Claims() {
  const [claims, setClaims] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: session } = useSession();

  const { toast } = useToast();
  const [selectedClaim, setSelectedClaim] = useState<any>(null);
  const [comment, setComment] = useState("");
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"review" | "reject" | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getClaims = async () => {
      try {
        console.log("session: ", session?.user.id);
        const response = await fetch(`/api/claim/get/${session?.user.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        setClaims(data);
        console.log("claims: ", data);
      } catch (error) {}
    };

    getClaims();
  }, [session]);

  const filteredClaims = claims.filter(
    (claim) => statusFilter === "all" || claim.status === statusFilter,
  );

  return (
    <div className="space-y-6 text-black">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">My Claims</h1>
          <p className="mt-1 text-gray-600">
            Manage and track your expense claims
          </p>
        </div>
        <Link href="/dashboard/claims/new">
          <Button className="bg-blue-600 text-white hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            New Claim
          </Button>
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-lg">
        <div className="border-b p-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-gray">
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Activity</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClaims.map((claim) => (
                <TableRow key={claim.id}>
                  <TableCell className="font-medium">
                    {claim.activity}
                  </TableCell>
                  <TableCell>{claim.venue}</TableCell>
                  <TableCell>
                    ${Number(claim.advanceAmount).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        statusColors[claim.status as keyof typeof statusColors]
                      }
                    >
                      {claim.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(claim.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-blue-50"
                          >
                            <Eye className="h-4 w-4 text-blue-600" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[80vh] max-w-4xl overflow-y-auto bg-white">
                          <DialogHeader>
                            <DialogTitle>Claim Details</DialogTitle>
                          </DialogHeader>
                          <div className="mt-4 space-y-6 bg-white">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                              <div>
                                <h3 className="font-semibold">
                                  Basic Information
                                </h3>
                                <div className="mt-2 space-y-2">
                                  <p>
                                    <span className="text-black">
                                      Employee:
                                    </span>{" "}
                                    {claim.user.name}
                                  </p>
                                  <p>
                                    <span className="text-black">
                                      Activity:
                                    </span>{" "}
                                    {claim.activity}
                                  </p>
                                  <p>
                                    <span className="text-black">Venue:</span>{" "}
                                    {claim.venue}
                                  </p>
                                  <p>
                                    <span className="text-black">
                                      Department:
                                    </span>{" "}
                                    {claim.department}
                                  </p>
                                  <p>
                                    <span className="text-black">Amount:</span>{" "}
                                    ${Number(claim.advanceAmount).toFixed(2)}
                                  </p>
                                  <p>
                                    <span className="text-black">Date:</span>{" "}
                                    {new Date(
                                      claim.createdAt,
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <h3 className="font-semibold">Period</h3>
                                <div className="mt-2 space-y-2">
                                  <p>
                                    <span className="text-black">From:</span>{" "}
                                    {new Date(claim.from).toLocaleDateString()}
                                  </p>
                                  <p>
                                    <span className="text-black">To:</span>{" "}
                                    {new Date(claim.to).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h3 className="mb-2 font-semibold">
                                Travel Expenses
                              </h3>
                              <div className="overflow-x-auto">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>From</TableHead>
                                      <TableHead>To</TableHead>
                                      <TableHead>Board</TableHead>
                                      <TableHead>Meals</TableHead>
                                      <TableHead>Fares</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {claim.travellingAndSubsistence.map(
                                      (expense: any, index: number) => (
                                        <TableRow key={index}>
                                          <TableCell>
                                            {expense.fromPlace}
                                          </TableCell>
                                          <TableCell>
                                            {expense.toPlace}
                                          </TableCell>
                                          <TableCell>
                                            ${expense.board}
                                          </TableCell>
                                          <TableCell>
                                            $
                                            {expense.breakfast +
                                              expense.lunch +
                                              expense.dinner +
                                              expense.supper}
                                          </TableCell>
                                          <TableCell>
                                            ${expense.fares}
                                          </TableCell>
                                        </TableRow>
                                      ),
                                    )}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>

                            <div>
                              <h3 className="mb-2 font-semibold">
                                Expert Allowances
                              </h3>
                              <div className="overflow-x-auto">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Designation</TableHead>
                                      <TableHead>Activity</TableHead>
                                      <TableHead>Units</TableHead>
                                      <TableHead>Rate</TableHead>
                                      <TableHead>Total</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {claim.expertAndAdministrationAllowances.map(
                                      (allowance: any, index: number) => (
                                        <TableRow key={index}>
                                          <TableCell>
                                            {allowance.designation}
                                          </TableCell>
                                          <TableCell>
                                            {allowance.activity}
                                          </TableCell>
                                          <TableCell>
                                            {allowance.units}
                                          </TableCell>
                                          <TableCell>
                                            ${allowance.rate}
                                          </TableCell>
                                          <TableCell>
                                            ${allowance.allowance}
                                          </TableCell>
                                        </TableRow>
                                      ),
                                    )}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
