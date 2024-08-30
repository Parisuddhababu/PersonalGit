"use client";
import { CustomButtonProps } from "@types";

const Button = ({
  isDisabled,
  btnType,
  containerStyles,
  textStyles,
  title,
  handleClick,
}: CustomButtonProps) => (
  <button
    disabled={isDisabled}
    type={btnType ?? "button"}
    className={`custom-btn ${containerStyles}`}
    onClick={handleClick}
  >
    <span className={`flex-1 ${textStyles}`}>{title}</span>
  </button>
);

export default Button;
