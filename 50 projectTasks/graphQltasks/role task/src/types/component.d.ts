import { DefaultTFuncReturn } from "i18next";

export type TextInputProps = {
  id?: string;
  label?: string | DefaultTFuncReturn;
  placeholder: string;
  name?: string;
  type?: "text" | "password" | "date" | "file" | "search" | "number";
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  value?: string;
  error?: string;
  note?: string;
  inputIcon?: React.JSXElementConstructor;
  disabled?: boolean;
};

export type DropdownProps = {
  id?: string;
  label?: string | DefaultTFuncReturn;
  placeholder: string;
  name?: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  value?: number | string;
  error?: string;
  options: StatusOptionType[];
  inputIcon?: React.JSXElementConstructor;
  disabled?: boolean;
  note?: string;
  className?: string;
};

export type DropdownOptionType = {
  name: string | number;
  key: string | number;
};
