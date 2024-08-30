
import SignInFormSection2 from "@templates/SignIn/components/SignInForm/sign-in-form-2";
import { ISignInBanner } from "@type/Pages/signIn";

const SignInBannerSection2 = (props : ISignInBanner) => {
  return (
      <SignInFormSection2 SignInformData={props}/>
  );
};

export default SignInBannerSection2;
