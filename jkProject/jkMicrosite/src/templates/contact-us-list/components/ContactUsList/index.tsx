import ContactUsList from "@templates/contact-us-list/components/ContactUsList/contact-us-list-1";
import { ICountryFlag } from "@type/Pages/contactUsAddress";
export interface IContactUsListProps {
  data: {
    _id : string,
    name : string,
    country_code : string,
    country_phone_code : string,
    currency_code : string,
    currency_symbol : string,
    country_flag : ICountryFlag[],
    is_default ?: number ,
    latitude ?: number,
    longitude ?: number,
    country: {
      country_phone_code: string;
    };
    contactus_contact_number: string;
    contactus_email: string;
    address_title?: string;
    address_line1?: string;
    address_line2?: string;

  };
  type?: number
}
export default ContactUsList;




