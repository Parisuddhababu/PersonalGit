import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import { useState } from "react";
import { IOurProductCategory1Props } from ".";
import { splitArrayInChunk } from "@util/common";
import CustomImage from "@components/CustomImage/CustomImage";
import Link from "next/link";

const IOurProductCategory2 = ({ data,dynamic_title }: IOurProductCategory1Props) => {
  const [splittedData] = useState(splitArrayInChunk(data, 9));

  return (
    <>
      <section className="our-product-category">
        <div className="container">
          <div className="heading">
            <h2>{dynamic_title?.our_product_category_title || "Our Product Category"}</h2>
          </div>
          <div className="row">
            {splittedData && splittedData[0].map((element: any, index: any) => {
              return index === 4 ? (
                <div className="d-col full-img">
                  <div className="details-wrapper">
                    <CustomImage
                      src={
                        element?.images?.home_category_wide_image?.path
                          ? element?.images?.home_category_wide_image?.path
                          : element?.home_category_wide_image?.path
                      }
                      alt={
                        element?.homecategory?.name
                          ? element?.homecategory?.name
                          : element?.name
                      }
                      title={
                        element?.homecategory?.name
                          ? element?.homecategory?.name
                          : element?.name
                      }
                      width="740px"
                      height="320px"
                    />
                    <div className="details">
                      <h3>
                        {element?.homecategory?.name
                          ? element?.homecategory?.name
                          : element?.name}
                      </h3>
                      <Link
                        href={
                          element?.homecategory?.slug
                            ? element?.homecategory?.slug
                            : element?.slug
                        }
                      >
                        <a className="btn btn-secondary">Shop Now</a>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="d-col d-col-2">
                  <div className="details-wrapper">
                    <CustomImage
                      src={
                        element?.images?.home_category_rectangle_image?.path
                          ? element?.images?.home_category_rectangle_image?.path
                          : element?.home_category_rectangle_image?.path
                      }
                      alt={
                        element?.homecategory?.name
                          ? element?.homecategory?.name
                          : element?.name
                      }
                      title={
                        element?.homecategory?.name
                          ? element?.homecategory?.name
                          : element?.name
                      }
                      width="1520"
                      height="400px"
                    />
                    <div className="details">
                      <h3>
                        {element?.homecategory?.name
                          ? element?.homecategory?.name
                          : element?.name}
                      </h3>
                      <Link
                        href={
                          element?.homecategory?.slug
                            ? element?.homecategory?.slug
                            : element?.slug
                        }
                      >
                        <a className="btn btn-secondary">Shop Now</a>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath("2", CSS_NAME_PATH.homeProductCategory)}
        />
      </Head>
    </>
  );
};

export default IOurProductCategory2;
