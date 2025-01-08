"use client";
import { InputBox } from "@/app/components/InputBox";
import { Error } from "@/app/components/Error";
import Form from "next/form";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/lib/firebase/AuthContext";
import { updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { db } from "@/app/lib/firebase/firebase";
import { setDoc, doc, getDoc } from "firebase/firestore";
import Spinner from "@/app/components/Spinner";
export default function ProfileForm() {
  const [error, setError] = useState("");
  const { user } = useAuth();
  const router = useRouter();
  const addressRef = user ? doc(db, "users", user?.uid) : null;
  const [address, setAddress] = useState();
  const [loadingAddress, setLoadingAddress] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (addressRef) {
        const snapshot = await getDoc(addressRef);
        const address = snapshot.data().address;
        setAddress(address);
        setLoadingAddress(false);
      }
    }
    fetchData();
  });

  const onSubmit = async (e) => {
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
    try {
      const docRef = await setDoc(addressRef, {
        address: {
          city: e.target["city"].value,
          street: e.target["street"].value,
          zipCode: e.target["zipCode"].value,
        },
      });
      console.log("Document written with ID: ", docRef?.uid);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  if (loadingAddress)
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  return (
    <>
      <div className="text-center text-3xl mb-5">Update profile</div>
      {error ? <Error error={error} /> : null}
      <Form
        onSubmit={onSubmit}
        className={
          user.photoURL
            ? "relative mx-auto max-w-[900px] overflow-hidden rounded-lg bg-white flex"
            : "relative mx-auto max-w-[525px] overflow-hidden rounded-lg bg-white flex"
        }
      >
        <div className="min-w-[525px]">
          <InputBox
            type="email"
            name="email"
            defaultValue={user?.email}
            readOnly={true}
          />
          <InputBox
            type="text"
            name="display_name"
            placeholder="Display name"
            defaultValue={user?.displayName}
          />
          <InputBox
            type="text"
            name="photo_url"
            placeholder="Photo url"
            defaultValue={user?.photoURL}
          />
          <InputBox
            type="text"
            name="city"
            placeholder="City"
            defaultValue={address?.city}
          />
          <InputBox
            type="text"
            name="street"
            placeholder="Street"
            defaultValue={address?.street}
          />
          <InputBox
            type="text"
            name="zipCode"
            placeholder="Zip code"
            defaultValue={address?.zipCode}
          />
          <div className="mb-10">
            <input
              type="submit"
              value="Update profile"
              className="w-full cursor-pointer rounded-md border border-primary bg-primary px-5 py-3 text-base font-medium transition hover:bg-opacity-90 text-white"
            />
          </div>
        </div>
        {user.photoURL ? (
          <Image
            src={user.photoURL}
            alt="Profile photo"
            width={375}
            height={550}
            className="rounded ms-2"
            quality={100}
          />
        ) : null}
      </Form>
    </>
  );
}
