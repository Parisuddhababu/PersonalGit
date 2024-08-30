'use client'
import { ChangeEvent, Fragment, useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';
import { setLoadingState } from '@/framework/redux/reducers/commonSlice';
import DeletePopup from '@/components/Popup/DeletePopup'
import AddInfluencer from '@/components/Popup/AddInfluencer'
import { GET_INFLUENCER } from '@/framework/graphql/queries/influencer'
import { DEFAULT_LIMIT, DEFAULT_PAGE, sortBy, sortOrder } from '@/constant/regex'
import { DELETE_INFLUENCER, UPDATE_INFLUENCER_STATUS } from '@/framework/graphql/mutations/influencer'
import Pagination from '@/components/Pagination'
import "@/styles/pages/influencer.scss";
import { CommonSliceTypes } from '@/framework/redux/redux';
import { handleGraphQLErrors } from '@/utils/helpers';
import SortingArrows from '@/components/common/SortingArrows';
import ChatLoader from '@/components/Loader/ChatLoader';
import { USER_STATUS } from '@/constant/enums';
import Link from 'next/link';
import { InfluencerData } from '@/types/graphql/pages';
import { PaginationParamsList } from '@/types/graphql/common';

export default function Influencer() {
    const [deleteFrontInfluencer, { error: dError, loading: dLoading }] = useMutation(DELETE_INFLUENCER);
    const [updateFrontInfluencerStatus, { error: uError, loading: uLoading }] = useMutation(UPDATE_INFLUENCER_STATUS);
    const [filterData, setFilterData] = useState<PaginationParamsList>(
        {
            limit: DEFAULT_LIMIT,
            page: DEFAULT_PAGE,
            sortBy: sortBy,
            sortOrder: sortOrder,
            search: ''
        }
    );
    const { data, refetch: getInfluencers, error } = useLazyQuery(GET_INFLUENCER,{variables : filterData})[1];
    const [isDeletePopup, setIsDeletePopup] = useState<boolean>(false);
    const [modal, setModal] = useState<boolean>(false);
    const [editMode, setEditMode] = useState(false);
    const [deleteItemData, setDeleteItemData] = useState<string | null>("");
    const [idOfInfluencer, setIdOfInfluencer] = useState("");
    const dispatch = useDispatch();
    const [userLoader, setUserLoader] = useState(false)
    const { userDetails } = useSelector(
        (state: CommonSliceTypes) => state.common
    );
    const [isShortForName, setIsShortForName] = useState(false)
    const { brandName } = useSelector((state: CommonSliceTypes) => state.common)

    useEffect(() => {
        dispatch(setLoadingState(dLoading || uLoading))
        if (error?.message) {
            toast.error(error?.message)
        }
        if (dError?.message) {
            toast.error(dError?.message)
        }
        if (uError) {
            handleGraphQLErrors(uError)
        }
    }, [error, dError, dLoading, uError, uLoading])

    //delete influencer
    const deleteInfluencerById = (id: string) => {
        deleteFrontInfluencer({
            variables: {
                uuid: id,
            },
        }).then((response) => {
            if (response?.data?.deleteFrontInfluencer?.meta?.statusCode === 200) {
                refetchData();
                toast.success(response?.data?.deleteFrontInfluencer?.meta?.message)
            }
        }).catch((error) => {
            toast.error(error)
        })
    };

    /*status change handler*/
    const changeStatusHandler = useCallback((data: { uuid: string, status: string | number }) => {
        updateFrontInfluencerStatus({
            variables: {
                uuid: data?.uuid,
                status: data?.status === "1" ? USER_STATUS.InActive : USER_STATUS.Active,
            },
        })
            .then((response) => {
                const data = response.data;
                if (data.updateFrontInfluencerStatus.meta.statusCode === 200) {
                    toast.success(data.updateFrontInfluencerStatus.meta.message);
                    getInfluencers()
                }
            })
            .catch((error) => {
                toast.error(error);
            });
    }, []);

    const handleDeleteData = useCallback((isDelete: boolean) => {
        if (isDelete) {
            if (deleteItemData) {
                deleteInfluencerById(deleteItemData);
            }
            setDeleteItemData(null);
            onCloseDeleteModal();
        } else {
            onCloseDeleteModal();
            setDeleteItemData(null);
        }
    }, [deleteItemData, deleteInfluencerById]);

    const onCloseDeleteModal = useCallback(() => {
        setIsDeletePopup(false);
    }, [isDeletePopup]);

    const toggleModal = useCallback(() => {
        setModal(!modal);
    }, [modal]);

    const handleFilterProduct = () => {
        if (filterData) {
            setUserLoader(true)
            getInfluencers(filterData).then(() => {
                setUserLoader(false)
            }).catch(() => {
                setUserLoader(false)
            })
        }
    }

    /*refetching filtered data*/
    useEffect(() => {
        if (isShortForName) {
            const filterTimeout = setTimeout(() => {
                handleFilterProduct()
            }, 600)
            return () => clearTimeout(filterTimeout);
        }
        handleFilterProduct()
    }, [filterData, getInfluencers, isShortForName]);

    const userSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setFilterData({
            ...filterData, search: e.target.value, page: 1
        })
        setIsShortForName(true)
        setUserLoader(true)
    }

    //edit influencer
    const editInfluencer = useCallback((id: string) => {
        if (id) {
            setIdOfInfluencer(id);
            setEditMode(true);
            toggleModal();
        }
    }, [data]);

    //edit influencer
    const addInfluencer = useCallback(() => {
        setIdOfInfluencer('');
        setEditMode(false);
        toggleModal();
    }, [data]);

    //pages
    const totalInfluencersCount = data?.fetchFrontInfluencers?.data?.count;
    const totalPages = Math.ceil(totalInfluencersCount / filterData?.limit);

    const pageClickHandler = useCallback((page: number) => {
        setFilterData({
            ...filterData,
            page: page,
        });
    }, [filterData]);

    //refetch
    const refetchData = useCallback(() => {
        getInfluencers();
    }, [])

    //page select handler
    const pageSelectHandler = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
        setFilterData({
            ...filterData, limit: +e.target.value,
            page: DEFAULT_PAGE,
        })
    }, [filterData])

    //sort handler 
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
        userDetails && userDetails.user_type === '3' && <div className="influencer-wrapper">
            <div className="container-lg">
                <div className="influencer-inner">
                    <div className="row spacing-30">
                        <h1 className="page-title">Manage User/Influencer</h1>
                        {
                            brandName !== 'whi' &&
                            <button className="btn btn-secondary btn-prev" onClick={addInfluencer}><span className="icon icon-user"></span>Add Influencer</button>
                        }
                    </div>
                    <div className="influencer card">
                        <div className="row spacing-30">
                            <div className="l-col">
                                <h2 className="card-title h3">Influencers</h2>
                            </div>
                            <div className="r-col">
                                <form action="">
                                    <div className="search-form-group">
                                        <div className="form-group-password">
                                            <input aria-label="search user" className="form-control" type="text" placeholder="Search Influencer" name="search" onChange={userSearch} />
                                            <span className="icon-search password-icon"></span>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="table-responsive spacing-40">
                            <table>
                                <thead>
                                    <tr>
                                        <th>
                                            Influencer Name{" "}
                                            <span
                                                className="sorting"
                                                onClick={() => handleSort("first_name")}
                                            >
                                                <SortingArrows handleShortingIcons={handleShortingIcons} field='first_name'/>
                                            </span>
                                        </th>
                                        <th>
                                            Email Id{" "}
                                            <span
                                                className="sorting"
                                                onClick={() => handleSort("email")}
                                            >
                                                <SortingArrows handleShortingIcons={handleShortingIcons} field='email'/>
                                            </span>
                                        </th>
                                        {
                                            brandName !== 'whi' &&
                                            <Fragment>
                                                <th>
                                                    Status{" "}
                                                    <span
                                                        className="sorting"
                                                        onClick={() => handleSort("status")}
                                                    >
                                                        <SortingArrows handleShortingIcons={handleShortingIcons} field='status'/>
                                                    </span>
                                                </th>
                                                <th>
                                                    Action{" "}
                                                    <span className="sorting">
                                                        <span className=""></span>
                                                        <span className=""></span>
                                                    </span>
                                                </th>
                                            </Fragment>
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.fetchFrontInfluencers?.data?.influencerData?.length > 0  ? data?.fetchFrontInfluencers?.data?.influencerData?.map((data: InfluencerData) => {
                                        return (
                                            <tr key={data.uuid}>
                                                <td>{data?.first_name ? data?.first_name : "-"}{" "}{data?.last_name ? data?.last_name : "-"}</td>
                                                <td>{data?.email ? data?.email : "-"}</td>
                                                {
                                                    brandName !== 'whi' &&
                                                    <Fragment>
                                                        <td>
                                                            <div className="toggle-btn">
                                                                <input type="checkbox" id={`toggle-${data.uuid}-${data?.status === "1" ? "yes" : "no"}`} checked={data?.status === "1"} onClick={() => {
                                                                    changeStatusHandler(data)
                                                                }} />
                                                                <span className="circle"></span>
                                                                <label htmlFor={`toggle-${data.uuid}-yes`}  className="toggle-yes">yes</label>
                                                                <label htmlFor={`toggle-${data.uuid}-no`}  className="toggle-no">No</label>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="action-row">
                                                                <Link href="" className="actionIcon" aria-label="edit icon" onClick={() => {
                                                                    editInfluencer(data?.uuid);
                                                                }}><span className="icon-pen"></span></Link>
                                                                <Link href="" className="actionIcon" aria-label="delete icon"
                                                                    onClick={() => {
                                                                        setIsDeletePopup(true);
                                                                        setDeleteItemData(data?.uuid);
                                                                    }}
                                                                ><span className="icon-trash"></span></Link>
                                                            </div>
                                                        </td>
                                                    </Fragment>
                                                }
                                            </tr>
                                        )
                                    }) : 
                                        <tr>
                                            <td colSpan={4} className='text-center'>No Influencers Found</td>
                                        </tr>
                                    }
                                    {
                                        userLoader &&
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
                        <AddInfluencer
                            onClose={toggleModal}
                            idOfInfluencer={idOfInfluencer}
                            editMode={editMode}
                            refetchData={refetchData}
                            modal={modal}
                        />
                        <DeletePopup
                            onClose={onCloseDeleteModal}
                            isDelete={handleDeleteData}
                            message='Are you sure you want to delete account?'
                            isShow={isDeletePopup}
                            title='Delete influencer'
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}





