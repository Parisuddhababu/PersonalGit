import { MyaddressPropsMain } from ".";
import MyAddressSection1 from "./components/Address";

const MyAddress = (props: MyaddressPropsMain) => {

  return (
    <MyAddressSection1 useraddressDetails={props?.data?.user_address_list?.data} />
  );
};

export default MyAddress;
