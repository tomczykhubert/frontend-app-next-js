"use client";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";
import { app } from "@/app/lib/firebase/firebase";

export default function LogoutForm() {
  const router = useRouter();

  const onSubmit = (e) => {
    e.preventDefault();
    signOut(getAuth(app));
    router.push("/");
  };
  return (
    <form onSubmit={onSubmit}>
      <input
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        type="submit"
        value="Log out"
      ></input>
    </form>
  );
}
