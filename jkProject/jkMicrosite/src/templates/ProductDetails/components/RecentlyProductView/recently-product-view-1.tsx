import { IRecentlyViewProps } from "@templates/ProductDetails/components/RecentlyProductView";
import SimilarProductView1 from "@templates/ProductDetails/components/SimilarProductView";

const RecentlyViewProduct1 = (props: IRecentlyViewProps) => {
  return (
    <>
      <SimilarProductView1
        title={"Recently Views"}
        data={props?.data}
        sectionName="recently_view"
        product_tags_detail={props?.product_tags_detail}
      />
    </>
  );
};

export default RecentlyViewProduct1;
