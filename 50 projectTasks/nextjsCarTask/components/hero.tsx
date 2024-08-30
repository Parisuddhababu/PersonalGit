import Image from "next/image";
import CustomButton from "./customButton";
import Lappy from "../public/lapy.jpg";
import React from "react";
const Hero = () => {
  return (
    <div className="hero">
      <div className="flex-1  pt-36 padding-x">
        <h1 className="hero__title">Best Products You Can Find</h1>
        <p className="hero__subtitle">Order a good products and enjoy</p>
        {/* for explore button */}
        <CustomButton
          title="Explore Products"
          containerStyles="bg-primary-blue text-white rounded-full mt-10"
        />
      </div>
      {/* for home page image */}

      <div className="hero__image-container">
        <div className="hero__image h-25 w-25">
          <Image
            src={Lappy}
            alt="mainCarImage"
            fill
            className="object-contain"
          />
        </div>
        {/* for overlay*/}

        <div className="hero__image-overlay "></div>
      </div>
    </div>
  );
};
export default Hero;
