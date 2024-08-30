import { FormControlLabel, Switch } from "@mui/material";
import { onAutoOn } from "../store/waterSlice";
import { useDispatch, useSelector } from "react-redux";
import React from "react";

type Data = {
  totalMl: number;
  selectedGlass: string;
  data: {
    id: number;
    bottleInMl: string;
    showBottle: boolean;
    classList: string;
  }[];
  totalCupsFilled: string[];
  totalCups: number;
  showDropdownlist: boolean;
  dropDownListValue: number;
};

const Toggle = () => {
  const dispatch = useDispatch();
  const mainState = useSelector(
    /*all details of store*/
    (item: { selectBottle: Data }) => item.selectBottle
  );
  return (
    <div>
      <FormControlLabel
        control={
          /*toggle for auto mode*/
          <Switch
            checked={mainState.showDropdownlist ? true : false}
            onChange={() => dispatch(onAutoOn())}
            name="Auto"
          />
        }
        label="Auto"
      ></FormControlLabel>
    </div>
  );
};
export default Toggle;
