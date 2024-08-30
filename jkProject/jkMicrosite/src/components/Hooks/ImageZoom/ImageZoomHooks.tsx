import { useState } from "react";

const useZoomImageHook = () => {
  const [[x, y], setXY] = useState([0, 0]);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
  const [showMagnifier, setShowMagnifier] = useState(false);

  const mouseEnter = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    // update image size and turn-on magnifier
    const elem = e.currentTarget as HTMLElement;
    const { width, height } = elem.getBoundingClientRect();
    setSize([width, height]);
    setShowMagnifier(true);
  };

  const onMouseMove = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    // update cursor position
    const elem = e.currentTarget as HTMLElement;
    const { top, left } = elem.getBoundingClientRect();
    // calculate cursor position on the image
    const x = e.pageX - left - window.pageXOffset;
    const y = e.pageY - top - window.pageYOffset;

    setXY([x, y]);
  };

  const mouseLeave = () => {
    setShowMagnifier(false);
  };

  return {
    mouseEnter,
    onMouseMove,
    mouseLeave,
    imgWidth,
    imgHeight,
    x,
    y,
    showMagnifier,
  };
};

export default useZoomImageHook;
