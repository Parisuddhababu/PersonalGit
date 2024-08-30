import { FormControl, TextField } from "@mui/material";
import React, { ChangeEvent, useState } from "react";
interface FormData {
  id: string;
  type: string;
  label: string;
}
/* for telephone input */
const TelephoneInput = (props: FormData) => {
  const [error, setError] = useState<string>("");
  const [errStatus, setErrorStatus] = useState<boolean>(false);
  const telChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.type === "tel") {
      if (
        event.target.value === "" ||
        event.target.value.length !== 10 ||
        !+event.target.value
      ) {
        setErrorStatus(true);
        setError("please enter 10 digits");
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
            error={errStatus}
            id={props.id}
            label={props.label}
            type={props.type}
            onChange={telChangeHandler}
            helperText={error}
          />
        </FormControl>
      </>
    </div>
  );
};
export default TelephoneInput;
