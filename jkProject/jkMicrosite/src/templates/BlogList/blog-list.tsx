import { getComponents } from "@templates/BlogList/components";
import { IBlogListMain } from "@templates/BlogList";
import { useEffect } from "react";
import { setDynamicDefaultStyle } from "@util/common";

const BlogList = (props: IBlogListMain) => {
  const setDynamicColour = () => {
    if (props?.default_style && props?.theme) {
      setDynamicDefaultStyle(props?.default_style, props?.theme);
    }
  };

  useEffect(() => {
    setDynamicColour();
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <main>
        {props.sequence?.map((ele) =>
          getComponents(props?.data?.[ele]?.type, ele, {
            data: props?.data?.[ele as keyof IBlogListMain],
            blogListData: props?.data?.blog_listing_and_other_details?.blog_list?.data
          })
        )}
      </main>
    </>
  );
};

export default BlogList;
