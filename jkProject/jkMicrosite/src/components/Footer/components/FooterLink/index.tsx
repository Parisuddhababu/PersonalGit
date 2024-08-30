import { IFooterMenus } from "@type/Footer";
import FooterLinkSection from "./FooterLink";

export interface IFooterLinkSectionProps {
  list: IFooterMenus[] | null;
}

export default FooterLinkSection;
