import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, InfoIcon, Search } from '@components/icons/icons';
import Button from '@components/button/button';
import UpdatedHeader from '@components/header/updatedHeader';
import { useNavigate } from 'react-router-dom';
import { DELETE_WARNING_TEXT, ROUTES, USER_TYPE, convertMinutesToHoursAndMinutes } from '@config/constant';
import { DropdownOptionType, PaginationParams } from '@types';
import { useMutation, useQuery } from '@apollo/client';
import { useSelector } from 'react-redux';
import { UserProfileType, UserRoles } from 'src/types/common';
import { toast } from 'react-toastify';
import { GET_COURSE_BY_PLAYLIST } from '@framework/graphql/queries/getCourses';
import LoadingIndicator from '@components/loadingIndicator/loaderIndicator';
import TextInput from '@components/textInput/TextInput';
import { DELETE_PLAYLIST } from '@framework/graphql/mutations/playlist';
import CommonModel from '@components/common/commonModel';
import ButtonWithoutLoader from '@components/button/buttonWithoutLoader';
import { CourseData } from 'src/types/courseTemplate';
import logo from '@assets/images/login-img.jpg';
import profile from '@assets/images/default-user-image.png';

const Index = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const playListId = queryParams.get('playlist_id');
    const [deleteCourse, deleteLoading] = useMutation(DELETE_PLAYLIST);
    const { templates } = useSelector(((state: { rolesManagement: { templates: UserRoles } }) => state.rolesManagement));
    const [onDelete, setOnDelete] = useState<boolean>(false);
    const { data: getCourseData, refetch, loading } = useQuery(GET_COURSE_BY_PLAYLIST, {
        variables: {
            filterData: {
                limit: 8,
                page: 1,
                playlist_id: playListId,
                search: '',
                sortField: 'createdAt',
                sortOrder: 'desc',
            }
        }
    });
    const [filterData, setFilterData] = useState<PaginationParams>({
        limit: 8,
        page: 1,
        playlist_id: playListId,
        sortField: 'createdAt',
        sortOrder: 'desc',
        search: '',
    });
    const [onViewMore, setOnViewMore] = useState<boolean>(false);
    const [isRefetching, setIsRefetching] = useState<boolean>(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [isTemplateData, setIsTemplateData] = useState<any[]>([]);

    const onCourseView = (uuid: string) => {
        navigate(`/${ROUTES.app}/${ROUTES.tfsCoursesTemplates}/${ROUTES.courseDetails}/?uuid=${uuid}`)
    }

    const viewMore = () => {
        setOnViewMore(true);
        setFilterData({
            ...filterData,
            page: filterData.page + 1
        });
    }

    useEffect(() => {
        const tempDataArr: DropdownOptionType[] = [];
        getCourseData?.getPlaylistWiseCourses?.data?.courses?.map((data: CourseData) => {
            tempDataArr.push(data);
        });
        if (onViewMore) {
            setIsTemplateData([...isTemplateData, ...tempDataArr]);
            setOnViewMore(onViewMore ?? !onViewMore);
        } else {
            setIsTemplateData(tempDataArr);
        }
    }, [getCourseData]);

    useEffect(() => {
        const fetchData = async () => {
            setIsRefetching(true);
            try {
                await refetch({
                    filterData: { ...filterData },
                });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                toast.error(error?.networkError?.result?.errors?.[0]?.message)
            } finally {
                setIsRefetching(false);
                setOnViewMore(onViewMore ?? !onViewMore);
            }
        };
        if (filterData) {
            fetchData();
        }
    }, [filterData]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFilterData({ ...filterData, search: e.target.value })
    }, [filterData])

    const { userProfileData } = useSelector(((state: { userProfile: { userProfileData: UserProfileType } }) => state.userProfile));
    const userType = userProfileData?.getProfile?.data?.user_type ?? ''

    const onDeleteCourse = useCallback(() => {
        setOnDelete(true);
    }, [])

    const onClose = () => {
        setOnDelete(false);
    }

    const onRemovePlaylist = useCallback(() => {
        deleteCourse({
            variables: {
                playlistId: playListId
            }
        }).then((res) => {
            const data = res.data.deleteCourse
            toast.success(data?.message);
            refetch();
            navigate(-1);
        })
            .catch((err) => {
                toast.error(err?.networkError?.result?.errors?.[0]?.message);
            });
    }, [])

    const headerActionConst = () => {
        return (
            <>
                {templates?.write &&
                    <Button label='Delete Playlist' className='btn-secondary btn-normal md:w-[150px] whitespace-nowrap' onClick={onDeleteCourse}>
                    </Button>
                }
            </>
        )
    }

    const viewIsEditablePlaylistCourses = (data: CourseData) => {
        return [USER_TYPE?.SUPER_ADMIN, USER_TYPE?.SUBSCRIBER_ADMIN].includes(+data?.created_by?.user_type) || userProfileData?.getProfile?.data?.is_course_admin || userProfileData?.getProfile?.data?.is_course_creator
    }

    return (
        <>
            <UpdatedHeader headerActionConst={headerActionConst} />
            <div className='mb-7'>
                <div className='p-5 border border-solid border-border-primary rounded-xl'>
                    <div className="flex flex-wrap justify-between gap-3 mb-5 md:gap-5">
                        <h6>{t('Playlist all courses')}</h6>
                        <TextInput placeholder={t('Search')} type='text' id='table-search' value={filterData.search} onChange={handleChange} inputIcon={<Search fontSize='18' />} />
                    </div>
                    {(loading || (isRefetching && !onViewMore)) ? <LoadingIndicator /> :
                        <div className="flex flex-wrap items-start justify-center gap-5 mb-7 sm:justify-start">
                            {getCourseData?.getPlaylistWiseCourses?.data?.count > 0 ? <>
                                {isTemplateData?.map((data: CourseData) => (
                                    <button className={'w-full 2xl:w-[calc(25%-15px)] text-left xl:w-[calc(33.3%-15px)] lg:w-[calc(50%-15px)] border-border-primary  h-full'} key={data?.uuid} title=''>
                                        <picture className='w-full block relative border-b border-solid border-border-primary'>
                                            <img src={(data?.course_image === '' || !data?.course_image) ? logo : `${process.env.REACT_APP_IMAGE_BASE_URL}/${data.course_image}`} alt="Course Image" title="Course Image" className='object-cover w-full h-full rounded-t-xl' />
                                        </picture>

                                        <div className="flex flex-col w-full p-5 border-b border-solid border-x border-border-primary rounded-b-xl min-h-340px">
                                            <div className={`${userType !== USER_TYPE.SUBSCRIBER_EMPLOYEE ? 'cursor-pointer' : 'pointer-events-auto'} flex flex-col flex-1`} onClick={() => onCourseView(data.uuid)}>
                                                <div className="flex-wrap flex items-center justify-between mb-2.5 gap-2">
                                                    <div>
                                                        <span className='h-9 flex items-center justify-center bg-p-list-box-btn font-bold text-white md:mb-0  px-4 rounded-xl min-w-[100px] text-sm mr-4'>{data?.category.name}</span>
                                                    </div>
                                                    {viewIsEditablePlaylistCourses(data) && <div className='relative group'>
                                                        <InfoIcon className='text-base md:text-lg cursor-pointer fill-primary' />
                                                        <p className='absolute whitespace-nowrap left-auto shadow-infos p-1.5 md:p-2.5 bg-white border border-border-primary rounded-xl md:right-0 xd:left-1 -top-[68px] md:-top-14 hidden group-hover:inline-block z-10'>{data?.is_editable ? 'Editable Course' : 'Non-Editable Course'}</p>
                                                    </div>}
                                                </div>
                                                <h4 className='text-base hover:text-primary mb-2.5 truncate'>{data?.title}</h4>
                                                <p className='leading-6 mb-3 md:mb-5 w-full text-ellipsis line-clamp-3 break-words' dangerouslySetInnerHTML={{ __html: data?.description }}></p>
                                                <div className="flex flex-wrap justify-between items-center gap-2 mt-auto">
                                                    <div className="flex items-center gap-2">
                                                        <picture className='w-[40px] h-[40px] flex items-center justify-center rounded-full overflow-hidden border border-solid border-border-primary'>
                                                            <img src={(data?.instructor_profile === '' || !data?.instructor_profile) ? profile : `${process.env.REACT_APP_IMAGE_BASE_URL}/${data?.instructor_profile}`} alt="Profile" title='Profile' className='object-cover w-full h-full' />
                                                        </picture>
                                                        <p className='font-semibold'>{data?.instructor_name}</p>
                                                    </div>
                                                    <div className="time max-xmd:my-2.5">
                                                        <span className="flex text-xs"><span className='mr-1 text-base'><Clock className='fill-secondary' /></span><span>{`${convertMinutesToHoursAndMinutes(data?.estimate_time).hours} h ${convertMinutesToHoursAndMinutes(data?.estimate_time).minutes} m`}</span></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </> : <div>No Records Found!!!</div>}
                        </div>
                    }

                    <div className="flex items-center justify-center">
                        <ButtonWithoutLoader className='btn-secondary btn-normal w-full md:w-[120px]' label={isRefetching && onViewMore ? t('Loading...!') : t('Load More')} onClick={() => viewMore()} disabled={loading || isRefetching || (getCourseData?.getPlaylistWiseCourses?.data?.count === isTemplateData.length)} title={`${isRefetching && onViewMore ? t('Loading...!') : t('Load More')}`} />
                    </div>
                </div>
            </div>

            {onDelete && (
                <CommonModel
                    disabled={deleteLoading?.loading}
                    isLoading={deleteLoading?.loading}
                    warningText={DELETE_WARNING_TEXT}
                    onClose={onClose}
                    action={() => onRemovePlaylist()}
                    show={onDelete}
                />
            )}
        </>
    );
};
export default Index;
