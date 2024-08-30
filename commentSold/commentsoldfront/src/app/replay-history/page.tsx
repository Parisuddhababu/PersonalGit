'use client'
import Pagination from "@/components/Pagination";
import { DEFAULT_LIMIT, DEFAULT_PAGE, sortOrder } from "@/constant/regex";
import { GET_HISTORY } from "@/framework/graphql/queries/replayHistory";
import "@/styles/pages/replay-history.scss";
import { useLazyQuery } from '@apollo/client';
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getConvertTimeFormat } from "@/utils/helpers";
import { ROUTES } from "@/config/staticUrl.config";
import { usePathname } from 'next/navigation';
import moment from "moment";
import Link from "next/link";
import SortingArrows from "@/components/common/SortingArrows";
import ChatLoader from "@/components/Loader/ChatLoader";
import { DATE_TIME_FORMAT } from "@/constant/common";
import { PaginationParamsList } from "@/types/graphql/common";
import { IReplayHistory } from "@/types/graphql/pages";

const ReplayHistory = () => {
    const [getHistory,{ data, refetch: refetchGetHistory, error, loading }] = useLazyQuery(GET_HISTORY);
    const [filterData, setFilterData] = useState<PaginationParamsList>(
        {
            limit: DEFAULT_LIMIT,
            page: DEFAULT_PAGE,
            sortBy: "start_time",
            sortOrder: sortOrder,
            name: ''
        }
    );
    const totalHistoryCount = data?.fetchStreamingHistory?.data?.count;
    const totalPages = Math.ceil(totalHistoryCount / filterData?.limit);
    const [activeButton, setActiveButton] = useState('newest');
    const [historyLoader, setHistoryLoader] = useState(false)
    const [isShortForName, setIsShortForName] = useState(false)
    const path = usePathname()

    const handleFilterProduct = () =>{
        if (filterData) {
            setHistoryLoader(true)
            getHistory({variables :filterData}).then(() => {
                setHistoryLoader(false)
            }).catch(() => {
                setHistoryLoader(false)
            })
        }
    }

    useEffect(()=>{
        refetchGetHistory(filterData)
    },[path])

    /*refetching filtered data*/
    useEffect(() => {
        if(isShortForName){
            const filterTimeout = setTimeout(()=>{
                handleFilterProduct()
            },600)
            return ()=> clearTimeout(filterTimeout);
        }
        handleFilterProduct()
    }, [filterData,isShortForName]);

    //user search
    const userSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setFilterData({
            ...filterData, name: e.target.value, page: 1
        })
        setIsShortForName(true)
        setHistoryLoader(true)
    };

    //pagination
    const pageClickHandler = useCallback((page: number) => {
        setFilterData({
            ...filterData,
            page: page,
        });
    }, [filterData]);

    // page select
    const pageSelectHandler = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
        setFilterData({
            ...filterData, limit: +e.target.value,
            page: DEFAULT_PAGE
        })
    }, [filterData])

    useEffect(() => {
        setHistoryLoader(loading)
        if (error?.message) {
            toast.error(error?.message)
        }
    }, [loading, error])

    const handleFilterBtns = (sortBy : string, sortOrder : string, activeKey : string) => {
        setFilterData({
            ...filterData, sortBy, sortOrder
        })
        setActiveButton(activeKey);
    }

    const handleSort = useCallback((field: string) => {
        const sortOrder = filterData.sortOrder === 'asc' ? 'desc' : 'asc';
        setFilterData({
            ...filterData,
            sortBy: field,
            sortOrder: sortOrder
        });
        setIsShortForName(false)
    }, [filterData]);

    const handleShortingIcons = useCallback((field: string, icon: string) => {
        let showIcon = true
        if (filterData?.sortBy === field) {
            showIcon = filterData.sortOrder === icon
        }
        return showIcon
    }, [filterData])

    return (
        <div className="replay-history-wrapper">
            <div className="container-lg">
                <div className="replay-history-inner">
                    <h1 className="page-title spacing-30">Replay History</h1>
                    <div className="historyCard card">
                        <div className="row spacing-30">
                            <div className="l-col">
                                <form action="">
                                    <div className="search-form-group">
                                        <div className="form-group-password">
                                            <input aria-label="Search History" className="form-control" type="text" placeholder="Search Video" name="search" onChange={userSearch} />
                                            <span className="icon-search password-icon"></span>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="r-col">
                                <div className="r-colinner">
                                    <h2 className="h3">Sort By:</h2>
                                    <ul className="list-unstyled shortByFilter mobile-dd open">
                                        <li><Link href="" onClick={() => handleFilterBtns('start_time', 'desc','newest')}
                                            className={`menuItem ${activeButton === 'newest' ? 'active' : ''}`}>Newest</Link></li>
                                        <li><Link href="" onClick={() => handleFilterBtns('start_time', 'asc','oldest')}
                                            className={`menuItem ${activeButton === 'oldest' ? 'active' : ''}`}>Oldest</Link></li>
                                        <li><Link href="" onClick={() => handleFilterBtns('duration','desc','duration')}
                                            className={`menuItem ${activeButton === 'duration' ? 'active' : ''}`}>Duration</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="table-responsive spacing-40">
                            <table className="table-col3">
                                <thead>
                                    <tr>
                                        <th>
                                            Name of video{" "}
                                            <span
                                                className="sorting"
                                                onClick={() => handleSort("stream_title")}
                                            >
                                                <SortingArrows handleShortingIcons={handleShortingIcons} field='stream_title'/>
                                            </span>
                                        </th>
                                        <th>
                                            Date & Time Created{" "}
                                            <span
                                                className="sorting"
                                                onClick={() => handleSort("start_time")}
                                            >
                                                <SortingArrows handleShortingIcons={handleShortingIcons} field='start_time'/>
                                            </span>
                                        </th>
                                        <th>
                                            Duration{" "}
                                            <span
                                                className="sorting"
                                                onClick={() => handleSort("duration")}
                                            >
                                                 <SortingArrows handleShortingIcons={handleShortingIcons} field='duration'/>
                                            </span>
                                        </th>
                                        <th>INSIGHTS</th>
                                    </tr>
                                </thead>
                                {
                                    <tbody>
                                        {
                                            data?.fetchStreamingHistory?.data?.count > 0 ? data?.fetchStreamingHistory?.data?.streamings?.map((data: IReplayHistory) => {
                                                return (
                                                    <tr key={data?.uuid}>
                                                        <td>{data?.stream_title ? data?.stream_title : (data?.schedule_stream_title ? data?.schedule_stream_title : "_")}
                                                        </td>
                                                        <td>{data?.start_time ? <><span className="date">{moment.utc(data?.start_time).local().format(DATE_TIME_FORMAT.format1)}</span><span className="time">{moment.utc(data?.start_time).local().format(DATE_TIME_FORMAT.format2)}</span></> : "-"}</td>
                                                        <td>{data?.duration ? getConvertTimeFormat(data?.duration.toString()) : "-"}</td>
                                                        <td>
                                                            <Link aria-label="Link For Insight" href={`/${ROUTES.private.insights}/${ROUTES.private.insightReport}/?uuid=${data?.uuid}`}>
                                                                <button aria-label="Insight Button" className="btn btn-primary btn-arrow-up"><span className="icon-arrow-up-right"></span></button>
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                )
                                            }) : <tr><td className="no-data text-center" colSpan={4}>No History Available</td></tr>
                                        }
                                        {
                                            historyLoader &&
                                            <ChatLoader isText={false}/>
                                        }
                                    </tbody>
                                }
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
                </div>
            </div>
        </div>
    )
}

export default ReplayHistory;