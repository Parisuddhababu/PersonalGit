
'use client'
import React, { ChangeEvent, Fragment, useCallback, useEffect, useState } from 'react';
import "@/styles/pages/influencer.scss";
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_SCHEDULE_STREAMING } from '@/framework/graphql/queries/schedules';
import { useDispatch, useSelector } from 'react-redux';
import { setLoadingState } from '@/framework/redux/reducers/commonSlice';
import moment from 'moment';
import { DATE_TIME_FORMAT, LOCAL_STORAGE_KEY } from '@/constant/common';
import Pagination from '@/components/Pagination';
import { DEFAULT_LIMIT, DEFAULT_PAGE, sortBy, sortOrder } from '@/constant/regex';
import Link from 'next/link';
import { ROUTES } from '@/config/staticUrl.config';
import { usePathname, useRouter } from 'next/navigation';
import { CommonSliceTypes } from '@/framework/redux/redux';
import { isCurrentTimeOver, isDateBetween } from '@/utils/helpers';
import { toast } from 'react-toastify';
import { DELETE_SCHEDULE_STREAMING } from '@/framework/graphql/mutations/schedule';
import { Message } from '@/constant/errorMessage';
import DeletePopup from '@/components/Popup/DeletePopup';
import ViewScheduleDetails from '@/components/Popup/ViewSchedule';
import { IScheduleData } from '@/types/pages';
import SortingArrows from '@/components/common/SortingArrows';
import ChatLoader from '@/components/Loader/ChatLoader';
import { PaginationParamsList } from '@/types/graphql/common';

