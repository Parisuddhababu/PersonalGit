"use client";

import { useQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import { GET_PROFILE } from "@/framework/graphql/queries/myProfile";
import { CommonSliceTypes } from "@/framework/redux/redux";
import "@/styles/pages/my-account.scss";
import CustomisePlatform from "@/components/MyAccount/CustomisePlatform";
import MyProfile from "@/components/MyAccount/MyProfile";
import SocialSetting from "@/components/MyAccount/SocialSetting";

const MyAccount = () => {
  const { userDetails, userType } = useSelector((state: CommonSliceTypes) => state.common);
  const { data } = useQuery(GET_PROFILE, { fetchPolicy: "network-only" });

  return (
    <div className="my-account-wrapper">
      <div className="container-lg">
        <div className="my-account-inner">
          <h1 className="">My Account</h1>
          <MyProfile data={data} />
          {userDetails?.user_type === "2" && <SocialSetting />}
          {(userType === "brand" || userType === "influencer") && <CustomisePlatform data={data} />}
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
