"use client";
import BrandInsightsTable from "@/components/insights/BrandInsightTable";
import InsightsTable from "@/components/insights/InsightsTable";
import { insightPlatforms } from "@/constant/common";
import { E_PLATFORMS } from "@/constant/enums";
import {
  GET_STREAMING_INSIGHTS,
  GET_TOP_FIVE_COMMENT_INSIGHTS,
  GET_TOP_FIVE_INFLUENCER_INSIGHTS,
  GET_TOP_FIVE_PRODUCT_INSIGHTS,
  GET_TOP_FIVE_VIEWS_INSIGHTS,
} from "@/framework/graphql/queries/insights";
import useGetActiveSocialPlatform from "@/framework/hooks/useGetActiveSocialPlatform";
import { setLoadingState } from "@/framework/redux/reducers/commonSlice";
import { CommonSliceTypes } from "@/framework/redux/redux";
import "@/styles/pages/insights-dashboard.scss";
import {
  DateFilter,
  IComments,
  IInsights,
  IPlatform,
  ITotalInsights,
  IViews,
} from "@/types/pages";
import { useQuery } from "@apollo/client";
import { CDatePicker } from "@coreui/react-pro";
import moment from "moment";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Insights = () => {
  const { data, loading, error, refetch : refetchStreamingInsights } = useQuery(GET_STREAMING_INSIGHTS);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const dispatch = useDispatch();
  const [totalInsights, setTotalInsights] = useState<ITotalInsights>();
  const path = usePathname()
  const { userType } = useSelector((state: CommonSliceTypes) => state.common);
  const [filterDateObject, setFilterDateObject] = useState<DateFilter>({startDate: null , endDate : null});
  const {activePlatformList} = useGetActiveSocialPlatform();
  

  useEffect(() => {
    dispatch(setLoadingState(loading));
  }, [loading, error]);

  const setInsightsData = () => {
    let tempViews: IInsights = { facebook: 0, instagram: 0, totalCount: 0 , youtube: 0, tiktok: 0,};
    let tempComments: IInsights = { facebook: 0, instagram: 0, totalCount: 0, youtube: 0, tiktok: 0,};

    const platformToShow: Record<string, keyof IInsights> = {
      Facebook: 'facebook',
      Instagram: 'instagram',
      Youtube: 'youtube',
      TikTok: 'tiktok',
    };

    data?.getStreamingInsights?.data?.session_views?.forEach((el: IViews) => {
      const platformKey = platformToShow[el.platform];
      if (platformKey) {
        tempViews[platformKey] += +el.view_platform_count;
      }
    });

    data?.getStreamingInsights?.data?.comment_count?.forEach((el: IComments) => {
      const platformKey = platformToShow[el.comments_platform];
      if (platformKey) {
        tempComments[platformKey] += +el.comments_platform_count;
      }
    });

    setTotalInsights({
      views: {
        ...tempViews,
        totalCount: tempViews?.facebook + tempViews?.instagram + tempViews?.youtube + tempViews?.tiktok,
      },
      comments: {
        ...tempComments,
        totalCount: tempComments?.facebook + tempComments?.instagram + tempComments?.youtube + tempComments?.tiktok,
      },
      totalSessions: data?.getStreamingInsights?.data?.total_session,
    });
  };

  useEffect(() => {
    setInsightsData();
  }, [data]);

  const handleDateChange = (date: string, name : string) => {
    if (name === 'startDate' && date !== 'Invalid date') setStartDate(date);
    if (name === 'endDate' && date !== 'Invalid date') setEndDate(date);
  };

  useEffect(()=>{
    refetchStreamingInsights()
  },[path,userType])

  useEffect(()=>{
    if(startDate && endDate){
      setFilterDateObject({startDate : startDate, endDate : endDate })
    }
  },[startDate,endDate])

  return (
    <div>
      <div className="container-lg">
        <h1 className="page-card-title">Insights</h1>
        <div className="insights-card insights-card-sticky">
          <div className="insights-card-row">
            <div className="insights-col">
              <div className="insights-inner-card">
                <div className="insights-inner-title">
                  <h2 className="h3">Total Sessions</h2>
                  <h3 className="h1">{totalInsights?.totalSessions}</h3>
                </div>
              </div>
            </div>
            <div className="insights-col">
              <div className="insights-inner-card insights-bg">
                <div className="insights-inner-title small">
                  <h2 className="h3">Total Views</h2>
                  <h3 className="h1">{totalInsights?.views?.totalCount}</h3>
                </div>
                <ul className="insights-social list-unstyled">
                  {insightPlatforms.map(
                    (platform) =>
                      activePlatformList?.[platform.key] && (
                        <li key={platform.dataKey}>
                          <span className={`icon ${platform.icon}`}></span>
                          <p className="spacing-0">{platform.name}</p>
                          <p className="h2">{totalInsights?.views?.[platform.dataKey]}</p>
                        </li>
                      )
                  )}
                </ul>
              </div>
            </div>
            <div className="insights-col">
              <div className="insights-inner-card insights-bg-2">
                <div className="insights-inner-title small">
                  <h2 className="h3">Total Comments</h2>
                  <h3 className="h1">{totalInsights?.comments?.totalCount}</h3>
                </div>
                <ul className="insights-social list-unstyled">
                  {insightPlatforms.map(
                    (platform) =>
                      activePlatformList?.[platform.key] && (
                        <li key={platform.dataKey}>
                          <span className={`icon ${platform.icon}`}></span>
                          <p className="spacing-0">{platform.name}</p>
                          <p className="h2">{totalInsights?.comments?.[platform.dataKey]}</p>
                        </li>
                      )
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="insights-card">
          <div className="data-range-row spacing-40">
            <div className="data-range-col">
              <p className="spacing-10">Date Range</p>
              <div className="data-range-form">
                <label htmlFor="From" className="h4">
                  From
                </label>
                <div className="date-control">
                  <CDatePicker id="From" date={startDate || ""} onDateChange={(date) => handleDateChange(moment(date).format("YYYY-MM-DD"), "startDate")} cleaner={false} aria-label="Start Date" />
                  <span className="icon icon-calendar"></span>
                </div>
                <label htmlFor="To" className="h4">
                  To
                </label>
                <div className="date-control">
                  <CDatePicker id="To" date={endDate || ""} onDateChange={(date) => handleDateChange(moment(date).format("YYYY-MM-DD"), "endDate")} cleaner={false} aria-label="End Date" />
                  <span className="icon icon-calendar"></span>
                </div>
              </div>
            </div>
            <div className="data-range-col">
              <button
                className="btn btn-primary btn-refresh"
                aria-label="Refresh Button"
                onClick={() => {
                  if (startDate || endDate) {
                    setFilterDateObject({ startDate: null, endDate: null });
                    setStartDate(null);
                    setEndDate(null);
                  }
                }}
              >
                <span className="icon-refresh"></span>
              </button>
            </div>
          </div>
          <div className="insights-table-row">
            <InsightsTable tableFor={"views"} query={GET_TOP_FIVE_VIEWS_INSIGHTS} dateObject={filterDateObject} />
            <InsightsTable tableFor={"comments"} query={GET_TOP_FIVE_COMMENT_INSIGHTS} dateObject={filterDateObject} />
          </div>
        </div>
        {userType === "brand" && (
          <div className="insights-card">
            <div className="insights-table-row">
              <BrandInsightsTable tableFor={"influencer"} query={GET_TOP_FIVE_INFLUENCER_INSIGHTS} dateObject={filterDateObject} title="Influencers" />
              <BrandInsightsTable tableFor={"products"} query={GET_TOP_FIVE_PRODUCT_INSIGHTS} dateObject={filterDateObject} title="Products" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Insights;
