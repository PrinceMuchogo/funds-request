"use client";

import { useEffect, useState } from "react";
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
import { CheckCircle, XCircle, Filter, Eye } from "lucide-react";
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

const statusColors = {
  pending_checker: "bg-yellow-100 text-yellow-800",
  pending_approval: "bg-blue-100 text-blue-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const statusOptions = [
  { value: "all", label: "All Acquittals" },
  { value: "PENDING APPROVAL", label: "Pending Approval" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

export default function ApproverAcquittals() {
  const [acquittals, setAcquittals] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    const getClaims = async () => {
      try {
        const response = await fetch("/api/acquittal/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        setAcquittals(data);
        console.log("claims: ", data);
      } catch (error) {}
    };

    getClaims();
  }, []);

  const filteredAcquittals = acquittals.filter(
    (acquittal) => statusFilter === "all" || acquittal.status === statusFilter,
  );

  const handleAction = (id: string, action: "approve" | "reject") => {
    toast({
      title: `Acquittal ${action}ed`,
      description: `The acquittal has been ${action}ed successfully.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Acquittals Pending Approval</h1>
        <p className="mt-1 text-gray-600">
          Review and approve expense acquittals
        </p>
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
                <TableHead>Employee</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Advance</TableHead>
                <TableHead>Acquitted</TableHead>
                <TableHead>Refund/Extra</TableHead>
                <TableHead>Checked By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAcquittals.map((acquittal) => (
                <TableRow key={acquittal.id}>
                  <TableCell className="font-medium">
                    {acquittal.employee}
                  </TableCell>
                  <TableCell>{acquittal.activity}</TableCell>
                  <TableCell>
                    ${Number(acquittal.advanceAmount).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    ${Number(acquittal.acquittedAmount).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {acquittal.refundAmount ? (
                      <span className="text-red-600">
                        -${Number(acquittal.refundAmount).toFixed(2)}
                      </span>
                    ) : acquittal.refundAmount ? (
                      <span className="text-green-600">
                        +${acquittal.refundAmount}
                      </span>
                    ) : (
                      "$0.00"
                    )}
                  </TableCell>
                  <TableCell>{acquittal.checkedBy}</TableCell>
                  <TableCell>
                    {new Date(acquittal.updatedAt).toLocaleDateString()}
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
                        <DialogContent className="max-h-[80vh] max-w-4xl overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Acquittal Details</DialogTitle>
                          </DialogHeader>
                          <div className="mt-4 space-y-6">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                              <div>
                                <h3 className="font-semibold">
                                  Basic Information
                                </h3>
                                <div className="mt-2 space-y-2">
                                  <p>
                                    <span className="text-gray-600">
                                      Employee:
                                    </span>{" "}
                                    {acquittal.employee}
                                  </p>
                                  <p>
                                    <span className="text-gray-600">
                                      Activity:
                                    </span>{" "}
                                    {acquittal.activity}
                                  </p>
                                  <p>
                                    <span className="text-gray-600">
                                      Venue:
                                    </span>{" "}
                                    {acquittal.venue}
                                  </p>
                                  <p>
                                    <span className="text-gray-600">
                                      Department:
                                    </span>{" "}
                                    {acquittal.department}
                                  </p>
                                  <p>
                                    <span className="text-gray-600">
                                      Advance Amount:
                                    </span>{" "}
                                    $
                                    {Number(acquittal.advanceAmount).toFixed(2)}
                                  </p>
                                  <p>
                                    <span className="text-gray-600">
                                      Acquitted Amount:
                                    </span>{" "}
                                    $
                                    {Number(acquittal.acquittedAmount).toFixed(
                                      2,
                                    )}
                                  </p>
                                  <p>
                                    <span className="text-gray-600">
                                      Checked By:
                                    </span>{" "}
                                    {acquittal.checkedBy}
                                  </p>
                                  <p>
                                    <span className="text-gray-600">Date:</span>{" "}
                                    {new Date(
                                      acquittal.updatedAt,
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <h3 className="font-semibold">Period</h3>
                                <div className="mt-2 space-y-2">
                                  <p>
                                    <span className="text-gray-600">From:</span>{" "}
                                    {new Date(
                                      acquittal.details.from,
                                    ).toLocaleDateString()}
                                  </p>
                                  <p>
                                    <span className="text-gray-600">To:</span>{" "}
                                    {new Date(
                                      acquittal.details.to,
                                    ).toLocaleDateString()}
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
                                      <TableHead>Total</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {acquittal.details.travelExpenses.map(
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
                                          <TableCell>
                                            ${expense.total}
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
                                    {acquittal.details.expertAllowances.map(
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
                                            ${allowance.total}
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

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleAction(acquittal.id, "approve")}
                        className="text-green-600 hover:bg-green-50"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleAction(acquittal.id, "reject")}
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
