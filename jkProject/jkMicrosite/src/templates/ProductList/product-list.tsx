import React, { useEffect, useState } from "react";
import { getComponents } from "@templates/ProductList/components";
import {
  IProductBannerProps,
  IProductBannerReq,
  IProductListProps,
} from "@templates/ProductList/index";
import { useRouter } from "next/router";
import pagesServices from "@services/pages.services";
import APICONFIG from "@config/api.config";
import { staticSectionNameProps } from "@type/Common/staticSectionName";
import { API_SECTION_NAME } from "@config/apiSectionName";
import Head from "next/head";
import APPCONFIG from "@config/app.config";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";

const ProductList = ({ domainName, slugInfo }: IProductListProps) => {
  const [bannerData, setBannerData] = useState<IProductBannerProps>({
    image: "",
    mobileImage: "",
    title: "",
    description: "",
  });
  const [productSequence, setProductSequence] = useState<string[]>([]);
  const [templateSectionTypes, setTempalteSectionTypes] =
    useState<staticSectionNameProps>({
      category_banner: 1,
      product_list_with_filter_options: 1,
    });
  const router = useRouter();
  const { slug, query, param1, param2 } = router.query;
  const [url, setURL] = useState<string>(
    `${slug}/${query}/${param1}/${param2}`
  );

  const getProductBannerDetails = async () => {
    let obj: IProductBannerReq = {};
    if (param2) {
      obj["sub_category"] = `${slug}/${query}/${param1}/${param2}`;
    } else if (param1) {
      obj["category"] = `${slug}/${query}/${param1}`;
    } else if (query) {
      obj["category_type"] = `${slug}/${query}`;
    }
    await pagesServices
      .postPage(APICONFIG.PRODUCT_BANNER_IMAGE, obj)
      .then((result) => {
        if (result.meta && result.status_code == 200) {
          if (param2) {
            setBannerData({
              image:
                result?.data?.sub_category_banner?.[0]?.desktop_image?.path,
              mobileImage:
                result?.data?.sub_category_banner?.[0]?.mobile_image?.path,
              title: result?.data?.sub_category_banner?.[0]?.tag_line,
              description: result?.data?.sub_category_banner?.[0]?.tag_line,
            });
          } else if (param1) {
            setBannerData({
              image: result?.data?.category_banner?.[0]?.desktop_image?.path,
              mobileImage:
                result?.data?.category_banner?.[0]?.mobile_image?.path,
              title: result?.data?.category_banner?.[0]?.tag_line,
              description: result?.data?.category_banner?.[0]?.tag_line,
            });
          } else if (query) {
            setBannerData({
              image:
                result?.data?.category_type_banner?.[0]?.desktop_image?.path,
              mobileImage:
                result?.data?.category_type_banner?.[0]?.mobile_image?.path,
              title: result?.data?.category_type_banner?.[0]?.tag_line,
              description: result?.data?.category_type_banner?.[0]?.tag_line,
            });
          }
          setProductSequence(result?.sequence);
          setTempalteSectionTypes({
            category_banner: result?.data?.type,
            product_list_with_filter_options:
              result?.data?.product_template_type,
          });
        }
      });
  };

  useEffect(() => {
    getProductBannerDetails();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (url !== `${slug}/${query}/${param1}/${param2}`) {
      getProductBannerDetails();
      setURL(`${slug}/${query}/${param1}/${param2}`);
    }
    // eslint-disable-next-line
  }, [router.asPath]);


  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={
            APPCONFIG.STYLE_BASE_PATH_PAGES +
            CSS_NAME_PATH.productListMain +
            ".min.css"
          }
        />
        {/* <link
          rel="stylesheet"
          href={
            APPCONFIG.STYLE_BASE_PATH_PAGES +
            CSS_NAME_PATH.productListMain +
            ".min.css"
          }
        /> */}
        {/* <title>{slugInfo?.slug_info?.slug_detail?.meta_title ? slugInfo?.slug_info?.slug_detail?.meta_title : domainName}</title> */}
      </Head>
      <main>
        {productSequence?.map((ele) =>
          getComponents(
            // @ts-ignore
            templateSectionTypes?.[ele] as string,
            ele,
            ele === API_SECTION_NAME.category_banner
              ? {
                image: bannerData?.image,
                mobileImage: bannerData?.mobileImage,
                title: bannerData?.title,
                description: bannerData?.description,
              }
              : {},
            domainName,
            slugInfo
          )
        )}
      </main>
    </>
  );
};

export default ProductList;
