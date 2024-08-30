import { IProductTagList } from "@components/Meta";
import IQuickView1 from "@templates/ProductList/components/QuickView/quick-view-1";

export interface IQuickView1Props {
  onClose: () => void;
  slug: string;
  isModal: boolean;
  product_tags_detail?: IProductTagList[];
  type: number;
}

export default IQuickView1;
