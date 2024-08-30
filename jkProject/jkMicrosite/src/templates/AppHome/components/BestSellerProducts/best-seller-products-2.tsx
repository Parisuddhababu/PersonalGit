import BestSellerTrendingProductComponent from "@components/BestSellerTrendingProductCommonComponent";

export const BestSellerProductsSection2 = (props: any) => {
  return (
    <BestSellerTrendingProductComponent
      data={props?.data}
      title={"Best Seller Products"}
      product_tags_detail={props?.product_tags_detail}
    />
  );
};

export default BestSellerProductsSection2;
