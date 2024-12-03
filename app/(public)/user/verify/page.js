"use client";
import { getAuth, sendEmailVerification, signOut } from "firebase/auth";
import { useAuth } from "@/app/lib/firebase/AuthContext";
import { app } from "@/app/lib/firebase/firebase";
import { useState } from "react";
export default function VerifyEmail() {
  const { user } = useAuth();
  const [userVerify, setUser] = useState(user);
  signOut(getAuth(app));
  return (
    <>
      <h1>
        Email not verified. Verify clicking on link in email send to your
        address {userVerify?.email}
      </h1>
    </>
  );
}
