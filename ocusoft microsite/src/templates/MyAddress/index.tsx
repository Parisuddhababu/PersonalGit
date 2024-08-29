import MyAddress from "@templates/MyAddress/my-address";
import { IBaseTemplateProps } from "@templates/index";
import { IAddressListPropsData } from "@templates/MyAddress/components/Address/index";

export interface MyaddressPropsMain
  extends IBaseTemplateProps,
    IAddressListPropsData {}

export default MyAddress;
