import { setDynamicDefaultStyle } from "@util/common";
import { useEffect } from "react";
import { getComponents } from "@templates/SignIn/components/index";
import { ISignUp } from "@templates/SignUp/index";
import Script from "next/script";

const SignUp = (props: ISignUp) => {
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
      <Script src="/assets/js/lib/loadFaceBook.min.js" defer={true} />
      <Script src="/assets/js/lib/loadGoogle.min.js" defer={true} />
      <main>
        {props.sequence?.map((ele) =>
          getComponents(props?.data?.[ele]?.type,
            ele,
            props?.data?.[ele as keyof ISignUp]?.banner_detail?.[0]
          )
        )}
      </main>
    </>
  );
};

export default SignUp;
