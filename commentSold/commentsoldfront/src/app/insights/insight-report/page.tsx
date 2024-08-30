
'use client'
import React, { useEffect, useState } from 'react';
import "@/styles/pages/product-catalog-management.scss";
import "@/styles/pages/insight-report.scss";
import { useLazyQuery, useQuery } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';
import { IInsightReportProps, IInsights, IMultiHostDetails, IStreamDetailsData, IViewsCount } from '@/types/pages';
import { setLoadingState } from '@/framework/redux/reducers/commonSlice';
import { useSearchParams, useRouter } from 'next/navigation';
import moment from 'moment';
import { GET_STREAMING_SESSION_INSIGHT_DETAILS, GET_STREAMING_SESSION_PRODUCT_INSIGHT_DETAILS } from '@/framework/graphql/queries/insights';
import { handleGraphQLErrors } from '@/utils/helpers';
import { CommonSliceTypes } from '@/framework/redux/redux';
import { DATE_TIME_FORMAT, insightPlatforms } from '@/constant/common';
import Image from 'next/image';
import { IMAGE_PATH } from '@/constant/imagePath';
import useGetActiveSocialPlatform from '@/framework/hooks/useGetActiveSocialPlatform';
import { E_PLATFORMS } from '@/constant/enums';

const InsightReport = () => {
    const param = useSearchParams();
    const router = useRouter()
    const insightReportId = param?.get('uuid') ?? '';
    const dispatch = useDispatch();
    const { refetch: getStreamingInsightDetails, data, error, loading } = useQuery(GET_STREAMING_SESSION_INSIGHT_DETAILS, {
        variables: { uuid: insightReportId }, skip: !insightReportId
    })
    const [getProductData,{ data : productData, error : productError, loading : productLoading }] = useLazyQuery(GET_STREAMING_SESSION_PRODUCT_INSIGHT_DETAILS);
    const { userType, userDetails } = useSelector((state: CommonSliceTypes) => state.common);
    const [currentUserId, setCurrentUserId] = useState<string>("");
    const [insightReportData,setInsightReportData] = useState<IStreamDetailsData>();
    const [sessionViews, setSessionViews] = useState<IInsights>();
    const {activePlatformList} = useGetActiveSocialPlatform();
    
    useEffect(()=>{
        let tempViews: IInsights = { facebook: 0, instagram: 0, totalCount: 0 , youtube: 0, tiktok: 0};

        const platformToShow: Record<string, keyof IInsights> = {
          Facebook: "facebook",
          Instagram: "instagram",
          Youtube: "youtube",
          TikTok: "tiktok",
        };
        
        data?.getStreamingSessionInsightsDetails?.data?.session_views?.forEach((session: IViewsCount) => {
            const platformKey = platformToShow[session.platform];
            if (platformKey) {
              tempViews[platformKey] += +session.view_platform_count;
            }
        });
        
        setSessionViews({...tempViews,totalCount: tempViews?.facebook + tempViews?.instagram + tempViews?.youtube + tempViews?.tiktok})
        setInsightReportData(data?.getStreamingSessionInsightsDetails?.data);
    },[data])

    useEffect(() => {
      getStreamingInsightDetails();
    }, [insightReportId]);

    useEffect(() => {
      dispatch(setLoadingState(loading || productLoading));
      if (error) {
        handleGraphQLErrors(error);
      }
      if (productError) {
        handleGraphQLErrors(error);
      }
    }, [loading, error, productLoading]);

    useEffect(() => {
      const guestUers = data?.getStreamingSessionInsightsDetails?.data?.multi_host_user_details ?? [];
      if(guestUers.length <= 0) {
        return;
      }

      let defaultUserId = guestUers?.[0]?.uuid
    
      if(userType !== "brand"){
        defaultUserId = guestUers?.find((user : {email : string}) => user?.email === userDetails?.email)?.uuid;
      }

      getProductData({
        variables: {
          streamId: insightReportId,
          userId: defaultUserId,
        },
      });

      setCurrentUserId(defaultUserId);
    }, [data]);

    const changeProductHandler = (userId: string) => {
      if (userId && userType === "brand") {
        getProductData({ variables: { streamId: insightReportId, userId } });
        setCurrentUserId(userId);
      }
    };

    return (
        <div className="insight-wrapper">
            <div className="container-lg">
                <div className="insight-inner">
                    <div className="row spacing-30 insight_row">
                        <div className="l-col">
                            <h1 className="page-title">Insight Report</h1>
                        </div>
                        <div className='r-col'>
                            <button
                                type="button"
                                className="btn btn-secondary btn-prev btn-icon"
                                onClick={() => router.back()}>
                                <span className="icon-left-long icon"></span> Back
                            </button>
                        </div>
                    </div>

                    <div className="insight card">
                        <div className="row">
                            <div className="l-col border-card">
                                <div className='border-bottom spacing-20'>
                                    <h3 className='gap-4'>Session Name:</h3>
                                    <p className='greyText'>{insightReportData?.stream_title ? insightReportData?.stream_title : '-'}</p>
                                </div>
                                <div className='border-bottom spacing-20'>
                                    <p className='gap-4'><strong>Date & Time</strong></p>
                                    <p>{insightReportData?.start_time ? `${moment.utc(insightReportData.start_time).local().format(DATE_TIME_FORMAT.format1)}/${moment.utc(insightReportData.start_time).local().format(DATE_TIME_FORMAT.format2)}` : '-/-'}</p>
                                </div>
                                <div className='border-bottom spacing-20'>
                                    <p className='gap-4'><strong>Duration</strong></p>
                                    <p>{insightReportData?.duration ? insightReportData?.duration : "0 h 0 m 0 s "}</p>
                                </div>
                                {(data?.getStreamingSessionInsightsDetails?.data?.multi_host_user_details?.length > 0) && <div className='user'>
                                    <p className='gap-4'><strong>Users</strong></p>
                                    <div className='tags-block'>
                                        {data?.getStreamingSessionInsightsDetails?.data?.multi_host_user_details?.map((multiHost: IMultiHostDetails) => {
                                            return (
                                                <span style={{cursor:`${userType === "brand" ? "pointer" : "not-allowed"}`}} key={multiHost?.user_id} onClick={()=> {changeProductHandler(multiHost?.uuid)}} className={`greyTag ${currentUserId === multiHost?.uuid ? "active" : ""}`}>{multiHost?.email}</span>
                                            )
                                        })}
                                    </div>
                                </div>
                                }
                            </div>
                            <div className="r-col border-card">
                                <div className='border-bottom spacing-20'>
                                    <div className='small-head'>Total Views</div>
                                    <div className='totalViews h1'>{sessionViews?.totalCount}</div>
                                </div>
                                <div className='summary-block spacing-20'>
                                    <h3>Summary</h3>
                                    <p>Last {moment(new Date().toISOString()).diff(insightReportData?.start_time, 'days')} Days</p>
                                </div>
                                <div className='viewBox'>
                                     {insightPlatforms.map(
                                      (platform) =>
                                        activePlatformList?.[platform.key] && (
                                          <div className="blueBox" key={platform.dataKey}>
                                            <p className="font-20">{platform.name}</p>
                                            <p>
                                              <span className="semibold">{sessionViews?.[platform.dataKey]}</span> VIEWS
                                            </p>
                                          </div>
                                        )
                                    )}
                                </div>
                            </div>
                            {productData?.getStreamingSessionProductsInsightsDetails?.data.map((product: IInsightReportProps) => {
                                return (
                                    <div className="l-col border-card" key={product?.id}>
                                        <div className='spacing-20'>
                                            <h3 className='gap-4'>{product?.name ?? '-'}</h3>
                                        </div>
                                        <div className='innerRow'>
                                            {activePlatformList?.[E_PLATFORMS.Facebook] && 
                                            <div className='inner-leftCol colCard'>
                                                <div className='page-bar spacing-20'><span className="icon icon-facebook fb-blue"></span>Page</div>
                                                <div className='pageDesc'>
                                                    <span className='pageDesc-bar'><span className='pageDesc-tag'>Comments</span><span className='pageDesc-num'>{product?.comment?.Facebook ?? 0}</span></span>
                                                    <span className='pageDesc-bar'><span className='pageDesc-tag'>url clicks</span><span className='pageDesc-num'>{product?.click?.Facebook ?? 0}</span></span>
                                                </div>
                                            </div>}
                                            {activePlatformList?.[E_PLATFORMS.Instagram] && 
                                            <div className='inner-rightCol colCard'>
                                                <div className='page-bar spacing-20'><span className="icon icon-instagram icon-instagram-gradient"></span>Page</div>
                                                <div className='pageDesc'>
                                                    <span className='pageDesc-bar'><span className='pageDesc-tag'>Comments</span><span className='pageDesc-num'>{product?.comment?.Instagram ?? 0}</span></span>
                                                    <span className='pageDesc-bar'><span className='pageDesc-tag'>url clicks</span><span className='pageDesc-num'>{product?.click?.Instagram ?? 0}</span></span>
                                                </div>
                                            </div>}
                                            {activePlatformList?.[E_PLATFORMS.Youtube] && 
                                            <div className='inner-leftCol colCard'>
                                                <div className='page-bar spacing-20'>
                                                    <Image className='icon'  src={IMAGE_PATH.youtubeLogo}  alt="youtube icon" width={17} height={17} layout={'fit'} objectFit={'contain'}/>
                                                    Page
                                                    </div>
                                                <div className='pageDesc'>
                                                    <span className='pageDesc-bar'><span className='pageDesc-tag'>Comments</span><span className='pageDesc-num'>{product?.comment?.Youtube ?? 0}</span></span>
                                                    <span className='pageDesc-bar'><span className='pageDesc-tag'>url clicks</span><span className='pageDesc-num'>{product?.click?.Youtube ?? 0}</span></span>
                                                </div>
                                            </div>}
                                            {activePlatformList?.[E_PLATFORMS.TikTok] && 
                                            <div className='inner-rightCol colCard'>
                                                <div className='page-bar spacing-20'><span className="icon icon-tiktok"></span>Page</div>
                                                <div className='pageDesc'>
                                                    <span className='pageDesc-bar'><span className='pageDesc-tag'>Comments</span><span className='pageDesc-num'>{product?.comment?.TikTok ?? 0}</span></span>
                                                    <span className='pageDesc-bar'><span className='pageDesc-tag'>url clicks</span><span className='pageDesc-num'>{product?.click?.TikTok ?? 0}</span></span>
                                                </div>
                                            </div>}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default InsightReport;