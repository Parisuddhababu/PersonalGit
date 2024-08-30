import { IRecentlyViewProps } from "@templates/ProductDetails/components/RecentlyProductView";
import SimilarProductView2 from "../SimilarProductView/similar-product-view-2";

const ProductPairView2 = (props: IRecentlyViewProps) => {
  return (
    <>
      <SimilarProductView2
        sectionName="product_match_set"
        title="Products Pair"
        data={props?.data}
        product_tags_detail={props?.product_tags_detail}
      />
    </>
  );
};

export default ProductPairView2;
