import { ISimilarProductsProps } from "@components/Hooks/similarProductList";
import { IProductTagList, SlugInfoProps } from "@components/Meta";
import SimilarProductView1 from "@templates/ProductDetails/components/SimilarProductView/similar-product-view-1";
import { IProductDetails } from "@type/Pages/productDetails";
export interface ISimilarViewProps {
  data: IProductDetails;
  title?: string;
  sectionName?:
  | "product_match_set"
  | "product_set"
  | "recently_view"
  | "similar_view";
  product_tags_detail?: IProductTagList[];
}

export interface IPDPProductBox {
  FilterOptions?: any;
  commingFromOther?: boolean;
  pageName?: string;
  domainName?: string
  slugInfo?: SlugInfoProps
  product_tags_detail?: IProductTagList[]
  key: number
  data: ISimilarProductsProps
  addtoWishList: () => void
  wishListData: any[]
  setIsQuickView: () => void
  setQuickViewSlug: () => void
  pdp?: boolean
  props: ISimilarViewProps
}


export default SimilarProductView1;
