import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DynamicTabsProps, Tab } from 'src/types/component';
import { Archive, Download, Edit, HamburgerMenu, Trash } from '@components/icons/icons';
import Button from '@components/button/button';
import { API_MEDIA_END_POINT, UNARCHVIVES_WARNING_TEXT, COUSER_FLAG, DELETE_WARNING_TEXT, ROUTES, USER_TYPE, EDIT_WARNING_TEXT } from '@config/constant';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CourseClone, CourseDetailsPage, UserProfileType } from 'src/types/common';
import CommonModel from '@components/common/commonModel';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_ARCHIVE_STATE } from '@framework/graphql/mutations/archivesAndDraftsManagement';
import { DELETE_COURSE } from '@framework/graphql/mutations/course';
import { GET_COURSE_PERMISSIONS } from '@framework/graphql/queries/getCourses';

const Tabs: React.FC<DynamicTabsProps> = ({ tabs, containerMinimize }) => {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState<number>(0);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [isOpenArchives, setIsOpenArchives] = useState<boolean>(false);
    const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
    const [archiveId, setArchiveId] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDrop, setIsDrop] = useState(false);
    const navigate = useNavigate();
    const [queryParams] = useSearchParams(location.search);
    const uuid = queryParams.get('uuid');
    const isViewAsLearner = queryParams.get('isViewAsLearner')
    const { id } = useParams();
	const {data:permission }=useQuery(GET_COURSE_PERMISSIONS,{variables:{
		courseId:uuid
	},fetchPolicy:'network-only'})
    const { courseDetailsPage,overview } = useSelector(((state: { coursesManagement: { courseDetailsPage: CourseDetailsPage,overview:CourseClone } }) => state.coursesManagement));
    const { userProfileData } = useSelector(((state: { userProfile: { userProfileData: UserProfileType } }) => state.userProfile));
    const [updateArchiveState, { loading: statusLoading }] = useMutation(UPDATE_ARCHIVE_STATE);
    const [deleteCousre, { loading: deleteArchiveLoading }] = useMutation(DELETE_COURSE);
    const userType = userProfileData?.getProfile?.data?.user_type ?? '';
    const isCreator = userProfileData?.getProfile?.data?.is_course_creator;
    const handleTabClick = (index: number) => {
        setActiveTab(index);
    };

    const onAllPdfDownload = useCallback(() => {
        axios.get(`${API_MEDIA_END_POINT}/download-zip/${uuid ?? id}`, { responseType: 'blob' })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${courseDetailsPage?.getCourseDetailOverview?.data?.overview?.title}.zip`);
                document.body.appendChild(link);
                link.click();
                toast.success(response?.data?.message);
            })
            .catch((err) => {
                toast.error(err.message);
            });
    }, [courseDetailsPage?.getCourseDetailOverview?.data?.overview?.title]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hasAttachment = courseDetailsPage?.getCourseDetailOverview?.data?.contents?.some((chapter: any) => {
        return chapter?.lessons?.some((lesson: { attachment: string; }) => lesson?.attachment);
    });

    const onEditCourseDetails = useCallback(() => {
        setIsDrop(false);
        if(overview?.is_published){
            setIsEdit(true);
        }else{
            navigate(`/${ROUTES.app}/${ROUTES.updateEducationAndEngagement}/?uuid=${uuid}`)
        }
    }, [overview]);

    /**
    * Method used to show warning popup to archive
    */
    const onArchiveCourseDetails = useCallback(() => {
        setIsOpenArchives(true);
        setIsDrop(false);
        setArchiveId(uuid);
    }, []);

    const onDeleteCourseDetails = useCallback(() => {
        setIsOpenDelete(true);
        setIsDrop(false);
        setDeleteId(uuid);
    }, [])

    const handleArchiveCourse = useCallback(() => {
        if (archiveId && archiveId !== '') {
            updateArchiveState({
                variables: {
                    archive: {
                        archive_flag: COUSER_FLAG.isDoArchive,
                        course_id: archiveId
                    }
                }
            }).then((res) => {
                toast.success(res?.data?.updateCourseArchiveState?.message);
                onCloseArchives();
                navigate(`/${ROUTES.app}/${ROUTES.allCourses}`)
            }).catch((err) => {
                toast.error(err?.networkError?.result?.errors[0]?.message);
            })
        }
    }, [archiveId]);

    const handleDeleteCourse = useCallback(() => {
        if (deleteId && deleteId !== '') {
            deleteCousre({
                variables: {
                    courseId: deleteId
                }
            }).then((res) => {
                toast.success(res?.data?.deleteCourse?.message);
                onCloseArchives();
                navigate(`/${ROUTES.app}/${ROUTES.allCourses}`)

            }).catch((err) => {
                toast.error(err?.networkError?.result?.errors[0]?.message);
            })
        }
    }, [deleteId]);

    /**
     * Method used to close popups and refetch data
     */
    const onCloseArchives = useCallback(() => {
        setIsOpenArchives(false);
        setIsOpenDelete(false);
        setIsEdit(false);
        setDeleteId(null);
        setArchiveId(null);
    }, []);

    const handleClickOutside = (event:MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsDrop(false); // Close the dropdown if clicked outside
        }
      };

    const handleEditCourse =useCallback(()=>{
        setIsEdit(false);
        navigate(`/${ROUTES.app}/${ROUTES.updateEducationAndEngagement}/?uuid=${uuid}`)
    },[uuid]);
    
      // Attach event listener when the component mounts
      useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);
    return (
        <div className='tab'>
            <div className='flex flex-wrap items-center justify-between gap-3 mb-5 lg:flex-nowrap md:gap-5'>
                <ul className="flex w-full gap-3 md:w-auto tab-list md:gap-5">
                    {tabs.map((tab: Tab, index: number) => (
                        <li
                            key={`tab-list-${tab.id}`}
                            className={`tab-item w-full btn md:w-[120px] ${activeTab === index ? 'btn-primary' : 'btn-normal'}`}
                            onClick={() => handleTabClick(index)}
                        >
                            {tab.label}
                        </li>
                    ))}
                </ul>
                {!isViewAsLearner&&(permission?.getCoursePermissions?.data?.is_edit||permission?.getCoursePermissions?.data?.is_archive||permission?.getCoursePermissions?.data?.is_delete) && ([USER_TYPE?.SUPER_ADMIN, USER_TYPE?.SUBSCRIBER_ADMIN].includes(userType) || isCreator ) && <div className='relative' ref={dropdownRef}>
                    {isDrop ?
                        <ul className='absolute flex flex-col items-start -top-12 right-0 bg-white rounded-xl overflow-hidden border border-gray-300 min-w-48'>
                           {permission?.getCoursePermissions?.data?.is_edit&& <li className='w-full h-full  px-4 py-4 border-b border-gray-300 last:border-0'>
                                <Button type='button' label='' onClick={onEditCourseDetails} className='flex items-center w-full gap-3 lg:w-auto -order-1 lg:order-2' title='Edit'>
                                    <Edit fontSize='18' className='fill-primary' />
                                    <span className='text-xl text-black hover:underline hover:text-primary '>Edit</span>
                                </Button>
                            </li>}
                            {permission?.getCoursePermissions?.data?.is_archive&&<li className='w-full h-full px-4 py-4 border-b border-gray-300 last:border-0'>
                                <Button type='button' label='' onClick={onArchiveCourseDetails} className='flex items-center w-full gap-3 lg:w-auto -order-1 lg:order-2' title='Archive'>
                                    <Archive fontSize='18' className='fill-primary' />
                                    <span className='text-xl text-black hover:underline hover:text-primary'>Archive</span>
                                </Button>
                            </li>}
                            {permission?.getCoursePermissions?.data?.is_delete&&<li className='w-full h-full  px-4 py-4 border-b border-gray-300 last:border-0'>
                              <Button type='button' label='' onClick={onDeleteCourseDetails} className='flex items-center w-full gap-3 lg:w-auto -order-1 lg:order-2' title='Delete'>
                                    <Trash fontSize='18' className='fill-primary' />
                                    <span className='text-xl text-black hover:underline hover:text-primary'>Delete</span>
                                </Button>
                            </li>}
                        </ul>
                        : <Button type='button' label='' title='Menu' onClick={() => setIsDrop(true)} >
                            <span className='text-2xl'><HamburgerMenu className='fill-black ' /></span>
                        </Button>

                    }
                </div>}

                {hasAttachment && <Button type='button' label='' onClick={() => onAllPdfDownload()} className='flex items-center w-full gap-1 lg:w-auto -order-1 lg:order-2' title='Download'>
                    <Download fontSize='16' className='fill-primary' />
                    <span className='text-primary hover:underline'>Download Resources</span>
                </Button>}
            </div>

            <div className={`${containerMinimize ? '2lg:w-[calc(60%-10px)] xl:w-[calc(66%-14px)]' : ''} float-left w-full mb-5 overflow-hidden border border-solid border-border-primary rounded-xl tab-content md:mb-7`}>
                {tabs.map((tab: Tab, index: number) => (
                    <div
                        key={`tab-content-${tab.id}`}
                        className={`tab-panel ${activeTab === index ? 'active py-3 bg-transparent' : ''}`}
                    >
                        {activeTab === index && tab.content}
                    </div>
                ))}
            </div>
            {(isOpenArchives || isOpenDelete) && <CommonModel warningText={isOpenDelete ? DELETE_WARNING_TEXT : UNARCHVIVES_WARNING_TEXT} onClose={() => onCloseArchives()} action={isOpenDelete ? handleDeleteCourse : handleArchiveCourse} show={isOpenArchives || isOpenDelete} disabled={deleteArchiveLoading || statusLoading} />}
            {(isEdit) && <CommonModel warningText={EDIT_WARNING_TEXT} onClose={() => onCloseArchives()} action={handleEditCourse} show={isEdit} />}
        </div>

    );
};

export default Tabs;
