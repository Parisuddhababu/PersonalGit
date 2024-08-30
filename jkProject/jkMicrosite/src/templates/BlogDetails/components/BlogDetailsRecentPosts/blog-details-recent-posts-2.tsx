import IBlogRecenetPostSection2 from "@templates/BlogList/components/RecentPost/recent-post-2";
import { IRecentPosts } from "@type/Pages/blogList";

const IBlogDetailsRecentPostSection2 = (props: IRecentPosts) => {
  return <IBlogRecenetPostSection2 {...props} />;
};

export default IBlogDetailsRecentPostSection2;
