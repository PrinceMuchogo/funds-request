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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

type User = {
  id: string;
  name: string;
  email: string;
  ecno: string;
  department: string;
  role: "employee" | "checker" | "approver" | "admin";
  status: "active" | "inactive";
};

const roleColors = {
  employee: "bg-gray-100 text-gray-800",
  checker: "bg-blue-100 text-blue-800",
  approver: "bg-green-100 text-green-800",
  admin: "bg-purple-100 text-purple-800",
};

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const { toast } = useToast();
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
  const handleChange = (e: any) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const getClaims = async () => {
      try {
        const response = await fetch("/api/users/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        setUsers(data);
        console.log("claims: ", data);
      } catch (error) {}
    };

    getClaims();
    console.log("claims: ", users);
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implement user creation
    toast({
      title: "User added successfully",
      description: "The new user has been created and notified via email.",
    });
    setIsAddUserOpen(false);
  };

  const handleRoleChange = (userId: string, newRole: string) => {
    // TODO: Implement role change
    toast({
      title: "Role updated",
      description: "The user's role has been updated successfully.",
    });
  };

  const handleDeleteUser = (userId: string) => {
    // TODO: Implement user deletion
    toast({
      title: "User deleted",
      description: "The user has been removed from the system.",
    });
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Link href={"/dashboard/admin/add-user"}>
          <Button className="text-white">
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </Link>
      </div>

      <div className="rounded-lg bg-white shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Employee ID</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.ecno}</TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={roleColors[user.role]}>
                    {user.role.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={
                      user.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {user.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-white">
                        <DialogHeader>
                          <DialogTitle>Edit User Role</DialogTitle>
                        </DialogHeader>
                        <div className="mt-4 space-y-4">
                          <div>
                            <Label htmlFor="newRole">New Role</Label>
                            <select
                              id="newRole"
                              className="border-input bg-background w-full rounded-md border px-3 py-2"
                              defaultValue={user.role}
                              onChange={(e) =>
                                handleRoleChange(user.id, e.target.value)
                              }
                            >
                              <option value="checker">Checker</option>
                              <option value="approver">Approver</option>
                              <option value="admin">Admin</option>
                            </select>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
