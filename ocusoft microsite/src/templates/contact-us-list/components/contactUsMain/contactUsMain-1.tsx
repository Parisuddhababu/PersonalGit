import { IContactUsMain } from "@templates/contact-us-list";
import ContactUsAddressList1 from "../contactusAddressList/contactus-address-list-1";
import BannerTemplateType1 from "../BannerTemplateType/banner-template-type-1";

const ContactUsMain1 = (props: IContactUsMain) => {
  return (
    <>
      <BannerTemplateType1 {...props} />
      <ContactUsAddressList1 />
    </>
  );
};

export default ContactUsMain1;
