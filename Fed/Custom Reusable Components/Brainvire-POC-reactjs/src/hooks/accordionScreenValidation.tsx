

export const accordionScreenValidation = (
  index: number,
  activeBoxRef,
  setActiveBox,
  screenWidth: number,
  scrollindex: string,
  topHight: number,
  scrollToElement
):void => {
  const scrollTopEle = (className: string, topHeight?: number):void => {
    if (window.innerWidth <= screenWidth) {
      scrollToElement(className, topHeight);
    }
  };
  const isMobile = (nullIndex):void => {
    if (window.innerWidth <= screenWidth) {
      setActiveBox(nullIndex);
    }
  };
  const isActive:boolean = activeBoxRef.current === index;
  isActive ? isMobile(null) : setActiveBox(index);
  !isActive && scrollTopEle(scrollindex, topHight);
};
