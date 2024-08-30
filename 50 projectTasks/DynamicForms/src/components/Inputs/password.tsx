import { FormControl, TextField } from "@mui/material";
import React, { useState } from "react";

interface FormData {
  id: string;
  type: string;
  label: string;
}
/* for password input */
const PasswordInput = (props: FormData) => {
  const [error, setError] = useState<string>("");
  const [errStatus, setErrorStatus] = useState<boolean>(false);

  const passwordPattern = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,16}$/;

  const PasswordHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.type === "password") {
      if (!passwordPattern.test(event.target.value)) {
        setErrorStatus(true);
        setError(
          event.target.value === ""
            ? "Password must be atleast 8 digits"
            : "Password must contains one digit from (specialChars and [A-Z] and [a-z] and [0-9])"
        );
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
          onChange={PasswordHandler}
          helperText={error}
        />
      </FormControl>
    </div>
  );
};
export default PasswordInput;
