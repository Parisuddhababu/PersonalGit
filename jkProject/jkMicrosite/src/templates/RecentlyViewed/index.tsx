import RecentlyViewed from "@templates/RecentlyViewed/recentlyViewed";
import { IBaseTemplateProps } from "@templates/index";
import { IRecentlyViewd } from "@type/Pages/recentlyView";

export interface IRecentlyViewedListMain extends IBaseTemplateProps, IRecentlyViewd {}

export default RecentlyViewed;
