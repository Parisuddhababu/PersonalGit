"use client";

import Image from "next/image";

import { CustomButton } from "@components";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="hero">
      <div className="flex-1 pt-36 padding-x">
        <h1 className="hero__title">Find and book a car</h1>

        <p className="hero__subtitle">
          book your car and enjoy with your family
        </p>

        <Link href={"/cars"}>
          <CustomButton
            title="Explore Cars"
            containerStyles="bg-primary-blue text-white rounded-full mt-10"
          />
        </Link>
      </div>
      <div className="hero__image-container">
        <div className="hero__image">
          <Image src="/hero.png" alt="hero" fill className="object-contain" />
        </div>

        <div className="hero__image-overlay" />
      </div>
    </div>
  );
};

export default Hero;
