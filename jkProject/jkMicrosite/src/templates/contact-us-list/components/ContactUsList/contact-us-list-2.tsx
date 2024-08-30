import React from "react";
import { IContactUsListProps } from "@templates/contact-us-list/components/ContactUsList";
import Head from "next/head";
import { getTypeBasedCSSPath } from "@util/common";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import APPCONFIG from "@config/app.config";

const ContactUsList2 = ({ data }: IContactUsListProps) => {
    return (
        <>
            <Head>
                <link
                    rel="stylesheet"
                    href={getTypeBasedCSSPath("2", CSS_NAME_PATH.contactForm)}
                />
                <link
                    rel="stylesheet"
                    href={
                        APPCONFIG.STYLE_BASE_PATH_COMPONENT +
                        CSS_NAME_PATH.toasterDesign +
                        ".css"
                    }
                />
            </Head>

            <div className="d-col left-side">
                <div className="box">
                    <h3>{"Let's Get in Touch"}</h3>
                    <div className="banner-contact-wrap">
                        <div className="contact-box mb-50">
                            <a href="/"><i className="jkms2-contact-location"></i></a>
                            <div className="contact-text ">
                                <h5>Head Office</h5>
                                <address>
                                    {data?.address_title}
                                    <p>{data?.address_line1}</p>
                                    <p>{data?.address_line2}</p>
                                </address>
                                {/* <h5>Head Office</h5>
                                        Margaret Joseph <br> P.O. Box 508 3919 Gravida St. <br> Tamuning Washington 55797 */}
                            </div>
                        </div>

                        <div className="contact-box mb-50">
                            <a href="/"><i className="jkms2-contact-mail"></i></a>
                            <div className="contact-text">

                                <h5>Email</h5>
                                <a href={`mailto:${data?.contactus_email}`}>
                                    {data?.contactus_email}
                                </a>                                    </div>
                        </div>

                        <div className="contact-box">
                            <a href="/"><i className="jkms2-contact-call"></i></a>
                            <div className="contact-text">
                                <h5>Contact</h5>
                                <a href={`tel:${data?.contactus_contact_number}`}>
                                    {data?.country?.country_phone_code}{" "}
                                    {data?.contactus_contact_number}
                                </a>                                    </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContactUsList2;
