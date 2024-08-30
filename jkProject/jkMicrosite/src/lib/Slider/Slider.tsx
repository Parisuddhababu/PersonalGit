import { Options, ISliderSettingsProps } from "@lib/Slider";
import Glider from "react-glider";
const Slider = (props: ISliderSettingsProps) => {
  const settings = { ...Options, ...props.options };
  return <Glider {...settings}>{props.children}</Glider>;
};

export default Slider;
