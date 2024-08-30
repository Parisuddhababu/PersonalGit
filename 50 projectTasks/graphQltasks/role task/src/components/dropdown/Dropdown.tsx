import React from "react";
import { DropdownProps, DropdownOptionType } from "src/types/component";
import cn from "classnames";
import FormClassess from "../../styles/page-styles/Form.module.scss";

const Dropdown = ({
  id,
  placeholder,
  name,
  onChange,
  options,
  label,
  error,
  value,
  inputIcon,
  disabled,
  note,
  className,
}: DropdownProps) => {
  return (
    <div className={`${className} ${cn(FormClassess["form-group"])}`}>
      {label !== undefined && <label htmlFor={name}>{label}</label>}
      <div
        className={`${cn(FormClassess["input-group"])} ${
          inputIcon ? FormClassess["with-icon"] : ""
        }`}
      >
        <select
          className={`${cn(
            FormClassess["form-control"],
            FormClassess["custom-select"]
          )} ${error ? "error" : ""}`}
          id={id}
          onChange={onChange}
          name={name}
          value={value}
          disabled={disabled}
        >
          {placeholder && <option disabled>{placeholder}</option>}
          {options?.map((data: DropdownOptionType, index: number) => {
            return (
              <option
                selected={data.key === value}
                value={data.key}
                key={`${index + 1}`}
              >
                {data.name}
              </option>
            );
          })}
        </select>
      </div>

      {error !== undefined && <p className="text-red-500 text-xs">{error}</p>}
      {note !== undefined && (
        <p className="text-black text-sm font-medium my-1">{note}</p>
      )}
    </div>
  );
};

export default React.memo(Dropdown);
