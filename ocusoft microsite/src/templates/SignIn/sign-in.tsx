import Script from "next/script";
import SignInBannerSection1 from "./components/SignInBanner";

const SignUp = () => {

  return (
    <>
      <Script src="/assets/js/lib/loadFaceBook.min.js" defer={true} />
      <main>
        <SignInBannerSection1 />
      </main>
    </>
  );
};

export default SignUp;
