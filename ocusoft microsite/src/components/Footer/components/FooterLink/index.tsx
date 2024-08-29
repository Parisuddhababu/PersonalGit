import { IFooterMenus } from "@type/Footer";
import FooterLinkSection from "@components/Footer/components/FooterLink/FooterLink";

export interface IFooterLinkSectionProps {
  list: IFooterMenus[] | null;
}

export default FooterLinkSection;
