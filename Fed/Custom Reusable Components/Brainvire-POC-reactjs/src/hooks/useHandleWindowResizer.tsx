import { useEffect, useState } from "react";

export const UseHandleWindowResizer = ():{isMobile:boolean} => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = ():void => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return ():void => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return {
    isMobile,
  };
};
