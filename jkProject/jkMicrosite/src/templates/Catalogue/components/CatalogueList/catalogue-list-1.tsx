import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath } from "@util/common";

import Head from "next/head";
import { ICatalogueListProps } from "@templates/Catalogue/components/CatalogueList";
import FeatureFooter1 from "@templates/AppHome/components/FeatureFooter";
import CustomImage from "@components/CustomImage/CustomImage";
import { ICatalogueListData } from "@type/Pages/catalogue";
import { useRouter } from "next/router";

const CatalogueList1 = ({ data }: ICatalogueListProps) => {
  const router = useRouter();

  const downloadCatalogue = (val: ICatalogueListData) => {
    var link = document.createElement("a");
    link.href = val?.pdf?.path;
    link.download = "file.pdf";
    link.target = "blank";
    link.dispatchEvent(new MouseEvent("click"));
  };

  return (
    <>
      {data?.map((val, index) => {
        return (
          <section className={`brand-1`} key={index}>
            <div className="container">
              <div className="d-row">
                {index % 2 === 0 ? (
                  <>
                    <div className="d-col d-col-66 mb-0">
                      <div className="brand_image">
                        <CustomImage
                          src={val?.collection_image?.path}
                          alt={"catalogue"}
                          title={"catalogue"}
                          width="996px"
                          height="471px"
                        />
                      </div>
                    </div>
                    <div className="d-col d-col-33">
                      <div className="catalog-content">
                        <h2>{val?.title}</h2>
                        <p>{val?.description}</p>
                        <div className="actions">
                          <button
                            type="button"
                            className="btn btn-secondary btn-medium"
                            onClick={() => downloadCatalogue(val)}
                          >
                            Download Catalogue
                          </button>
                          {val.is_custom_product !== 1 && <button
                            type="button"
                            className="btn btn-secondary btn-small"
                            onClick={() =>
                              router.push(`catalogue/${val?.catalog_slug}`)
                            }
                          >
                            View Products
                          </button>}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="d-col d-col-33">
                      <div className="catalog-content">
                        <h2>{val?.title}</h2>
                        <p>{val?.description}</p>
                        <div className="actions">
                          <button
                            type="button"
                            className="btn btn-secondary btn-medium"
                            onClick={() => downloadCatalogue(val)}
                          >
                            Download Catalogue
                          </button>
                          {val.is_custom_product !== 1 && <button
                            type="button"
                            className="btn btn-secondary btn-small"
                            onClick={() =>
                              router.push(`catalogue/${val?.catalog_slug}`)
                            }
                          >
                            View Products
                          </button>}
                        </div>
                      </div>
                    </div>
                    <div className="d-col d-col-66 mb-0">
                      <div className="brand_image">
                        <CustomImage
                          src={val?.collection_image?.path}
                          alt={"catalogue"}
                          title={"catalogue"}
                          width="996px"
                          height="471px"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>
        );
      })}
      {/* <section className="brand-1">
        <div className="container">
          <div className="d-row">
            <div className="d-col d-col-66 mb-0">
              <div className="brand_image">
                <CustomImage
                  src={IMAGE_PATH.aboutUsStoryFrontJpg}
                  alt={"about us"}
                  title={"about us"}
                  width="996px" height="471px" 
                />
              </div>
            </div>
            <div className="d-col d-col-33">
              <div className="catalog-content">
                <h2>Lorem Ipsum is simply dummy text</h2>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry</p>
                <div className="actions">
                  <button type="button" className="btn btn-secondary btn-medium" >Download Catalogue</button>
                  <button type="button" className="btn btn-secondary btn-small">View Products</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}
      {/* <!--Features Section--> */}
      <FeatureFooter1 />{" "}
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.brandOdd)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.brandEven)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.simpleFeature)}
        />
      </Head>
    </>
  );
};

export default CatalogueList1;
