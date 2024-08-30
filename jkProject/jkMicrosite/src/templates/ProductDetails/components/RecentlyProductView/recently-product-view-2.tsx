import { IRecentlyViewProps } from "@templates/ProductDetails/components/RecentlyProductView";
import SimilarProductView2 from "@templates/ProductDetails/components/SimilarProductView/similar-product-view-2";

const RecentlyViewProduct2 = (props: IRecentlyViewProps) => {
  return (
    <>
      <SimilarProductView2
        title={"Recently Viewed Product"}
        data={props?.data}
        sectionName="recently_view"
        product_tags_detail={props?.product_tags_detail}
      />
    </>
  );
};

export default RecentlyViewProduct2;
