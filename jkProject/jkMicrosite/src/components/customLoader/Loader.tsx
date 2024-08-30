import CustomImage from "@components/CustomImage/CustomImage";
import { IMAGE_PATH } from "@constant/imagepath";
import Cookies from "js-cookie";
import Head from "next/head";
import { useEffect, useState } from "react";

interface ILoaderProps {
  image?: string;
  title?: string;
}
const Loader = ({ image, title }: ILoaderProps) => {
  const [loaderMessage, setLoaderMessage] = useState(title ?? "Loading....");
  const spinner = false;
  const [loaderImg, setLoaderImg] = useState<string>()

  useEffect(() => {
    setLoaderImg(Cookies.get("loaderImg"))
    setTimeout(somethingWentWrongTimer, 60000);
  }, []);

  const somethingWentWrongTimer = () => {
    setLoaderMessage("Something Went Wrong , Please Refresh and Try Again");
  };

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={"/assets/css/common/loader.min.css"}
        />
      </Head>
      <div className="loader-wrapper">
        <div className="loader">
          {spinner ? (
            <>
              <div className="bounce1"></div>
              <div className="bounce2"></div>
              <div className="bounce3"></div>
            </>
          ) : (
            <></>
          )}
          <div className="logo">
            <CustomImage
              src={image ? image : loaderImg ?? IMAGE_PATH.favicon}
              alt={"Loading..."}
              title={"Loading..."}
              height="50px"
              width="40px"
            />
            <h4>{loaderMessage}</h4>
          </div>
        </div>
      </div>
    </>
  );
};

export default Loader;
