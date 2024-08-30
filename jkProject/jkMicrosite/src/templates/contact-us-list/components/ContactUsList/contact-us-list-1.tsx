import React from "react";
import { IContactUsListProps } from ".";

const ContactUsList1 = ({ data }: IContactUsListProps) => {
  return (
    <>
      <div className="container">
        <div className="banner-contact-wrap jk-card">
          <div className="d-row">
            <div className="d-col d-col-3">
              <div className="contact-box">
                <i className="jkm-contact-call"></i>
                <div className="contact-text">
                  <a href={`tel:${data?.contactus_contact_number}`}>
                    {data?.country?.country_phone_code}{" "}
                    {data?.contactus_contact_number}
                  </a>
                </div>
              </div>
            </div>
            <div className="d-col d-col-3">
              <div className="contact-box">
                <i className="jkm-contact-mail"></i>
                <div className="contact-text">
                  <a href={`mailto:${data?.contactus_email}`}>
                    {data?.contactus_email}
                  </a>
                </div>
              </div>
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
