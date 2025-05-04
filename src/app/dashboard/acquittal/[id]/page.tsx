"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  Calendar,
  Building2,
  Plus,
  Trash2,
  Receipt,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Claim } from "@/types/claim";
import { toast } from "react-toastify";

type TravellingExpense = {
  day: number;
  fromPlace: string;
  toPlace: string;
  dateDeparture: string;
  dateArrived: string;
  board: number;
  breakfast: number;
  lunch: number;
  dinner: number;
  fares: number;
  supper: number;
  total: number;
};

type ExpertAllowance = {
  day: number;
  designation: string;
  activity: string;
  allowance: number;
  units: number;
  rate: number;
  total: number;
};

// Mock data for demonstration
const mockClaim = {
  id: "1",
  activity: "Business Trip to New York",
  station: "Head Office",
  from: "2024-03-15",
  to: "2024-03-20",
  venue: "NYC Conference Center",
  advanceAmount: 1500.0,
  status: "approved",
  acquittalStatus: "pending",
  travelExpenses: [
    {
      day: 1,
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
      total: 450,
    },
  ],
  expertAllowances: [
    {
      day: 1,
      designation: "Senior Engineer",
      activity: "Technical Presentation",
      allowance: 100,
      units: 3,
      rate: 50,
      total: 150,
    },
  ],
};

