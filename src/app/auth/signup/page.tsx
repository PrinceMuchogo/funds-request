"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CircleDollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";

export default function SignUp() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    employeeId: "",
    idno: "",
    address: "",
    phone: "",
    bankName: "",
    branch: "",
    accountNumber: "",
    department: "",
    password: "",
    confirmPassword: "",
  });

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: any) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.warning("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        router.push("/");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Signup error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-12">
      <div className="w-full max-w-lg p-6 space-y-6 bg-white shadow-md rounded-lg">
        <div className="text-center">
          <CircleDollarSign className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Create Your Account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account? <Link href="/auth/signin" className="text-blue-600 hover:underline">Sign in</Link>
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" name="fullName" required onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="email">Work Email</Label>
              <Input id="email" name="email" type="email" required onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="employeeId">Employee ID</Label>
              <Input id="employeeId" name="employeeId" required onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="idno">National ID No</Label>
              <Input id="idno" name="idno" required onChange={handleChange} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" name="address" required onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" type="tel" required onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="bankName">Bank Name</Label>
              <Input id="bankName" name="bankName" required onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="branch">Branch</Label>
              <Input id="branch" name="branch" required onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input id="accountNumber" name="accountNumber" type="number" required onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Input id="department" name="department" required onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" required onChange={handleChange} />
            </div>
          </div>
          <Button type="submit" className="w-full text-white" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
        </form>
      </div>
    </div>
  );
}
