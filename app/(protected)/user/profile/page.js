"use client";
import { InputBox } from "@/app/components/InputBox";
import { Error } from "@/app/components/Error";
import Form from "next/form";
import { useState } from "react";
import { useAuth } from "@/app/lib/firebase/AuthContext";
import { updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
export default function ProfileForm() {
  const [error, setError] = useState("");
  const { user } = useAuth();
  const router = useRouter();
  const onSubmit = (e) => {
    e.preventDefault();
    updateProfile(user, {
      displayName: e.target["display_name"].value,
      photoURL: e.target["photo_url"].value,
    })
      .then(() => {
        console.log("Profile updated");
        router.refresh();
      })
      .catch((error) => {
        setError({ code: error.code, message: error.message });
      });
  };

  return (
    <>
      <div className="text-center text-3xl mb-5">Update profile</div>
      {error ? <Error error={error} /> : null}
      <Form
        onSubmit={onSubmit}
        className={
          user.photoURL
            ? "relative mx-auto max-w-[800px] overflow-hidden rounded-lg bg-white flex"
            : "relative mx-auto max-w-[525px] overflow-hidden rounded-lg bg-white flex"
        }
      >
        <div className="min-w-[525px]">
          <InputBox
            type="email"
            name="email"
            defaultValue={user.email ? user.email : ""}
            readOnly={true}
          />
          <InputBox
            type="text"
            name="display_name"
            placeholder="Display name"
            defaultValue={user.displayName ? user.displayName : ""}
          />
          <InputBox
            type="text"
            name="photo_url"
            placeholder="Photo url"
            defaultValue={user.photoURL ? user.photoURL : ""}
          />
          <div className="mb-10">
            <input
              type="submit"
              value="Update profile"
              className="w-full cursor-pointer rounded-md border border-primary bg-primary px-5 py-3 text-base font-medium transition hover:bg-opacity-90"
            />
          </div>
        </div>
        {user.photoURL ? (
          <Image
            src={user.photoURL}
            alt="Profile photo"
            width={275}
            height={550}
            className="rounded ms-2"
            quality={100}
          />
        ) : null}
      </Form>
    </>
  );
}
