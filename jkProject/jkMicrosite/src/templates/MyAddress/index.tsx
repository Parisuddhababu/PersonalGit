import MyAddress from "@templates/MyAddress/my-address";
import { IBaseTemplateProps } from "..";
import { IAddressListPropsData } from "./components/Address";

export interface MyaddressPropsMain
  extends IBaseTemplateProps,
    IAddressListPropsData {}

export default MyAddress;
