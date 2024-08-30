import { IHomeCustomizeJewelleryData } from "@type/Pages/home";
import CustomizeJewellery1 from "./customize-jewellery-1";
export interface ICustomizeJewellery1Props {
  data: IHomeCustomizeJewelleryData[];
  dynamic_title: {
    customise_jewellery_title:string
  }
}

export default CustomizeJewellery1;
