import React, { useEffect, useState } from "react";
import Modal from "@components/Modal";
import ReferalCodePopup from "@templates/refer-earn/components/referalCodePopup";
import { IInviteLinkModel } from "@type/Pages/inviteLink";
import useCurrencySymbol from "@components/Hooks/currencySymbol/useCurrencySymbol";
import usePriceDisplay from "@components/Hooks/priceDisplay";
import { useSelector } from "react-redux";
import { ISignInReducerData } from "@type/Common/Base";
import { getUserDetails } from "@util/common";
import Link from "next/link";
import { useToast } from "@components/Toastr/Toastr";
import Loader from "@components/customLoader/Loader";

const InviteLinkPopup = ({ toggleModal, referData }: IInviteLinkModel) => {
  const [referalCodeModal, setReferalCodeModal] = useState<boolean>(false);
  const currencySymbol = useCurrencySymbol();
  const { isPriceDisplay } = usePriceDisplay();
  const signIndata = useSelector((state: ISignInReducerData) => state);
  const [refralCode, setRefralCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {showWarning }: any = useToast();

  const toggleReferalModel = () => {
    setReferalCodeModal(!referalCodeModal);
  };

  const joinNow = () => {
    if (refralCode !== "") {
      toggleReferalModel();
    }
    else {
      showWarning("Please Login First To Generate Referal Code")
    }
  };

    useEffect(() => {
    setIsLoading(true);
    if (signIndata) {
      if (signIndata?.signIn?.userData?.user_detail?.referal_code) {
        setRefralCode(signIndata?.signIn?.userData?.user_detail?.referal_code);
      } else {
        setRefralCode("");
      }
      setIsLoading(false);
    }
  }, [signIndata]);

  return (
    <>
      {isLoading && <Loader />}
      <div className="modal-content">
        <h4>
          With more ways to unlock exciting perks, this is your all access pass
          to exclusive rewards.
        </h4>
        <div className="line"></div>
        <button
          type="button"
          className="btn btn-secondary btn-small"
          onClick={() => {
            joinNow();
          }}
        >
          Join Now
        </button>
        {!signIndata?.signIn?.userData && (
          <p>
            Already have an account?{" "}
            <Link href="/sign-in">
              <a>Sign in</a>
            </Link>
          </p>
        )}
      </div>
      <div className="modal-footer">
        <h3>Referrals</h3>
        <p>
          Give your friends a reward and claim your own when they make a
          purchase.
        </p>
        {getUserDetails() || (!getUserDetails() && isPriceDisplay) ? (
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
                {currencySymbol} {referData?.you_get_discount} OFF
              </h4>
              <p>
                <strong>You get</strong>
                <br />
                {currencySymbol} {referData?.you_get_discount} off coupon
              </p>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>

      {referalCodeModal ? (
        <Modal
          className={referalCodeModal ? `referral-code-popup` : ""}
          open={referalCodeModal}
          onClose={toggleReferalModel}
          dimmer={false}
          headerName="Referal Code"
        >
          <ReferalCodePopup
            toggleReferalModel={toggleReferalModel}
            toggleModal={toggleModal}
            referData={referData}
            refralCode={refralCode}
          />
        </Modal>
      ) : null}
    </>
  );
};
export default InviteLinkPopup;
