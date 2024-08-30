import CustomImage from "@components/CustomImage/CustomImage";
import useLoadMoreHook from "@components/Hooks/loadMore";
import NoDataAvailable from "@components/NoDataAvailable/NoDataAvailable";
import APICONFIG from "@config/api.config";
import { API_SECTION_NAME } from "@config/apiSectionName";
import APPCONFIG from "@config/app.config";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import pagesServices from "@services/pages.services";
import { IEventList } from "@type/Pages/eventList";
import { converDateMMDDYYYY, getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

const EventListSection2 = (props: IEventList) => {
  const callPastEvent = () => {
    const formData = {
      "is_past": '0'
    };

    pagesServices
      .postPage(APICONFIG.GET_EVENT_LIST, formData)
      .then((result) => {
        setPastEventListData(result?.data);
        if (result?.data?.currentPage * APPCONFIG.ANY_LIST_LENGTH >= result?.data?.recordsTotal) {
          setShowLoadMoreButton(false);
        }
      })
      .catch((err) => err);
  };
  const [eventListData, setEventListData] = useState(props?.data?.data ?? []);
  const [pastEventlistData, setPastEventListData] = useState(callPastEvent);
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
      if (pastEventlistData.event_list?.draw === 1) {
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
      {/* @ts-ignore */}
      {eventListData?.length === 0 || eventListData?.data?.data?.length === 0 ? (
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
                {eventListData?.length > 0 &&
                  eventListData?.map((ele, index) => (
                    <div
                      key={"t2_event_list" + index}
                      className="d-col d-col-3 just-center"
                    >
                      <div className="post-card">
                        <div className="post-image">
                          <CustomImage
                            src={ele?.cover_image?.path}
                            height="340px"
                            width="480px"
                          />
                          <div className="date">
                            <i className="jkms2-calendar mr-10"></i>
                            {converDateMMDDYYYY(ele.start_date)}
                          </div>
                        </div>
                        <div className="post-card-body">
                          <h4 className="post-card-title">
                            <Link href={`/event/${ele?._id}`}>
                              <a>{ele?.title}</a>
                            </Link>
                          </h4>
                          <div className="post-card-category-info">
                            <div className="map">
                              <i className="jkms2-contact-location mr-10"></i>
                              {ele.location_details}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              {(showLoadMoreButton && eventListData?.length > 0 && props?.data?.recordsTotal !== 0) && (eventListData?.length > 9) && (
                <div className="blog-list-content-footer">
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
        <link rel="stylesheet" href={APPCONFIG.STYLE_BASE_PATH_COMPONENT + CSS_NAME_PATH.eventList2 + ".min.css"} />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath("2", CSS_NAME_PATH.eventPostCard)}
        />
      </Head>
    </>
  );
};

export default EventListSection2;
