"use client";

import { useEffect, useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { FileText, Filter, Receipt } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const statusOptions = [
  { value: "all", label: "All Acquittals" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "rejected", label: "Rejected" },
];

export default function Acquittals() {
  const [claims, setClaims] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: session } = useSession();

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
    (claim) => statusFilter === "all" || claim.acquittalStatus === statusFilter,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Acquittals</h1>
          <p className="mt-1 text-gray-600">
            Manage and track your expense acquittals
          </p>
        </div>
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
                <TableHead>Advance</TableHead>
                <TableHead>Acquitted</TableHead>
                <TableHead>Refund/Extra</TableHead>
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
                  <TableCell>${Number(claim.advanceAmount).toFixed(2)}</TableCell>
                  <TableCell>${Number(claim.acquittedAmount).toFixed(2)}</TableCell>
                  <TableCell>
                    {claim.refundAmount ? (
                      <span className="text-red-600">
                        -${Number(claim.refundAmount).toFixed(2)}
                      </span>
                    ) : claim.extraClaimAmount ? (
                      <span className="text-green-600">
                        +${Number(claim.extraClaimAmount).toFixed(2)}
                      </span>
                    ) : (
                      "$0.00"
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        statusColors[
                          claim.acquittalStatus as keyof typeof statusColors
                        ]
                      }
                    >
                      {claim.acquittalStatus?.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(claim.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {claim.acquittalStatus === "pending" ? (
                      <Link href={`/dashboard/acquittal/${claim.id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-blue-50"
                        >
                          <Receipt className="h-4 w-4 text-blue-600" />
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-gray-100"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    )}
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
