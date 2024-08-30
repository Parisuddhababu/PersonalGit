import SignUpFormSection2 from "@templates/SignUp/components/SIgnUpForm/sign-up-form-2"
import { ISignUpBanner } from "@type/Pages/signUp";

const SignUpBannerSection2 = (props: ISignUpBanner) =>{
    return (
       <SignUpFormSection2 SignUpformData={props}/>
    )
}

export default SignUpBannerSection2