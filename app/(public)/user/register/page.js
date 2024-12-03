"use client";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { useAuth } from "@/app/lib/firebase/AuthContext";
import { useState } from "react";
import { InputBox } from "@/app/components/InputBox";
import Form from "next/form";
import { Error } from "@/app/components/Error";
import { app } from "@/app/lib/firebase/firebase";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [error, setError] = useState("");
  const { user } = useAuth();
  const router = useRouter();

  if (user) {
    return null;
  }

  const auth = getAuth(app);

  const onSubmit = (e) => {
    e.preventDefault();
    if (e.target["password"].value != e.target["confirm_password"].value) {
      setError({ message: "Passwords do not match!" });
    }
    createUserWithEmailAndPassword(
      auth,
      e.target["email"].value,
      e.target["password"].value
    )
      .then((userCredential) => {
        console.log("User registered!");
        sendEmailVerification(auth.currentUser).then(() => {
          console.log("Email verification send!");
          router.push("/user/verify");
        });
      })
      .catch((error) => {
        setError({ code: error.code, message: error.message });
        console.dir(error);
      });
  };

  return (
    <>
      <div className="text-center text-3xl mb-5">Create an account</div>
      {error ? <Error error={error} /> : null}
      <Form
        onSubmit={onSubmit}
        className="relative mx-auto max-w-[525px] overflow-hidden rounded-lg bg-white"
      >
        <InputBox type="email" name="email" placeholder="Email" />
        <InputBox type="password" name="password" placeholder="Password" />
        <InputBox
          type="password"
          name="confirm_password"
          placeholder="Confirm password"
        />
        <div className="mb-10">
          <input
            type="submit"
            value="Sign up"
            className="w-full cursor-pointer rounded-md border border-primary bg-primary px-5 py-3 text-base font-medium transition hover:bg-opacity-90"
          />
        </div>
      </Form>
    </>
  );
}
