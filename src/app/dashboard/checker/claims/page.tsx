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
import { CheckCircle, XCircle, FileText, Filter, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";

const statusColors = {
  pending_checker: "bg-yellow-100 text-yellow-800",
  pending_approval: "bg-blue-100 text-blue-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const statusOptions = [
  { value: "all", label: "All Claims" },
  { value: "PENDING CHECKER", label: "Pending Review" },
  { value: "PENDING APPROVAL", label: "In Progress" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

export default function CheckerClaims() {
  const { data: session } = useSession();
  const [claims, setClaims] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
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
        const response = await fetch("/api/claim/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        setClaims(data);
      } catch (error) {
        console.error("Error fetching claims:", error);
      }
    };

    getClaims();
  }, []);

  const filteredClaims = claims.filter(
    (claim) => statusFilter === "all" || claim.status === statusFilter,
  );

  const handleActionClick = (claim: any, action: "review" | "reject") => {
    setSelectedClaim(claim);
    setActionType(action);
    setComment("");
    setIsActionDialogOpen(true);
  };

  const handleActionSubmit = async () => {
    if (!selectedClaim || !actionType || !comment.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/claim/update/${selectedClaim.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: actionType === "review" ? "PENDING_APPROVAL" : "REJECTED",
          comment,
          userId: session?.user.id
        }),
      });

      if (!response.ok) throw new Error("Failed to update claim");

      // Update local state
      setClaims(
        claims.map((claim) =>
          claim.id === selectedClaim.id
            ? {
                ...claim,
                status:
                  actionType === "review" ? "PENDING_APPROVAL" : "REJECTED",
              }
            : claim,
        ),
      );

      toast({
        title: actionType === "review" ? "Claim reviewed" : "Claim rejected",
        description: `The claim has been ${actionType === "review" ? "reviewed and sent for approval" : "rejected"}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update claim status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsActionDialogOpen(false);
      setSelectedClaim(null);
      setActionType(null);
      setComment("");
    }
  };

  return (
    <div className="space-y-6 text-black">
      <div>
        <h1 className="text-2xl font-bold">Claims Pending Review</h1>
        <p className="mt-1 text-gray-600">Review and process expense claims</p>
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
                <TableHead className="hidden md:table-cell">Venue</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="hidden md:table-cell">
                  Department
                </TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClaims.map((claim) => (
                <TableRow key={claim.id}>
                  <TableCell className="font-medium">
                    {claim.user.name}
                  </TableCell>
                  <TableCell>{claim.activity}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {claim.venue}
                  </TableCell>
                  <TableCell>
                    ${Number(claim.advanceAmount).toFixed(2)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {claim.department}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
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
                                    {claim.employee}
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

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleActionClick(claim, "review")}
                        className="text-green-600 hover:bg-green-50"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleActionClick(claim, "reject")}
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

      {/* Action Dialog */}
      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent className="bg-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {actionType === "review" ? "Review Claim" : "Reject Claim"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="comment">Comment</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={
                  actionType === "review"
                    ? "Add review comments..."
                    : "Reason for rejection..."
                }
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsActionDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant={actionType === "review" ? "default" : "destructive"}
              onClick={handleActionSubmit}
              disabled={isLoading || !comment.trim()}
            >
              {isLoading
                ? "Processing..."
                : actionType === "review"
                  ? "Submit Review"
                  : "Reject Claim"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
