import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { ICareerList, ICarrerListData } from "@type/Pages/career";
import {
  converDateMMDDYYYY,
  getTypeBasedCSSPath,
  TextTruncate,
} from "@util/common";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { IJobSearchBarValues } from "@templates/Career/components/careerList/index";
import pagesServices from "@services/pages.services";
import APICONFIG from "@config/api.config";
import SafeHtml from "@lib/SafeHTML";
import useLoadMoreHook from "@components/Hooks/loadMore";
import APPCONFIG from "@config/app.config";
import { API_SECTION_NAME } from "@config/apiSectionName";
import Modal from "@components/Modal";
import SocialShare from "@components/SocialShare/SocialShare";
import CareerApplication from "@templates/Career/components/CareerApplication/CareerApplication";

const CareerListSection1 = (props: ICareerList) => {
  const [jobSearchBarValue, setJobSearchBarValues] =
    useState<IJobSearchBarValues>();
  const [carrerListData, setCarrerListData] = useState<ICarrerListData[]>([]);
  const [filter, setFilter] = useState({
    start: 0,
    title: "",
    location: "",
    length: APPCONFIG.ANY_LIST_LENGTH,
  });
  const [modal, setModal] = useState<boolean>(false);
  const [careerModal, setCareerModal] = useState<boolean>(false);
  const [careerId, setCareerId] = useState<string>('')
  const {
    loadedMoreData,
    loadMoreFunc,
    currentPage,
    showLoadMoreButton,
    setShowLoadMoreButton,
  } = useLoadMoreHook();

  useEffect(() => {
    setCarrerListData(props?.data)
  }, [props?.data]);

  useEffect(() => {
    getJobLocationAndTitleData();
  }, []);

  useEffect(() => {
    if (loadedMoreData?.length !== 0) {
      setCarrerListData([...carrerListData, ...loadedMoreData]);
    }
    if (props?.draw === 1) {
      setShowLoadMoreButton(false);
    }
    // eslint-disable-next-line
  }, [loadedMoreData]);

  const getJobLocationAndTitleData = () => {
    pagesServices
      .getPage(APICONFIG.CAREERPAGE_TITLE_LOCATION_API, {})
      .then((Response) => {
        setJobSearchBarValues(Response.data);
      })
      .catch((error) => error);
  };
  const maxCharCount = 350;

  const readMoreChange = (id: string, action: boolean) => {
    if (carrerListData.length >= 0) {
      const index = carrerListData.findIndex((ele) => ele._id === id);
      if (index !== -1) {
        carrerListData[index].showMore = action;
        setCarrerListData([...carrerListData]);
      }
    }
  };

  const getFormData = (funcLoadMoreOfHook: any) => {
    const totalDataToget = currentPage * APPCONFIG.ANY_LIST_LENGTH;
    const object = {
      start: totalDataToget,
    };
    funcLoadMoreOfHook(
      APICONFIG.GET_CAREEER_DATA,
      API_SECTION_NAME.career_list,
      object,
      APPCONFIG.API_METHOD_NAME_FOR_LOADMOREHOOK
    );
  };

  const searchData = () => {
    pagesServices
      .getPage(APICONFIG.GET_CAREEER_DATA, filter)
      .then((resp) => {
        if (resp) {
          setCarrerListData(resp?.data?.career_list?.data);
        }
      })
      .catch((err) => err);
  };

  useEffect(() => { }, [jobSearchBarValue]);

  const onChangeOfDropDownTitle = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter({ ...filter, title: e.target.value });
  };

  const onChangeOfDropDownLocation = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter({ ...filter, location: e.target.value });
  };

  const loadMoreFunctionCall = () => {
    getFormData(loadMoreFunc);
  };

  const toggleModal = () => {
    setModal(!modal);
  };

  const toggleModalCareer = () => {
    setCareerModal(!careerModal)
  }

  const onClickApply = (ele: ICarrerListData) => {
    setCareerId(ele?._id)
    toggleModalCareer()
  }

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.careerLoadMore)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.careerlist)}
        />

        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.popupBoxDesign)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.careerApplicationPopUp)}
        />
      </Head>

      <section className="career-details">
        <div className="container">
          <div className="career-filter">
            <form>
              <div className="flex-wrapper">
                <div className="form-group">
                  <label>What</label>
                  <select
                    className="form-control custom-select"
                    onChange={onChangeOfDropDownTitle}
                  >
                    {jobSearchBarValue?.jobTitle?.map((ele) => (
                      <option key={ele}>{ele}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Where</label>
                  <select
                    className="form-control custom-select"
                    onChange={onChangeOfDropDownLocation}
                  >
                    {jobSearchBarValue?.jobLocation?.map((ele) => (
                      <option key={ele}>{ele}</option>
                    ))}
                  </select>
                </div>
                <div className="form-button-action">
                  <button
                    type="button"
                    value="Search"
                    className="btn btn-secondary btn-small"
                    onClick={searchData}
                  >
                    Search
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
      <section className="career-wrapper">
        <div className="container">
          {carrerListData?.map((ele) => (
            <>
              <div className="career-description">
                <div className="career-description-left">
                  <h4>{ele.title}</h4>
                  {ele?.description?.length > maxCharCount && !ele?.showMore ? (
                    <>
                      <SafeHtml
                        html={TextTruncate(ele?.description, maxCharCount)}
                      />
                      <a
                        className="read-more"
                        onClick={() => readMoreChange(ele?._id, true)}
                      >
                        <span>Read More</span>{" "}
                        <i className="jkm-arrow-down"></i>
                      </a>
                    </>
                  ) : ele?.showMore &&
                    ele?.description?.length < maxCharCount ? (
                    <SafeHtml html={ele?.description} />
                  ) : (
                    <></>
                  )}
                  {ele?.showMore ? (
                    <>
                      <SafeHtml html={ele?.description} />
                      <a
                        className="read-more less"
                        onClick={() => readMoreChange(ele?._id, false)}
                      >
                        <span>Read Less</span>{" "}
                        <i className="jkm-arrow-down"></i>
                      </a>
                    </>
                  ) : null}
                </div>
                <div className="career-description-right">
                  <ul>
                    <li className="d-flex action-li">
                      <a
                        // link={`mailto:support@jewellerskart.com?subject=${ele?.title}`}
                        // target="_blank"
                        className="btn btn-primary btn-small"
                        onClick={() => onClickApply(ele)}
                      >
                        Apply
                      </a>

                      <a
                        onClick={toggleModal}
                        className="btn btn-secondary btn-icon btn-share"
                      >
                        <i className="jkm-share"></i>
                      </a>
                    </li>
                    <li>
                      <i className="jkm-briefcase"></i>{" "}
                      <span>
                        Min Exp: {ele.min_exp}. - Max Exp: {ele.max_exp} Yrs.
                      </span>
                    </li>
                    <li>
                      <i className="jkm-calendar"></i>{" "}
                      <span>{converDateMMDDYYYY(ele.created_at)}</span>
                    </li>
                    <li>
                      <i className="jkm-contact-location"></i>{" "}
                      <span>{ele.location}</span>
                    </li>
                    <li>
                      <i className="jkm-time"></i> <span>{ele.type}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </>
          ))}
        </div>

        {showLoadMoreButton && (
          <div className="flex-center load-more">
            <button
              className="btn btn-primary btn-small"
              onClick={loadMoreFunctionCall}
            >
              Load More
            </button>
          </div>
        )}

        {modal ? (
          <Modal
            open={modal}
            onClose={toggleModal}
            dimmer={false}
            headerName="Social Share"
          >
            <div className="modal-content">
              <SocialShare type={1} pageName={"career"} />
            </div>
          </Modal>
        ) : null}
        {careerModal ? (
          <Modal
            className="book-appointment-popup"
            open={true}
            onClose={toggleModalCareer}
            dimmer={false}
            headerName="Career Application"
          >
            <CareerApplication toggleModal={toggleModalCareer} careerId={careerId} />
          </Modal>
        ) : null}
      </section>
    </>
  );
};

export default CareerListSection1;
