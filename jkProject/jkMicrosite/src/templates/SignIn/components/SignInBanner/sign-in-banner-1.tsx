import CustomImage from "@components/CustomImage/CustomImage";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { ISignInBanner } from "@type/Pages/signIn";
import { getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import SignInFormSection1 from "@templates/SignIn/components/SignInForm/sign-in-form-1";
import Link from "next/link";

const SignInBannerSection1 = (props: ISignInBanner) => {
  return (
    <>
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

        <SignInFormSection1 guestUser={props?.guest_user} />
      </div>
      <Head>
      <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.signInBanner)}
        />
        </Head>
    </>
  );
};

export default SignInBannerSection1;
