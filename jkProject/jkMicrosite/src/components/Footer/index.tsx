import { ICountryCode } from "@type/Common/Base";
import Footer from "./Footer";

export interface IFooterProps {
  social_tumblr_link?: string;
  contactus_contact_number: string;
  contactus_email: string;
  description: string;
  social_facebook: string;
  social_google: string;
  social_instagram: string;
  social_linkedin: string;
  social_twitter: string;
  social_youtube: string;
  social_meetlink: string;
  social_whatsapp_number: string;
  social_pinterest_link?:string
  country: ICountryCode;
}

export default Footer;
