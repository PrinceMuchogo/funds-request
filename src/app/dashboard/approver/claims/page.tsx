"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockClaims = [
  {
    id: "1",
    employee: "John Doe",
    title: "Business Trip to New York",
    amount: 1250.00,
    department: "Engineering",
    checkedBy: "Jane Smith",
    date: "2024-03-20",
  },
  // Add more mock data as needed
];

export default function ApproverClaims() {
  const [claims] = useState(mockClaims);
  const { toast } = useToast();

  const handleAction = (id: string, action: "approve" | "reject") => {
    toast({
      title: `Claim ${action}ed`,
      description: `The claim has been ${action}ed successfully.`,
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Claims Pending Approval</h1>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Checked By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {claims.map((claim) => (
              <TableRow key={claim.id}>
                <TableCell>{claim.employee}</TableCell>
                <TableCell>{claim.title}</TableCell>
                <TableCell>${claim.amount.toFixed(2)}</TableCell>
                <TableCell>{claim.department}</TableCell>
                <TableCell>{claim.checkedBy}</TableCell>
                <TableCell>{new Date(claim.date).toLocaleDateString()}</TableCell>
                <TableCell className="space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleAction(claim.id, "approve")}
                    className="text-green-600 hover:text-green-700"
                  >
                    <CheckCircle className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleAction(claim.id, "reject")}
                    className="text-red-600 hover:text-red-700"
                  >
                    <XCircle className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <FileText className="h-5 w-5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}