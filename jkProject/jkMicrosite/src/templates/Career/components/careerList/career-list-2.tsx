import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { ICareerList, ICarrerListData } from "@type/Pages/career";
import {
    TextTruncate,
    converDateMMDDYYYY,
    getTypeBasedCSSPath,
} from "@util/common";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { IJobSearchBarValues } from "@templates/Career/components/careerList/index";
import pagesServices from "@services/pages.services";
import APICONFIG from "@config/api.config";
import useLoadMoreHook from "@components/Hooks/loadMore";
import APPCONFIG from "@config/app.config";
import { API_SECTION_NAME } from "@config/apiSectionName";
import Modal from "@components/Modal";
import SocialShare from "@components/SocialShare/SocialShare";
import CareerApplication from "@templates/Career/components/CareerApplication/CareerApplication";

const CareerListSection2 = (props: ICareerList) => {
    const [jobSearchBarValue, setJobSearchBarValues] =
        useState<IJobSearchBarValues>();
    const [carrerListData, setCarrerListData] = useState<ICarrerListData[]>(
        props?.data
    );
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
                    href={getTypeBasedCSSPath(2, CSS_NAME_PATH.careerLoadMore2)}
                />
                <link
                    rel="stylesheet"
                    href={getTypeBasedCSSPath(2, CSS_NAME_PATH.careerlist2)}
                />

                <link
                    rel="stylesheet"
                    href={getTypeBasedCSSPath(null, CSS_NAME_PATH.popupBoxDesign)}
                />

                <link
                    rel="stylesheet"
                    href={getTypeBasedCSSPath(null, CSS_NAME_PATH.bookAppointmentPopup)}
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
                                    <button type="button" value="Search" onClick={searchData} className="btn btn-secondary btn-small">
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
                            <div className={ele.showMore ? "full-description active" : "career-description"}>
                                <h4>{ele.title}</h4>
                                <div className="top">
                                    <ul>
                                        <li><i className="jkms2-briefcase"></i>
                                            <span>Min Exp: {ele.min_exp}. - Max Exp: {ele.max_exp} Yrs.</span></li>
                                        <li><i className="jkms2-calendar"></i>
                                            <span>{converDateMMDDYYYY(ele.created_at)}</span>
                                        </li>
                                        <li><i className="jkms2-contact-location"></i>
                                            <span>{ele.location}</span>
                                        </li>
                                        <li>
                                            <i className="jkms2-time"></i><span>{ele.type}</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="seperator"></div>
                                <div className="bottom">
                                    {(ele.description?.length > maxCharCount && !ele.showMore) ?

                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: TextTruncate(ele?.description, maxCharCount),
                                            }}
                                        ></div> : <div
                                            dangerouslySetInnerHTML={{
                                                __html: ele?.description,
                                            }}
                                        ></div>}
                                    {/* {(ele.description?.length > maxCharCount && !ele.showMore) ?
                                    <SafeHtml
                                        html={TextTruncate(ele?.description, maxCharCount)}
                                    /> : <SafeHtml html={ele?.description} />} */}

                                    {/* <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to
                                make a type specimen book.</p> */}
                                </div>
                                <div className="actions">
                                    {(ele.description?.length > maxCharCount && !ele.showMore) &&
                                        <button className="btn btn-secondary btn-small" onClick={() => readMoreChange(ele?._id, true)}>Read More</button>}
                                    {(ele.description?.length > maxCharCount && ele.showMore) &&
                                        <button className="btn btn-secondary btn-small" onClick={() => readMoreChange(ele?._id, false)}>Read Less</button>

                                    }
                                    <div className="share">
                                        <button type="button" className="btn btn-primary btn-small" onClick={() => onClickApply(ele)}>Apply</button>
                                        <a className="btn btn-secondary btn-icon btn-share" onClick={toggleModal}>
                                            <i className="jkms2-share"></i>
                                        </a>
                                    </div>
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
                            <SocialShare
                                ulClassName="product-social-media"
                                spanClassName="social-icon-link"
                                type={2}
                            />
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

export default CareerListSection2;
