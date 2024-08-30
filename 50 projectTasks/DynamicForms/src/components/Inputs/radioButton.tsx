import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

interface FormData {
  id: string;
  type: string;
  label: string;
  options: { id: string; value: string }[] | undefined;
}
/* for radio input */
const RadioInput = (props: FormData) => {
  return (
    <div>
      <FormControl>
        <FormLabel id="demo-radio-buttons-group-label">{props.label}</FormLabel>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="female"
          name="radio-buttons-group"
          key={props.id}
        >
          {props?.options?.map((i) => (
            <li style={{ listStyleType: "none" }} key={i.id}>
              <FormControlLabel
                value={i.value}
                control={<Radio />}
                label={i.value}
              />
            </li>
          ))}
        </RadioGroup>
      </FormControl>
    </div>
  );
};
export default RadioInput;
