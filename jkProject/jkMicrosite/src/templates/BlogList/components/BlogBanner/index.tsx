import IBlogBannerSection1 from "@templates/BlogList/components/BlogBanner/blog-banner-1";
import { IBlogBanner, IBlogListData } from "@type/Pages/blogList";
export interface IBlogBannerProps {
    data: IbannerData
    blogListData: IBlogListData
  }

interface IbannerData {
  banner : IBlogBanner[];
}
export default IBlogBannerSection1;
