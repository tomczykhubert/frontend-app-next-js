"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LuLogOut, LuLogIn, LuCircleUser, LuUserPlus } from "react-icons/lu";
import { useAuth } from "../lib/firebase/AuthContext";
const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  return (
    <header className={`flex w-full items-center bg-white dark:bg-dark`}>
      <div className="container">
        <div className="relative -mx-4 flex items-center justify-between">
          <div className="w-60 max-w-full px-4">
            <Link href="/#" className="block w-full py-5">
              <Image
                src="https://cdn.tailgrids.com/2.0/image/assets/images/logo/logo-primary.svg"
                alt="logo"
                className="dark:hidden"
                width={200}
                height={50}
              />
              <Image
                src="https://cdn.tailgrids.com/2.0/image/assets/images/logo/logo-white.svg"
                alt="logo"
                className="hidden dark:block"
                width={200}
                height={50}
              />
            </Link>
          </div>
          <div className="flex w-full items-center justify-between px-4">
            <div>
              <button
                onClick={() => setOpen(!open)}
                id="navbarToggler"
                className={` ${
                  open && "navbarTogglerActive"
                } absolute right-4 top-1/2 block -translate-y-1/2 rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden`}
              >
                <span className="relative my-[6px] block h-[2px] w-[30px] bg-body-color dark:bg-white"></span>
                <span className="relative my-[6px] block h-[2px] w-[30px] bg-body-color dark:bg-white"></span>
                <span className="relative my-[6px] block h-[2px] w-[30px] bg-body-color dark:bg-white"></span>
              </button>
              <nav
                // :className="!navbarOpen && 'hidden' "
                id="navbarCollapse"
                className={`absolute right-4 top-full w-full max-w-[250px] rounded-lg bg-white px-6 py-5 shadow dark:bg-dark-2 lg:static lg:block lg:w-full lg:max-w-full lg:shadow-none lg:dark:bg-transparent ${
                  !open && "hidden"
                } `}
                style={{ zIndex: 1000 }}
              >
                <ul className="block lg:flex gap-3">
                  <Link className="block" href="/">
                    Home
                  </Link>
                  {user ? (
                    <>
                      <Link className="block" href="/tic-tac-toe">
                        Tic-Tac-Toe
                      </Link>
                      <Link className="block" href="/user/articles">
                        Your articles
                      </Link>
                    </>
                  ) : (
                    <></>
                  )}
                </ul>
              </nav>
            </div>
            <div className="hidden justify-end pr-16 sm:flex lg:pr-0 gap-3">
              {!user ? (
                <>
                  <Link
                    href="/user/signin"
                    className="rounded-md bg-primary px-4 py-3 text-base text-white font-medium dark:text-white hover:bg-primary/90 flex items-center gap-2"
                  >
                    <LuLogIn size={25} />
                    Sign in
                  </Link>
                  <Link
                    href="/user/register"
                    className="rounded-md bg-primary px-4 py-3 text-base text-white font-medium dark:text-white hover:bg-primary/90 flex items-center gap-2"
                  >
                    <LuUserPlus size={25} />
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <div className="flex items-center">
                    Hello, {user.displayName}
                    {user.photoURL ? (
                      <Image
                        src={user.photoURL}
                        alt="Profile photo"
                        width={50}
                        height={50}
                        className="rounded ms-2"
                        style={{ aspectRatio: "1/1", objectFit: "cover" }}
                      />
                    ) : null}
                  </div>
                  <Link
                    href="/user/profile"
                    id="profile"
                    className="rounded-md bg-primary px-4 py-3 text-base text-white font-medium dark:text-white hover:bg-primary/90 flex items-center gap-2"
                  >
                    <LuCircleUser size={25} />
                    Profile
                  </Link>
                  <Link
                    href="/user/signout"
                    className="rounded-md bg-primary px-4 py-3 text-base text-white font-medium dark:text-white hover:bg-primary/90 flex items-center gap-2"
                  >
                    <LuLogOut size={25} />
                    Log out
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
