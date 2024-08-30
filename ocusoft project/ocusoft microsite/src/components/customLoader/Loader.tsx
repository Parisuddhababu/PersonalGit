import React, { Fragment, useEffect, useState } from "react"
import CustomImage from "@components/CustomImage/CustomImage"
import Head from "next/head"
import { getTypeBasedCSSPath } from "@util/common"
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant"
import { useSelector } from "react-redux"
import { ReducerState } from "@type/Redux"
import { IMAGE_PATH } from "@constant/imagepath"
import Cookies from "js-cookie"

const Loader = () => {
  const { loadingState } = useSelector((state: ReducerState) => state.loaderRootReducer)
  const [loaderImg, setLoaderImg] = useState<string>()

  useEffect(() => {
    if (Cookies.get("loaderImg")) {
      setLoaderImg(Cookies.get("loaderImg"))
    }
  }, []);

  return (
    <Fragment>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.loader)}
        />
      </Head>
      {
        loadingState &&
        <div className="loader-wrapper">
          <div className="loader">
            <div className="logo">
              <CustomImage
                src={loaderImg || IMAGE_PATH.defaultLoaderImage}
                alt={"Loading..."}
                title={"Loading..."}
                height="50px"
                width="40px"
              />
            </div>
          </div>
        </div>
      }
    </Fragment>
  );
};

export default Loader
