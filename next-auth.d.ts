import { Subscription } from "@/types/subscription";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // User ID
      username?: string; // Custom username
      role?: string; // Optional role
      email: string; // Email (already included by default)
      image?: string; // Profile image (already included by default)
      name?: string;
      ecno?: string;
      idno?: string;
      address?: string;
      phone?: string;
      password?: string;
      bankname?: string;
      status?: string;
      branch?: string;
      accountNumber?: string;
    };
  }

  interface User {
    id?: string; // Add ID to the User interface if needed
    username?: string; // Add username to the User interface
    role?: string; // Add role to the User interface
    name?: string;
    ecno?: string;
    idno?: string;
    address?: string;
    phone?: string;
    password?: string;
    bankname?: string;
    status?: string;
    branch?: string;
    accountNumber?: string;
  }
}
