import { IRecentlyViewProps } from "@templates/ProductDetails/components/RecentlyProductView";
import SimilarProductView1 from "../SimilarProductView";

const ProductSetView = (props: IRecentlyViewProps) => {
  return (
    <>
      <SimilarProductView1
        sectionName="product_set"
        title="Product Sets"
        data={props?.data}
        product_tags_detail={props?.product_tags_detail}
      />
    </>
  );
};

export default ProductSetView;
