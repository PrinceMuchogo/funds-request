"use client";

import { useState } from "react";
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

type User = {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  department: string;
  role: "employee" | "checker" | "approver" | "admin";
  status: "active" | "inactive";
};

const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@company.com",
    employeeId: "EMP001",
    department: "Engineering",
    role: "employee",
    status: "active",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@company.com",
    employeeId: "EMP002",
    department: "Finance",
    role: "checker",
    status: "active",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob.johnson@company.com",
    employeeId: "EMP003",
    department: "Finance",
    role: "approver",
    status: "active",
  },
];

const roleColors = {
  employee: "bg-gray-100 text-gray-800",
  checker: "bg-blue-100 text-blue-800",
  approver: "bg-green-100 text-green-800",
  admin: "bg-purple-100 text-purple-800",
};

export default function AdminUsers() {
  const [users] = useState<User[]>(mockUsers);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const { toast } = useToast();

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddUser} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required />
              </div>
              <div>
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input id="employeeId" required />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Input id="department" required />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  required
                >
                  <option value="employee">Employee</option>
                  <option value="checker">Checker</option>
                  <option value="approver">Approver</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <Button type="submit" className="w-full text-white">
                Add User
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow">
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
                <TableCell>{user.employeeId}</TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={roleColors[user.role]}
                  >
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
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit User Role</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div>
                            <Label htmlFor="newRole">New Role</Label>
                            <select
                              id="newRole"
                              className="w-full rounded-md border border-input bg-background px-3 py-2"
                              defaultValue={user.role}
                              onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            >
                              <option value="employee">Employee</option>
                              <option value="checker">Checker</option>
                              <option value="approver">Approver</option>
                              <option value="admin">Admin</option>
                            </select>
                          </div>
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