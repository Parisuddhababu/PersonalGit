import { TextTruncate } from "@util/common";
import FooterLinkSection from "./components";
import { IFooterTemplateProps } from "@type/Footer";
import Link from "next/link";
import { IReduxStore } from "@type/Common/Base";
import { useSelector } from "react-redux";
import Head from "next/head";
import APPCONFIG from "@config/app.config";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";

const FooterTemplate2 = ({
  footerData,
  footerMenu,
  footerDescription,
  footerLogo,
  copyrightText,
}: IFooterTemplateProps) => {
  const phoneData = useSelector((state: IReduxStore) => state);

  const openWhatsApp = (mobileNumber: string) => {
    window.open(
      `https://api.whatsapp.com/send/?phone=${mobileNumber}&text=` +
        encodeURIComponent(phoneData?.whatsAppReducer?.whatsappFeed)
    );
  };

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={
            APPCONFIG.STYLE_BASE_PATH_COMPONENT +
            CSS_NAME_PATH.footer2 +
            ".min.css"
          }
        />
      </Head>
      <div className="footer-top">
        <div className="row">
          <div className="d-col d-col-33">
            <div className="widget company-intro-widget">
              {footerLogo?.map((item: any, index: any) => {
                return (
                  <a href="#" key={index} className="logo">
                    <img src={item?.generalconf_logo?.path} alt="logo" />
                  </a>
                );
              })}

              <p>
                {footerDescription && footerDescription?.length > 100
                  ? TextTruncate(footerDescription, 100)
                  : footerDescription}
                {footerDescription && footerDescription?.length > 100 && (
                  <Link href="/about-us">
                    <a>
                      Read More <span>{">>"}</span>
                    </a>
                  </Link>
                )}
              </p>
              <ul className="company-footer-contact-list">
                <li>
                  <i className="icon jkms2-mail1" />
                  <Link href={`mailto:${footerData?.contactus_email}`}>
                    <a>{footerData?.contactus_email}</a>
                  </Link>
                </li>
                <li>
                  <i className="icon jkms2-call" />
                  <a
                    href={`tel: ${footerData?.contactus_contact_number}`}
                  >{`${footerData?.country?.country_phone_code}  ${footerData?.contactus_contact_number}`}</a>
                </li>
              </ul>
            </div>
          </div>

          <FooterLinkSection list={footerMenu} />
        </div>
      </div>
      <div className="footer-bottom">
        <div className="row">
          <div className="d-col d-col-3">
            <div className="footer-social-group">
              <ul>
                {footerData?.social_facebook && (
                  <li>
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={footerData?.social_facebook}
                      className="icon jkms2-meta"
                    />
                  </li>
                )}
                {footerData?.social_instagram && (
                  <li>
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={footerData?.social_instagram}
                      className="icon jkms2-instagram"
                    />
                  </li>
                )}
                {footerData?.social_pinterest_link && (
                  <li>
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={footerData?.social_pinterest_link}
                      className="icon jkms2-pinterest"
                    />
                  </li>
                )}
                {footerData?.social_linkedin && (
                  <li>
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={footerData?.social_linkedin}
                      className="icon jkms2-linkedin"
                    />
                  </li>
                )}
                {footerData?.social_twitter && (
                  <li>
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={footerData?.social_twitter}
                      className="icon jkms2-twitter"
                    />
                  </li>
                )}
                {footerData?.social_tumblr_link && (
                  <li>
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={footerData?.social_tumblr_link}
                      className="icon jkms2-tumblr"
                    />
                  </li>
                )}
                {footerData?.social_whatsapp_number && (
                  <li>
                    <a
                      target="_blank"
                      rel="noreferrer"
                      onClick={() =>
                        openWhatsApp(footerData?.social_whatsapp_number)
                      }
                      className="icon jkms2-whatsapp"
                    />
                  </li>
                )}
                {footerData?.social_youtube && (
                  <li>
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={footerData?.social_youtube}
                      className="icon jkms2-youtube"
                    />
                  </li>
                )}
                {footerData?.contactus_email && (
                  <li>
                    <a
                      target="_blank"
                      href={`mailto:${footerData?.contactus_email}`}
                      rel="noreferrer"
                      className="icon jkms2-mail1"
                    />
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="d-col d-col-3">
            <div className="copyright-section">
              <p>{copyrightText}</p>
            </div>
          </div>

          {/* <div className="d-col d-col-3">
          <div className="payment-options">
            <ul>
              <li>
                <i className="icon jkms2-visa" />
              </li>
            </ul>
          </div>
        </div> */}
        </div>
      </div>
    </>
  );
};

export default FooterTemplate2;
