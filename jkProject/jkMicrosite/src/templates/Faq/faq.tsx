import Head from "next/head";
// import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import APPCONFIG from "@config/app.config";
import { IFaqList } from "@templates/Faq/index";
import { setDynamicDefaultStyle } from "@util/common";
import { useEffect } from "react";
import { getComponents } from "@templates/Faq/components/FaqList";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";

const Faq = (props: IFaqList) => {
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
      <Head>
        <link
          rel="stylesheet"
          href={
            APPCONFIG.STYLE_BASE_PATH_PAGES + CSS_NAME_PATH.faq + ".min.css"
          }
        />
        {/* <link
          rel="stylesheet"
          href={
            APPCONFIG.STYLE_BASE_PATH_PAGES + 'faq-2' + ".min.css"
          }
        /> */}
      </Head>
      <main>
        {props.sequence?.map((ele) =>
          getComponents(
            props?.data?.[ele as keyof IFaqList]?.type,
            ele,
            props?.data?.[ele as keyof IFaqList]
          )
        )}
      </main>
    </>
  );
};

export default Faq;
