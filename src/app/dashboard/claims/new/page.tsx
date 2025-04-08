"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

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

export default function NewClaim() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [id, setUserId] = useState()
  const [formData, setFormData] = useState({
    activity: "",
    station: "",
    from: "",
    to: "",
    venue: "",
    advanceAmount: 0,
    userId: session?.user.id
  });

  useEffect(() => {
    setFormData({ ...formData, userId: session?.user.id })
  }, [session])
  

  const [travelExpenses, setTravelExpenses] = useState<TravellingExpense[]>([
    {
      day: 1,
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

  const [expertAllowances, setExpertAllowances] = useState<ExpertAllowance[]>([
    {
      day: 1,
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
          ? calculateTravelExpenseTotal(updatedExpenses[index])
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
          ? calculateExpertAllowanceTotal(updatedAllowances[index])
          : calculateExpertAllowanceTotal(updatedAllowances[index]),
    };
    setExpertAllowances(updatedAllowances);
  };

  const addTravelExpense = () => {
    setTravelExpenses([
      ...travelExpenses,
      {
        day: travelExpenses.length + 1,
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
        day: expertAllowances.length + 1,
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
    const updatedExpenses = travelExpenses
      .filter((_, i) => i !== index)
      .map((expense, i) => ({ ...expense, day: i + 1 }));
    setTravelExpenses(updatedExpenses);
  };

  const removeExpertAllowance = (index: number) => {
    const updatedAllowances = expertAllowances
      .filter((_, i) => i !== index)
      .map((allowance, i) => ({ ...allowance, day: i + 1 }));
    setExpertAllowances(updatedAllowances);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const totalTravelExpenses = travelExpenses.reduce(
      (acc, curr) => acc + curr.total,
      0,
    );
    const totalExpertAllowances = expertAllowances.reduce(
      (acc, curr) => acc + curr.total,
      0,
    );

    const claimData = {
      ...formData,
      travelExpenses,
      expertAllowances,
      totalAmount: totalTravelExpenses + totalExpertAllowances,
    };

    console.log("Submitting claim:", claimData);

    try {
      const response = await fetch("/api/claim/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(claimData),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(`${data.message}`);
      } else {
        toast.error(`${data.message}`);
      }
    } catch (error) {
      toast.error("Signup error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="overflow-hidden rounded-xl bg-white shadow-lg">
        <div className="bg-blue-600 p-6">
          <h1 className="text-2xl font-bold text-white">New Claim Request</h1>
          <p className="mt-2 text-blue-100">
            Fill in the details of your claim below
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 p-6">
          {/* Basic Information */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="activity">Activity</Label>
              <Input
                id="activity"
                value={formData.activity}
                onChange={(e) =>
                  setFormData({ ...formData, activity: e.target.value })
                }
                required
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="station">Station</Label>
              <Input
                id="station"
                value={formData.station}
                onChange={(e) =>
                  setFormData({ ...formData, station: e.target.value })
                }
                required
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="from">From Date</Label>
              <Input
                type="datetime-local"
                id="from"
                value={formData.from}
                onChange={(e) =>
                  setFormData({ ...formData, from: e.target.value })
                }
                required
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="to">To Date</Label>
              <Input
                type="datetime-local"
                id="to"
                value={formData.to}
                onChange={(e) =>
                  setFormData({ ...formData, to: e.target.value })
                }
                required
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="venue">Venue</Label>
              <Input
                id="venue"
                value={formData.venue}
                onChange={(e) =>
                  setFormData({ ...formData, venue: e.target.value })
                }
                required
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="advanceAmount">Advance Amount</Label>
              <Input
                type="number"
                id="advanceAmount"
                value={formData.advanceAmount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    advanceAmount: parseFloat(e.target.value),
                  })
                }
                min="0"
                step="0.01"
                required
                className="mt-2"
              />
            </div>
          </div>

          {/* Travelling and Subsistence */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Travelling & Subsistence
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
                            updateTravelExpense(index, "board", e.target.value)
                          }
                          onBlur={(e) =>
                            updateTravelExpense(index, "board", e.target.value)
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
                              e.target.value,
                            )
                          }
                          onBlur={(e) =>
                            updateTravelExpense(
                              index,
                              "breakfast",
                              e.target.value,
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
                            updateTravelExpense(index, "lunch", e.target.value)
                          }
                          onBlur={(e) =>
                            updateTravelExpense(index, "lunch", e.target.value)
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
                            updateTravelExpense(index, "dinner", e.target.value)
                          }
                          onBlur={(e) =>
                            updateTravelExpense(index, "dinner", e.target.value)
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
                            updateTravelExpense(index, "fares", e.target.value)
                          }
                          onBlur={(e) =>
                            updateTravelExpense(index, "fares", e.target.value)
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
                            updateTravelExpense(index, "supper", e.target.value)
                          }
                          onBlur={(e) =>
                            updateTravelExpense(index, "supper", e.target.value)
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
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => removeTravelExpense(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
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
                      {travelExpenses
                        .reduce((acc, curr) => acc + curr.total, 0)
                        .toFixed(2)}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Expert and Administration Allowances */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Expert & Administration Allowances
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
                          className="min-w-[150px]"
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
                              e.target.value,
                            )
                          }
                          onBlur={(e) =>
                            updateExpertAllowance(
                              index,
                              "allowance",
                              e.target.value,
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
                              e.target.value,
                            )
                          }
                          onBlur={(e) =>
                            updateExpertAllowance(
                              index,
                              "units",
                              e.target.value,
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
                            updateExpertAllowance(index, "rate", e.target.value)
                          }
                          onBlur={(e) =>
                            updateExpertAllowance(index, "rate", e.target.value)
                          }
                          min="0"
                          step="0.01"
                          className="min-w-[100px]"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        ${Number(allowance.total).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => removeExpertAllowance(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
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

          <div className="rounded-lg bg-gray-50 p-4">
            <div className="text-right">
              <p className="text-lg">
                <span className="font-semibold">Total Claim Amount: </span>
                <span className="text-xl font-bold text-blue-600">
                  $
                  {(
                    travelExpenses.reduce((acc, curr) => acc + curr.total, 0) +
                    expertAllowances.reduce((acc, curr) => acc + curr.total, 0)
                  ).toFixed(2)}
                </span>
              </p>
            </div>
          </div>

          <div className="pt-6">
            <Button
              type="submit"
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit Claim"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
