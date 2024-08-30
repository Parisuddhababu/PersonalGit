import IBlogTagsSection1 from "@templates/BlogList/components/BlogTags";
import { IBlogTags } from "@type/Pages/blogList";

const IBlogDetailsTagsSection1 = (props: IBlogTags) => {
  return <IBlogTagsSection1 {...props} />;
};

export default IBlogDetailsTagsSection1;
