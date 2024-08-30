import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import { IResetPasswordBannerProps } from "@templates/ResetPassword/components/resetPasswordBanner";
import { getTypeBasedCSSPathPages } from "@util/common";
import IResetPasswordForm2 from "../resetPasswordForm/reset-password-form-2";

const IResetPasswordBanner2 = ({ data }: IResetPasswordBannerProps) => {
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
      {/* <section className="banner-sec"
        style={{
          marginBottom: 0
        }}
      >
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
      </section> */}
      <IResetPasswordForm2 banner={data?.banner_image?.path} />
    </>
  );
};

export default IResetPasswordBanner2;
