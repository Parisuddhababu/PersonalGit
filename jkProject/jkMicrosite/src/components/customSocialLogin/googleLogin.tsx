import { useGoogleLogin } from "@react-oauth/google";

export interface IGoogleLoginSignupProps {
  // eslint-disable-next-line
  onClose: (data: any) => void;
  buttonLabel: string | null;
  type?: string | number
}

const GoogleLogin = ({ onClose, buttonLabel, type = 1 }: IGoogleLoginSignupProps) => {

  const login = useGoogleLogin({
    onSuccess: codeResponse => {
      fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${codeResponse.access_token}` }
      }).
        then(res => res.json()).
        then(profile => {
          const returnObj = {
            googleId: profile.sub,
            givenName: profile.given_name,
            familyName: profile.family_name,
            email: profile.email,
          };
          onClose(returnObj);
        }).catch((error) => {
          onClose(error);
        })
    },
    flow: 'implicit',
  });



  return (
    <div className="access-links-link google" id="googleButton" onClick={() => login()}>
      <a>
        <i className="jkm-gmail google"></i>
        {
          type == 1 ? (
            <span className="social-icon-text">
              {buttonLabel ? buttonLabel : "Sign In with google"}
            </span>
          ) : (
            <span> Sign In with Google</span>
          )
        }
      </a >
    </div >
  );
};

export default GoogleLogin;
