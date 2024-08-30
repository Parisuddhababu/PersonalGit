import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import CustomImage from "@components/CustomImage/CustomImage";
import { IForgotPasswordBannerProps } from "@templates/ForgotPassword/components/ForgotPasswordBanner";
import IForgotPasswordForm1 from "@templates/ForgotPassword/components/ForgotPasswordForm/forgot-password-form-1";

const IForgotPasswordBanner1 = ({ data }: IForgotPasswordBannerProps) => {
    return (
        <>
            <Head>
                <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.forgotPasswordBanner)} />
            </Head>
            <section className="banner-sec">
                <div className="banner-image-wrap">
                    <CustomImage
                        src={data?.banner_image?.path}
                        alt={"jk_jwellery_baner"}
                        title={"jk_jwellery_baner"}
                        height="330px"
                        width="1920px"
                    />

                    <div className="banner-content">
                        <h2>{data?.banner_title}</h2>
                    </div>
                </div>
            </section>
            <IForgotPasswordForm1 />
        </>
    );
};

export default IForgotPasswordBanner1;
