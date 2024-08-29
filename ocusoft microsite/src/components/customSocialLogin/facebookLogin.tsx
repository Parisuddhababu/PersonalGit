
export interface IFacebookLoginSignupProps {
  buttonLabel?: string;
  type?: number | string;
}

const FacebookLogin = ({
  buttonLabel,
  type = 1,
}: IFacebookLoginSignupProps) => {
  return (
    <div className="access-links-link facebook" >
      <a>
        <i className="jkm-meta-fill-square facebook"></i>
        {
          type == 1 ? (
            <span className="social-icon-text">
              {buttonLabel ? buttonLabel : "Sign In with Facebook"}
            </span>
          ) : (
            <span>Sign In with Facebook</span>
          )
        }
      </a >
    </div >
  );
};

export default FacebookLogin;
