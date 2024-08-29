import { ICountryCode } from "@type/Common/Base";
import Footer from "@components/Footer/Footer";
import { IFooterLogo } from "@type/Footer";


export interface IFooterProps {
  social_tumblr_link?: string;
  mobile: string;
  email: string;
  description: string;
  social_facebook: string;
  social_google: string;
  social_instagram: string;
  social_linkedin: string;
  social_twitter: string;
  social_youtube: string;
  social_meetlink: string;
  social_whatsapp_number: string;
  social_pinterest_link?: string
  country: ICountryCode;
  _id: string;
  header_link: string;
  favicon_icon: IFooterLogo;
  site_logo: IFooterLogo
}

export default Footer;
