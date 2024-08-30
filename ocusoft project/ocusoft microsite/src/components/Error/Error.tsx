import Head from "next/head";
import { IErrorPageprops } from ".";
import { useEffect, useState } from "react";
import { getHostnameFromRegex, getWebsiteCode } from "@util/accountCode";
import { getIsUndermaintence, getTypeBasedCSSPath } from "@util/common";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";

const ErrorPage = ({ code }: IErrorPageprops) => {

    useState<boolean>(false);
  const removeHeaderFooter = async () => {
    const url = getHostnameFromRegex(window.location.href) ?? "";
    const { accountCode } = await getWebsiteCode(url);

    if (!accountCode) {
      const removeElement = (selector: string) => {
        const element = document.querySelector(selector);
        if (element) {
          element.remove();
        }
      };

      removeElement("header");
      removeElement("footer");
    }

  };

  useEffect(() => {
    setTimeout(() => {
      removeHeaderFooter();
    }, 500)
  }, []);

  return (
    <>
      <Head>
        <title>{"Page Not Found"}</title>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.pageNotFound)}
        />
      </Head>
      <main>
        <section className="pagenotfound-404-section">
          <div className="container">
            <div className="pagenotfound-content">
              <h2>Ooooops! {code}</h2>
              {
                getIsUndermaintence() !== 'true' &&
                <figure>
                  <picture>
                    <source
                      srcSet="/assets/images/404/0404.webp"
                      type="image/webp"
                    />
                    <img
                      src="/assets/images/404/0404.png"
                      alt="404-error"
                      title="404-error"
                      height="260"
                      width="480"
                    />
                  </picture>
                </figure>
              }
              <p>{getIsUndermaintence() === 'true' ? "website under maintenance " : "Sorry! The Page Not Found!!"}</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default ErrorPage;
