import { useEffect } from "react";
import Script from "next/script";
import { ISignInReducerData } from "@type/Common/Base";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import SignUpBannerSection1 from "./components/SignUpBanner";

const SignUp = () => {
  const reduxData = useSelector((state: ISignInReducerData) => state);

  const router = useRouter();

  useEffect(() => {
    if (reduxData?.signIn?.userData?.user_detail?.email) {
      router.push("/");
    }
  }, []);
  return (
    <>
      <Script src="/assets/js/lib/loadFaceBook.min.js" defer={true} />
      <main>
        <SignUpBannerSection1 />
      </main>
    </>
  );
};

export default SignUp;
