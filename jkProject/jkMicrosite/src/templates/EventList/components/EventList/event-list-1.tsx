import React, { useEffect, useState } from "react";
import CustomImage from "@components/CustomImage/CustomImage";
import pagesServices from "@services/pages.services";
import APICONFIG from "@config/api.config";
import useLoadMoreHook from "@components/Hooks/loadMore";
import APPCONFIG from "@config/app.config";
import { API_SECTION_NAME } from "@config/apiSectionName";
import NoDataAvailable from "@components/NoDataAvailable/NoDataAvailable";
import Head from "next/head";
import { getTypeBasedCSSPath } from "@util/common";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { IEventListDetails } from "@templates/EventList/components/EventList";
import Link from "next/link";

const IEventListSection1 = (props: IEventListDetails) => {
  const callPastEvent = () => {
    const formData = new FormData();
    formData.append("is_past", "0");

    pagesServices
      .postPage(APICONFIG.GET_EVENT_LIST, formData)
      .then((result) => {
        setPastEventListData(result?.data);
      })
      .catch((err) => err);
  };

  const [eventListData, setEventListData] = useState<any[]>([]);
  const [pastEventlistData, setPastEventListData] = useState();
  const [selectedValues, setSelectedValues] = useState("");
  const {
    loadedMoreData,
    loadMoreFunc,
    currentPage,
    showLoadMoreButton,
    setCurrentPage,
    setShowLoadMoreButton,
    checkForLoadMoreButtonAtInitialLoad,
  } = useLoadMoreHook();

  useEffect(() => {
    callPastEvent();
    setEventListData(props?.data?.data ?? []);
  }, [props?.data?.data])

  useEffect(() => {
    if (loadedMoreData?.length !== 0) {
      setEventListData([...eventListData, ...loadedMoreData]);
    }
    checkForLoadMoreButtonAtInitialLoad(props?.data?.draw);
    // eslint-disable-next-line
  }, [loadedMoreData]);

  const callDropDownFunc = (e: any) => {
    setCurrentPage(1);
    setShowLoadMoreButton(true);
    setSelectedValues(e?.target?.value);
    callPostApiOfEvent(e?.target?.value);
  };

  const callPostApiOfEvent = (value: string) => {
    if (value === "Past Events") {
      // @ts-ignore
      if (pastEventlistData?.event_list?.draw === 1) {
        setShowLoadMoreButton(false);
      }
      // @ts-ignore
      setEventListData(pastEventlistData?.event_list?.data);
    } else {
      setEventListData(props?.data?.data);
    }
  };

  const getFormData = (funcLoadMoreOfHook: any) => {
    const formData = new FormData();
    const totalDataToget = currentPage * APPCONFIG.ANY_LIST_LENGTH;
    formData.append("start", totalDataToget.toString());
    if (selectedValues === "Past Events") {
      formData.append("is_past", "0");
    } else {
      formData.append("is_past", "1");
    }

    funcLoadMoreOfHook(
      APICONFIG.GET_EVENT_LIST,
      API_SECTION_NAME.event_list,
      formData
    );
  };

  const loadMoreFunction = () => {
    getFormData(loadMoreFunc);
  };

  return (
    <>
      <section className="page-title">
        <div className="container dropdown">
          <h2> Events </h2>
          <select
            className="form-control custom-select"
            onChange={(e) => callDropDownFunc(e)}
          >
            <option>Upcoming Events</option>
            <option>Past Events</option>
          </select>
        </div>
      </section>

      {eventListData?.length === 0 || eventListData === undefined ? (
        <NoDataAvailable title="No Events Found..!!">
          <Link href="/">
            <a className="btn btn-secondary btn-small">Go to Home</a>
          </Link>
        </NoDataAvailable>
      ) : (
        <section className="event-wrapper">
          <div className="container">
            <div className="mb-0 event_list">
              <div className="d-row">
                {eventListData?.length !== 0 &&
                  eventListData?.map((ele, eInd) => (
                    <div key={eInd} className="d-col d-col-3 just-center">
                      <div className="post-card">
                        <div className="post-image">
                          <CustomImage
                            src={ele?.cover_image?.path}
                            height="340px"
                            width="480px"
                          />
                        </div>

                        <div className="post-card-body">
                          <h4 className="post-card-title">
                            <Link href={`/event/${ele?._id}`}>
                              {ele?.title}
                            </Link>
                          </h4>
                          <div className="post-card-category-info">
                            <div className="date">
                              <i className="jkm-calendar mr-10"></i>
                              {ele.start_date}
                            </div>
                            <div className="map">
                              <i className="jkm-contact-location mr-10"></i>
                              {ele.location_details}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {(showLoadMoreButton && eventListData?.length > 0) && (eventListData?.length > 9) && (
                <div className="blog-list-content-footer flex-center">
                  <button
                    className="btn btn-primary btn-small"
                    onClick={loadMoreFunction}
                  >
                    Load More
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
      <Head>
        <link rel="stylesheet" href={APPCONFIG.STYLE_BASE_PATH_PAGES + CSS_NAME_PATH.eventList + ".min.css"} />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.eventPostCard)}
        />
      </Head>
    </>
  );
};

export default IEventListSection1;
