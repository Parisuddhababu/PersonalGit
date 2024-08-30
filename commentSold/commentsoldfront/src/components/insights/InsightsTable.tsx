"use client";
import { ROUTES } from "@/config/staticUrl.config";
import { DateFilter, IInsightsProps, ITopFiveData } from "@/types/pages";
import moment from "moment";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import ChatLoader from "../Loader/ChatLoader";
import { DATE_TIME_FORMAT } from "@/constant/common";
import Image from "next/image";
import { PaginationParamsList } from "@/types/graphql/common";
import { DEFAULT_PAGE, sortOrder } from "@/constant/regex";
import { useLazyQuery } from "@apollo/client";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { CommonSliceTypes } from "@/framework/redux/redux";
import useInfiniteScroll from "@/framework/hooks/useInfiniteScroll";
import SortingArrows from "../common/SortingArrows";
import { IMAGE_PATH } from "@/constant/imagePath";
import useGetActiveSocialPlatform from "@/framework/hooks/useGetActiveSocialPlatform";
import { E_PLATFORMS } from "@/constant/enums";

const InsightsTable = ({ tableFor, query, dateObject }: IInsightsProps) => {
  const [getData, { data, loading, refetch: refetchData }] = useLazyQuery(query);
  const path = usePathname();
  const { userType } = useSelector((state: CommonSliceTypes) => state.common);
  const [loadMoreData, setLoadMoreData] = useState<ITopFiveData[]>([]);
  const [showScrollRef, setShowScrollRef] = useState<boolean>(false);
  const totalPages = Math.ceil((data?.[tableFor === "views" ? "getTopFiveViewsInsights" : "getTopFiveCommentsInsights"]?.data?.count ?? 0)/5);
  const {activePlatformList} = useGetActiveSocialPlatform();

  const [filterData, setFilterData] = useState<PaginationParamsList>({
    limit: 5,
    page: DEFAULT_PAGE,
    sortBy: "start_time",
    sortOrder: sortOrder,
  });

  const fetchFilteredData = (filterObject: DateFilter) => {
    getData({ variables: filterObject });
  };

  useEffect(()=>{
    setShowScrollRef(false)
    if(!loading){
      const timeout = setTimeout(()=>{
        setShowScrollRef(true)
      },100)
      return ()=>{
        clearTimeout(timeout)
      }
    }
  },[loading])

  useEffect(() => {
    fetchFilteredData({ ...dateObject, ...filterData });
    refetchData();
  }, [path, userType]);

  useEffect(() => {
    fetchFilteredData({ ...dateObject, ...filterData });
  }, [filterData]);

  useEffect(() => {
    setLoadMoreData([]);
    setFilterData({ ...filterData, page: DEFAULT_PAGE, sortBy: "start_time", sortOrder: sortOrder});
  }, [dateObject]);

  const loadMore = () => {
      if(filterData.page + 1  > totalPages){
        setShowScrollRef(false);
        return;
      };
      setFilterData({ ...filterData, page: filterData.page + 1 });
  };

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

  const handleSort = useCallback(
    (field: string) => {
      const sortOrder = filterData.sortOrder === "asc" ? "desc" : "asc";
      setLoadMoreData([]);
      setFilterData({
        ...filterData,
        sortBy: field,
        sortOrder: sortOrder,
        page: DEFAULT_PAGE,
      });
    },
    [filterData]
  );

  useEffect(() => {
    if (data?.[tableFor === "views" ? "getTopFiveViewsInsights" : "getTopFiveCommentsInsights"]?.data?.[tableFor]?.length > 0) {
      setLoadMoreData((pre) => [...pre, ...data?.[tableFor === "views" ? "getTopFiveViewsInsights" : "getTopFiveCommentsInsights"]?.data?.[tableFor]]);
    }
  }, [data]);

  const { lastItemRef } = useInfiniteScroll(loadMore);
  return (
    <div className="insights-table-col">
      <h2 className="h3 spacing-20">{tableFor === "views" ? "Views" : "Comments"}</h2>
      <div className="table-responsive insights-table table-md insights-table-with-scroll">
        <table>
          <thead>
            <tr>
              <th>
                SESSION NAME
                <span className="sorting" onClick={() => handleSort("stream_title")}>
                  <SortingArrows handleShortingIcons={handleShortingIcons} field="stream_title" />
                </span>
              </th>
              <th>
                DATE
                <span className="sorting" onClick={() => handleSort("start_time")}>
                  <SortingArrows handleShortingIcons={handleShortingIcons} field="start_time" />
                </span>
              </th>
              {activePlatformList?.[E_PLATFORMS.Facebook] &&
              <th aria-label="Facebook Icon">
                <span className="icon icon-facebook"></span>
                <span className="sorting" onClick={() => handleSort(tableFor === "views" ? "facebook_views" : "facebook_comments")}>
                  <SortingArrows handleShortingIcons={handleShortingIcons} field={tableFor === "views" ? "facebook_views" : "facebook_comments"} />
                </span>
              </th>}
              {activePlatformList?.[E_PLATFORMS.Instagram] &&
              <th aria-label="Instagram Icon">
                <span className="icon icon-instagram icon-instagram-gradient"></span>
                <span className="sorting" onClick={() => handleSort(tableFor === "views" ? "instagram_views" : "instagram_comments")}>
                  <SortingArrows handleShortingIcons={handleShortingIcons} field={tableFor === "views" ? "instagram_views" : "instagram_comments"} />
                </span>
              </th>}
              {activePlatformList?.[E_PLATFORMS.Youtube] &&
              <th aria-label="Youtube Icon">
                <Image src={IMAGE_PATH.youtubeLogo}  alt="youtube icon" width={16} height={16} layout={'fit'} objectFit={'contain'}/>
                <span className="sorting" onClick={() => handleSort(tableFor === "views" ? "youtube_views" : "youtube_comments")}>
                  <SortingArrows handleShortingIcons={handleShortingIcons} field={tableFor === "views" ? "youtube_views" : "youtube_comments"} />
                </span>
              </th>}
              {activePlatformList?.[E_PLATFORMS.TikTok] &&
              <th aria-label="TikTok Icon">
                <span className="icon icon-tiktok"></span>
                <span className="sorting" onClick={() => handleSort(tableFor === "views" ? "tiktok_views" : "tiktok_comments")}>
                  <SortingArrows handleShortingIcons={handleShortingIcons} field={tableFor === "views" ? "tiktok_views" : "tiktok_comments"} />
                </span>
              </th>}
              <th>{tableFor === "views" ? "INSIGHTS" : "EXPAND"}</th>
            </tr>
          </thead>
          <tbody className="scrollbar-sm">
            {loadMoreData?.length > 0 ? (
              <>
                {loadMoreData?.map((session: ITopFiveData) => (
                  <tr key={session.uuid}>
                    <td>{session.stream_title || "-"}</td>
                    <td className="date">{moment.utc(session?.start_time).local().format(DATE_TIME_FORMAT.format1)}</td>
                    {activePlatformList?.[E_PLATFORMS.Facebook] && <td>{tableFor === "views" ? session.facebook_views : session.facebook_comments}</td>}
                    {activePlatformList?.[E_PLATFORMS.Instagram] && <td>{tableFor === "views" ? session.instagram_views : session.instagram_comments}</td>}
                    {activePlatformList?.[E_PLATFORMS.Youtube] &&  <td>{tableFor === "views" ? session.youtube_views : session.youtube_comments}</td>}
                    {activePlatformList?.[E_PLATFORMS.TikTok] &&  <td>{tableFor === "views" ? session.tiktok_views : session.tiktok_comments}</td>}
                    <td>
                      <Link aria-label="Link For Insight" href={`/${ROUTES.private.insights}/${ROUTES.private.insightReport}/?uuid=${session?.user_streaming_id}`}>
                        <button aria-label="Insight Report" className="btn btn-primary btn-arrow-up">
                          <span className="icon-arrow-up-right"></span>
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
                {loading && (
                  <tr>
                    <td colSpan={5} className="text-center insight-table-col-full">
                      <div className="insights-table-loader">
                        <Image src={"/images/loading.gif"} alt="page not found" width={30} height={30} style={{ objectFit: "contain" }} />
                      </div>
                    </td>
                  </tr>
                )}
                {showScrollRef && (
                  <tr ref={lastItemRef}>
                    <td colSpan={5}></td>
                  </tr>
                )}
              </>
            ) : (
              <tr>
                <td colSpan={5} className="text-center insight-table-col-full">
                  No Data Found
                </td>
              </tr>
            )}
            {filterData.page === 1 && loading && <ChatLoader isText={false} />}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InsightsTable;
