import { REACT_APP_API_GATEWAY_URL } from "@/config/app.config";
import { LOCAL_STORAGE_KEY } from "@/constant/common";
import { FETCH_SUBSCRIPTION_PLANS } from "@/framework/graphql/queries/myPlans";
import { setLoadingState } from "@/framework/redux/reducers/commonSlice";
import { ISubscriptionPlan } from "@/types/pages";
import { handleGraphQLErrors } from "@/utils/helpers";
import { useLazyQuery } from "@apollo/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const DragAndDropStyle = {
  content: {
    maxWidth: "1000px",
  },
};

const SubscriptionPopup = ({
  modal,
  onClose,
}: {
  modal: boolean;
  onClose: () => void;
}) => {
  const { refetch: refetchSubPlans, data, error, loading } = useLazyQuery(
    FETCH_SUBSCRIPTION_PLANS
  )[1];
  const [activePlans, setActivePlans] = useState<ISubscriptionPlan[]>([])
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    modal && refetchSubPlans();
  }, [modal]);

  useEffect(()=>{
    if(data?.fetchSubscriptionPlans?.data?.subscriptionPlanData?.length > 0){
      setActivePlans(data.fetchSubscriptionPlans.data.subscriptionPlanData?.filter(({status} : {status : string})=> status === '1'))
    }else {
      setActivePlans([])
    }
  },[data,modal])

  useEffect(() => {
    dispatch(setLoadingState(loading));
    if (error) {
      handleGraphQLErrors(error);
    }
  }, [loading, error, dispatch]);

  const buyPlanHandler = async (plan_uuid: string) => {
    dispatch(setLoadingState(true))
    try {
      const { data } = await axios.post(
        `${REACT_APP_API_GATEWAY_URL}/api/v1/payment/checkout-session?uuid=${plan_uuid}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              LOCAL_STORAGE_KEY.authToken
            )}`,
          },
        }
      );
      if (data?.url) router.push(data?.url);
    } catch (error) {
      toast.error(
        "Payment gateway is under maintenance, please try again later"
      );
      dispatch(setLoadingState(false))
    }
  };

  return (
    <Modal
      isOpen={modal}
      contentLabel="Example Modal"
      style={DragAndDropStyle}
    >
      <button onClick={() => {
        onClose()
      }} className='modal-close' aria-label="Close Model"><i className='icon-close'></i></button>
      <h3 className="text-center spacing-30">Choose Subscription Plan</h3>
      <div className="subscription-plan-row">
        {activePlans?.length > 0 &&  activePlans?.map(
          (plan: ISubscriptionPlan) => (
            <div key={plan?.uuid} className={`subscription-plan-card ${plan?.plan_title?.toLocaleLowerCase() || 'gold'}`}>
              <h3 className="h4 subscription-plan-title">{plan?.plan_title}</h3>
              <h4 className="h3 subscription-plan-price spacing-10">$ {plan?.plan_price}</h4>
              <div className="divider"></div>
              <ul className="list-unstyled subscription-plan-list">
                {plan?.plan_features?.map((feature) => (
                  <li key={feature.name} className={feature?.isActive ? '' : 'not-include'}>{feature?.name}</li>
                ))}
              </ul>
              <button
                className="btn btn-secondary btn-sm btn-full"
                onClick={() =>
                  buyPlanHandler(plan?.uuid)
                }
              >
                Buy Plan
              </button>
            </div>
          )
        )}
      </div>
    </Modal>
  );
};

export default SubscriptionPopup;
