import FormData from "./forms.json";
import CheckboxInput from "./Inputs/checkBox";
import InputContainer from "./Inputs/commonInputs";
import NumberInput from "./Inputs/number";
import RadioInput from "./Inputs/radioButton";
import SelectInput from "./Inputs/select";
import React from "react";
import TelephoneInput from "./Inputs/telephone";
import PasswordInput from "./Inputs/password";
import EmailInput from "./Inputs/email";
import TextInput from "./Inputs/text";
import UrlInput from "./Inputs/url";
import DateTimeInputs from "./Inputs/dateTime";
import { Button } from "@mui/material";

const MainForm = () => {
  const onSubmitHandler = (event: React.SyntheticEvent) => {
    event.preventDefault();
    alert("success");
    window.location.reload();
  };
  return (
    <div style={{ marginLeft: 500 }}>
      <form onSubmit={onSubmitHandler}>
        <h2 style={{ color: "green" }}>Dynamic Forms</h2>
        {FormData?.formTypes?.map((input) => {
          /* if it is checkbox type */
          if (input.type === "checkbox") {
            return (
              <CheckboxInput
                key={input.id}
                id={input.id}
                type={input.type}
                label={input.label}
                options={input.options}
              />
            );
          }
          /* if it is text type */
          if (input.type === "text") {
            return (
              <TextInput
                key={input.id}
                id={input.id}
                type={input.type}
                label={input.label}
              />
            );
          }
          /* if it is select type */
          if (input.type === "select") {
            return (
              <SelectInput
                key={input.id}
                id={input.id}
                type={input.type}
                label={input.label}
                options={input.options}
              />
            );
          }
          /* if it is radio type */
          if (input.type === "radio") {
            return (
              <RadioInput
                key={input.id}
                id={input.id}
                type={input.type}
                label={input.label}
                options={input.options}
              />
            );
          }
          /* if it is number type */
          if (input.type === "number") {
            return (
              <NumberInput
                key={input.id}
                id={input.id}
                type={input.type}
                label={input.label}
                min={input.min as number}
                max={input.max as number}
              />
            );
          }
          /* if it is telephone type */
          if (input.type === "tel") {
            return (
              <TelephoneInput
                key={input.id}
                id={input.id}
                type={input.type}
                label={input.label}
              />
            );
          }
          /* if it is password type */

          {
            if (input.type === "password") {
              return (
                <PasswordInput
                  id={input.id}
                  type={input.type}
                  label={input.label}
                />
              );
            }
          }
          /* if it is email type */
          {
            if (input.type === "email") {
              return (
                <EmailInput
                  id={input.id}
                  type={input.type}
                  label={input.label}
                />
              );
            }
          }
          /* if it is submit type */

          if (input.type === "submit") {
            return (
              <Button
                variant="contained"
                key={input.id}
                type={input.type}
                id={input.id}
              >
                {input.label}
              </Button>
            );
          }
          /* if it is url type */
          if (input.type === "url") {
            return (
              <UrlInput
                id={input.id}
                key={input.id}
                type={input.type}
                label={input.label}
              />
            );
          }
          /* if it is range,search & color types */
          if (
            input.type === "range" ||
            input.type === "search" ||
            input.type === "color"
          ) {
            return (
              <div key={input.id}>
                <InputContainer
                  key={input.id}
                  id={input.id}
                  label={input.label}
                  type={input.type}
                />
              </div>
            );
          } else {
            /* if it is date ,time types */
            return (
              <DateTimeInputs
                key={input.id}
                id={input.id}
                label={input.label}
                type={input.type}
              />
            );
          }
        })}
      </form>
    </div>
  );
};
export default MainForm;
