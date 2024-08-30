"use client";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import "@/styles/pages/my-plans.scss";
import SubscriptionPopup from "@/components/Popup/SubscriptionPopup";
import { useDispatch, useSelector } from "react-redux";
import { CommonSliceTypes } from "@/framework/redux/redux";
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  sortBy,
  sortOrder,
} from "@/constant/regex";
import Pagination from "@/components/Pagination";
import { useLazyQuery, useQuery } from "@apollo/client";
import {
  FETCH_PAYMENT_HISTORY,
  FETCH_USER_MY_PLAN_DETAILS,
} from "@/framework/graphql/queries/myPlans";
import { usePathname } from "next/navigation";
import moment from "moment";
import { DATE_TIME_FORMAT, LOCAL_STORAGE_KEY } from "@/constant/common";
import {
  setIsUserHaveActivePlan,
  setLoadingState,
} from "@/framework/redux/reducers/commonSlice";
import { capitalizeFirstLetter, handleGraphQLErrors } from "@/utils/helpers";
import Link from "next/link";
import ChatLoader from "@/components/Loader/ChatLoader";
import { PaginationParamsList } from "@/types/graphql/common";
import { IPaymentHistory } from "@/types/pages";

const MyPlans = () => {
  const { isUserHaveActivePlan, userType } = useSelector(
    (state: CommonSliceTypes) => state.common
  );
  const [modal, setModal] = useState<boolean>(false);
  const [filterData, setFilterData] = useState<PaginationParamsList>({
    limit: DEFAULT_LIMIT,
    page: DEFAULT_PAGE,
    sortBy: sortBy,
    sortOrder: sortOrder,
    name: "",
  });
  const [isShortForName, setIsShortForName] = useState(false);
  const [historyLoader, setHistoryLoader] = useState(false);
  const {
    data: userPlanData,
    loading: planLoading,
    refetch: planRefetch,
  } = useQuery(FETCH_USER_MY_PLAN_DETAILS);
  const [getHistory, { data, refetch: refetchGetHistory, error }] =
    useLazyQuery(FETCH_PAYMENT_HISTORY, { variables: filterData });
  const totalHistoryCount = data?.fetchPaymentHistory?.data?.count;
  const totalPages = Math.ceil(totalHistoryCount / filterData?.limit);
  const path = usePathname();
  const dispatch = useDispatch();

  useEffect(() => {
    refetchGetHistory(filterData);
    planRefetch();
  }, [path]);

  useEffect(() => {
    dispatch(setLoadingState(planLoading));
    if (error) {
      handleGraphQLErrors(error);
    }
  }, [error, dispatch, planLoading]);

  useEffect(() => {
    setModal(!isUserHaveActivePlan);
  }, [isUserHaveActivePlan]);

  useEffect(() => {
    if (
      userPlanData?.fetchUserMyPlanDetails?.data?.current_user_plan_details
    ) {
      localStorage.setItem(
        LOCAL_STORAGE_KEY.UsersCurrentPlan,
        JSON.stringify(
          userPlanData?.fetchUserMyPlanDetails?.data?.current_user_plan_details
        )
      );
      dispatch(setIsUserHaveActivePlan(true))
    } 
  }, [planRefetch, userPlanData, path]);

  const handleFilterProduct = () => {
    if (filterData) {
      setHistoryLoader(true);
      getHistory({ variables: filterData })
        .then(() => {
          setHistoryLoader(false);
        })
        .catch(() => {
          setHistoryLoader(false);
        });
    }
  };

  /*refetching filtered data*/
  useEffect(() => {
    if (isShortForName) {
      const filterTimeout = setTimeout(() => {
        handleFilterProduct();
      }, 600);
      return () => clearTimeout(filterTimeout);
    }
    handleFilterProduct();
  }, [filterData, isShortForName]);

  const onModalClose = () => {
    setModal(false);
  };

  const pageSelectHandler = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setFilterData({
        ...filterData,
        limit: +e.target.value,
        page: DEFAULT_PAGE,
      });
    },
    [filterData]
  );

  //pagination
  const pageClickHandler = useCallback(
    (page: number) => {
      setFilterData({
        ...filterData,
        page: page,
      });
    },
    [filterData]
  );

  const handleSort = useCallback(
    (field: string) => {
      const sortOrder = filterData.sortOrder === "asc" ? "desc" : "asc";
      setFilterData({
        ...filterData,
        sortBy: field,
        sortOrder: sortOrder,
      });
      setIsShortForName(false);
    },
    [filterData]
  );

  const handleShortingIcons = useCallback(
    (field: string, icon: string) => {
      let showIcon = true;
      if (filterData?.sortBy === field) {
        showIcon = filterData.sortOrder === icon;
      }
      return showIcon;
    },
    [filterData]
  );

  return (
    <>
      <div className="my-plans-wrapper">
        <div className="container-lg">
          <h1 className="page-title spacing-30">{ userType === 'influencer' ? 'My Plans' : 'My Sessions'}</h1>
          <div
            className={`my-plans-card spacing-30 ${userPlanData?.fetchUserMyPlanDetails?.data?.plan_title
                ? userPlanData?.fetchUserMyPlanDetails?.data?.plan_title?.toLocaleLowerCase() +
                "-plan"
                : "gold-plan"
              }`}
          >
            {userType === 'influencer' && <h2 className="h3 spacing-30">Active Plan Details</h2>}
            <ul className="list-unstyled my-plans-list spacing-30">
              {isUserHaveActivePlan ? (
                <>
                  {userType !== 'brand' && <li>
                    <p className="my-plans-list-title spacing-0">
                      Current Plan
                    </p>
                    <span className="my-plans-list-number h2">
                      {
                        userPlanData?.fetchUserMyPlanDetails?.data
                          ?.plan_title
                      }
                    </span>
                  </li>}
                  <li>
                    <p className="my-plans-list-title spacing-0">
                      Total Sessions
                    </p>
                    <span className="my-plans-list-number h2">
                      {
                        userPlanData?.fetchUserMyPlanDetails?.data
                          ?.total_purchased_session
                      }
                    </span>
                  </li>
                  <li>
                    <p className="my-plans-list-title spacing-0">
                      Completed Sessions
                    </p>
                    <span className="my-plans-list-number h2">
                      {
                        userPlanData?.fetchUserMyPlanDetails?.data
                          ?.completed_session
                      }
                    </span>
                  </li>
                  <li>
                    <p className="my-plans-list-title spacing-0">
                      Remaining Sessions
                    </p>
                    <span className="my-plans-list-number h2">
                      {userPlanData?.fetchUserMyPlanDetails?.data?.current_user_plan_details?.available_session}
                    </span>
                  </li>
                  {userType !== 'brand' && <li>
                    <p className="my-plans-list-title spacing-0">Plan Price</p>
                    <span className="my-plans-list-number h2 text-primary">
                      ${" "}
                      {
                        userPlanData?.fetchUserMyPlanDetails?.data
                          ?.current_user_plan_details
                          ?.current_subscription_purchased_price?.toLocaleString('en-US')
                      }
                    </span>
                  </li>}
                </>
              ) : (
                <li className="no-active-plan">
                  <p className="my-plans-list-title spacing-0">
                  It seems like you don't have any active plan at the moment.
                  </p>
                </li>
              )}
            </ul>
            {userType === 'influencer' && <button
              className="btn btn-primary btn-sm"
              onClick={() => setModal(true)}
            >
              {isUserHaveActivePlan ? "Upgrade Now" : "Buy Now"}
            </button>}
          </div>
          {isUserHaveActivePlan && userType === 'influencer' ? (
            <div className="my-plans-card spacing-30">
              <h2 className="h3 spacing-20">Payment History</h2>
              <div className="table-responsive bg-white vertical-align-middle table-md spacing-40">
                <table className="checkTable">
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>
                        Payment Date
                        <span
                          className="sorting"
                          onClick={() => handleSort("created_at")}
                        >
                          {handleShortingIcons("created_at", "asc") ? (
                            <span className="icon-down up-arrow"></span>
                          ) : (
                            <></>
                          )}
                          {handleShortingIcons("created_at", "desc") ? (
                            <span className="icon-down"></span>
                          ) : (
                            <></>
                          )}
                        </span>
                      </th>
                      <th>
                        Payment Status
                        <span
                          className="sorting"
                          onClick={() => handleSort("status")}
                        >
                          {handleShortingIcons("status", "asc") ? (
                            <span className="icon-down up-arrow"></span>
                          ) : (
                            <></>
                          )}
                          {handleShortingIcons("status", "desc") ? (
                            <span className="icon-down"></span>
                          ) : (
                            <></>
                          )}
                        </span>
                      </th>
                      <th>
                        Amount
                        <span
                          className="sorting"
                          onClick={() => handleSort("purchased_price")}
                        >
                          {handleShortingIcons("purchased_price", "asc") ? (
                            <span className="icon-down up-arrow"></span>
                          ) : (
                            <></>
                          )}
                          {handleShortingIcons("purchased_price", "desc") ? (
                            <span className="icon-down"></span>
                          ) : (
                            <></>
                          )}
                        </span>
                      </th>
                      <th>
                        Download Invoice
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.fetchPaymentHistory?.data?.PaymentHistoryDate
                      ?.length > 0 ? (
                      data?.fetchPaymentHistory?.data?.PaymentHistoryDate.map(
                        (history: IPaymentHistory, index: number) => (
                          <tr key={history?.uuid}>
                            <td>
                              {(filterData.page - 1) * filterData.limit +
                                index +
                                1}
                            </td>
                            <td>
                              {moment(history?.created_at)
                                .tz(moment.tz.guess())
                                .format(DATE_TIME_FORMAT.format1)}
                            </td>
                            <td>
                              <span className={`${history.status == 'success' ? "text-success" : "text-danger"}`}>
                                {capitalizeFirstLetter(history.status)}
                              </span>
                            </td>
                            <td>$ {history?.purchased_price?.toLocaleString('en-US')}</td>
                            <td>
                              {history?.invoice_pdf ? <Link aria-label="Download Invoice" href={history?.invoice_pdf} target="_blank"><span className="icon-download"></span></Link> : <>-</>}
                            </td>
                          </tr>
                        )
                      )
                    ) : (
                      <tr>
                        <td>No Data found</td>
                      </tr>
                    )}
                    {historyLoader && (
                      <ChatLoader isText={false}/>
                    )}
                  </tbody>
                </table>
              </div>
              <Pagination
                totalPages={totalPages}
                onPageChange={pageClickHandler}
                filterPage={filterData.page}
                pageSelectHandler={pageSelectHandler}
                totalIteamCount={totalHistoryCount}
              />
              </div>
          ) : (
            <></>
          )}
        </div>
      </div>
      <SubscriptionPopup modal={modal} onClose={onModalClose} />
    </>
  );
};

export default MyPlans;
