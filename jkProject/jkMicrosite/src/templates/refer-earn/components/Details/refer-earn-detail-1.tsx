import Head from "next/head";
import React, { useState } from "react";
import Modal from "@components/Modal";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath, getUserDetails } from "@util/common";
import { IReferEarnDetailProps } from '.'
import InviteLinkPopup from "@templates/refer-earn/components/InviteLinkPopup";
import SafeHtml from "@lib/SafeHTML";
import CustomImage from "@components/CustomImage/CustomImage";
import FeatureFooter1 from "@templates/AppHome/components/FeatureFooter";
import APPCONFIG from "@config/app.config";
import useCurrencySymbol from "@components/Hooks/currencySymbol/useCurrencySymbol";
import usePriceDisplay from "@components/Hooks/priceDisplay";


const ReferEarnDetail1 = ({ data }: IReferEarnDetailProps) => {
    const [modal, setModal] = useState<boolean>(false);
    const currencySymbol = useCurrencySymbol();
    const { isPriceDisplay } = usePriceDisplay();
    const [activeClassName,setActiveClassName] = useState({
        Section1:"stepper-content-col",
        Section2:"stepper-content-col",
        Section3:"stepper-content-col",
        Section4:"stepper-content-col"
    })

    const toggleModal = () => {
        setModal(!modal);
    };

    const activeClassSet = (e: any) => {
      switch (e?.taret?.id) {
        case [e?.target?.id]:
            setActiveClassName({...activeClassName,[e?.target?.id]:"stepper-content-col active"})
          break;
        default:
            setActiveClassName({...activeClassName,[e?.target?.id]:"stepper-content-col active"})
          break;
      }
    };


    return (
        <>
            <Head>
                <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.stepperWithBgImage)} />
                <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.simpleFeature)} />
                <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.modal)} />
                <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.yourReferralCodePopup)} />
                <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.getInviteLinkPopup)} />
                <link
                rel="stylesheet"
                href={
                    APPCONFIG.STYLE_BASE_PATH_COMPONENT +
                    CSS_NAME_PATH.toasterDesign +
                    ".min.css"
                }
            />
            </Head>

            <>
                <section className="reward-section">
                    <div className="container">

                        <div className="reward-content">
                            <h2>{data?.title}</h2>
                            {
                              getUserDetails() || (!getUserDetails() && isPriceDisplay) ?
                              <>
                              <p>Give your friends a reward {currencySymbol} {data?.you_get_discount}off coupon when they make a purchase from your invite link.</p>
                              <button type="button" className="btn btn-secondary btn-big">You also earn {currencySymbol} {data?.you_get_discount} off coupon.</button>
                              </>
                              : <></>
                            }
                            <h2>How it works?</h2>
                            <div className="seperator"></div>
                            <div className="stepper-content-container">

                                <div className={activeClassName?.Section1} id="Section1" onMouseOver={(e)=>activeClassSet(e)} onMouseOut={()=>setActiveClassName({...activeClassName,"Section1":"stepper-content-col"})}>
                                    <div className="stepper-content-img ">
                                        <CustomImage
                                            src={data?.step1_image?.path}
                                            alt={"Refer and Earn"}
                                            title={"Refer and Earn"}
                                            height="500px"
                                            width="1920px"
                                        />
                                    </div>
                                    <div className="stepper-content-info">
                                        <h3 className="step-count">{data?.step1_title}</h3>
                                        <p className="step-para">{data?.step1_description}</p>
                                    </div>
                                </div>
                                <div  className={activeClassName?.Section2} id="Section2" onMouseOver={(e)=>activeClassSet(e)} onMouseOut={()=>setActiveClassName({...activeClassName,"Section2":"stepper-content-col"})}>
                                    <div className="stepper-content-img">
                                        <CustomImage
                                            src={data?.step2_image?.path}
                                            alt={"Refer and Earn"}
                                            title={"Refer and Earn"}
                                            height="500px"
                                            width="1920px"
                                        />
                                    </div>
                                    <div className="stepper-content-info">
                                        <h3 className="step-count">{data?.step2_title}</h3>
                                        <p className="step-para">{data?.step2_description}</p>
                                    </div>
                                </div>
                                <div  className={activeClassName?.Section3} id="Section3" onMouseOver={(e)=>activeClassSet(e)} onMouseOut={()=>setActiveClassName({...activeClassName,"Section3":"stepper-content-col"})}>
                                    <div className="stepper-content-img">
                                        <CustomImage
                                            src={data?.step3_image?.path}
                                            alt={"Refer and Earn"}
                                            title={"Refer and Earn"}
                                            height="500px"
                                            width="1920px"
                                        />
                                    </div>
                                    <div className="stepper-content-info">
                                        <h3 className="step-count">{data?.step3_title}</h3>
                                        <p className="step-para">{data?.step3_description}</p>
                                    </div>
                                </div>
                                <div  className={activeClassName?.Section4} id="Section4" onMouseOver={(e)=>activeClassSet(e)} onMouseOut={()=>setActiveClassName({...activeClassName,"Section4":"stepper-content-col"})}>
                                    <div className="stepper-content-img">
                                        <CustomImage
                                            src={data?.step4_image?.path}
                                            alt={"Refer and Earn"}
                                            title={"Refer and Earn"}
                                            height="500px"
                                            width="1920px"
                                        />
                                    </div>
                                    <div className="stepper-content-info">
                                        <h3 className="step-count">{data?.step4_title}</h3>
                                        <p className="step-para">{data?.step4_description}</p>
                                    </div>
                                </div>
                            </div>
                            <button type="button" className="btn btn-secondary btn-small" onClick={toggleModal}>Get Invite Link</button>
                        </div>

                    </div>
                </section>

                <section className="terms-and-conditon-section">
                    <div className="container">
                        <div className="condition-content">
                            <h4>Terms & Conditions</h4>
                            <SafeHtml html={data?.terms_and_conditions} />

                        </div>
                    </div>
                </section>
                {/* <!--Features Section--> */}
                <FeatureFooter1 />
            </>


            {modal ? (
                <Modal className={modal ? `get-invite-link-popup` : ''} headerName="Become a Member" open={modal} onClose={toggleModal} dimmer={false}>
                    <InviteLinkPopup toggleModal={toggleModal}  referData={data} />
                </Modal>
            ) : null}
        </>
    );
};

export default ReferEarnDetail1;
