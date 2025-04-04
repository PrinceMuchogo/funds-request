"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from 'react';

type AuthProviderProps = {
  children: ReactNode;
};

export const Provider = ({ children }: AuthProviderProps) => {
  return <SessionProvider>{children}</SessionProvider>;
};
