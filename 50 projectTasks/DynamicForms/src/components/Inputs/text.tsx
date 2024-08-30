import { FormControl, TextField } from "@mui/material";

import React, { useState } from "react";

interface FormData {
  id: string;
  type: string;
  label: string;
}
/* for text input */
const TextInput = (props: FormData) => {
  const [error, setError] = useState<string>("");
  const [errStatus, setErrorStatus] = useState<boolean>(false);
  const textHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.type === "text") {
      if (event.target.value === "") {
        setErrorStatus(true);
        setError("please enter your name");
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
          onChange={textHandler}
          helperText={error}
        />
      </FormControl>
    </div>
  );
};
export default TextInput;
