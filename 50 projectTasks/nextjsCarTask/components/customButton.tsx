import { CustomButtonProps } from "@/types";
import Link from "next/link";
import React from "react";
const CustomButton = ({
  title,
  containerStyles,
  btnType,
}: CustomButtonProps) => {
  return (
    <div>
      <Link href="/products">
        <button
          disabled={false}
          type={btnType ?? "button"}
          className={`custom-btn ${containerStyles}`}
        >
          {title}
        </button>
      </Link>
    </div>
  );
};
export default CustomButton;