export default function AcquittalForm({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [claim, setClaim] = useState<Claim>();
  const [travelLength, setTravelLength] = useState(0);
  const [allowanceLength, setAllowanceLength] = useState(0);
  const [files, setFiles] = useState<FileList | null>(null);
  const [travelExpenses, setTravelExpenses] = useState<TravellingExpense[]>([
    {
      day: 2,
      // claim?.travellingAndSubsistence.length! + 1,
      fromPlace: "",
      toPlace: "",
      dateDeparture: "",
      dateArrived: "",
      board: 0,
      breakfast: 0,
      lunch: 0,
      dinner: 0,
      fares: 0,
      supper: 0,
      total: 0,
    },
  ]);

  useEffect(() => {
    const getClaims = async () => {
      try {
        const response = await fetch(`/api/claim/${params.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        console.log("claim: ", data);
        setClaim(data);
        setAllowanceLength(data.expertAndAdministrationAllowances.length);
        setTravelLength(data.travellingAndSubsistence.length);
      } catch (error) {}
    };

    getClaims();
  }, [session]);
  const [expertAllowances, setExpertAllowances] = useState<ExpertAllowance[]>([
    {
      day: 1,
      // claim?.expertAndAdministrationAllowances.length! + 1,
      designation: "",
      activity: "",
      allowance: 0,
      units: 0,
      rate: 0,
      total: 0,
    },
  ]);

  const calculateTravelExpenseTotal = (expense: TravellingExpense) => {
    return (
      expense.board +
      expense.breakfast +
      expense.lunch +
      expense.dinner +
      expense.fares +
      expense.supper
    );
  };

  const calculateExpertAllowanceTotal = (allowance: ExpertAllowance) => {
    return allowance.units * allowance.rate;
  };

  const updateTravelExpense = (
    index: number,
    field: keyof TravellingExpense,
    value: any,
  ) => {
    const updatedExpenses = [...travelExpenses];
    updatedExpenses[index] = {
      ...updatedExpenses[index],
      [field]: value,
      total:
        field === "total"
          ? value
          : calculateTravelExpenseTotal(updatedExpenses[index]),
    };
    setTravelExpenses(updatedExpenses);
  };

  const updateExpertAllowance = (
    index: number,
    field: keyof ExpertAllowance,
    value: any,
  ) => {
    const updatedAllowances = [...expertAllowances];
    updatedAllowances[index] = {
      ...updatedAllowances[index],
      [field]: value,
      total:
        field === "total"
          ? value
          : calculateExpertAllowanceTotal(updatedAllowances[index]),
    };
    setExpertAllowances(updatedAllowances);
  };

  const addTravelExpense = () => {
    setTravelExpenses([
      ...travelExpenses,
      {
        day:
          claim?.travellingAndSubsistence.length! + travelExpenses.length + 1,
        fromPlace: "",
        toPlace: "",
        dateDeparture: "",
        dateArrived: "",
        board: 0,
        breakfast: 0,
        lunch: 0,
        dinner: 0,
        fares: 0,
        supper: 0,
        total: 0,
      },
    ]);
  };

  const addExpertAllowance = () => {
    setExpertAllowances([
      ...expertAllowances,
      {
        day:
          claim?.expertAndAdministrationAllowances.length! +
          expertAllowances.length +
          1,
        designation: "",
        activity: "",
        allowance: 0,
        units: 0,
        rate: 0,
        total: 0,
      },
    ]);
  };

  const removeTravelExpense = (index: number) => {
    setTravelExpenses(travelExpenses.filter((_, i) => i !== index));
  };

  const removeExpertAllowance = (index: number) => {
    setExpertAllowances(expertAllowances.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    const existingTravelTotal = claim?.travellingAndSubsistence!.reduce(
      (acc, curr) => acc + Number(curr.total),
      0,
    );
    const newTravelTotal = travelExpenses.reduce(
      (acc, curr) => acc + curr.total,
      0,
    );

    const existingAllowanceTotal =
      claim?.expertAndAdministrationAllowances!.reduce(
        (acc, curr) => acc + Number(curr.total),
        0,
      );
    const newAllowanceTotal = expertAllowances.reduce(
      (acc, curr) => acc + curr.total,
      0,
    );

    const totalExpenses =
      existingTravelTotal! +
      newTravelTotal +
      existingAllowanceTotal! +
      newAllowanceTotal;
    const difference = totalExpenses - claim?.advanceAmount!;

    return {
      acquittedAmount: totalExpenses,
      refundAmount: difference < 0 ? Math.abs(difference) : 0,
      extraClaimAmount: difference > 0 ? difference : 0,
    };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const totals = calculateTotals();

    // Create FormData instance to handle file uploads
    const formData = new FormData();

    // Add all files to FormData
    if (files) {
      Array.from(files).forEach((file, index) => {
        formData.append(`supportingDocuments`, file);
      });
    }

    // Add other data as JSON string
    formData.append(
      "data",
      JSON.stringify({
        claimId: params.id,
        ...totals,
        newTravelExpenses: travelExpenses,
        newExpertAllowances: expertAllowances,
      }),
    );

    try {
      // TODO: Replace with your actual API endpoint
      const response = await fetch(`/api/acquittal/add/${params.id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit acquittal");
      }

      router.push("/dashboard/acquittal");
      toast.success("Your acquittal has been sent for review.");
    } catch (error) {
      toast("Failed. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files);
    }
  };

  return (
    <div className="py-8lack mx-auto max-w-7xl px-4">
      <div className="overflow-hidden rounded-xl bg-white shadow-lg">
        <div className="bg-blue-600 p-6">
          <h1 className="text-2xl font-bold text-white">Acquittal Form</h1>
          <p className="mt-2 text-blue-100">
            Update your claim with actual expenses
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 p-6">
          {/* Original Claim Details */}
          <div className="rounded-lg bg-gray-50 p-4">
            <h2 className="mb-4 text-lg font-semibold">
              Original Claim Details
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <Label className="text-gray-600">Activity</Label>
                <p className="font-medium">{claim?.station}</p>
              </div>
              <div>
                <Label className="text-gray-600">From Date</Label>
                <p className="font-medium">
                  {new Date(claim?.from!).toLocaleDateString()}
                </p>
              </div>
              <div>
                <Label className="text-gray-600">To Date</Label>
                <p className="font-medium">
                  {new Date(claim?.to!).toLocaleDateString()}
                </p>
              </div>
              <div>
                <Label className="text-gray-600">Venue</Label>
                <p className="font-medium">{claim?.venue}</p>
              </div>
              <div>
                <Label className="text-gray-600">Advance Amount</Label>
                <p className="font-medium">
                  ${Number(claim?.advanceAmount!).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Existing Travel Expenses */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Existing Travel Expenses</h2>
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Day</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Departure</TableHead>
                    <TableHead>Arrival</TableHead>
                    <TableHead>Board</TableHead>
                    <TableHead>Breakfast</TableHead>
                    <TableHead>Lunch</TableHead>
                    <TableHead>Dinner</TableHead>
                    <TableHead>Fares</TableHead>
                    <TableHead>Supper</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {claim &&
                    claim.travellingAndSubsistence!.map((expense, index) => (
                      <TableRow key={index}>
                        <TableCell>{expense.day}</TableCell>
                        <TableCell>{expense.fromPlace}</TableCell>
                        <TableCell>{expense.toPlace}</TableCell>
                        <TableCell>
                          {new Date(expense.dateDeparture).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {new Date(expense.dateArrived).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          ${Number(expense.board).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          ${Number(expense.breakfast).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          ${Number(expense.lunch).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          ${Number(expense.dinner).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          ${Number(expense.fares).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          ${Number(expense.supper).toFixed(2)}
                        </TableCell>
                        <TableCell className="font-medium">
                          ${Number(expense.total).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  <TableRow>
                    <TableCell
                      colSpan={11}
                      className="text-right font-semibold"
                    >
                      Grand Total:
                    </TableCell>
                    <TableCell className="font-semibold">
                      $
                      {claim
                        ?.travellingAndSubsistence!.reduce(
                          (acc, curr) => acc + Number(curr.total),
                          0,
                        )
                        .toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Additional Travel Expenses */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Additional Travel Expenses
              </h2>
              <Button
                type="button"
                onClick={addTravelExpense}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Row
              </Button>
            </div>

            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Day</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Departure</TableHead>
                    <TableHead>Arrival</TableHead>
                    <TableHead>Board</TableHead>
                    <TableHead>Breakfast</TableHead>
                    <TableHead>Lunch</TableHead>
                    <TableHead>Dinner</TableHead>
                    <TableHead>Fares</TableHead>
                    <TableHead>Supper</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {travelExpenses.map((expense, index) => (
                    <TableRow key={index}>
                      <TableCell>{expense.day}</TableCell>
                      <TableCell>
                        <Input
                          value={expense.fromPlace}
                          onChange={(e) =>
                            updateTravelExpense(
                              index,
                              "fromPlace",
                              e.target.value,
                            )
                          }
                          onFocus={(e) =>
                            updateTravelExpense(
                              index,
                              "fromPlace",
                              e.target.value,
                            )
                          }
                          className="min-w-[100px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={expense.toPlace}
                          onChange={(e) =>
                            updateTravelExpense(
                              index,
                              "toPlace",
                              e.target.value,
                            )
                          }
                          onFocus={(e) =>
                            updateTravelExpense(
                              index,
                              "toPlace",
                              e.target.value,
                            )
                          }
                          onBlur={(e) =>
                            updateTravelExpense(
                              index,
                              "toPlace",
                              e.target.value,
                            )
                          }
                          className="min-w-[100px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="datetime-local"
                          value={expense.dateDeparture}
                          onChange={(e) =>
                            updateTravelExpense(
                              index,
                              "dateDeparture",
                              e.target.value,
                            )
                          }
                          onFocus={(e) =>
                            updateTravelExpense(
                              index,
                              "dateDeparture",
                              e.target.value,
                            )
                          }
                          onBlur={(e) =>
                            updateTravelExpense(
                              index,
                              "dateDeparture",
                              e.target.value,
                            )
                          }
                          className="min-w-[180px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="datetime-local"
                          value={expense.dateArrived}
                          onChange={(e) =>
                            updateTravelExpense(
                              index,
                              "dateArrived",
                              e.target.value,
                            )
                          }
                          onFocus={(e) =>
                            updateTravelExpense(
                              index,
                              "dateArrived",
                              e.target.value,
                            )
                          }
                          onBlur={(e) =>
                            updateTravelExpense(
                              index,
                              "dateArrived",
                              e.target.value,
                            )
                          }
                          className="min-w-[180px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={expense.board}
                          onChange={(e) =>
                            updateTravelExpense(
                              index,
                              "board",
                              parseFloat(e.target.value),
                            )
                          }
                          onFocus={(e) =>
                            updateTravelExpense(index, "board", parseFloat(e.target.value),)
                          }
                          onBlur={(e) =>
                            updateTravelExpense(index, "board", parseFloat(e.target.value),)
                          }
                          min="0"
                          step="0.01"
                          className="min-w-[80px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={expense.breakfast}
                          onChange={(e) =>
                            updateTravelExpense(
                              index,
                              "breakfast",
                              parseFloat(e.target.value),
                            )
                          }
                          onFocus={(e) =>
                            updateTravelExpense(
                              index,
                              "breakfast",
                              parseFloat(e.target.value),
                            )
                          }
                          onBlur={(e) =>
                            updateTravelExpense(
                              index,
                              "breakfast",
                              parseFloat(e.target.value),
                            )
                          }
                          min="0"
                          step="0.01"
                          className="min-w-[80px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={expense.lunch}
                          onChange={(e) =>
                            updateTravelExpense(
                              index,
                              "lunch",
                              parseFloat(e.target.value),
                            )
                          }
                          onFocus={(e) =>
                            updateTravelExpense(index, "lunch", parseFloat(e.target.value),)
                          }
                          onBlur={(e) =>
                            updateTravelExpense(index, "lunch", parseFloat(e.target.value),)
                          }
                          min="0"
                          step="0.01"
                          className="min-w-[80px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={expense.dinner}
                          onChange={(e) =>
                            updateTravelExpense(
                              index,
                              "dinner",
                              parseFloat(e.target.value),
                            )
                          }
                          onFocus={(e) =>
                            updateTravelExpense(index, "dinner", parseFloat(e.target.value),)
                          }
                          onBlur={(e) =>
                            updateTravelExpense(index, "dinner", parseFloat(e.target.value),)
                          }
                          min="0"
                          step="0.01"
                          className="min-w-[80px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={expense.fares}
                          onChange={(e) =>
                            updateTravelExpense(
                              index,
                              "fares",
                              parseFloat(e.target.value),
                            )
                          }
                          onFocus={(e) =>
                            updateTravelExpense(index, "fares", parseFloat(e.target.value),)
                          }
                          onBlur={(e) =>
                            updateTravelExpense(index, "fares", parseFloat(e.target.value),)
                          }
                          min="0"
                          step="0.01"
                          className="min-w-[80px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={expense.supper}
                          onChange={(e) =>
                            updateTravelExpense(
                              index,
                              "supper",
                              parseFloat(e.target.value),
                            )
                          }
                          onFocus={(e) =>
                            updateTravelExpense(
                              index,
                              "supper",
                              parseFloat(e.target.value),
                            )
                          }
                          onBlur={(e) =>
                            updateTravelExpense(index, "supper", parseFloat(e.target.value),)
                          }
                          min="0"
                          step="0.01"
                          className="min-w-[80px]"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        ${Number(expense.total).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => removeTravelExpense(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell
                      colSpan={11}
                      className="text-right font-semibold"
                    >
                      Grand Total:
                    </TableCell>
                    <TableCell className="font-semibold">
                      $
                      {Number(
                        travelExpenses.reduce(
                          (acc, curr) => acc + curr.total,
                          0,
                        ),
                      ).toFixed(2)}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Existing Expert Allowances */}
          {/* <div className="space-y-4">
            <h2 className="text-lg font-semibold">
              Existing Expert Allowances
            </h2>
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Day</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Allowance</TableHead>
                    <TableHead>Units</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {claim &&
                    claim.expertAndAdministrationAllowances!.map(
                      (allowance, index) => (
                        <TableRow key={index}>
                          <TableCell>{allowance.day}</TableCell>
                          <TableCell>{allowance.designation}</TableCell>
                          <TableCell>{allowance.activity}</TableCell>
                          <TableCell>
                            ${Number(allowance.allowance).toFixed(2)}
                          </TableCell>
                          <TableCell>{Number(allowance.units)}</TableCell>
                          <TableCell>
                            ${Number(allowance.rate).toFixed(2)}
                          </TableCell>
                          <TableCell className="font-medium">
                            ${Number(allowance.total).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ),
                    )}
                  <TableRow>
                    <TableCell colSpan={6} className="text-right font-semibold">
                      Grand Total:
                    </TableCell>
                    <TableCell className="font-semibold">
                      $
                      {claim
                        ?.expertAndAdministrationAllowances!.reduce(
                          (acc, curr) => acc + Number(curr.total),
                          0,
                        )
                        .toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div> */}

          {/* Additional Expert Allowances */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Expert Allowances
              </h2>
              <Button
                type="button"
                onClick={addExpertAllowance}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Row
              </Button>
            </div>

            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Day</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Allowance</TableHead>
                    <TableHead>Units</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expertAllowances.map((allowance, index) => (
                    <TableRow key={index}>
                      <TableCell>{allowance.day}</TableCell>
                      <TableCell>
                        <Input
                          value={allowance.designation}
                          onChange={(e) =>
                            updateExpertAllowance(
                              index,
                              "designation",
                              e.target.value,
                            )
                          }
                          onFocus={(e) =>
                            updateExpertAllowance(
                              index,
                              "designation",
                              e.target.value,
                            )
                          }
                          onBlur={(e) =>
                            updateExpertAllowance(
                              index,
                              "designation",
                              e.target.value,
                            )
                          }
                          className="min-w-[150px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={allowance.activity}
                          onChange={(e) =>
                            updateExpertAllowance(
                              index,
                              "activity",
                              e.target.value,
                            )
                          }
                          onFocus={(e) =>
                            updateExpertAllowance(
                              index,
                              "activity",
                              e.target.value,
                            )
                          }
                          onBlur={(e) =>
                            updateExpertAllowance(
                              index,
                              "activity",
                              e.target.value,
                            )
                          }
                          className="min-w-[150px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={allowance.allowance}
                          onChange={(e) =>
                            updateExpertAllowance(
                              index,
                              "allowance",
                              parseFloat(e.target.value),
                            )
                          }
                          onFocus={(e) =>
                            updateExpertAllowance(
                              index,
                              "allowance",
                              parseFloat(e.target.value),
                            )
                          }
                          onBlur={(e) =>
                            updateExpertAllowance(
                              index,
                              "allowance",
                              parseFloat(e.target.value),
                            )
                          }
                          min="0"
                          step="0.01"
                          className="min-w-[100px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={allowance.units}
                          onChange={(e) =>
                            updateExpertAllowance(
                              index,
                              "units",
                              parseInt(e.target.value),
                            )
                          }
                          onFocus={(e) =>
                            updateExpertAllowance(
                              index,
                              "units",
                              parseFloat(e.target.value),
                            )
                          }
                          onBlur={(e) =>
                            updateExpertAllowance(
                              index,
                              "units",
                              parseFloat(e.target.value),
                            )
                          }
                          min="1"
                          className="min-w-[80px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={allowance.rate}
                          onChange={(e) =>
                            updateExpertAllowance(
                              index,
                              "rate",
                              parseFloat(e.target.value),
                            )
                          }
                          onFocus={(e) =>
                            updateExpertAllowance(index, "rate", parseFloat(e.target.value))
                          }
                          onBlur={(e) =>
                            updateExpertAllowance(index, "rate", parseFloat(e.target.value))
                          }
                          min="0"
                          step="0.01"
                          className="min-w-[100px]"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        ${allowance.total.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => removeExpertAllowance(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={6} className="text-right font-semibold">
                      Grand Total:
                    </TableCell>
                    <TableCell className="font-semibold">
                      $
                      {expertAllowances
                        .reduce((acc, curr) => acc + curr.total, 0)
                        .toFixed(2)}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Supporting Documents */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Supporting Documents</h2>
            <div className="rounded-lg border bg-gray-50 p-4">
              <Label className="flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                Upload Receipts
              </Label>
              <Input
                type="file"
                multiple
                accept="image/*,.pdf"
                className="mt-2"
                onChange={handleFileChange}
                // required
              />
              <p className="mt-1 text-sm text-gray-500">
                Upload all relevant receipts and supporting documents (PDF or
                images)
              </p>
            </div>
          </div>

          {/* Summary */}
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Existing Expenses:</span>
                <span className="font-medium">
                  $
                  {claim &&
                    (
                      claim.travellingAndSubsistence!.reduce(
                        (acc, curr) => acc + Number(curr.total),
                        0,
                      ) +
                      claim.expertAndAdministrationAllowances!.reduce(
                        (acc, curr) => acc + Number(curr.total),
                        0,
                      )
                    ).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">
                  Total Additional Expenses:
                </span>
                <span className="font-medium">
                  $
                  {Number(
                    Number(
                      travelExpenses.reduce((acc, curr) => acc + curr.total, 0),
                    ) +
                      (expertAllowances
                        ? Number(
                            expertAllowances.reduce(
                              (acc, curr) => acc + curr.total,
                              0,
                            ),
                          )
                        : 0),
                  ).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Advance Amount:</span>
                <span className="font-medium">
                  ${Number(claim?.advanceAmount).toFixed(2)}
                </span>
              </div>
              <div className="mt-2 border-t pt-2">
                <div className="flex items-center justify-between text-lg">
                  <span className="font-semibold">Final Balance:</span>
                  <span
                    className={`font-bold ${calculateTotals().refundAmount > 0 ? "text-red-600" : "text-green-600"}`}
                  >
                    {calculateTotals().refundAmount > 0
                      ? `Refund: $${calculateTotals().refundAmount.toFixed(2)}`
                      : `Extra Claim: $${calculateTotals().extraClaimAmount.toFixed(2)}`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <Button
              type="submit"
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit Acquittal"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
