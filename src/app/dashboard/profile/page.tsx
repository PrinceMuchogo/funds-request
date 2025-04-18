"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

export default function Profile() {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const [userFormData, setFormData] = useState({
    username: "",
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...userFormData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (
      userFormData.email === "" &&
      userFormData.newPassword === "" &&
      userFormData.username === ""
    ) {
      toast.error("Please fill at least one field to update.");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("username", userFormData.username);
    formData.append("email", userFormData.email);
    formData.append("password", userFormData.newPassword);
    formData.append("oldPassword", userFormData.oldPassword);

    try {
      const response = await fetch(`/api/users/update/${session?.user.id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        return toast.error(`${data.message}`);
      }

      setIsLoading(false);
      return toast.success(`${data.message}`);
    } catch (error) {
      console.log("error: ", error)
      toast.error("Failed to update profile.");
      setIsLoading(false);
      return
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">Profile Settings</h1>
      <div className="rounded-lg bg-white p-6 shadow">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="username"
              value={userFormData.username}
              onChange={handleChange}
              defaultValue={session?.user.name}
            />
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={userFormData.email}
              onChange={handleChange}
              defaultValue={session?.user.email}
            />
          </div>

          <div>
            <Label htmlFor="employeeId">Employee ID</Label>
            <Input id="employeeId" defaultValue={session?.user.ecno} disabled />
          </div>

          <div>
            <Label htmlFor="department">Department</Label>
            <Input id="department" defaultValue="Engineering" disabled />
          </div>

          <div>
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              name="oldPassword"
              value={userFormData.oldPassword}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              name="newPassword"
              value={userFormData.newPassword}
              onChange={handleChange}
            />
          </div>

          <Button
            type="submit"
            className="w-full text-white"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  );
}
