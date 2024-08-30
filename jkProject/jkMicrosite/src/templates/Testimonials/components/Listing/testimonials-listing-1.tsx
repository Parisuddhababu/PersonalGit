import React, { useState, useEffect } from "react";
import Head from "next/head";
import { getTypeBasedCSSPath } from "@util/common";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import CustomImage from "@components/CustomImage/CustomImage";
import { ITestimonials, ITestimonialsListData } from "@type/Pages/testimonials";
import useLoadMoreHook from "@components/Hooks/loadMore/loadMore";
import APPCONFIG from "@config/app.config";
import APICONFIG from "@config/api.config";
import { API_SECTION_NAME } from "@config/apiSectionName";
import Loader from "@components/customLoader/Loader";
import { useSelector } from "react-redux";

const TestimonialsListing1 = (props: ITestimonials) => {
  const [ListData, setListData] = useState<ITestimonialsListData[]>(props?.other_testimonials?.data);
  const { loadedMoreData, loadMoreFunc, currentPage, showLoadMoreButton, setShowLoadMoreButton } = useLoadMoreHook();

  const loadMoreFunctionCall = () => {
    getFormData(loadMoreFunc);
  };
  const loaderData = useSelector((state) => state);

  const getFormData = async (funcLoadMoreOfHook: any) => {
    const formData = new FormData();
    const totalDataToget = currentPage * APPCONFIG.ANY_LIST_LENGTH;
    formData.append("start", totalDataToget.toString());
    funcLoadMoreOfHook(APICONFIG.GET_TESTIMONIAL_LIST, API_SECTION_NAME.testimonial_list, formData);
  };

  useEffect(() => {
    if (loadedMoreData?.length !== 0) {
      setListData([...ListData, ...loadedMoreData]);
    }
    if (props?.other_testimonials.draw === 1) {
      setShowLoadMoreButton(false);
    }
    // eslint-disable-next-line
  }, [loadedMoreData]);

  return (
    <>
      <Head>
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.testimonailList)} />
        <link
          rel="stylesheet"
          href={
            APPCONFIG.STYLE_BASE_PATH_COMPONENT +
            CSS_NAME_PATH.footer +
            ".min.css"
          }
        />
      </Head>
      {/* @ts-ignore */}
      {loaderData?.loaderRootReducer?.loadingState && <Loader />}
      <section className="testimonials-sec">
        <div className="container">
          <div className="testimonial-wrap">
            <div className="d-row">
              {ListData?.map((ele, eInd) => (
                <div className="d-col d-col-3" key={eInd}>
                  <div className="testimonial-content">
                    <CustomImage src={ele?.image?.path} height="94" width="94" pictureClassName="testimonial-img" />
                    <h4 className="testimonial-title title-effet">{ele?.name}</h4>
                    <p className="testimonial-para">{ele?.details}</p>
                    <i className="jkm-quote1 testimonial-icon"></i>
                  </div>
                </div>
              ))}
            </div>

            {(showLoadMoreButton && ListData?.length > 0) && (
              <button className="btn btn-primary btn-small" onClick={loadMoreFunctionCall}>
                Load More
              </button>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default TestimonialsListing1;
