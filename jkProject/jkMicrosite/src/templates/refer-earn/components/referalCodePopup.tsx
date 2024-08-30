import useCurrencySymbol from "@components/Hooks/currencySymbol/useCurrencySymbol";
import usePriceDisplay from "@components/Hooks/priceDisplay";
import { useToast } from "@components/Toastr/Toastr";
import { IReferalCodeModel } from "@type/Pages/referalCode";
import { getUserDetails } from "@util/common";


const ReferalCodePopup = ({ referData, refralCode}: IReferalCodeModel) => {
  const { showSuccess}: any = useToast();
  const currencySymbol = useCurrencySymbol();
  const { isPriceDisplay } = usePriceDisplay();

  const copyRefralCode = () => {
      navigator.clipboard.writeText(
        `${window.location.origin}/sign-up?referral_code=${refralCode}`
      );
      showSuccess("URl Copied to Clipboard");
  };

  return (
    <>
      <>
        <div className="modal-content">
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              name="first_name"
              id="first_name"
              placeholder={`${window.location.origin}/sign-up?referral_code=${refralCode}`}
            />
            <a>
              {" "}
              <i className="jkm-copy" onClick={copyRefralCode}></i>
            </a>
          </div>
          <h6> Share Referral Code</h6>
          <ul className="social_icons">
            <li className="facebook">
              <a href="https://www.facebook.com/jewellerskart">
                <i className="jkm-meta-fill-square"></i>
              </a>
            </li>
            <li className="instagram">
              <a href="https://www.instagram.com/jewellerskart_com/">
                <i className="jkm-insta-fill-square"></i>
              </a>
            </li>
            <li className="linkedin">
              <a href="https://www.linkedin.com/authwall?trk=bf&trkInfo=AQFHgAO1ag_M-QAAAYSkcTNoBqjJXuBlbCEmxh35k1oV1Kc4LbdDW96b1fmbweWajNkZCO4Vq_bAR5ek0rCMW4t0Rew4duHH-zsY-XXpT3Ha2kXtlSSyy1Ysf4F-2HKEcTHaeb8=&original_referer=&sessionRedirect=https%3A%2F%2Fwww.linkedin.com%2Fcompany%2F74427461">
                <i className="jkm-linkedin"></i>
              </a>
            </li>
            <li className="whatsapp">
              <a href="https://api.whatsapp.com/send/?phone=919819082345&text&type=phone_number&app_absent=0">
                <i className="jkm-whatsapp"></i>
              </a>
            </li>
            <li className="mail">
              <a href="mailto:support@jewellerskart.com">
                <i className="jkm-mail1"></i>
              </a>
            </li>
          </ul>
        </div>
        {getUserDetails() || (!getUserDetails() && isPriceDisplay) ? (
          <div className="modal-footer">
            <h3>Referrals</h3>
            <p>
              Give your friends a reward and claim your own when they make a
              purchase.
            </p>
            <div className="d-row benefits">
              <div className="d-col d-col-2">
                <h4>
                  {currencySymbol} {referData?.they_get_discount} OFF
                </h4>
                <p>
                  <strong>They get</strong>
                  <br />
                  {currencySymbol} {referData?.they_get_discount} off coupon
                </p>
              </div>
              <div className="d-col d-col-2">
                <h4>
                  {currencySymbol}
                  {referData?.you_get_discount} OFF
                </h4>
                <p>
                  <strong>You get</strong>
                  <br />
                  {currencySymbol} {referData?.you_get_discount} off coupon
                </p>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </>
    </>
  );
};
export default ReferalCodePopup;
