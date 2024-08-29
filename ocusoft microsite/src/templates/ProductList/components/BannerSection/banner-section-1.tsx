import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { ProductListProps } from "@templates/ProductList";
import { getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import Link from "next/link";

const IBannerSection1 = (props: ProductListProps) => {
  const banner = props.breadCrumbData?.[props.breadCrumbData?.length - 1]
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.bannerWithBreadcrumb)}
        />
        <title>{banner?.title || 'Products'}</title>
      </Head>
      <section className="banner-with-breadcrumb banner-section">
        <figure className="banner-with-breadcrumb-bg-img">
          <picture>
            {
              banner?.image != undefined &&
              <source
                srcSet={banner?.image}
                type="image/webp"
              />
            }
            {
              banner?.image != undefined && <img
                src={banner?.image}
                alt={banner?.title}
                title={banner?.title}
                height="350"
                width="1920"
              />
            }

          </picture>
        </figure>
        <div className="container">
          <div className="banner-with-breadcrumb-content">
            <h1>{banner?.title}</h1>
            <ul className="breadcrumb">
              <li>
                <Link href='/'>
                  <a aria-label="home-page-link">
                    <em className="osicon-home"></em>
                  </a>
                </Link>
              </li>
              {
                props.breadCrumbData.map((i, key: number) => (
                  key === props.breadCrumbData?.length - 1 ?
                    <li key={i.slug}>
                      <a>{i?.title}</a>
                    </li>
                    : <li key={i.slug}>
                      <Link href={i?.slug}>
                        <a>{i?.title}</a>
                      </Link>
                    </li>
                ))
              }
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};

export default IBannerSection1;
