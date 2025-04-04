"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  MapPin,
  Calendar,
  Building2,
  Plus,
  Trash2,
  Clock,
  Coffee,
  UtensilsCrossed,
  Bus,
  Moon,
  BadgeDollarSign,
  Users,
  Activity,
  Calculator,
  Receipt,
} from "lucide-react";

type TravellingExpense = {
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
  advanceAmount: 1500.00,
  status: "approved",
  acquittalStatus: "pending",
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
      total: 450,
    }
  ],
  expertAllowances: [
    {
      designation: "Senior Engineer",
      activity: "Technical Presentation",
      allowance: 100,
      units: 3,
      rate: 50,
      total: 150,
    }
  ]
};

export default function AcquittalForm({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [claim] = useState(mockClaim);
  const [travelExpenses, setTravelExpenses] = useState<TravellingExpense[]>([{
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
  }]);
  const [expertAllowances, setExpertAllowances] = useState<ExpertAllowance[]>([{
    designation: "",
    activity: "",
    allowance: 0,
    units: 0,
    rate: 0,
    total: 0,
  }]);

  const addTravelExpense = () => {
    setTravelExpenses([...travelExpenses, {
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
    }]);
  };

  const addExpertAllowance = () => {
    setExpertAllowances([...expertAllowances, {
      designation: "",
      activity: "",
      allowance: 0,
      units: 0,
      rate: 0,
      total: 0,
    }]);
  };

  const removeTravelExpense = (index: number) => {
    setTravelExpenses(travelExpenses.filter((_, i) => i !== index));
  };

  const removeExpertAllowance = (index: number) => {
    setExpertAllowances(expertAllowances.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    const existingTravelTotal = claim.travelExpenses.reduce((acc, curr) => acc + curr.total, 0);
    const newTravelTotal = travelExpenses.reduce((acc, curr) => {
      const total = curr.board + curr.breakfast + curr.lunch + curr.dinner + curr.fares + curr.supper;
      return acc + total;
    }, 0);

    const existingAllowanceTotal = claim.expertAllowances.reduce((acc, curr) => acc + curr.total, 0);
    const newAllowanceTotal = expertAllowances.reduce((acc, curr) => acc + (curr.units * curr.rate), 0);

    const totalExpenses = existingTravelTotal + newTravelTotal + existingAllowanceTotal + newAllowanceTotal;
    const difference = totalExpenses - claim.advanceAmount;

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

    // TODO: Implement acquittal submission
    console.log({
      claimId: params.id,
      ...totals,
      newTravelExpenses: travelExpenses,
      newExpertAllowances: expertAllowances,
    });

    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Acquittal submitted successfully",
        description: "Your acquittal has been sent for review.",
      });
    //   router.push("/claims");
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-blue-600 p-6">
          <h1 className="text-2xl font-bold text-white">Acquittal Form</h1>
          <p className="text-blue-100 mt-2">Update your claim with actual expenses</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Original Claim Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Original Claim Details</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="text-gray-600">Activity</Label>
                <p className="font-medium">{claim.activity}</p>
              </div>
              <div>
                <Label className="text-gray-600">Station</Label>
                <p className="font-medium">{claim.station}</p>
              </div>
              <div>
                <Label className="text-gray-600">From Date</Label>
                <p className="font-medium">{new Date(claim.from).toLocaleDateString()}</p>
              </div>
              <div>
                <Label className="text-gray-600">To Date</Label>
                <p className="font-medium">{new Date(claim.to).toLocaleDateString()}</p>
              </div>
              <div>
                <Label className="text-gray-600">Venue</Label>
                <p className="font-medium">{claim.venue}</p>
              </div>
              <div>
                <Label className="text-gray-600">Advance Amount</Label>
                <p className="font-medium">${claim.advanceAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Existing Travel Expenses */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Existing Travel Expenses</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">From</th>
                    <th className="px-4 py-2 text-left">To</th>
                    <th className="px-4 py-2 text-right">Board</th>
                    <th className="px-4 py-2 text-right">Meals</th>
                    <th className="px-4 py-2 text-right">Fares</th>
                    <th className="px-4 py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {claim.travelExpenses.map((expense, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2">{expense.fromPlace}</td>
                      <td className="px-4 py-2">{expense.toPlace}</td>
                      <td className="px-4 py-2 text-right">${expense.board}</td>
                      <td className="px-4 py-2 text-right">
                        ${expense.breakfast + expense.lunch + expense.dinner + expense.supper}
                      </td>
                      <td className="px-4 py-2 text-right">${expense.fares}</td>
                      <td className="px-4 py-2 text-right">${expense.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Additional Travel Expenses */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Additional Travel Expenses</h2>
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

            {travelExpenses.map((expense, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-4 bg-gray-50">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      From Place
                    </Label>
                    <Input  className="mt-1" />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      To Place
                    </Label>
                    <Input   className="mt-1" />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Departure Date & Time
                    </Label>
                    <Input type="datetime-local"  className="mt-1" />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Arrival Date & Time
                    </Label>
                    <Input type="datetime-local"  className="mt-1" />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div>
                    <Label className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Board
                    </Label>
                    <Input type="number" min="0" step="0.01"  className="mt-1" />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2">
                      <Coffee className="h-4 w-4" />
                      Breakfast
                    </Label>
                    <Input type="number" min="0" step="0.01"  className="mt-1" />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2">
                      <UtensilsCrossed className="h-4 w-4" />
                      Lunch
                    </Label>
                    <Input type="number" min="0" step="0.01"  className="mt-1" />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2">
                      <UtensilsCrossed className="h-4 w-4" />
                      Dinner
                    </Label>
                    <Input type="number" min="0" step="0.01"  className="mt-1" />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2">
                      <Bus className="h-4 w-4" />
                      Fares
                    </Label>
                    <Input type="number" min="0" step="0.01"  className="mt-1" />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      Supper
                    </Label>
                    <Input type="number" min="0" step="0.01"  className="mt-1" />
                  </div>
                </div>

                {index > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => removeTravelExpense(index)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Existing Expert Allowances */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Existing Expert Allowances</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Designation</th>
                    <th className="px-4 py-2 text-left">Activity</th>
                    <th className="px-4 py-2 text-right">Units</th>
                    <th className="px-4 py-2 text-right">Rate</th>
                    <th className="px-4 py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {claim.expertAllowances.map((allowance, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2">{allowance.designation}</td>
                      <td className="px-4 py-2">{allowance.activity}</td>
                      <td className="px-4 py-2 text-right">{allowance.units}</td>
                      <td className="px-4 py-2 text-right">${allowance.rate}</td>
                      <td className="px-4 py-2 text-right">${allowance.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Additional Expert Allowances */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Additional Expert Allowances</h2>
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

            {expertAllowances.map((allowance, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-4 bg-gray-50">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Designation
                    </Label>
                    <Input  className="mt-1" />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Activity
                    </Label>
                    <Input  className="mt-1" />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2">
                      <BadgeDollarSign className="h-4 w-4" />
                      Allowance
                    </Label>
                    <Input type="number" min="0" step="0.01"  className="mt-1" />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2">
                      <Calculator className="h-4 w-4" />
                      Units
                    </Label>
                    <Input type="number" min="1" className="mt-1" />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2">
                      <BadgeDollarSign className="h-4 w-4" />
                      Rate
                    </Label>
                    <Input type="number" min="0" step="0.01" className="mt-1" />
                  </div>
                </div>

                {index > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => removeExpertAllowance(index)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Supporting Documents */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Supporting Documents</h2>
            <div className="p-4 border rounded-lg bg-gray-50">
              <Label className="flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                Upload Receipts
              </Label>
              <Input
                type="file"
                multiple
                accept="image/*,.pdf"
                className="mt-2"
                
              />
              <p className="text-sm text-gray-500 mt-1">
                Upload all relevant receipts and supporting documents (PDF or images)
              </p>
            </div>
          </div>

          <div className="pt-6">
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
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