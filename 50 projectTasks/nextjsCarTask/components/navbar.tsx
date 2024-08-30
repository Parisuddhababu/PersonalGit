"use client";
import Image from "next/image";
import Link from "next/link";
import Logo from "../public/lappyLogo1.jpg";
import React from "react";

const NavBar = () => {
  return (
    <header className="w-full  absolute z-10 mb-15">
      <nav className="max-w-[1440px] mx-auto flex justify-between items-center sm:px-16 px-6  bg-transparent mb-15">
        <Link href="/" className="flex justify-center items-center">
          <Image
            src={Logo}
            alt="logo"
            width={118}
            height={18}
            className="object-contain"
          />
        </Link>
        <Link href="/" className="flex ">
          Home
        </Link>
        <Link href="/products" className="flex">
          AllProducts
        </Link>
        <Link href="/about" className="flex">
          About
        </Link>
      </nav>
    </header>
  );
};
export default NavBar;
