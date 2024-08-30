import { IRecentlyViewProps } from "@templates/ProductDetails/components/RecentlyProductView";
import SimilarProductView1 from "../SimilarProductView";

const ProductPairView = (props: IRecentlyViewProps) => {
  return (
    <>
      <SimilarProductView1
        sectionName="product_match_set"
        title="Products Pair"
        data={props?.data}
        product_tags_detail={props?.product_tags_detail}
      />
    </>
  );
};

export default ProductPairView;
