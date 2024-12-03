"use client";
import { useAuth } from "@/app/lib/firebase/AuthContext";
import { useLayoutEffect } from "react";
import { redirect } from "next/navigation";
import { usePathname } from "next/navigation";
import { app } from "@/app/lib/firebase/firebase";

function Protected({ children }) {
  const { user } = useAuth();
  const returnUrl = usePathname();

  useLayoutEffect(() => {
    if (!user) {
      redirect(`/user/singin?returnUrl=${returnUrl}`);
    }
  });
  return <>{children}</>;
}

export default Protected;
