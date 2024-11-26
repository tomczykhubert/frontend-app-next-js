"use client";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { getAuth } from "firebase/auth";
import { useSearchParams, useRouter, redirect } from "next/navigation";
import { app } from "@/app/lib/firebase/firebase";
import Form from "next/form";
import { useState } from "react";

export default function SignInForm() {
  const [error, setError] = useState("");
  const auth = getAuth(app);
  const params = useSearchParams();
  const router = useRouter();
  const returnUrl = params.get("returnUrl");
  const onSubmit = (e) => {
    e.preventDefault();
    const email = e.target["email"].value;
    const password = e.target["password"].value;
    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            returnUrl ? router.push(returnUrl) : router.push("/");
          })
          .catch((error) => {
            setError({ code: error.code, message: error.message });
          });
      })
      .catch((error) => {
        setError({ code: error.code, message: error.message });
      });
  };
  const classes = "";
  return (
    <div>
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
            value="Sign In"
            className="w-full cursor-pointer rounded-md border border-primary bg-primary px-5 py-3 text-base font-medium transition hover:bg-opacity-90"
          />
        </div>
      </Form>
    </div>
  );
}
const InputBox = ({ type, placeholder, name }) => {
  return (
    <div className="mb-6">
      <input
        type={type}
        placeholder={placeholder}
        name={name}
        className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-body-color outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white"
      />
    </div>
  );
};

const Error = ({ error }) => {
  return (
    <div className="flex justify-center mb-3">
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="block">An error occured!</strong>
        {error.code ? <span className="block">Error; {error.code}</span> : null}
        {error.message ? (
          <span className="block">Message; {error.message}</span>
        ) : null}
      </div>
    </div>
  );
};
