import * as React from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

interface FormData {
  id: string;
  type: string;
  label: string;
  options: { id: string; value: string }[] | undefined;
}
/* for checkbox input */
const CheckboxInput = (props: FormData) => {
  return (
    <div>
      <FormGroup>
        {props?.options?.map((i) => (
          <li key={i.id} style={{ listStyleType: "none" }}>
            <FormControlLabel control={<Checkbox />} label={i.value} />
          </li>
        ))}
      </FormGroup>
    </div>
  );
};
export default CheckboxInput;
