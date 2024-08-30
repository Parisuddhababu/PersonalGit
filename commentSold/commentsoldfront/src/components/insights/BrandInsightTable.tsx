"use client";
import { DateFilter, IBrandInsightsProps, ITopFiveInfluencers } from "@/types/pages";
import React, { useCallback, useEffect, useState } from "react";
import ChatLoader from "../Loader/ChatLoader";
import { useLazyQuery } from "@apollo/client";
import useInfiniteScroll from "@/framework/hooks/useInfiniteScroll";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { CommonSliceTypes } from "@/framework/redux/redux";
import { PaginationParamsList } from "@/types/graphql/common";
import { DEFAULT_PAGE, sortOrder } from "@/constant/regex";
import { useSelector } from "react-redux";
import SortingArrows from "../common/SortingArrows";

const BrandInsightsTable = ({ tableFor, title, query, dateObject }: IBrandInsightsProps) => {
  const [getData, { data, loading, refetch: refetchData }] = useLazyQuery(query);
  const path = usePathname();
  const { userType } = useSelector((state: CommonSliceTypes) => state.common);
  const [loadMoreData, setLoadMoreData] = useState<ITopFiveInfluencers[]>([]);
  const [showScrollRef, setShowScrollRef] = useState<boolean>(false);
  const totalPages = Math.ceil((data?.[tableFor === "influencer" ? "getTopFiveInfluencerInsights" : "getTopFiveProductInsights"]?.data?.count ?? 0) / 5);

  const [filterData, setFilterData] = useState<PaginationParamsList>({
    limit: 5,
    page: DEFAULT_PAGE,
    sortBy: tableFor === "influencer" ? "total_streaming_count" : "total_click_count",
    sortOrder: sortOrder,
  });

  const fetchFilteredData = (filterObject: DateFilter) => {
    getData({ variables: filterObject });
  };

  useEffect(() => {
    setShowScrollRef(false);
    if (!loading) {
      const timeout = setTimeout(() => {
        setShowScrollRef(true);
      }, 100);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [loading]);

  useEffect(() => {
    fetchFilteredData({ ...dateObject, ...filterData });
    refetchData();
  }, [path, userType]);

  useEffect(() => {
    fetchFilteredData({ ...dateObject, ...filterData });
  }, [filterData]);

  useEffect(() => {
    setLoadMoreData([]);
    setFilterData({ ...filterData, page: DEFAULT_PAGE, sortBy: tableFor === "influencer" ? "total_streaming_count" : "total_click_count", sortOrder: sortOrder });
  }, [dateObject]);

  const loadMore = () => {
    if (filterData.page + 1 > totalPages) {
      setShowScrollRef(false);
      return;
    }
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
    if (data?.[tableFor === "influencer" ? "getTopFiveInfluencerInsights" : "getTopFiveProductInsights"]?.data?.[tableFor].length > 0) {
      setLoadMoreData((pre) => [...pre, ...data?.[tableFor === "influencer" ? "getTopFiveInfluencerInsights" : "getTopFiveProductInsights"]?.data?.[tableFor]]);
    }
  }, [data]);

  const { lastItemRef } = useInfiniteScroll(loadMore);

  return (
    <div className="insights-table-col">
      <h2 className="h3 spacing-20">{title}</h2>
      <div className="table-responsive insights-table table-md insights-table-with-scroll top-five">
        <table>
          <thead>
            <tr>
              <th>
                {tableFor === "influencer" ? "influencer Name" : "Product List"}
                <span className="sorting" onClick={() => handleSort("name")}>
                  <SortingArrows handleShortingIcons={handleShortingIcons} field="name" />
                </span>
              </th>
              <th className="white-space-nowrap">
                {tableFor === "influencer" ? "Total Sessions" : "Total Clicks"}
                <span className="sorting" onClick={() => handleSort(tableFor === "influencer" ? "total_streaming_count" : "total_click_count")}>
                  <SortingArrows handleShortingIcons={handleShortingIcons} field={tableFor === "influencer" ? "total_streaming_count" : "total_click_count"} />
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="scrollbar-sm">
            {loadMoreData?.length > 0 ? (
              <>
                {loadMoreData?.map((topData: ITopFiveInfluencers) => (
                  <tr key={topData.uuid}>
                    <td>{topData?.name || "-"}</td>
                    <td>{topData?.total_streaming_count || topData?.total_click_count || "-"}</td>
                  </tr>
                ))}
                {loading && (
                  <tr>
                    <td className="text-center insight-table-col-full">
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

export default BrandInsightsTable;
