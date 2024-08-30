import React, { useState, MouseEvent, useEffect } from "react";
import { useSelector } from "react-redux";

import { IReduxStore } from "@type/Common/Base";
import { isEmpty } from "@util/common";

const WhatsAppInquire = () => {
    const reduxData = useSelector((state: IReduxStore) => state);
    const [phone, setPhone] = useState('');

    useEffect(() => {
        const _phone = reduxData?.whatsAppReducer?.whatsAppNumber ?? '';
        setPhone(_phone);
    }, [reduxData]);

    const isMobileOrTablet = () => {
        return /(android|iphone|ipad|mobile)/i.test(navigator.userAgent);
    };

    const openWhatsAppWeb = (e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault();

        if (!isEmpty(phone)) {
            window.open(
                "https://"
                + (isMobileOrTablet() ? "api" : "web")
                + `.whatsapp.com/send?phone=${phone}&text=`
                + encodeURIComponent(String(window.location.href))
            );
        }
    }

    return (
        <>
            <div
                onClick={openWhatsAppWeb}
                title="Place Inquiry via WhatsApp"
                style={{
                    zIndex: '3',
                    width: "40px",
                    height: "40px",
                    float: "right",
                    color: "white",
                    marginTop: "20%",
                    marginLeft: "95%",
                    cursor: "pointer",
                    paddingTop: "7px",
                    position: "fixed",
                    borderRadius: "50%",
                    paddingLeft: "13px",
                }}
            >
                <span style={{ fontSize: "xx-large" }}>
                    <li><a className="icon jkm-whatsapp" /></li>
                </span>
            </div>
        </>
    )
}

export default WhatsAppInquire;
