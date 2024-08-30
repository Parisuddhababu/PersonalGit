import { FormControl, TextField } from "@mui/material";
import React, { useState } from "react";

interface FormData {
  id: string;
  type: string;
  label: string;
}
/* for email input */
const EmailInput = (props: FormData) => {
  const [error, setError] = useState<string>("");
  const [errStatus, setErrorStatus] = useState<boolean>(false);
  const emailHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.type === "email") {
      if (
        event.target.value === "" ||
        !event.target.value.includes("@") ||
        !event.target.value.includes(".com")
      ) {
        setErrorStatus(true);
        setError("email sholud contain @ and .com");
      } else {
        setErrorStatus(false);
        setError("");
      }
    }
  };

  return (
    <div>
      <FormControl style={{ marginRight: 35, marginBottom: 20, width: 250 }}>
        <TextField
          required
          error={errStatus}
          id={props.id}
          label={props.label}
          type={props.type}
          onChange={emailHandler}
          helperText={error}
        />
      </FormControl>
    </div>
  );
};
export default EmailInput;
