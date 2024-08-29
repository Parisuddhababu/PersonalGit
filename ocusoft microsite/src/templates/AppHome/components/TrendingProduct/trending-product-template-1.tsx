import BestSellerTrendingProductComponent from "@components/HomePageMiddleSection";
import { IMiddleSection } from "@type/Pages/home";

export const TrendingProductSection1 = (props: { data: IMiddleSection }) => {
  return (
    <BestSellerTrendingProductComponent
      data={props?.data}
    />
  );
};

export default TrendingProductSection1;
