import { FormControl, TextField } from "@mui/material";
import React, { useState } from "react";

interface FormData {
  id: string;
  type: string;
  label: string;
  min: number;
  max: number;
}
/* for number input */
const NumberInput = (props: FormData) => {
  const [error, setError] = useState<string>("");
  const [errStatus, setErrorStatus] = useState<boolean>(false);

  const numberHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.type === "number") {
      if (
        event.target.value.length === 0 ||
        +event.target.value < props.min ||
        +event.target.value > props.max
      ) {
        setErrorStatus(true);
        setError("enter positive value between 1 to 100");
      } else {
        setErrorStatus(false);
        setError("");
      }
    }
  };

  return (
    <div>
      <>
        <FormControl style={{ marginRight: 35, marginBottom: 20, width: 250 }}>
          <TextField
            required
            error={errStatus}
            id={props.id}
            label={props.label}
            type={props.type}
            inputProps={{ min: `${props.min}`, max: `${props.max}` }}
            onChange={numberHandler}
            helperText={error}
          />
        </FormControl>
      </>
    </div>
  );
};
export default NumberInput;
