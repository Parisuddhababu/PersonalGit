import { useDispatch, useSelector } from "react-redux";
import { onBottleClick } from "../store/waterSlice";
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

const BottleClick = () => {
  const dispatch = useDispatch();
  const mainState = useSelector(
    /*all details of store*/
    (item: { selectBottle: Data }) => item.selectBottle
  );
  const data = useSelector(
    /*details of glass based on user selection*/
    (item: { selectBottle: Data }) => item.selectBottle.data
  );

  return (
    <div className="cups">
      {data.map(
        (item: {
          id: number;
          bottleInMl: string;
          showBottle: boolean;
          classList: string;
        }) => {
          return (
            <>
              <div
                className={`cup cup-small ${item.showBottle ? "full" : ""}`}
                id={`${item.id}`}
                onClick={() => {
                  /*if it is automode no manual fill*/
                  mainState.showDropdownlist &&
                    alert("Auto Mode is on Please Turn off");
                  /*if manual mode fill click on bottle*/
                  !mainState.showDropdownlist &&
                    dispatch(onBottleClick(item.id));
                }}
              >
                {item.bottleInMl}
              </div>
            </>
          );
        }
      )}
    </div>
  );
};
export default BottleClick;
