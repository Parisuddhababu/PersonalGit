import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import CustomImage from "@components/CustomImage/CustomImage";
import { IResetPasswordBannerProps } from "@templates/ResetPassword/components/resetPasswordBanner";
import IResetPasswordForm1 from "@templates/ResetPassword/components/resetPasswordForm/reset-password-form-1";
import { getTypeBasedCSSPathPages } from "@util/common";

const IResetPasswordBanner1 = ({ data }: IResetPasswordBannerProps) => {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.resetPasswordBanner)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPathPages(null, CSS_NAME_PATH.resetPassword)}
        />
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
      <IResetPasswordForm1 />
    </>
  );
};

export default IResetPasswordBanner1;
