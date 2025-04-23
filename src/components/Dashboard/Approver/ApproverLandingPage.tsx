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
import { toast } from "react-toastify";

const statusColors = {
  pending_checker: "bg-yellow-100 text-yellow-800",
  pending_approval: "bg-blue-100 text-blue-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const statusOptions = [
  // { value: "all", label: "All Claims" },
  { value: "PENDING APPROVAL", label: "Pending Approval" },
  // { value: "APPROVED", label: "Approved" },
  // { value: "REJECTED", label: "Rejected" },
];

export default function ApproverClaims() {
  const [claims, setClaims] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("PENDING APPROVAL");
  const [selectedClaim, setSelectedClaim] = useState<any>(null);
  const [comment, setComment] = useState("");
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewDialogComment, setViewDialogComment] = useState("");
  const {data:session} = useSession()

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

  const handleActionClick = (claim: any, action: "approve" | "reject") => {
    setSelectedClaim(claim);
    setActionType(action);
    setComment("");
    setIsActionDialogOpen(true);
  };

  const handleActionSubmit = async (
    fromDialog: "action" | "view" = "action",
  ) => {
    if (!selectedClaim || !actionType) return;
    const commentText = fromDialog === "action" ? comment : viewDialogComment;
    if (!commentText.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/claim/approval/${selectedClaim.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: actionType === "approve" ? "APPROVED" : "REJECTED",
          comment: commentText,
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
                status: actionType === "approve" ? "APPROVED" : "REJECTED",
              }
            : claim,
        ),
      );

      toast.success( `The claim has been ${actionType === "approve" ? "approved" : "rejected"} successfully.`);
    } catch (error) {
      console.log("error: ", error)
      toast.error("Failed to update claim status. Please try again.");
    } finally {
      setIsLoading(false);
      setIsActionDialogOpen(false);
      setIsViewDialogOpen(false);
      setSelectedClaim(null);
      setActionType(null);
      setComment("");
      setViewDialogComment("");
    }
  };

  const handleViewDialogAction = (action: "approve" | "reject") => {
    setActionType(action);
    handleActionSubmit("view");
  };

  return (
    <div className="space-y-6 text-black">
      <div>
        <h1 className="text-2xl font-bold">Claims Pending Approval</h1>
        <p className="mt-1 text-gray-600">Review and approve expense claims</p>
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
                  Checked By
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
                    {claim.checker.name}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(claim.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog
                        open={isViewDialogOpen}
                        onOpenChange={setIsViewDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-blue-50"
                            onClick={() => setSelectedClaim(claim)}
                          >
                            <Eye className="h-4 w-4 text-blue-600" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[80vh] max-w-4xl overflow-y-auto bg-white">
                          <DialogHeader>
                            <DialogTitle>Claim Details</DialogTitle>
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
                                    {claim.employee}
                                  </p>
                                  <p>
                                    <span className="text-gray-600">
                                      Activity:
                                    </span>{" "}
                                    {claim.activity}
                                  </p>
                                  <p>
                                    <span className="text-gray-600">
                                      Venue:
                                    </span>{" "}
                                    {claim.venue}
                                  </p>
                                  <p>
                                    <span className="text-gray-600">
                                      Department:
                                    </span>{" "}
                                    {claim.department}
                                  </p>
                                  <p>
                                    <span className="text-gray-600">
                                      Amount:
                                    </span>{" "}
                                    ${Number(claim.advanceAmount).toFixed(2)}
                                  </p>
                                  <p>
                                    <span className="text-gray-600">
                                      Checked By:
                                    </span>{" "}
                                    {claim.checker.name}
                                  </p>
                                  <p>
                                    <span className="text-gray-600">Date:</span>{" "}
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
                                    <span className="text-gray-600">From:</span>{" "}
                                    {new Date(claim.from).toLocaleDateString()}
                                  </p>
                                  <p>
                                    <span className="text-gray-600">To:</span>{" "}
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

                            <div className="space-y-4 border-t pt-4">
                              <div className="grid gap-2">
                                <Label htmlFor="viewComment">Comment</Label>
                                <Textarea
                                  id="viewComment"
                                  value={viewDialogComment}
                                  onChange={(e) =>
                                    setViewDialogComment(e.target.value)
                                  }
                                  placeholder="Add your comments..."
                                  className="min-h-[100px]"
                                />
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => setIsViewDialogOpen(false)}
                                  disabled={isLoading}
                                >
                                  Close
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() =>
                                    handleViewDialogAction("reject")
                                  }
                                  disabled={
                                    isLoading || !viewDialogComment.trim()
                                  }
                                >
                                  {isLoading ? "Processing..." : "Reject"}
                                </Button>
                                <Button
                                  onClick={() =>
                                    handleViewDialogAction("approve")
                                  }
                                  disabled={
                                    isLoading || !viewDialogComment.trim()
                                  }
                                >
                                  {isLoading ? "Processing..." : "Approve"}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleActionClick(claim, "approve")}
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
              {actionType === "approve" ? "Approve Claim" : "Reject Claim"}
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
                  actionType === "approve"
                    ? "Add approval comments..."
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
              variant={actionType === "approve" ? "default" : "destructive"}
              onClick={() => handleActionSubmit("action")}
              disabled={isLoading || !comment.trim()}
            >
              {isLoading
                ? "Processing..."
                : actionType === "approve"
                  ? "Approve"
                  : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
