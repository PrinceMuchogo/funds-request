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
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, FileText, Filter, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mockClaims = [
  {
    id: "1",
    employee: "John Doe",
    activity: "Business Trip to New York",
    amount: 1250.00,
    department: "Engineering",
    checkedBy: "Jane Smith",
    date: "2024-03-20",
    venue: "NYC Conference Center",
    status: "pending_approval",
    details: {
      from: "2024-03-15",
      to: "2024-03-20",
      travelExpenses: [
        {
          fromPlace: "Office",
          toPlace: "NYC",
          dateDeparture: "2024-03-15T09:00",
          dateArrived: "2024-03-15T14:00",
          board: 200,
          breakfast: 15,
          lunch: 25,
          dinner: 40,
          fares: 150,
          supper: 20,
        }
      ],
      expertAllowances: [
        {
          designation: "Senior Engineer",
          activity: "Technical Presentation",
          allowance: 100,
          units: 3,
          rate: 50,
        }
      ]
    }
  },
  // Add more mock claims as needed
];

const statusColors = {
  pending_checker: "bg-yellow-100 text-yellow-800",
  pending_approval: "bg-blue-100 text-blue-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const statusOptions = [
  { value: "all", label: "All Claims" },
  { value: "pending_approval", label: "Pending Approval" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export default function ApproverClaims() {
  const [claims] = useState(mockClaims);
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const filteredClaims = claims.filter(
    claim => statusFilter === "all" || claim.status === statusFilter
  );

  const handleAction = (id: string, action: "approve" | "reject") => {
    toast({
      title: `Claim ${action}ed`,
      description: `The claim has been ${action}ed successfully.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Claims Pending Approval</h1>
        <p className="text-gray-600 mt-1">Review and approve expense claims</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(option => (
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
                <TableHead>Employee</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead className="hidden md:table-cell">Venue</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="hidden md:table-cell">Checked By</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClaims.map((claim) => (
                <TableRow key={claim.id}>
                  <TableCell className="font-medium">{claim.employee}</TableCell>
                  <TableCell>{claim.activity}</TableCell>
                  <TableCell className="hidden md:table-cell">{claim.venue}</TableCell>
                  <TableCell>${claim.amount.toFixed(2)}</TableCell>
                  <TableCell className="hidden md:table-cell">{claim.checkedBy}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(claim.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="hover:bg-blue-50">
                            <Eye className="h-4 w-4 text-blue-600" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Claim Details</DialogTitle>
                          </DialogHeader>
                          <div className="mt-4 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h3 className="font-semibold">Basic Information</h3>
                                <div className="mt-2 space-y-2">
                                  <p><span className="text-gray-600">Employee:</span> {claim.employee}</p>
                                  <p><span className="text-gray-600">Activity:</span> {claim.activity}</p>
                                  <p><span className="text-gray-600">Venue:</span> {claim.venue}</p>
                                  <p><span className="text-gray-600">Department:</span> {claim.department}</p>
                                  <p><span className="text-gray-600">Amount:</span> ${claim.amount.toFixed(2)}</p>
                                  <p><span className="text-gray-600">Checked By:</span> {claim.checkedBy}</p>
                                  <p><span className="text-gray-600">Date:</span> {new Date(claim.date).toLocaleDateString()}</p>
                                </div>
                              </div>
                              <div>
                                <h3 className="font-semibold">Period</h3>
                                <div className="mt-2 space-y-2">
                                  <p><span className="text-gray-600">From:</span> {new Date(claim.details.from).toLocaleDateString()}</p>
                                  <p><span className="text-gray-600">To:</span> {new Date(claim.details.to).toLocaleDateString()}</p>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h3 className="font-semibold mb-2">Travel Expenses</h3>
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
                                    {claim.details.travelExpenses.map((expense, index) => (
                                      <TableRow key={index}>
                                        <TableCell>{expense.fromPlace}</TableCell>
                                        <TableCell>{expense.toPlace}</TableCell>
                                        <TableCell>${expense.board}</TableCell>
                                        <TableCell>
                                          ${expense.breakfast + expense.lunch + expense.dinner + expense.supper}
                                        </TableCell>
                                        <TableCell>${expense.fares}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>

                            <div>
                              <h3 className="font-semibold mb-2">Expert Allowances</h3>
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
                                    {claim.details.expertAllowances.map((allowance, index) => (
                                      <TableRow key={index}>
                                        <TableCell>{allowance.designation}</TableCell>
                                        <TableCell>{allowance.activity}</TableCell>
                                        <TableCell>{allowance.units}</TableCell>
                                        <TableCell>${allowance.rate}</TableCell>
                                        <TableCell>${allowance.allowance}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleAction(claim.id, "approve")}
                        className="text-green-600 hover:bg-green-50"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleAction(claim.id, "reject")}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
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