import { IProductTagList } from "@components/Meta";
import RecentlyViewProduct1 from "@templates/ProductDetails/components/RecentlyProductView/recently-product-view-1";
import { IProductDetails } from "@type/Pages/productDetails";
export interface IRecentlyViewProps {
  data: IProductDetails;
  product_tags_detail?: IProductTagList[];
}

export default RecentlyViewProduct1;
