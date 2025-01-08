"use client";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { useSearchParams, useRouter, redirect } from "next/navigation";
import Form from "next/form";
import { useState } from "react";
import { InputBox } from "@/app/components/InputBox";
import { Error } from "@/app/components/Error";
import { useAuth } from "@/app/lib/firebase/AuthContext";
import { auth } from "@/app/lib/firebase/firebase";
export default function SignInForm() {
  const [error, setError] = useState("");
  const { user } = useAuth();
  const params = useSearchParams();
  const router = useRouter();
  const returnUrl = params.get("returnUrl");
  if (user) {
    return null;
  }
  const onSubmit = (e) => {
    e.preventDefault();
    const email = e.target["email"].value;
    const password = e.target["password"].value;
    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            returnUrl ? router.push(returnUrl) : router.push("/");
            userCredential.user.emailVerified
              ? null
              : router.push("/user/verify");
          })
          .catch((error) => {
            setError({ code: error.code, message: error.message });
          });
      })
      .catch((error) => {
        setError({ code: error.code, message: error.message });
      });
  };
  return (
    <div>
      <h1 className="text-center text-3xl mb-5">Sign in</h1>
      {error ? <Error error={error} /> : null}
      <Form
        onSubmit={onSubmit}
        className="relative mx-auto max-w-[525px] overflow-hidden rounded-lg bg-white"
      >
        <InputBox type="email" name="email" placeholder="Email" />
        <InputBox type="password" name="password" placeholder="Password" />
        <div className="mb-10">
          <input
            type="submit"
            data-testid="submit-button"
            value="Sign In"
            className="w-full cursor-pointer rounded-md border border-primary bg-primary px-5 py-3 text-base font-medium transition hover:bg-opacity-90 text-white"
          />
        </div>
      </Form>
    </div>
  );
}
