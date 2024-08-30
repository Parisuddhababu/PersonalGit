import React from "react";
import { ButtonProps } from "src/types/component";

const Button = ({
  label,
  onClick,
  type = "button",
  primary,
  secondary,
  warning,
  className,
}: ButtonProps) => {
  const color = React.useMemo(() => {
    if (primary) {
      return "bg-primary";
    }
    if (secondary) {
      return "bg-secondary";
    }
    if (warning) {
      return "bg-warning";
    }
    return "bg-default";
  }, [primary, secondary, warning]);

  return (
    <button
      className={`${color} ${className} hover:bg-blue-700 text-white font-bold 
    py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
      type={type}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default React.memo(Button);
