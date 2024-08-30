import { IRecentlyViewProps } from "@templates/ProductDetails/components/RecentlyProductView";
import SimilarProductView2 from "../SimilarProductView/similar-product-view-2";

const ProductSetView2 = (props: IRecentlyViewProps) => {
  return (
    <>
      <SimilarProductView2
        sectionName="product_set"
        title="Product Sets"
        data={props?.data}
        product_tags_detail={props?.product_tags_detail}
      />
    </>
  );
};

export default ProductSetView2;
