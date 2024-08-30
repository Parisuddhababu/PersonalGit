import { FormControl, TextField } from "@mui/material";
import React, { useState } from "react";

interface FormData {
  id: string;
  type: string;
  label: string;
}
/* for search,color,range inputs */
const InputContainer = (props: FormData) => {
  const [error, setError] = useState<string>("");
  const [errStatus, setErrorStatus] = useState<boolean>(false);

  const onchangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (
      event.target.type === "search" ||
      event.target.type === "color" ||
      event.target.type === "range"
    ) {
      if (event.target.value === "") {
        setErrorStatus(true);
        setError("please fill the feild");
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
          onChange={onchangeHandler}
          helperText={error}
        />
      </FormControl>
    </div>
  );
};
export default InputContainer;
