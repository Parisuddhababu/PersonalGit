import React from "react";
import { TextInputProps } from "src/types/component";
import FormClassess from "../../../src/styles/page-styles/Form.module.scss";
import cn from "classnames";

const TextInput = ({
  id,
  label,
  placeholder,
  name,
  type = "text" || "checkbox",
  onChange,
  value,
  error,
  note,
  inputIcon,
  disabled,
}: TextInputProps) => {
  return (
    <React.Fragment>
      <div className={cn(FormClassess["form-group"])}>
        {label !== undefined && <label htmlFor="password">{label}</label>}
        <div
          className={`${cn(FormClassess["input-group"])} ${
            inputIcon ? FormClassess["with-icon"] : ""
          }`}
        >
          {inputIcon && (
            <div className={cn(FormClassess["input-icon"])}>{inputIcon}</div>
          )}
          <input
            className={`${cn(FormClassess["form-control"])} ${
              error ? "error" : ""
            }`}
            id={id}
            type={type}
            name={name}
            placeholder={placeholder}
            onChange={onChange}
            value={value}
            disabled={disabled && true}
          />
        </div>
        {error !== undefined && <p className="text-red-600 text-sm">{error}</p>}
        {note !== undefined && (
          <p className="text-black text-sm font-medium my-1">{note}</p>
        )}
      </div>
    </React.Fragment>
  );
};

export default React.memo(TextInput);
