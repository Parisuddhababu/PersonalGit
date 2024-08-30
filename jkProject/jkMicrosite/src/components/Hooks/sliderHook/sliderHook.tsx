import { splitArrayInChunk } from "@util/common";
import { useEffect, useState } from "react";

const useSliderHook = (listData: any, index: number) => {
  const [slicedData, setSlicedData] = useState<any>([]);
  const [hideRightButton, setHideRightButton] = useState(true);
  const [hideLeftButton, setHideLeftButton] = useState(false);
  const [arrayIndex, setArrayIndex] = useState(0);

  useEffect(() => {
    setSlicedData(splitArrayInChunk(listData, index));
    if (index >= listData?.length) {
      setHideRightButton(false);
    }
    // eslint-disable-next-line
  }, []);

  const splitDataArray = (data: any[]) => {
    setSlicedData(splitArrayInChunk(data, index));
  };

  /**
   *
   * @param buttonSide  Arrow Side of Slider for Hide and Show Purpose of Arrow
   * @param index       To switch upcoming or past data with index
   *
   * use SliderButton function when You have Right And left arrow button and you want to have Sliding Functionality with
   * show and hide button as well (button will hide and show accordingly as par data you have)
   *
   */
  const SliderButton = (buttonSide: string, index: number) => {
    if (index !== -1) {
      if (buttonSide.toLowerCase() === "left") setHideRightButton(true);
      if (index >= slicedData.length - 1) {
        setHideRightButton(false);
      }
      if (index === 0) {
        setHideLeftButton(false);
      } else {
        setHideLeftButton(true);
      }
      setArrayIndex(index);
    }
  };

  return {
    slicedData,
    hideRightButton,
    hideLeftButton,
    arrayIndex,
    SliderButton,
    splitDataArray,
  };
};

export default useSliderHook;
