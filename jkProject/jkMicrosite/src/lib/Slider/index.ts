import { ReactNode } from "react";

export const Options = {
  hasArrows: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: {
    prev: "#buttonPrev",
    next: "#buttonNext",
  },
  duration: 5000,
};

export interface ISliderSettings {
  hasArrows?: boolean;
  hasDots?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  scrollToSlide?: number;
  scrollToPage?: number;
  slidesToShow?: number;
  slidesToScroll?: number;
  itemWidth?: any;
  exactWidth?: any;
  resizeLock?: boolean;
  rewind?: boolean;
  duration?: number;
  dots?: boolean;
  arrows: {
    prev: any;
    next: any;
  };
  draggable?: boolean;
  dragVelocity?: number;
  scrollPropagate?: boolean;
  propagateEvent?: boolean;
  scrollLock?: boolean;
  skipTrack?: boolean;
  scrollLockDelay?: number;
  responsive?: any;
  containerElement?: any;
  easing?: any;
}

export interface ISliderSettingsProps {
  options: ISliderSettings;
  children: ReactNode;
}
