import React, { useEffect } from "react";
import { getComponents } from "./components";
import Head from "next/head";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import APPCONFIG from "@config/app.config";
import { setDynamicDefaultStyle } from "@util/common";
import { IQuotationMain } from "@templates/Quotation";
import { API_SECTION_NAME } from "@config/apiSectionName";

const Quotation = (props: IQuotationMain) => {
    const setDynamicColour = () => {
        if (props?.default_style && props?.theme) {
            setDynamicDefaultStyle(props?.default_style, props?.theme);
        }
    };

    useEffect(() => {
        setDynamicColour();
        // eslint-disable-next-line
    }, []);
    return (
        <>
            <Head>
                <link
                    rel="stylesheet"
                    href={
                        APPCONFIG.STYLE_BASE_PATH_PAGES +
                        CSS_NAME_PATH.quotation +
                        ".min.css"
                    }
                />
            </Head>
            <main>
                {

                    getComponents(
                        APPCONFIG.TEMPLATE_TYPE,
                        API_SECTION_NAME.quotation,
                        props?.data
                    )
                }

            </main>
        </>
    );
};

export default Quotation;
