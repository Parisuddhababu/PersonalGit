import React from "react";
import { IContactUsListProps } from "@templates/contact-us-list/components/ContactUsList/index";
import { useSelector } from "react-redux";
import { RootState } from "src/redux/rootReducers";

const ContactUsList1 = ({ data }: IContactUsListProps) => {
  const { whatsAppReducer: { email, mobileNumber, countryCode } } = useSelector((state: RootState) => state);
  return (
    <>
      <div className="container">
        <div className="banner-contact-wrap jk-card">
          <div className="d-row">
            <div className="d-col d-col-3">
              {mobileNumber && countryCode && <div className="contact-box">
                <i className="jkm-contact-call"></i>
                <div className="contact-text">
                  <a href={`tel:${mobileNumber}`}>
                    {countryCode}{" "}
                    {mobileNumber}
                  </a>
                </div>
              </div>}
            </div>
            <div className="d-col d-col-3">
              {email && <div className="contact-box">
                <i className="jkm-contact-mail"></i>
                <div className="contact-text">
                  <a href={`mailto:${email}`}>
                    {email}
                  </a>
                </div>
              </div>}
            </div>
            <div className="d-col d-col-3">
              <div className="contact-box">
                <i className="jkm-contact-location"></i>
                <div className="contact-text">
                  <address>
                    {data?.address_title}
                    <p>{data?.address_line1}</p>
                    <p>{data?.address_line2}</p>
                  </address>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUsList1;
