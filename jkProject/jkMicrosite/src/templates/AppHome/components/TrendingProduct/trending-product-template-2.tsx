import BestSellerTrendingProductComponent, { IBestSellerTrendingProductProps } from "@components/BestSellerTrendingProductCommonComponent";

export const TrendingProductSection2 = (props: IBestSellerTrendingProductProps) => {
  return (
    <BestSellerTrendingProductComponent
      data={props?.data}
      title={"Trending Products"}
      product_tags_detail={props?.product_tags_detail}
    />
  );
};

export default TrendingProductSection2;
