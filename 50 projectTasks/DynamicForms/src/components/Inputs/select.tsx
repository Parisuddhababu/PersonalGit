import * as React from "react";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { TextField } from "@mui/material";

interface selectInputData {
  id: string;
  label: string;
  type: string;
  options: { id: string; value: string }[] | undefined;
}
/* for select input */
const SelectInput = (props: selectInputData) => {
  return (
    <div>
      <Box sx={{ minWidth: 120 }}>
        <FormControl style={{ width: 250 }}>
          <TextField required select id={props.id} label={props.label}>
            {props?.options?.map((i) => (
              <MenuItem key={i.id} value={i.value}>
                {i.value}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
      </Box>
    </div>
  );
};
export default SelectInput;
