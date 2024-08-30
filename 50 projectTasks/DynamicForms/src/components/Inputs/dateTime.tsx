import { FormControl, TextField } from "@mui/material";

import React, { useState } from "react";

interface FormData {
  id: string;
  type: string;
  label: string;
}
/* for date,time,file inputs */
const DateTimeInputs = (props: FormData) => {
  const [error, setError] = useState<string>("");
  const [errStatus, setErrorStatus] = useState<boolean>(false);
  const textHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (
      event.target.type === "date" ||
      event.target.type === "datetime-local" ||
      event.target.type === "time" ||
      event.target.type === "file"
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
          type={props.type}
          onChange={textHandler}
          helperText={error}
        />
      </FormControl>
    </div>
  );
};
export default DateTimeInputs;
