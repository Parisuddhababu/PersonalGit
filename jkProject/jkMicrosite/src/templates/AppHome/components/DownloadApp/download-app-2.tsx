import CustomImage from "@components/CustomImage/CustomImage";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import SafeHtml from "@lib/SafeHTML";
import { getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import Link from "next/link";
import { IDownloadApp1Props } from ".";

const DownloadApp2 = ({ data }: IDownloadApp1Props) => {
  return (
    <>
      <section className="download-app">
        <div className="container">
          <div className="row">
            <div className="d-col d-col-2 mobile-text">
              <h2>Download Our App</h2>
              <h4>
                <SafeHtml
                  removeAllTags={true}
                  html={data?.[0]?.downloadapp_description}
                />
              </h4>
              <div className="action-btn">
                <Link href={data?.[0]?.downloadapp_playstore_link || ""}>
                  <a className="btn btn-secondary">
                    <i className="jkms2-google-play"></i>Google Play
                  </a>
                </Link>
                <Link href={data?.[0]?.downloadapp_appstore_link || ""}>
                  <a className="btn btn-secondary">
                    <i className="jkms2-apple"></i>Apple Store
                  </a>
                </Link>
              </div>
            </div>
            <div className="d-col d-col-2 mb-0 mobile-device">
              <CustomImage
                src={data?.[0]?.downloadapp_landing_page_image?.path}
                height="552px"
                width="467px"
              />
            </div>
          </div>
        </div>
      </section>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath("2", CSS_NAME_PATH.homeDownloadApp2)}
        />
      </Head>
    </>
  );
};

export default DownloadApp2;
