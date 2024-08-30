import { setDynamicDefaultStyle } from "@util/common";
import { useEffect } from "react";
import { getComponents } from "@templates/SignUp/components/index";
import { ISignUp } from "@templates/SignUp/index";
import Script from "next/script";
import { ISignInReducerData } from "@type/Common/Base";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const SignUp = (props: ISignUp) => {
  const reduxData = useSelector((state: ISignInReducerData) => state);
  const setDynamicColour = () => {
    if (props?.default_style && props?.theme) {
      setDynamicDefaultStyle(props?.default_style, props?.theme);
    }
  };

  const router = useRouter();

  useEffect(() => {
    setDynamicColour();
    if (reduxData?.signIn?.userData?.user_detail?.email) {
      router.push("/");
    }
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <Script src="/assets/js/lib/loadFaceBook.min.js" defer={true} />
      <Script src="/assets/js/lib/loadGoogle.min.js" defer={true} />
      <main>
        {props.sequence?.map((ele) =>
          getComponents(
            props?.data?.[ele as keyof ISignUp]?.type,
            ele,
            props?.data?.[ele as keyof ISignUp]?.banner_detail?.[0]
          )
        )}
      </main>
    </>
  );
};

export default SignUp;
