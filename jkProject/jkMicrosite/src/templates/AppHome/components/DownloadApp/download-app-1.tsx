import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath } from "@util/common";
import React from "react";
import { IDownloadApp1Props } from "@templates/AppHome/components/DownloadApp";
import Head from "next/head";
import CustomImage from "@components/CustomImage/CustomImage";
import SafeHtml from "@lib/SafeHTML";
import Link from "next/link";

const DownloadApp1 = ({ data }: IDownloadApp1Props) => {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.homeDownloadApp)}
        />
      </Head>
      <section className="download-app">
        {data?.map((ele, eInd) => (
          <div key={eInd} className="container">
            <div className="row">
              <div className="d-col d-col-2 mb-0 mobile-device">
                <CustomImage
                  src={ele?.downloadapp_landing_page_image?.path}
                  alt={ele?.downloadapp_landing_page_image?.name}
                  title={ele?.downloadapp_landing_page_image?.name}
                  width="467px"
                  height="552px"
                />
              </div>
              <div className="d-col d-col-2 mobile-text">
                <h2>{ele?.downloadapp_title}</h2>
                <h3 className="h4">
                  {" "}
                  <SafeHtml
                    removeAllTags={true}
                    html={ele.downloadapp_description}
                  />
                </h3>
                {ele?.downloadapp_playstore_link ||
                  (ele?.downloadapp_appstore_link && (
                    <div className="action-btn">
                      {ele?.downloadapp_playstore_link && (
                        <Link href={ele?.downloadapp_playstore_link || ""}>
                          <a className="btn btn-secondary">
                            <i className="jkm-google-play" />
                            Google Play
                          </a>
                        </Link>
                      )}
                      {ele?.downloadapp_appstore_link && (
                        <Link href={ele?.downloadapp_appstore_link || ""}>
                          <a className="btn btn-secondary">
                            <i className="jkm-apple" />
                            Apple Store
                          </a>
                        </Link>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </section>
    </>
  );
};

export default DownloadApp1;
