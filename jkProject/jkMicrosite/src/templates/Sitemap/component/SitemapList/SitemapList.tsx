import Wrapper from "@components/Wrapper";
import { ISiteMapMenuProps } from "@templates/Sitemap/component/SitemapList";

import Link from "next/link";

const SiteMapList = (props: ISiteMapMenuProps) => {
  return (
    <div className="sitemap-wrapper">
      <div className="container">
        <div className="sitemap-heading">
          <h2 className="h3">Sitemap</h2>
        </div>

        <div className="sitemap-group-link-section">
          {props?.data?.footer_menus?.map((fm,fIndex) => (
            <div className="category-box col-4" key={fIndex}>
              <div className="main-cat-label">
                <Link href="/">
                  <a>{fm.menu_header_title} </a>
                </Link>
              </div>
              <div className="subcat-box">
                <ul>
                  {fm?.menu_links?.map((ml,mIndex) => (
                    <li key={mIndex}>
                      <Link href={ml?.link}>
                        <a>{ml?.title}</a>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}

          {props?.data?.header_menus?.length > 0 ? (
            <div className="category-box">
              <div className="main-cat-label">
                <Link href="/">
                  <a>Shop Online</a>
                </Link>
              </div>
              <div className="group-subcat">
                {props?.data?.header_menus?.map((hm,hmIndex) => (
                  <ul key={hmIndex}>
                    <li key={hmIndex}>
                      <Link href={`/${hm?.url}`}>
                        <a className="cat-label">{hm?.name}</a>
                      </Link>
                    </li>
                    {hm?.parent_category?.map((pac, pacIndex) => (
                      <li key={pacIndex}>
                        <Link href={`/${pac?.url}`}>
                          <a>{pac?.name} </a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
              <div className="inner-subcat-box">
                {props?.data?.header_menus?.map((head,hIndex) => (
                  <Wrapper key={hIndex}>
                    {head?.parent_category?.map((pac, pacInd) => (
                      <div className="inner-box" key={pacInd}>
                        <div className="main-cat-label">
                          <Link href={`/${pac?.url}`}>
                            <a>{pac?.name}</a>
                          </Link>
                        </div>
                        <div className="inner-box-wrapper">
                          <ul>
                            {pac?.child_category?.map((ccc,ccIndex) => (
                              <li key={ccIndex}>
                                <Link href={`/${ccc?.url}`}>
                                  <a>{ccc?.name}</a>
                                </Link>
                              </li>
                            ))}
                          </ul>
                          {/* <ul>
                            <li>
                              <a href="#" className="cat-label">
                                Shop By Metal & Stone
                              </a>
                            </li>
                            <li>
                              <a href="#">Rose Gold</a>
                            </li>
                            <li>
                              <a href="#">Diamond</a>
                            </li>
                          </ul> */}
                          {/* <ul>
                            <li>
                              <a href="#" className="cat-label">
                                Shop By
                              </a>
                            </li>
                            <li>
                              <a href="#">For Men</a>
                            </li>
                            <li>
                              <a href="#">For Women</a>
                            </li>
                          </ul> */}
                        </div>
                      </div>
                    ))}
                  </Wrapper>
                ))}
              </div>
            </div>
          ) : (
            <></>
          )}

          {props?.data?.our_solution?.length > 0 ? (
            <div className="category-box col-4">
              <div className="main-cat-label">
                <Link href="/">
                  <a>Our Solutions</a>
                </Link>
              </div>
              <div className="subcat-box">
                <ul>
                  {props?.data?.other_menus?.map((om,omIndex) => (
                    <li key={omIndex}>
                      <Link href={`/${om?.url}`}>
                        <a>{om?.name}</a>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <></>
          )}

          {props?.data?.other_menus?.length > 0 ? (
            <div className="category-box col-4">
              <div className="main-cat-label">
                <Link href="/">
                  <a>Other Menu </a>
                </Link>
              </div>
              <div className="subcat-box">
                <ul>
                  {props?.data?.other_menus?.map((om,oIndex) => (
                    <li key={oIndex}>
                      <Link href={`/${om?.url}`}>
                        <a>{om?.name} </a>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default SiteMapList;
