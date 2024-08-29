import { useGoogleLogin } from "@react-oauth/google";

export interface IGoogleLoginSignupProps {
  buttonLabel: string | null;
  type?: string | number
}

const GoogleLogin = ({ buttonLabel, type = 1 }: IGoogleLoginSignupProps) => {

  const login = useGoogleLogin({
    onSuccess: codeResponse => {
      fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${codeResponse.access_token}` }
      }).
        then(res => res.json())
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
              {buttonLabel ?? "Sign In with google"}
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
