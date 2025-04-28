"use client";

import { useState } from "react";
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
    role: "",
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

    console.log("form data: ", formData);

    try {
      const response = await fetch("/api/users/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        router.push("/dashboard/admin/users");
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
    <div className="flex min-h-screen items-center justify-center  px-6 py-2 text-black">
      <div className="w-full max-w-lg space-y-6 rounded-lg  p-2 ">
        <div className="text-center">
          <CircleDollarSign className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Create User Account
          </h2>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                required
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="email">Work Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="employeeId">Employee ID</Label>
              <Input
                id="employeeId"
                name="employeeId"
                required
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="idno">National ID No</Label>
              <Input id="idno" name="idno" required onChange={handleChange} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" name="address" onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="bankName">Bank Name</Label>
              <Input id="bankName" name="bankName" onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="branch">Branch</Label>
              <Input id="branch" name="branch" onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                name="accountNumber"
                type="number"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                name="department"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              name="role"
              className="border-input bg-background w-full rounded-md border px-3 py-2"
              required
              onChange={handleChange}
            >
              <option value="checker">Checker</option>
              <option value="checker">Checker</option>
              <option value="approver">Approver</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <Button
            type="submit"
            className="w-full text-white"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
        </form>
      </div>
    </div>
  );
}
