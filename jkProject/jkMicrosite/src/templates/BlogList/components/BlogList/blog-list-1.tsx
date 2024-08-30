import React, { useEffect, useState } from "react";
import Head from "next/head";
import {
  getTypeBasedCSSPath,
} from "@util/common";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { IBlogListData, IBlogListWithSubscribe } from "@type/Pages/blogList";
import useLoadMoreHook from "@components/Hooks/loadMore/loadMore";
import IBlogSubscribeNewsLetterSection1 from "@templates/BlogList/components/BlogSubscribeNewsLetter/blog-subscribe-news-letter-1";
import APICONFIG from "@config/api.config";
import { API_SECTION_NAME } from "@config/apiSectionName";
import APPCONFIG from "@config/app.config";
import Loader from "@components/customLoader/Loader";
import { useSelector } from "react-redux";
import BlogBox from "./blog-box";

const IBlogListSection1 = (props: IBlogListWithSubscribe) => {
  const [blogListData, setBlogListData] = useState<IBlogListData[]>(
    props?.data
  );
  const {
    loadedMoreData,
    loadMoreFunc,
    currentPage,
    showLoadMoreButton,
    setShowLoadMoreButton,
  } = useLoadMoreHook();

  const loaderData = useSelector((state) => state);

  useEffect(() => {
    if (loadedMoreData?.length !== 0) {
      setBlogListData([...blogListData, ...loadedMoreData]);
    }
    if (props?.draw === 1) {
      setShowLoadMoreButton(false);
    }
    // eslint-disable-next-line
  }, [loadedMoreData]);

  const getFormData = (funcLoadMoreOfHook: any) => {
    const formData = new FormData();
    const totalDataToget = currentPage * APPCONFIG.ANY_LIST_LENGTH;
    formData.append("start", totalDataToget.toString());
    funcLoadMoreOfHook(
      APICONFIG.GET_BLOG_LIST,
      API_SECTION_NAME.blog_list,
      formData
    );
  };

  const loadMoreFunctionCall = () => {
    getFormData(loadMoreFunc);
  };

  const postCardOfBlogList = (ele: any, index: number) => {
    return (
      <BlogBox
        ele={ele}
        key={index}
      />
    );
  };

  return (
    <>
      <Head>
        {/* <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.blog)}
        /> */}
        <link
          rel="stylesheet"
          href={
            APPCONFIG.STYLE_BASE_PATH_PAGES +
            CSS_NAME_PATH.blogList +
            ".min.css"
          }
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.blogPostCard)}
        />
      </Head>
      {/* @ts-ignore */}
      {loaderData?.loaderRootReducer?.loadingState ? (
        <Loader />
      ) : (
        <>
          <div className="d-row">
            {blogListData?.map((ele: IBlogListData, index: number) => {
              if (index === 4) {
                return (
                  <>
                    <IBlogSubscribeNewsLetterSection1 subs={props?.subs} />
                    {postCardOfBlogList(ele, index)}
                  </>
                );
              }
              return postCardOfBlogList(ele, index);
            })}
          </div>

          {showLoadMoreButton && blogListData?.length > 0 && (
            <div className="blog-list-content-footer flex-center">
              <button
                className="btn btn-primary btn-small"
                onClick={loadMoreFunctionCall}
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default IBlogListSection1;
