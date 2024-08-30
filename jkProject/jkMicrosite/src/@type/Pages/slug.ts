import { IMeta } from "@type/Common/meta";
import { IRating } from "@type/Common/rating";
import { IBreadCrumbs } from "@type/Common/breadcrumbs";
import { SlugInfoProps } from "@components/Meta";

export interface ISlug {
  status_code: number;
  sequence?: string[];
  meta: IMeta;
  data: any;
  status: number;
  rating?: IRating;
  response?: string;
  page_template?: string;
  breadcrumbs: IBreadCrumbs[];
  slugInfo?: SlugInfoProps;
}

export interface ISlugPageProps {
  ctx: ISlug;
  useragent: string;
  host: string;
  canonical?: string;
  domainName?: string
}
