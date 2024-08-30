import { IMeta } from "@type/Common/meta";
import { IHome } from "@type/Pages/home";
import { IRootColor } from "@type/Common/Base";
import { SlugInfoProps } from "@components/Meta";

interface Context extends IHome {
  meta: IMeta;
  sequence: string[];
  slugInfo?: SlugInfoProps;
}

export default interface Home {
  Context: Context;
  canonical?: string;
  default_style: IRootColor;
  host?: string;
  slugInfo?: SlugInfoProps;
  domainName: string;
  micrositeName?: string
}
