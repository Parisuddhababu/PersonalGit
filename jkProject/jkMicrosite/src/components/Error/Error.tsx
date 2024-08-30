import Head from "next/head";
import Link from "next/link";
import { IMAGE_PATH } from "@constant/imagepath";
import CustomImage from "@components/CustomImage/CustomImage";
import { IErrorPageprops } from ".";
import { useEffect, useState } from "react";
import { getHostnameFromRegex, getWebsiteCode } from "@util/accountCode";

const ErrorPage = ({ code, message, domainName}: IErrorPageprops) => {
  const [removeHeaderFooterData, setRemoveHeaderFooterData] =
    useState<boolean>(false);
  const removeHeaderFooter = async () => {
    const url = getHostnameFromRegex(window.location.href) || "";
    const { accountCode } = await getWebsiteCode(url);
    if (accountCode === "" || accountCode === undefined) {
      setRemoveHeaderFooterData(true);
      const header = document.querySelector("header");
      if (header) {
        header.remove();
      }
      const footer = document.querySelector("footer");
      if (footer) {
        footer.remove();
      }
    }
  };

  useEffect(() => {
    setTimeout(() => {
      removeHeaderFooter();
    }, 500)
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <main>
        <section className="error404">
          <div className="container">
            <div className="error404-content">
              <h2>Ooooops! {code}</h2>
              <div className="image">
                <CustomImage
                  src={IMAGE_PATH.notFoundPageWebp}
                  alt={"Not Found Page"}
                  title={"Not Found Page"}
                  height="145px"
                  width="406px"
                />
              </div>
              <p>{message ? message : "Sorry! The Page Not Found!!"}</p>
              {!removeHeaderFooterData && (
                <Link href="/" as="/">
                  <button type="button" className="btn btn-secondary btn-small">
                    Go to Home
                  </button>
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>
      <Head>
        {/* <link rel="stylesheet" href="/assets/css/error.min.css" /> */}
        <link rel="stylesheet" href="/assets/css/pages/404.min.css" />
        <title>{domainName ? domainName : "Page Not Found"}</title>
      </Head>
    </>
  );
};

export default ErrorPage;
