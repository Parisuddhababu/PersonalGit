import { getComponents } from "@templates/BlogDetails/components/index";
import { IBlogDetails } from ".";
import { setDynamicDefaultStyle } from "@util/common";
import { useEffect } from "react";

const BlogDetails = (props: IBlogDetails) => {
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
          getComponents(
            props?.data?.[ele]?.type,
            ele,
            props?.data?.[ele as keyof IBlogDetails]
          )
        )}
      </main>
    </>
  );
};

export default BlogDetails;
