import Select from "@mui/material/Select";
import { useDispatch } from "react-redux";
import { onBottleChange } from "../store/waterSlice";
import React from "react";
import { Box, FormControl, InputLabel, MenuItem } from "@mui/material";

export default function DialogSelect() {
  const dispatch = useDispatch();
  /*to getting selected value and dispatching action*/
  const handleChange = (event: { target: { value: string | number } }) => {
    dispatch(onBottleChange(+event.target.value));
  };

  return (
    <div>
      {/*selecting glass quantity  */}
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Select Quantity</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Age"
            onChange={handleChange}
          >
            <MenuItem value={100}> 100ml</MenuItem>
            <MenuItem value={200}> 200ml</MenuItem>
            <MenuItem value={400}> 400ml</MenuItem>
            <MenuItem value={1000}> 1000ml</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </div>
  );
}
