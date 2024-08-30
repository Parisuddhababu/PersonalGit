'use client'
import React, { Fragment, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { CommonSliceTypes, UserType } from "@/framework/redux/redux";
import { useRouter, usePathname } from "next/navigation";
import { LOCAL_STORAGE_KEY, RESTRICT_FOR_LOGIN_USER } from "@/constant/common";
import { ROUTES } from "@/config/staticUrl.config";
import { setBrandName, setIsBrandInfluencer, setIsUserHaveActivePlan, setLandingPageState, setLoadingState, setUserDetailsState, setUserType } from "@/framework/redux/reducers/commonSlice";
import { ICurrentPlanDetails, LoggedInUser } from "@/types/graphql/pages";

const Loader = () => {
  const { loading } = useSelector((state: CommonSliceTypes) => state.common)
  const dispatch = useDispatch();
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEY.authToken);
    
    dispatch(setLandingPageState(!token))
    dispatch(setLoadingState(false))

    // Redirect to login if token is not present and the route is private
    if (!token && Object.values(ROUTES.private).includes(pathName.split('/')?.[1])) {
      router.push(`/${ROUTES.public.signIn}`);
      return
    }

    const userDetails = localStorage.getItem(LOCAL_STORAGE_KEY.userDetails)
    const brandName = localStorage.getItem(LOCAL_STORAGE_KEY.brandName)
    const UsersCurrentPlan = localStorage.getItem(LOCAL_STORAGE_KEY.UsersCurrentPlan)

    if (userDetails) {
      const uDetails = JSON.parse(userDetails) as LoggedInUser
      dispatch(setUserDetailsState(uDetails))
      let uType: UserType = 'influencer'

      if (uDetails?.user_type === '3') {
        uType = 'brand'
      }

      if (uDetails?.user_type === '2' && uDetails?.brand_id) {
        uType = 'brand-influencer'
      }

      dispatch(setUserType(uType))

      if(brandName){
        dispatch(setIsBrandInfluencer(uType === 'brand-influencer' && brandName === 'whi'))
        dispatch(setBrandName(brandName))
      }
    }

    if(UsersCurrentPlan){
      const UsersCurrentPlanDetails = JSON.parse(UsersCurrentPlan) as ICurrentPlanDetails
      Object.keys(UsersCurrentPlanDetails)?.length > 0 ? dispatch(setIsUserHaveActivePlan(true)) :  dispatch(setIsUserHaveActivePlan(false))
    }

    if (token && RESTRICT_FOR_LOGIN_USER.includes(pathName)) {
      router.push('/');
    }
  }, [pathName]);

  return (
    <Fragment>
      {
        loading &&
        <div className="loader-spin">
          <div className="circle"></div>
          <div className="loading-text">Loading
            <span className="dot-one"> .</span>
            <span className="dot-two"> .</span>
            <span className="dot-three"> .</span>
          </div>
        </div>
      }
    </Fragment>
  );
};

export default Loader
