import CustomImage from "@components/CustomImage/CustomImage";
import { ISignUpBanner } from "@type/Pages/signUp";
import SignUpFormSection1 from "@templates/SignUp/components/SIgnUpForm/sign-up-form-1";
import Head from "next/head";
import { getTypeBasedCSSPath } from "@util/common";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import Link from "next/link";

const SignUpBannerSection1 = (props: ISignUpBanner) => {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.signUpBanner)}
        />
      </Head>
      <div className="wrapper">
        <Link href={props?.link || ""}>
          <a>
            <section className="banner-sec">
              <div className="banner-image-wrap">
                <CustomImage
                  src={props?.banner_image?.path}
                  height="330px"
                  width="1920px"
                />

                <div className="banner-content">
                  <h2>{props?.banner_title}</h2>
                </div>
              </div>
            </section>
          </a>
        </Link>

        <SignUpFormSection1 />
      </div>
    </>
  );
};

export default SignUpBannerSection1;
