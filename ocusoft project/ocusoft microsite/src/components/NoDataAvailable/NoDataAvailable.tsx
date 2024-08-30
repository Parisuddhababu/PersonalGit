import React from "react";
import { INoDataAvailableProps } from "@components/NoDataAvailable";
import Head from "next/head";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath } from "@util/common";
import { useSelector } from "react-redux";

function NoDataAvailable({ message, image, title, children, isSuccess }: INoDataAvailableProps) {
  const data = useSelector((state: any) => state);
  return (
    <>
      <Head>
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.emailVerify)} />
      </Head>
      <section className="email-verify-section">
        <div className="container">
          <div className="email-verify-content">
            {
              data?.whatsAppReducer?.logo?.path?.length > 0 &&
              <figure>
                <picture>
                  <source srcSet={data?.whatsAppReducer?.logo?.path} type="image/webp" />
                  <img
                    src={data?.whatsAppReducer?.logo?.path}
                    alt="logo-image"
                    title="logo-image"
                    height="140"
                    width="260"
                  />
                </picture>
              </figure>
            }

            <div className="verified-text">
              <h3>{title}</h3>
              <h2>{message}</h2>
              {
                isSuccess &&
                <em className="osicon-tick-circle"></em>
              }
            </div>
            <div>
              {children}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default NoDataAvailable;