const LiveSchedule = () => {
    const [getScheduleStreaming, { data, refetch: refetchGetScheduleStreaming, loading }] = useLazyQuery(GET_SCHEDULE_STREAMING);
    const [deleteScheduleStreaming, { error: dError, loading: dLoading }] = useMutation(DELETE_SCHEDULE_STREAMING);
    const [deleteItemData, setDeleteItemData] = useState<string | null>("");
    const [deletePopupStates, setDeletePopupStates] = useState({ isShow: false, message: '', operation: '', title: '' });
    const [singleScheduleId, setSingleScheduleId] = useState<string | null>('');
    const [model, setModel] = useState<boolean>(false);
    const dispatch = useDispatch();
    const [filterData, setFilterData] = useState<PaginationParamsList>(
        {
            limit: DEFAULT_LIMIT,
            page: DEFAULT_PAGE,
            sortBy: sortBy,
            sortOrder: sortOrder,
        }
    );
    const { userType, isWhiInfluencer, brandName } = useSelector((state: CommonSliceTypes) => state.common)
    const totalInfluencersCount = data?.fetchScheduleStreaming?.data?.count;
    const totalPages = Math.ceil(totalInfluencersCount / filterData?.limit);
    const router = useRouter();
    const path = usePathname()
    const [scheduleLoader, setScheduleLoader] = useState<Boolean>(false)

    useEffect(() => {
        refetchGetScheduleStreaming(filterData)
    }, [path])

    useEffect(() => {
        if (filterData) {
            setScheduleLoader(true)
            getScheduleStreaming({ variables: filterData }).then(() => {
                setScheduleLoader(false)
            }).catch(() => {
                setScheduleLoader(false)
            })
        }
    }, [filterData]);

    const pageClickHandler = useCallback((page: number) => {
        setFilterData({
            ...filterData,
            page: page,
        });
    }, [filterData]);

    const pageSelectHandler = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
        setFilterData({
            ...filterData, limit: +e.target.value,
            page: DEFAULT_PAGE
        })
    }, [filterData])

    useEffect(() => {
        dispatch(setLoadingState(dLoading))
        setScheduleLoader(loading)
        if (dError?.message) {
            toast.error(dError?.message)
        }
    }, [dError, dLoading,loading])

    useEffect(() => {
        router.prefetch(`/${ROUTES.private.liveSchedule}/${ROUTES.private.createLiveSchedule}`)
    }, [router])

    const redirectToCreateSchedule = () => {
        router.push(`/${ROUTES.private.liveSchedule}/${ROUTES.private.createLiveSchedule}`)
    }

    //sort handler
    const handleSort = useCallback((field: string) => {
        const sortOrder = filterData.sortOrder === 'asc' ? 'desc' : 'asc';
        setFilterData({
            ...filterData,
            sortBy: field,
            sortOrder: sortOrder
        });
    }, [filterData]);

    const handleShortingIcons = useCallback((field: string, icon: string) => {
        let showIcon = true
        if (filterData?.sortBy === field) {
            showIcon = filterData.sortOrder === icon
        }
        return showIcon
    }, [filterData])

    const redirectToGoLive = (scheduledId: string, invitationUrl?: string) => {
        localStorage.removeItem(LOCAL_STORAGE_KEY.isReload)
        if (invitationUrl) {
            router.push(`/${ROUTES.private.goLive}?token=${invitationUrl}`)
            return
        }
        router.push(`/${ROUTES.private.goLive}?scheduledId=${scheduledId}`)
    }

    // delete schedule streaming
    const deleteScheduleStreamingById = (id: string) => {
        deleteScheduleStreaming({
            variables: {
                scheduleUuid: id,
            },
        }).then((response) => {
            if (response?.data?.deleteScheduleStreaming?.meta?.statusCode === 200) {
                toast.success(response?.data?.deleteScheduleStreaming?.meta?.message)
                refetchGetScheduleStreaming(filterData);
            }
        })
    };

    const onCloseDeleteModal = useCallback(() => {
        setDeletePopupStates((pre) => ({ ...pre, isShow: false }))
        setModel(false);
        setSingleScheduleId('')
    }, [deletePopupStates]);

    const handleDeleteData = useCallback((isDelete: boolean) => {
        if (isDelete) {
            if (deleteItemData) {
                deleteScheduleStreamingById(deleteItemData);
            }
            setDeleteItemData(null);
            onCloseDeleteModal();
        } else {
            onCloseDeleteModal();
            setDeleteItemData(null);
        }
    }, [deleteItemData, deleteScheduleStreamingById]);

    const GoLiveButton = ({
        status,
        timeZone,
        end_date,
        schedule_date,
        schedule_time,
        invitation_url,
        uuid,
    }: {
        status: string
        timeZone: string
        end_date: string
        schedule_date: string
        schedule_time: string
        invitation_url: string
        uuid: string
    }) => {
        if (status !== 'Pending') {
            return <button className='btn btn-secondary btn-sm' disabled>
                Finished
            </button>
        }
        if (status === 'Pending') {
            if (isCurrentTimeOver(timeZone, end_date)) {
                return <button className='btn btn-secondary btn-sm' disabled>
                    Expired
                </button>
            }
            if (isDateBetween(schedule_date, schedule_time, timeZone, end_date) && userType !== 'brand') {
                return <button className='btn btn-primary btn-sm'
                    onClick={() => redirectToGoLive(uuid, invitation_url)}>
                    Go Live
                </button>
            }
        }
        return <button className='btn btn-primary btn-sm'>
            Pending
        </button>
    }

    return (
        <div className="influencer-wrapper">
            <div className="container-lg">
                <div className="influencer-inner">
                    <div className="row spacing-30">
                        <h1 className="page-title">Live Schedule</h1>
                        {
                            ((userType == 'brand' && brandName !== 'whi') || userType === 'influencer' || isWhiInfluencer) &&
                            <button className="btn btn-secondary" onClick={redirectToCreateSchedule}>
                                Create Live Schedule
                            </button>
                        }
                    </div>
                    <div className="influencer card">
                        <div className="table-responsive bg-white vertical-align-middle spacing-40">
                            <table className="checkTable">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>
                                            LIVE TITLE
                                            <span className="sorting" onClick={() => handleSort("stream_title")}>
                                                <SortingArrows handleShortingIcons={handleShortingIcons} field='stream_title'/>
                                            </span>
                                        </th>
                                        <th>
                                            DATE AND TIME
                                            <span className="sorting" onClick={() => handleSort("created_at")}>
                                                <SortingArrows handleShortingIcons={handleShortingIcons} field='created_at'/>
                                            </span>
                                        </th>
                                        <th>ACTION</th>
                                        <th>STATUS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data?.fetchScheduleStreaming?.data?.scheduleData?.length > 0 ?
                                            data?.fetchScheduleStreaming?.data?.scheduleData?.map((item: IScheduleData) => (
                                                <tr key={item?.uuid}>
                                                    <td><span className="icon-calendar color-title-text"></span></td>
                                                    <td>{item?.stream_title ?? 'Video'}</td>
                                                    <td>
                                                        <span className="date">{moment.tz(`${item.schedule_date}T${item.schedule_time}`, item?.timeZone).utc().tz(moment.tz.guess(true)).format(DATE_TIME_FORMAT.format1)}</span>
                                                        <span className="time">{moment.tz(`${item.schedule_date}T${item.schedule_time}`, item?.timeZone).utc().tz(moment.tz.guess(true)).format(DATE_TIME_FORMAT.format2)}</span>
                                                    </td>
                                                    <td>
                                                        <div className="action-row">
                                                            <Link href="" aria-label="eye link" onClick={() => {
                                                                setSingleScheduleId(item?.uuid);
                                                                setModel(true);
                                                            }} className="actionIcon"><span className="icon-eye"></span></Link>
                                                            {
                                                                (item?.status === 'Pending' && !item?.invitation_url && !isCurrentTimeOver(item?.timeZone, item?.end_date)) &&
                                                                <Fragment>
                                                                   {(brandName !== 'whi' || isWhiInfluencer) && <Link aria-label="edit link" href={`/${ROUTES.private.liveSchedule}/update-schedule/?uuid=${item.uuid}`} className="actionIcon"><span className="icon-pen"></span></Link>}
                                                                    {(brandName !== 'whi' || isWhiInfluencer) && <Link aria-label="delete link" href="" onClick={() => {
                                                                        setDeletePopupStates({ message: Message.CONFIRM_DELETE_SCHEDULE_STREAM, isShow: true, operation: 'singleDelete', title: 'Delete Schedule Streaming' })
                                                                        setDeleteItemData(item?.uuid!);
                                                                    }} className="actionIcon"><span className="icon-trash"></span></Link>}
                                                                </Fragment>
                                                            }
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <GoLiveButton
                                                            status={item?.status}
                                                            timeZone={item?.timeZone}
                                                            end_date={item?.end_date}
                                                            schedule_date={item?.schedule_date}
                                                            schedule_time={item?.schedule_time}
                                                            invitation_url={item?.invitation_url}
                                                            uuid={item?.uuid}
                                                        />

                                                    </td>
                                                </tr>
                                            )) :
                                            <tr>
                                                <td className='text-center' colSpan={5}>No Schedule Found</td>
                                            </tr>
                                        }
                                        {
                                            scheduleLoader &&
                                            <ChatLoader isText={false}/>
                                        }
                                </tbody>
                            </table>
                        </div>
                        <Pagination
                            totalPages={totalPages}
                            onPageChange={pageClickHandler}
                            filterPage={filterData.page}
                            pageSelectHandler={pageSelectHandler}
                            totalIteamCount={totalInfluencersCount}
                        />
                    </div>
                </div>
            </div>
            <DeletePopup
                onClose={onCloseDeleteModal}
                isDelete={handleDeleteData}
                message={deletePopupStates?.message}
                isShow={deletePopupStates?.isShow}
                title={deletePopupStates.title}
            />

            <ViewScheduleDetails SingleScheduleId={singleScheduleId!} model={model} onClose={onCloseDeleteModal} />
        </div>

    )
}

export default LiveSchedule