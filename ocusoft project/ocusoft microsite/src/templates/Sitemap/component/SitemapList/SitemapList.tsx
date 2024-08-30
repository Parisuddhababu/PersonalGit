import Wrapper from "@components/Wrapper";
import { StaticRoutes } from "@config/staticurl.config";
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
          {props?.data?.footer_menus?.map((fm) => (
            <div className="category-box col-4" key={fm.menu_header_title}>
              <div className="main-cat-label">
                <Link href={StaticRoutes.home}>
                  <a>{fm.menu_header_title} </a>
                </Link>
              </div>
              <div className="subcat-box">
                <ul>
                  {fm?.menu_links?.map((ml) => (
                    <li key={ml.link}>
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
                <Link href={StaticRoutes.home}>
                  <a>Shop Online</a>
                </Link>
              </div>
              <div className="group-subcat">
                {props?.data?.header_menus?.map((hm) => (
                  <ul key={hm.url}>
                    <li key={hm.url}>
                      <Link href={`/${hm?.url}`}>
                        <a className="cat-label">{hm?.name}</a>
                      </Link>
                    </li>
                    {hm?.parent_category?.map((pac) => (
                      <li key={pac.url}>
                        <Link href={`/${pac?.url}`}>
                          <a>{pac?.name} </a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
              <div className="inner-subcat-box">
                {props?.data?.header_menus?.map((head) => (
                  <Wrapper key={head.url}>
                    {head?.parent_category?.map((pac) => (
                      <div className="inner-box" key={pac.url}>
                        <div className="main-cat-label">
                          <Link href={`/${pac?.url}`}>
                            <a>{pac?.name}</a>
                          </Link>
                        </div>
                        <div className="inner-box-wrapper">
                          <ul>
                            {pac?.child_category?.map((ccc) => (
                              <li key={ccc.url}>
                                <Link href={`/${ccc?.url}`}>
                                  <a>{ccc?.name}</a>
                                </Link>
                              </li>
                            ))}
                          </ul>
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
                <Link href={StaticRoutes.home}>
                  <a>Our Solutions</a>
                </Link>
              </div>
              <div className="subcat-box">
                <ul>
                  {props?.data?.other_menus?.map((om) => (
                    <li key={om.url}>
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
                <Link href={StaticRoutes.home}>
                  <a>Other Menu </a>
                </Link>
              </div>
              <div className="subcat-box">
                <ul>
                  {props?.data?.other_menus?.map((om) => (
                    <li key={om.url}>
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
