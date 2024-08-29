import { IBaseTemplateProps } from "@templates/index";
import ContactUs from "@templates/contact-us-list/contact-us-list";
import { IContactList } from "@type/Pages/contactUsAddress";

export interface IContactUsMain {
  type: string;
  contactus_address_list: {
    draw: number;
    recordsTotal: number;
    recordsFiltered: number;
    data: IContactList[];
  }
  contact_us_list: {
    data: {
      _id: string;
      country: {
        country_phone_code: string;
      };
      contactus_contact_number: string;
      contactus_email: string;

    }[];
  }
  link?: string;

}

export interface IContactUs extends IContactUsMain, IBaseTemplateProps { }

export default ContactUs;
