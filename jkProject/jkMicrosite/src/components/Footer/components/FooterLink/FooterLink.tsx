import { IFooterLinkSectionProps } from "@components/Footer/components/FooterLink";
import Link from "next/link";


const FooterLinkSection = (props: IFooterLinkSectionProps) => {
  return (
    props?.list && (
      <div className="d-col d-col-66">
        {props?.list?.map((mainMenu, mmenuIndex: number) =>
          mainMenu?.is_show === 1 && (
            <div className="d-col d-col-4" key={mmenuIndex}>
              <div className="widget links-widget">
                <h5 className="widget-title">{mainMenu?.menu_header_title}</h5>
                <ul className="link-list">
                  {mainMenu?.menu_links?.map((menuLink, mLinkIndex: number) => (
                    <li key={mLinkIndex}>
                      <Link href={menuLink?.link || ""}><a>{menuLink?.title}</a></Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        )}
      </div>
    )
  );
};

export default FooterLinkSection;
