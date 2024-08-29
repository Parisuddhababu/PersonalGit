import { getComponents } from "@templates/AboutUs/components";
import { API_SECTION_NAME } from "@config/apiSectionName";
import { setDynamicDefaultStyle } from "@util/common";
import { useEffect } from "react";
import { IAboutUs } from "@templates/AboutUs";

const AboutUs = (props: IAboutUs) => {
  const setDynamicColour = () => {
    if (props?.default_style && props?.theme) {
      setDynamicDefaultStyle(props?.default_style, props?.theme);
    }
  };

  useEffect(() => {
    setDynamicColour();
  }, []);

  return (
    <>
      <main>
        {props?.sequence?.map((ele) =>
          {
            if(ele === API_SECTION_NAME.aboutus_banner){
            return getComponents(props?.data?.aboutus_banner_type, ele, {
              data: props?.data?.[ele]?.[0],
            })
          }else{
            return getComponents(
              props?.data?.[ele]?.type,
              ele,
              ele === API_SECTION_NAME.owner_messages 
                ? {
                  data: props?.data?.[ele]?.data,
                  type: props?.data?.[ele]?.type,
                }
                : {
                  data: props?.data?.[ele],
                }
            )
          }
          }
        )}
      </main>
    </>
  );
};

export default AboutUs;
