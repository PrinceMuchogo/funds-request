"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const handleChange = (e: any) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
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

  const renderStepIndicator = () => {
    return (
      <div className="mb-6 flex justify-center">
        {[...Array(totalSteps)].map((_, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors duration-200 ${
                currentStep > index + 1
                  ? "bg-blue-600 text-white"
                  : currentStep === index + 1
                    ? "border-2 border-blue-300 bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
              }`}
            >
              {index + 1}
            </div>
            {index < totalSteps - 1 && (
              <div
                className={`h-1 w-12 ${currentStep > index + 1 ? "bg-blue-600" : "bg-gray-200"}`}
              ></div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-blue-50 to-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
          <div className="bg-blue-600 p-6 text-center">
            <div className="mb-3 flex justify-center">
              <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-white">
                <Image
                  src="/logo.jpg?height=64&width=64"
                  alt="IPMS Logo"
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <h2 className="text-xl font-bold text-white">
              CREATE YOUR ACCOUNT
            </h2>
            <p className="mt-1 text-sm text-blue-100">
              Join the Integrated Payment Management System
            </p>
          </div>

          <div className="p-8">
            {renderStepIndicator()}

            <form className="space-y-6" onSubmit={handleSubmit}>
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label
                        htmlFor="fullName"
                        className="text-sm font-medium text-gray-700"
                      >
                        Full Name
                      </Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        required
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="email"
                        className="text-sm font-medium text-gray-700"
                      >
                        Work Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        required
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="employeeId"
                        className="text-sm font-medium text-gray-700"
                      >
                        Employee ID
                      </Label>
                      <Input
                        id="employeeId"
                        name="employeeId"
                        value={formData.employeeId}
                        required
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="idno"
                        className="text-sm font-medium text-gray-700"
                      >
                        National ID No
                      </Label>
                      <Input
                        id="idno"
                        name="idno"
                        value={formData.idno}
                        required
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label
                        htmlFor="address"
                        className="text-sm font-medium text-gray-700"
                      >
                        Address
                      </Label>
                      <Textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        required
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="phone"
                        className="text-sm font-medium text-gray-700"
                      >
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        required
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="department"
                        className="text-sm font-medium text-gray-700"
                      >
                        Department
                      </Label>
                      <Input
                        id="department"
                        name="department"
                        value={formData.department}
                        required
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Banking Information
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label
                        htmlFor="bankName"
                        className="text-sm font-medium text-gray-700"
                      >
                        Bank Name
                      </Label>
                      <Input
                        id="bankName"
                        name="bankName"
                        value={formData.bankName}
                        required
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="branch"
                        className="text-sm font-medium text-gray-700"
                      >
                        Branch
                      </Label>
                      <Input
                        id="branch"
                        name="branch"
                        value={formData.branch}
                        required
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label
                        htmlFor="accountNumber"
                        className="text-sm font-medium text-gray-700"
                      >
                        Account Number
                      </Label>
                      <Input
                        id="accountNumber"
                        name="accountNumber"
                        type="number"
                        value={formData.accountNumber}
                        required
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Security
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label
                        htmlFor="password"
                        className="text-sm font-medium text-gray-700"
                      >
                        Password
                      </Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        required
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="confirmPassword"
                        className="text-sm font-medium text-gray-700"
                      >
                        Confirm Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        required
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4">
                {currentStep > 1 ? (
                  <Button
                    type="button"
                    onClick={prevStep}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Back
                  </Button>
                ) : (
                  <div></div>
                )}

                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg
                          className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Creating account...
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                )}
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/auth/signin"
                  className="font-medium text-blue-600 transition-colors duration-200 hover:text-blue-500"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
