import { useEffect, useState } from "react";
import OurCompanyVideo from "./components/OurCompanyVideo";
import OurCompanyVideoModel from "./components/OurCompanyVideoModel";
import { ICompanyInfoItem, IOurCompanyInfo } from "src/@types/brainvire_poc";
import { uuid } from "../../utils/uuid";

const YoutubePlay = (props: IOurCompanyInfo) => {
  const [windowWidth, setWindowWidth] = useState(990);

  useEffect(() => {
    const handleResize = (): void => {
      setWindowWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return (): void => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const ourCompanyHeader = () => {
    return (
      <div className="our-company-content-header">
        <h2>{props?.title}</h2>
        {props?.description}
      </div>
    );
  };

  return (
    <section className="our-company">
      <div className="container">
        {windowWidth <= 990 && ourCompanyHeader()}
        <div className="our-company-grid">
          <div className="our-company-video">
            <div className="video-placeholder">
              <div className="video-preview">
                <div className="our-company-video-area">
                  <OurCompanyVideo VideoLink={props?.video_thumb_url} />
                </div>
              </div>
              <OurCompanyVideoModel />
            </div>
          </div>
          <div className="our-company-content">
            {windowWidth > 991 && ourCompanyHeader()}
            {props?.company_info?.length > 0 && (
              <div className="our-company-graph">
                {props?.company_info?.map((companyInfo: ICompanyInfoItem) => (
                  <div key={uuid()}>
                    <p className="count">{companyInfo?.count}</p>
                    <p className="our-compnay-graph-title">
                      {companyInfo?.title}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <div className="our-company-menu">
              {props?.other_page_links?.length > 0 && (
                <ul>
                  {props?.other_page_links?.map((link) => (
                    <li key={uuid()}>
                      <a href={link?.url}>{link?.title}</a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default YoutubePlay;
