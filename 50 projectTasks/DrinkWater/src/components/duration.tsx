import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { onBottle, onDropDownSelected, onDuration } from "../store/waterSlice";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";

type Data = {
  data: {
    id: number;
    bottleInMl: string;
    showBottle: boolean;
    classList: string;
  }[];
  dropDownListValue: number;
  duration: number;
};

const AutoModeDuration = () => {
  const dispatch = useDispatch();
  const data = useSelector(
    /*details of glass based on user selection*/
    (item: { selectBottle: Data }) => item.selectBottle.data
  );
  const mainState = useSelector(
    /*all details of store*/
    (item: { selectBottle: Data }) => item.selectBottle
  );

  const [seconds, setSeconds] = useState(mainState.dropDownListValue);
  useEffect(() => {
    /*for specific duration in auto mode*/
    if (
      seconds <= mainState.data.length &&
      mainState.dropDownListValue > 0 &&
      mainState.duration > 0
    ) {
      const interval = setInterval(() => {
        setSeconds((prev) => prev + mainState.dropDownListValue);
        dispatch(onBottle(seconds));
      }, 1000 * mainState.duration);
      return () => clearInterval(interval);
    }
    /*remaining to fill*/
    if (mainState.dropDownListValue > 0 && mainState.duration > 0) {
      const interval = setInterval(() => {
        dispatch(onBottle(mainState.data.length));
      }, 1000 * mainState.duration);
      return () => clearInterval(interval);
    }
  });

  return (
    <div>
      <div>
        {/* selecting an option for specific quantity of glass */}
        <Box sx={{ m: 1, minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-controlled-open-select-label">
              Choose Glass
            </InputLabel>
            <Select
              labelId="demo-controlled-open-select-label"
              id="demo-controlled-open-select"
              label="Age"
              onChange={(event: { target: { value: string | number } }) => {
                dispatch(onDropDownSelected(+event.target.value));
                setSeconds(0);
              }}
            >
              {/* choosing glasses in auto mode to be fill*/}
              {data.map((item) => {
                return (
                  <MenuItem key={item.id} value={item.id + 1 || ""}>
                    {item.id + 1} Glass
                  </MenuItem>
                );
              })}
            </Select>
            <br />
          </FormControl>
        </Box>
      </div>
      {/*selecting an option for specific duration*/}
      <div>
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Select Duration
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Age"
              onChange={(event: { target: { value: string | number } }) => {
                dispatch(onDuration(+event.target.value));
              }}
            >
              <MenuItem value={1}>1 sec</MenuItem>
              <MenuItem value={3}>3 sec</MenuItem>
              <MenuItem value={5}>5 sec</MenuItem>
              <MenuItem value={7}>7 sec</MenuItem>
              <MenuItem value={10}>10 sec</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </div>
    </div>
  );
};
export default AutoModeDuration;
