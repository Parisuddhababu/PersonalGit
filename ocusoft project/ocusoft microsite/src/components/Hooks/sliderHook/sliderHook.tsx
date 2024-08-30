import { splitArrayInChunk } from "@util/common";
import { useEffect, useState } from "react";

const useSliderHook = (listData:any, fixedIndex?: number) => {
  const [slicedData, setSlicedData] = useState<any>([]);
  const [hideRightButton, setHideRightButton] = useState(true);
  const [hideLeftButton, setHideLeftButton] = useState(false);
  const [arrayIndex, setArrayIndex] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      // Set index based on screen width
      let index = fixedIndex ?? 4;
      if (!fixedIndex) {
        if (screenWidth < 576) index = 1; // Mobile
        else if (screenWidth < 768) index = 2; // Tablet
        else if (screenWidth < 1200) index = 3; // Medium
        else index = 4; // Desktop
      }
      setArrayIndex(0)
      setHideRightButton(true)
      setHideLeftButton(false)
      setSlicedData(splitArrayInChunk(listData, index));
      if (index >= listData?.length) {
        setHideRightButton(false);
      }
    };

    // Initial setup
    handleResize();

    // Listen for window resize events
    if (!fixedIndex) {
      window.addEventListener("resize", handleResize);
    }

    // Cleanup the event listener on component unmount
    return () => {
      if (!fixedIndex) {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, [listData]);

  const splitDataArray = (data: any[]) => {
    setSlicedData(splitArrayInChunk(data, slicedData[0].length || 4));
  };

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
