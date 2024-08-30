import IBlogRecenetPostSection1 from "@templates/BlogList/components/RecentPost/recent-post-1";
import { IRecentPosts } from "@type/Pages/blogList";

const IBlogDetailsRecentPostSection1 = (props: IRecentPosts) => {
  return <IBlogRecenetPostSection1 {...props} />;
};

export default IBlogDetailsRecentPostSection1;
