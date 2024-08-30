import Loader from "@components/customLoader/Loader";
import useLoadMoreHook from "@components/Hooks/loadMore";
import APICONFIG from "@config/api.config";
import { API_SECTION_NAME } from "@config/apiSectionName";
import APPCONFIG from "@config/app.config";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { IBlogListData, IBlogListWithSubscribe } from "@type/Pages/blogList";
import {
  getTypeBasedCSSPath,
} from "@util/common";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import IBlogSubscribeNewsLetterSection2 from "@templates/BlogList/components/BlogSubscribeNewsLetter/blog-subscribe-news-letter-2";
import BlogBox from "./blog-box";

const IBlogListSection2 = (props: IBlogListWithSubscribe) => {
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

  const showNewsLatter = (index: number) => {
    switch (blogListData?.length) {
      case 1:
        if (index === 0) {
          return true
        }
      case 2:
        if (index === 1) {
          return true
        }
      case 3:
        if (index === 2) {
          return true
        }
      default:
        if (index === 3) {
          return true
        }
    }
  }

  return (
    <>
      {/* @ts-ignore */}
      {loaderData?.loaderRootReducer?.loadingState ? (
        <Loader />
      ) : (
        <>
          <div className="d-row">
            {blogListData?.map((ele: IBlogListData, index: number) => {
              if (showNewsLatter(index)) {
                return (
                  <>
                    {postCardOfBlogList(ele, index)}
                    <div className="d-col">
                      <IBlogSubscribeNewsLetterSection2 />
                    </div>
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

      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(2, CSS_NAME_PATH.blogList)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(2, CSS_NAME_PATH.blogPostCard2)}
        />
      </Head>
    </>
  );
};

export default IBlogListSection2;
