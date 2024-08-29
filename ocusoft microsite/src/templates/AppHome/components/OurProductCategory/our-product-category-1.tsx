import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath, IsEven, IsBrowser } from "@util/common";
import React, { useEffect, useState } from "react";
import { IOurProductCategory1Props } from "@templates/AppHome/components/OurProductCategory";
import { ICategoryData } from "@type/Pages/home";
import Head from "next/head";
import CustomImage from "@components/CustomImage/CustomImage";
import Link from "next/link";

const IOurProductCategory1 = ({
  data,
  dynamic_title,
}: IOurProductCategory1Props) => {
  const [pdata, setPData] = useState<ICategoryData[]>([]);
  const [winSize, setWinSize] = useState<number>(0);
  /**
   * Devided array into three Data array
   * @returns array of array
   */
  const splittingProductData = (list: ICategoryData[]) => {
    const chunkSize = 3;
    const tempData = [];
    for (let i = 0; i < list?.length; i += chunkSize) {
      const chunk = list.slice(i, i + chunkSize);
      tempData.push(chunk);
    }
    return tempData;
  };
  useEffect(() => {
    setPData(data?.splice(0, 9))
    if (IsBrowser) {
      window.addEventListener("resize", checkWindowReziser);
      checkWindowReziser();
    }
    return () => {
      window.removeEventListener("resize", checkWindowReziser);
    };
  }, [data]);

  // Screen Type & Size Checking
  const checkWindowReziser = () => {
    setWinSize(window.screen.width);
  };

  return (
    <>
      <Head>
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.homeProductCategory)} />
      </Head>
      <section className="our-product-category">
        <div className="container">
          <h2>{dynamic_title?.our_product_category_title || "Our Product Category"}</h2>
          <div className="row">
            {winSize >= 576
              ? splittingProductData(pdata)?.map((element, index) => {
                return IsEven(index) ? (
                  <>
                    {
                      element?.[0] &&
                      <div className="d-col d-col-2">
                        <div className="details-wrapper">
                          <CustomImage
                            src={
                              element?.[0]?.images
                                ?.home_category_rectangle_image?.path
                                || element?.[0]?.home_category_rectangle_image
                                  ?.path
                            }
                            alt={
                              element?.[0]?.homecategory?.name
                                || element?.[0]?.home_category_rectangle_image
                                  ?.name
                            }
                            title={
                              element?.[0]?.homecategory?.name
                               || element?.[0]?.home_category_rectangle_image
                                  ?.name
                            }
                            width="740px"
                            height="350px"
                          />
                          <div className="details">
                            <h3>
                              {element?.[0]?.homecategory?.name
                               || element?.[0]?.name}
                            </h3>
                            <Link
                              href={
                                element?.[0]?.homecategory?.slug
                                  || element?.[0]?.slug
                              }
                            >
                              <a className="btn btn-secondary">
                                Shop Now
                              </a>
                            </Link>
                          </div>
                        </div>
                      </div >
                    }

                    <div className="d-col d-col-2 mb-0">
                      <div className="row">
                        {
                          element?.[1] &&
                          <div className="d-col d-col-2">
                            <div className="details-wrapper">
                              <CustomImage
                                src={
                                  element?.[1]?.images
                                    ?.home_category_square_image?.path
                                    || element?.[1]?.home_category_square_image
                                      ?.path
                                }
                                alt={
                                  element?.[1]?.homecategory?.name
                                    || element?.[1]?.home_category_square_image
                                      ?.name
                                }
                                title={
                                  element?.[1]?.homecategory?.name
                                    || element?.[1]?.home_category_square_image
                                      ?.name
                                }
                                width="350px"
                                height="350px"
                              />
                              <div className="details">
                                <h3>
                                  {element?.[1]?.homecategory?.name
                                    || element?.[1]?.name}
                                </h3>
                                <Link
                                  href={
                                    element?.[1]?.homecategory?.slug
                                      || element?.[1]?.slug
                                  }
                                >
                                  <a className="btn btn-secondary">
                                    Shop Now
                                  </a>
                                </Link>
                              </div>
                            </div>
                          </div>
                        }

                        {
                          element?.[2] &&
                          <div className="d-col d-col-2">
                            <div className="details-wrapper">
                              <CustomImage
                                src={
                                  element?.[2]?.images
                                    ?.home_category_square_image?.path
                                    || element?.[2]?.home_category_square_image
                                      ?.path
                                }
                                alt={
                                  element?.[2]?.homecategory?.name
                                   || element?.[2]?.home_category_square_image
                                      ?.name
                                }
                                title={
                                  element?.[2]?.homecategory?.name
                                    || element?.[2]?.home_category_square_image
                                      ?.name
                                }
                                width="350px"
                                height="350px"
                              />
                              <div className="details">
                                <h3>
                                  {element?.[2]?.homecategory?.name
                                    || element?.[2]?.name}
                                </h3>
                                <Link
                                  href={
                                    element?.[2]?.homecategory?.slug
                                      || element?.[2]?.slug
                                  }
                                >
                                  <a className="btn btn-secondary">
                                    Shop Now
                                  </a>
                                </Link>
                              </div>
                            </div>
                          </div>
                        }

                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="d-col d-col-2 mb-0">
                      <div className="row">
                        {
                          element?.[0] &&
                          <div className="d-col d-col-2">
                            <div className="details-wrapper">
                              <CustomImage
                                src={
                                  element?.[0]?.images
                                    ?.home_category_square_image?.path
                                    || element?.[0]?.home_category_square_image
                                      ?.path
                                }
                                alt={
                                  element?.[0]?.homecategory?.name
                                    || element?.[0]?.home_category_square_image
                                      ?.name
                                }
                                title={
                                  element?.[0]?.homecategory?.name
                                    || element?.[0]?.home_category_square_image
                                      ?.name
                                }
                                width="350px"
                                height="350px"
                              />
                              <div className="details">
                                <h3>{element?.[0]?.homecategory?.name}</h3>
                                <Link
                                  href={
                                    element?.[0]?.homecategory?.slug
                                      || element?.[0]?.slug
                                  }
                                >
                                  <a className="btn btn-secondary">
                                    Shop Now
                                  </a>
                                </Link>
                              </div>
                            </div>
                          </div>
                        }

                        {
                          element?.[1] &&
                          <div className="d-col d-col-2">
                            <div className="details-wrapper">
                              <CustomImage
                                src={
                                  element?.[1]?.images
                                    ?.home_category_square_image?.path
                                    || element?.[1]?.home_category_square_image
                                      ?.path
                                }
                                alt={
                                  element?.[1]?.homecategory?.name
                                    || element?.[1]?.home_category_square_image
                                      ?.name
                                }
                                title={
                                  element?.[1]?.homecategory?.name
                                    || element?.[1]?.home_category_square_image
                                      ?.name
                                }
                                width="350px"
                                height="350px"
                              />
                              <div className="details">
                                <h3>
                                  {element?.[1]?.homecategory?.name
                                    || element?.[1]?.name}
                                </h3>
                                <Link
                                  href={
                                    element?.[1]?.homecategory?.slug
                                      || element?.[1]?.slug
                                  }
                                >
                                  <a className="btn btn-secondary">
                                    Shop Now
                                  </a>
                                </Link>
                              </div>
                            </div>
                          </div>
                        }

                      </div>
                    </div>
                    {
                      element?.[2] &&
                      <div className="d-col d-col-2">
                        <div className="details-wrapper">
                          <CustomImage
                            src={
                              element?.[2]?.images
                                ?.home_category_rectangle_image?.path
                                || element?.[2]?.home_category_rectangle_image
                                  ?.path
                            }
                            alt={element?.[2]?.homecategory?.name || element?.[2]?.home_category_rectangle_image?.name}
                            title={ element?.[2]?.homecategory?.name || element?.[2]?.home_category_rectangle_image?.name}
                            width="740px"
                            height="350px"
                          />
                          <div className="details">
                            <h3>
                              {element?.[2]?.homecategory?.name
                                || element?.[2]?.name}
                            </h3>
                            <Link
                              href={
                                element?.[2]?.homecategory?.slug
                                || element?.[2]?.slug
                              }
                            >
                              <a className="btn btn-secondary">
                                Shop Now
                              </a>
                            </Link>
                          </div>
                        </div>
                      </div>
                    }

                  </>
                );
              })
              : pdata?.map((element) => {
                return (
                  <>
                    <div className="d-col d-col-2 mb-0">
                      <div className="details-wrapper">
                        <CustomImage
                          src={
                            element?.images?.home_category_square_image?.path
                              || element?.home_category_square_image?.path
                          }
                          alt={
                            element?.homecategory?.name
                             || element?.home_category_square_image?.name
                          }
                          title={
                            element?.homecategory?.name
                              || element?.home_category_square_image?.name
                          }
                          width="350px"
                          height="350px"
                        />
                        <div className="details">
                          <h3>
                            {element?.homecategory?.name
                              || element?.name}
                          </h3>
                          <Link
                            href={
                              element?.homecategory?.slug
                                || element?.slug
                            }
                          >
                            <a className="btn btn-secondary">
                              Shop Now
                            </a>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}
            { }
          </div>
        </div>
      </section >
    </>
  );
};

export default IOurProductCategory1;
