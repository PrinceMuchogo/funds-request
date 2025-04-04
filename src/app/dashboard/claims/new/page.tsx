"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
};

type ExpertAllowance = {
  designation: string;
  activity: string;
  allowance: number;
  units: number;
  rate: number;
};

export default function NewClaim() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
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
  }]);
  const [expertAllowances, setExpertAllowances] = useState<ExpertAllowance[]>([{
    designation: "",
    activity: "",
    allowance: 0,
    units: 0,
    rate: 0,
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
    }]);
  };

  const addExpertAllowance = () => {
    setExpertAllowances([...expertAllowances, {
      designation: "",
      activity: "",
      allowance: 0,
      units: 0,
      rate: 0,
    }]);
  };

  const removeTravelExpense = (index: number) => {
    setTravelExpenses(travelExpenses.filter((_, i) => i !== index));
  };

  const removeExpertAllowance = (index: number) => {
    setExpertAllowances(expertAllowances.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: Implement claim submission
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Claim submitted successfully",
        description: "Your claim has been sent for review.",
      });
      router.push("/claims");
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-blue-600 p-6">
          <h1 className="text-2xl font-bold text-white">New Claim Request</h1>
          <p className="text-blue-100 mt-2">Fill in the details of your claim below</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="activity" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Activity
              </Label>
              <Input id="activity" required className="mt-2" />
            </div>
            
            <div>
              <Label htmlFor="station" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Station
              </Label>
              <Input id="station" required className="mt-2" />
            </div>

            <div>
              <Label htmlFor="from" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                From Date
              </Label>
              <Input type="date" id="from" required className="mt-2" />
            </div>

            <div>
              <Label htmlFor="to" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                To Date
              </Label>
              <Input type="date" id="to" required className="mt-2" />
            </div>

            <div>
              <Label htmlFor="venue" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Venue
              </Label>
              <Input id="venue" required className="mt-2" />
            </div>

            <div>
              <Label htmlFor="advanceAmount" className="flex items-center gap-2">
                <BadgeDollarSign className="h-4 w-4" />
                Advance Amount
              </Label>
              <Input type="number" id="advanceAmount" min="0" step="0.01" required className="mt-2" />
            </div>
          </div>

          {/* Travelling and Subsistence */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Travelling & Subsistence</h2>
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
                    <Input required className="mt-1" />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      To Place
                    </Label>
                    <Input required className="mt-1" />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Departure Date & Time
                    </Label>
                    <Input type="datetime-local" required className="mt-1" />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Arrival Date & Time
                    </Label>
                    <Input type="datetime-local" required className="mt-1" />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div>
                    <Label className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Board
                    </Label>
                    <Input type="number" min="0" step="0.01" required className="mt-1" />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2">
                      <Coffee className="h-4 w-4" />
                      Breakfast
                    </Label>
                    <Input type="number" min="0" step="0.01" required className="mt-1" />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2">
                      <UtensilsCrossed className="h-4 w-4" />
                      Lunch
                    </Label>
                    <Input type="number" min="0" step="0.01" required className="mt-1" />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2">
                      <UtensilsCrossed className="h-4 w-4" />
                      Dinner
                    </Label>
                    <Input type="number" min="0" step="0.01" required className="mt-1" />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2">
                      <Bus className="h-4 w-4" />
                      Fares
                    </Label>
                    <Input type="number" min="0" step="0.01" required className="mt-1" />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      Supper
                    </Label>
                    <Input type="number" min="0" step="0.01" required className="mt-1" />
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

          {/* Expert and Administration Allowances */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Expert & Administration Allowances</h2>
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
                    <Input required className="mt-1" />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Activity
                    </Label>
                    <Input required className="mt-1" />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2">
                      <BadgeDollarSign className="h-4 w-4" />
                      Allowance
                    </Label>
                    <Input type="number" min="0" step="0.01" required className="mt-1" />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2">
                      <Calculator className="h-4 w-4" />
                      Units
                    </Label>
                    <Input type="number" min="1" required className="mt-1" />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2">
                      <BadgeDollarSign className="h-4 w-4" />
                      Rate
                    </Label>
                    <Input type="number" min="0" step="0.01" required className="mt-1" />
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

          <div className="pt-6">
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
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