import { ROUTES } from "@/config/staticUrl.config";
import { FETCH_SUBSCRIPTION_PLANS } from "@/framework/graphql/queries/myPlans";
import { ISubscriptionPlan } from "@/types/pages";
import { handleGraphQLErrors } from "@/utils/helpers";
import { useLazyQuery } from "@apollo/client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const InfluencerPlans = () => {
  const { refetch: refetchSubPlans, data, error } = useLazyQuery(
    FETCH_SUBSCRIPTION_PLANS
  )[1];
  const [activePlans, setActivePlans] = useState<ISubscriptionPlan[]>([]);
  const path = usePathname();
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      handleGraphQLErrors(error);
    }
  }, [error, dispatch]);

  useEffect(() => {
    refetchSubPlans();
  }, [path]);

  useEffect(() => {
    if (data?.fetchSubscriptionPlans?.data?.subscriptionPlanData?.length > 0) {
      setActivePlans(
        data.fetchSubscriptionPlans.data.subscriptionPlanData?.filter(
          ({ status }: { status: string }) => status === "1"
        )
      );
    } else {
      setActivePlans([]);
    }
  }, [data]);

  return (
    <div className="row tab-cards">
      {activePlans?.length > 0 &&
        activePlans?.map((plan: ISubscriptionPlan,index) => (
          <div className={`tab-card ${index === 1 ? 'bluecard' : (index === 2 ? 'light-bluecard' : '')}`} key={plan?.uuid} >
            <div className="tab-card-inner">
              <h3 className="spacing-10 text-center">{plan?.plan_title}</h3>
              <h2 className="h1 text-center spacing-30 blue-color">
                $ {plan?.plan_price}
              </h2>
              <ul className="list-unstyled card-ul spacing-30">
                {plan?.plan_features?.map((feature) => (
                  <li
                    key={feature.name}
                    className={feature?.isActive ? "" : "unchecked"}
                  >
                    {feature?.name}
                  </li>
                ))}
              </ul>
              <Link href={`/${ROUTES.public.signUp}`}>
                <button className={`btn button-center ${index === 1 ? 'btn-fullwhite' : 'btn-primary'}`}>
                  Buy Plan
                </button>
              </Link>
            </div>
          </div>
        ))}
    </div>
  );
};

export default InfluencerPlans;
