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
import { CheckCircle, XCircle, Filter, Eye, FileText } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

const statusOptions = [
  { value: "all", label: "All Acquittals" },
  { value: "PENDING CHECKER", label: "Pending Review" },
  { value: "PENDING APPROVAL", label: "In Progress" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

export default function CheckerAcquittals() {
  const [acquittals, setAcquittals] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAcquittal, setSelectedAcquittal] = useState<any>(null);
  const [comment, setComment] = useState("");
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewDialogComment, setViewDialogComment] = useState("");
  const { data: session } = useSession();

  useEffect(() => {
    const getAcquittals = async () => {
      try {
        const response = await fetch("/api/acquittal/get/pending-approval", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        setAcquittals(data);
      } catch (error) {
        console.error("Error fetching acquittals:", error);
      }
    };

    getAcquittals();
  }, []);

  const filteredAcquittals = acquittals.filter(
    (acquittal) =>
      statusFilter === "all" || acquittal.acquittalStatus === statusFilter,
  );

  const handleActionClick = (acquittal: any, action: "approve" | "reject") => {
    setSelectedAcquittal(acquittal);
    setActionType(action);
    setComment("");
    setIsActionDialogOpen(true);
  };

  const handleActionSubmit = async (
    fromDialog: "action" | "view" = "action",
  ) => {
    if (!selectedAcquittal || !actionType) return;
    const commentText = fromDialog === "action" ? comment : viewDialogComment;
    if (!commentText.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/acquittal/approval/${selectedAcquittal.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: actionType === "approve" ? "APPROVED" : "REJECTEDR",
            comment: commentText,
            userId: session?.user.id,
          }),
        },
      );

      if (!response.ok) throw new Error("Failed to update acquittal");

      setAcquittals(
        acquittals.map((acquittal) =>
          acquittal.id === selectedAcquittal.id
            ? {
                ...acquittal,
                status: actionType === "approve" ? "APPROVED" : "REJECTED",
              }
            : acquittal,
        ),
      );

      toast.success(
        `The acquittal has been ${actionType === "approve" ? "approved" : "rejected"} successfully.`,
      );
    } catch (error) {
      toast.error("Failed to update acquittal status. Please try again.");
    } finally {
      setIsLoading(false);
      setIsActionDialogOpen(false);
      setIsViewDialogOpen(false);
      setSelectedAcquittal(null);
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
        <h1 className="text-2xl font-bold">Acquittals Approval</h1>
        <p className="mt-1 text-gray-600">
          Review and process expense acquittals
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
                <TableHead>Acquittal status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAcquittals.map((acquittal) => (
                <TableRow key={acquittal.id}>
                  <TableCell className="font-medium">
                    {acquittal.user.name}
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
                    ) : acquittal.extraClaimAmount ? (
                      <span className="text-green-600">
                        +${Number(acquittal.extraClaimAmount).toFixed(2)}
                      </span>
                    ) : (
                      "$0.00"
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {acquittal.acquittalStatus}
                  </TableCell>
                  <TableCell>
                    {new Date(acquittal.updatedAt).toLocaleDateString()}
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
                            onClick={() => setSelectedAcquittal(acquittal)}
                          >
                            <Eye className="h-4 w-4 text-blue-600" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[80vh] max-w-4xl overflow-y-auto bg-white">
                          <DialogHeader>
                            <DialogTitle>Acquittal Details</DialogTitle>
                          </DialogHeader>
                          <div className="mt-4 space-y-6">
                            {/* Basic Information */}
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
                                    {acquittal.user.name}
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
                                    ${acquittal.advanceAmount.toFixed(2)}
                                  </p>
                                  <p>
                                    <span className="text-gray-600">
                                      Acquitted Amount:
                                    </span>{" "}
                                    ${acquittal.acquittedAmount.toFixed(2)}
                                  </p>
                                  <p>
                                    <span className="text-gray-600">
                                      Refund/Extra Amount:
                                    </span>{" "}
                                    {acquittal.refundAmount ? (
                                      <span className="text-red-600">
                                        -$
                                        {Number(acquittal.refundAmount).toFixed(
                                          2,
                                        )}
                                      </span>
                                    ) : acquittal.extraClaimAmount ? (
                                      <span className="text-green-600">
                                        +$
                                        {Number(
                                          acquittal.extraClaimAmount,
                                        ).toFixed(2)}
                                      </span>
                                    ) : (
                                      "$0.00"
                                    )}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <h3 className="font-semibold">Period</h3>
                                <div className="mt-2 space-y-2">
                                  <p>
                                    <span className="text-gray-600">From:</span>{" "}
                                    {new Date(
                                      acquittal.from,
                                    ).toLocaleDateString()}
                                  </p>
                                  <p>
                                    <span className="text-gray-600">To:</span>{" "}
                                    {new Date(
                                      acquittal.to,
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Supporting Documents */}
                            <div>
                              <h3 className="mb-2 font-semibold">
                                Supporting Documents
                              </h3>
                              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {acquittal.SupportingDocuments?.map(
                                  (doc: any, index: number) => (
                                    <div
                                      key={index}
                                      className="flex items-center gap-2 rounded border p-2"
                                    >
                                      <FileText className="h-4 w-4 text-blue-600" />
                                      <a
                                        href={doc.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                      >
                                        Document {index + 1}
                                      </a>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>

                            {/* Travel Expenses */}
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
                                    {acquittal.travellingAndSubsistence.map(
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

                            {/* Expert Allowances */}
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
                                    {acquittal.expertAndAdministrationAllowances.map(
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

                            {/* Comments Section */}
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
                        onClick={() => handleActionClick(acquittal, "approve")}
                        className="text-green-600 hover:bg-green-50"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleActionClick(acquittal, "reject")}
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
              {actionType === "approve"
                ? "Approve Acquittal"
                : "Reject Acquittal"}
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
