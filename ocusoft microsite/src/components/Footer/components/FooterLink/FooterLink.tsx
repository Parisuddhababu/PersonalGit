import { IFooterLinkSectionProps } from "@components/Footer/components/FooterLink";
import { getUserDetails } from "@util/common";
import Link from "next/link";
import { Fragment, useEffect } from "react";

const FooterLinkSection = (props: IFooterLinkSectionProps) => {
  useEffect(() => {
    getUserDetails();
  }, [getUserDetails])

  return (
    <Fragment>
      {props?.list &&
        props.list?.map(
          (mainMenu) =>
            mainMenu?.is_show === 1 && (getUserDetails() ? (mainMenu?.menu_header_title !== "My Account") : true) && (
              <li className="footer-main-list-common" key={mainMenu?.menu_header_title}>
                <div className="list-title-wrap">
                  <span className="list-title">{mainMenu?.menu_header_title}</span>
                  <em className="osicon-cheveron-down"></em>
                </div>
                <ul className="footer-main-sublist">
                  {mainMenu?.menu_links?.map((menuLink) => (
                    <li key={menuLink.link}>
                      {menuLink.title === "About OCuSOFT" ? (
                        <a
                          href={menuLink.link}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {menuLink.title}
                        </a>
                      ) : (
                        <Link href={menuLink?.link || ""}>
                          <a>{menuLink?.title}</a>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            )
        )}
    </Fragment>
  );
};

export default FooterLinkSection;
