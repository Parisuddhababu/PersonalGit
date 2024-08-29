import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath, getTypeBasedCSSPathPages } from "@util/common";
import Head from "next/head";
import IForgotPasswordForm1 from "@templates/ForgotPassword/components/ForgotPasswordForm/forgot-password-form-1";

const IForgotPasswordBanner1 = () => {
    return (
        <>
            <Head>
                <title>Forgot Password</title>
                <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.forgotPassword)} />
                <link rel="stylesheet" href={getTypeBasedCSSPathPages(null, CSS_NAME_PATH.toasterDesign)} />
            </Head>
            <IForgotPasswordForm1 />
        </>
    );
};

export default IForgotPasswordBanner1;
