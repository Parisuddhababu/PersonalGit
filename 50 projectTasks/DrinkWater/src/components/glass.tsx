import { useSelector } from "react-redux";
import "./glass.css";
import React, { useEffect, useState } from "react";
import DialogSelect from "./dialogSelect";
import AutoModeDuration from "./duration";
import Toggle from "./toggle";
import BottleClick from "./bottleClick";

/*defining types for store data*/
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

const GlassManager = () => {
  const mainState = useSelector(
    /*all details of store*/
    (item: { selectBottle: Data }) => item.selectBottle
  );

  const totalcups = useSelector(
    /*number of cups based on user selection*/
    (item: { selectBottle: Data }) => item.selectBottle.totalCups
  );

  const selectedGlass = useSelector(
    /*for user selected glass*/
    (item: { selectBottle: Data }) => item.selectBottle.selectedGlass
  );

  const fullCups = useSelector(
    /*number of total cups filled*/
    (item: { selectBottle: Data }) => item.selectBottle.totalCupsFilled
  ).length;

  const [visibility, setVisibility] = useState("");
  const [height, setHeight] = useState("0");
  const [textContent, setTextContent] = useState("");
  const [reminedvisible, setremindedvisible] = useState("");
  const [reminedHe, setreminedHe] = useState(0);
  const [liters, setremliters] = useState<number | string>(
    `${mainState.totalMl}`
  );

  useEffect(() => {
    /*no filled cups*/
    if (fullCups === 0) {
      setVisibility("hidden");
      setHeight("0");
    } else {
      /*for filled cups*/
      setVisibility("visible");
      setHeight(`${(fullCups / totalcups) * 330}px`);
      setTextContent(`${(fullCups / totalcups) * 100}`);
    }
    /*all cups filled*/
    if (fullCups === totalcups) {
      setremindedvisible("hidden");
      setreminedHe(0);
    } else {
      setremindedvisible("visible");
      /*remainder for glasses to complete*/
      setremliters(
        `${mainState.totalMl / 1000 - (+selectedGlass * fullCups) / 1000}`
      );
    }
  }, [fullCups, totalcups, selectedGlass, mainState.totalMl]);

  return (
    <>
      <h1>Drink Water</h1>
      <h3>Goal: {mainState.totalMl / 1000} Liters</h3>
      <p>choose quantity of glass</p>
      {/* components for dialogbox to select glass quantity */}
      <DialogSelect />
      <div className="cup">
        {/* reminder for L to complete */}
        <div
          className={`remained ${reminedvisible}`}
          style={{ height: `${reminedHe}` }}
          id="remained"
        >
          {/*  fixing to places after decimal */}
          <span id="liters">{parseFloat(`${liters}`).toFixed(2)} L</span>
          <small>Remained</small>
        </div>
        {/*  showing percentage */}
        <div
          className={`percentage ${visibility}`}
          id="percentage"
          style={{ height: `${height}` }}
        >
          {parseFloat(`${textContent}`).toFixed(2)}%
        </div>
      </div>
      <Toggle />
      {/*  showing dropdown for duration & quantity when user turn on toggle for automode  */}
      {mainState.showDropdownlist && <AutoModeDuration />}
      <br />
      <p className="text">
        Select how many glasses of water that you have drank
      </p>
      <BottleClick />
    </>
  );
};
export default GlassManager;
