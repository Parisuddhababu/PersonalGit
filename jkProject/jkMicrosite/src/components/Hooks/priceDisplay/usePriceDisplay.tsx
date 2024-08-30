import { IsBrowser } from "@util/common";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const usePriceDisplay = () => {
  const [isPriceDisplay, setIsPriceDisplay] = useState<boolean>(true);

  useEffect(() => {
    if (IsBrowser) {
      const flag = Cookies.get("is_Price_display");
      if (flag === "false") {
        setIsPriceDisplay(false);
      }
      if (flag === "true") {
        setIsPriceDisplay(true);
      }
    }
    // eslint-disable-next-line
  }, []);

  return {
    isPriceDisplay
  };
};

export default usePriceDisplay;
