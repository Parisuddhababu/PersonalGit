import React, { useState, useEffect } from 'react'
import Head from "next/head";
import { getTypeBasedCSSPath } from "@util/common";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import CustomImage from "@components/CustomImage/CustomImage";
import { ICustomise, IcustomDesignStepsData } from "@type/Pages/customiseDesign";

const CustomiseSteps1 = (props: ICustomise) => {
    const [ListData] = useState<IcustomDesignStepsData[]>(props?.custom_design_steps?.data?.original?.data)
    const bannerData = props?.custome_design_banner[0]?.banner_image?.path
    useEffect(() => {
        const bannerImageElement = document.getElementById('bannerImage');
        if (bannerData && bannerImageElement) {
            bannerImageElement.style.backgroundImage = `url(${bannerData})`;
        }
    }, [bannerData]);

    return (
        <>
            <Head>
                <link
                    rel="stylesheet"
                    href={getTypeBasedCSSPath(null, CSS_NAME_PATH.customiseDesignStepper)}
                />
                <link
                    rel="stylesheet"
                    href={getTypeBasedCSSPath(null, CSS_NAME_PATH.customiseDesignTitle)}
                />
                <link
                    rel="stylesheet"
                    href={getTypeBasedCSSPath(null, CSS_NAME_PATH.customiseFileUpload)}
                />
                <link
                    rel="stylesheet"
                    href={getTypeBasedCSSPath(null, CSS_NAME_PATH.customiseFileContact)}
                />
            </Head>
            <section className="heading-sec">
                <div className="container">
                    <div className="heading-title-wrap">
                        <h2 className="heading-title">Customise Design</h2>
                    </div>
                </div>
            </section>
            <section className="customise-design-stepper-sec">
                <div className="container">
                    <div className="customise-design-stepper-wrap  stepper-wrap" id="bannerImage">
                        <div className="stepper-content-container">
                            {
                                ListData.map((ele, eInd) => (
                                    <div className="stepper-content-col" key={eInd}>

                                        <div className="stepper-content-img">
                                            <CustomImage
                                                src={ele?.image?.path}
                                                height="340"
                                                width="480"
                                            // pictureClassName="jkm-diamond-icon stepper-icons"
                                            />
                                        </div>
                                        <div className="stepper-content-info">
                                            <h4 className="step-count">{ele?.title}</h4>
                                            <p className="step-para">{ele?.description}</p>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default CustomiseSteps1
