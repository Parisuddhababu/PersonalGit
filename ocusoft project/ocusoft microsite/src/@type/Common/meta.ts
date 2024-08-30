import { IProductTagList } from "@components/Meta";

export interface IMeta {
  status_code: number;
  title: string;
  description: string;
  canonical_url?: string;
  Alternate: AlternateMeta[];
  NoIndex: string;
  NoFollow: string;
  product_tags_detail?: IProductTagList[];
}

interface AlternateMeta {
  href: string;
  hreflang: string;
}

export interface ICustomScriptProps {
  id: string;
  src: string;
  dangerouslySetInnerHTML: {
    __html: string;
  };
}
export interface INextScriptCustomProps {
  props: ICustomScriptProps;
  type: string;
}
