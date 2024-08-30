import Head from "next/head";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import APPCONFIG from "@config/app.config";
import { ICatalogueList } from "@templates/Catalogue";
import { setDynamicDefaultStyle } from "@util/common";
import { useEffect } from "react";
import { getComponents } from "@templates/Catalogue/components";

const CatalogueList = (props: ICatalogueList) => {
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
        {props?.sequence?.map((ele) =>
          getComponents(props?.data?.[ele]?.type, ele,
            ele === 'catalogue_list' ? {
              data: props?.data?.[ele]?.original?.data,
            } :
            {
              data: props?.data?.[ele]
            })
        )}
      </main>
      <Head>
        <link
          rel="stylesheet"
          href={
            APPCONFIG.STYLE_BASE_PATH_PAGES + CSS_NAME_PATH.catalogue + ".min.css"
          }
        />
      </Head>
    </>
  );
};

export default CatalogueList;
