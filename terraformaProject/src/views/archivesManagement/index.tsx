import React, { ChangeEvent, ReactElement, useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import Pagination from '@components/Pagination/Pagination';
import Button from '@components/button/button';
import UpdatedHeader from '@components/header/updatedHeader';
import { Archive, ArrowSortingDown, ArrowSortingUp, Edit, Eye, Filter, GetDefaultIcon, Trash, } from '@components/icons/icons';
import { ARCHVIVES_WARNING_TEXT, COUSER_FLAG, DELETE_WARNING_TEXT, PAGE_LIMIT, PAGE_NUMBER, ROUTES, SHOW_PAGE_COUNT_ARR, } from '@config/constant';
import { useTranslation } from 'react-i18next';
import { FETCH_ARCHIVES_AND_DRAFT } from '@framework/graphql/queries/archivesAndDraftManagement';
import { ArchivesAndDraftData, PaginationParamsArchives } from 'src/types/archivesAndDrafts';
import { toast } from 'react-toastify';
import CommonModel from '@components/common/commonModel';
import { UPDATE_ARCHIVE_STATE } from '@framework/graphql/mutations/archivesAndDraftsManagement';
import { Link, } from 'react-router-dom';
import { DELETE_COURSE } from '@framework/graphql/mutations/course';
import Loader from '@components/common/loader';
import TextInput from '@components/textInput/TextInput';
import { useFormik } from 'formik';

export type ColArrType = {
    name: string
    sortable: boolean
    fieldName: string
}

const ArchivesManagement = (): ReactElement => {
    const { t } = useTranslation();
    const [openFilter, setOpenFilter] = useState<boolean>(false);
    const [isOpenArchives, setIsOpenArchives] = useState<boolean>(false);
    const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
    const [archiveId, setArchiveId] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [filterArchivesData, setFilterArchivesData] = useState<PaginationParamsArchives>({
        course_flag: COUSER_FLAG.isArchives,
        limit: PAGE_LIMIT,
        page: PAGE_NUMBER,
        sortOrder: 'DESC',
        search: '',
        sortField: 'createdAt',
        index: 0,
    });
    const [recordsPerPage, setRecordsPerPage] = useState<number>(filterArchivesData.limit);
    const { data, refetch: getArchivesList, loading: arcivesListLoader } = useQuery(FETCH_ARCHIVES_AND_DRAFT, {
        variables: {
            courseFlag: {
                course_flag: COUSER_FLAG.isArchives,
                limit: PAGE_LIMIT,
                page: PAGE_NUMBER,
                sortOrder: 'DESC',
                search: '',
                sortField: 'createdAt',
            }
        },
        fetchPolicy: 'network-only'
    });
    const [updateArchiveState, { loading: statusLoading }] = useMutation(UPDATE_ARCHIVE_STATE);
    const [deleteCousre, { loading: deleteArchiveLoading }] = useMutation(DELETE_COURSE);
    const COL_ARR_CREATOR = [
        { name: t('Sr.No'), sortable: false },
        { name: t('Course Name'), sortable: true, fieldName: 'title' },
    ] as ColArrType[];

    const initialValues = {
        courseName: '',
    }
    const formik = useFormik({
        initialValues,
        onSubmit(values) {
            const updatedFilterArchives = {
                ...filterArchivesData,
                search: values?.courseName
            }
            setFilterArchivesData(updatedFilterArchives);
        }
    })
    const resetFilter = () => {
        formik.resetForm();
        const updatedFilterArchives = {
            ...filterArchivesData,
            search: ''
        }
        setFilterArchivesData(updatedFilterArchives);
    }

    useEffect(() => {
        getArchivesList({
            courseFlag: {
                course_flag: filterArchivesData?.course_flag,
                limit: filterArchivesData?.limit,
                page: filterArchivesData?.page,
                search: filterArchivesData?.search,
                sortOrder: filterArchivesData?.sortOrder,
                sortField: filterArchivesData?.sortField,
            }
        }).catch((err) => {
            toast.error(err?.networkError?.result?.errors[0]?.message);
        })
    }, [filterArchivesData])

    const headerActionConst = () => {
        return (
            <>
                <Button className={` ${openFilter ? 'btn-primary' : 'btn-secondary'} btn-normal md:w-[50px]`} label='' onClick={() => setOpenFilter(!openFilter)} title='Filter'>
                    <Filter />
                </Button>
            </>
        )
    }

    /**
     *
     * @param sortFieldName Method used for storing sort data
     */
    const onHandleSortArchives = (sortFieldName: string) => {
        const updatedFilterArchives = {
            ...filterArchivesData,
            search: formik?.values?.courseName,
            sortField: sortFieldName,
            sortOrder: filterArchivesData.sortOrder === 'ASC' ? 'DESC' : 'ASC',
        }
        setFilterArchivesData(updatedFilterArchives);


    };

    const totalCreator = data?.getDraftAndArchiveCourses?.data?.count;
    const totalPages = Math.ceil(totalCreator / recordsPerPage);
    const handlePageChange = useCallback((newPage: number): void => {
        const updatedFilterArchives = {
            ...filterArchivesData,
            search: formik?.values?.courseName,
            page: newPage,
            index: (newPage - 1) * filterArchivesData.limit,
        };
        setFilterArchivesData(updatedFilterArchives);


    }, [filterArchivesData.limit])

    useEffect(() => {
        setRecordsPerPage(filterArchivesData.limit);
    }, [filterArchivesData.limit]);

    /**
   * Method used select number of records to show
   * @param e 
   */
    const handlePageDropselectArchives = (e: ChangeEvent<HTMLSelectElement>) => {
        const limit = Number(e?.target?.value);
        const updatedFilterArchives = {
            ...filterArchivesData,
            search: formik?.values?.courseName,
            limit: limit,
            page: 1,
            index: 0
        }
        setFilterArchivesData(updatedFilterArchives);
    }

    const handleArchiveCourse = useCallback(() => {
        if (archiveId && archiveId !== '') {
            updateArchiveState({
                variables: {
                    archive: {
                        archive_flag: COUSER_FLAG.unArchive,
                        course_id: archiveId
                    }
                }
            }).then((res) => {
                toast.success(res?.data?.updateCourseArchiveState?.message);
                onCloseArchives();
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
        setDeleteId(null);
        setArchiveId(null);
        getArchivesList({
            courseFlag: {
                course_flag: filterArchivesData?.course_flag,
                page: filterArchivesData?.page,
                limit: filterArchivesData?.limit,
                sortOrder: filterArchivesData?.sortOrder,
                search: formik?.values?.courseName,
                sortField: filterArchivesData?.sortField,
            }
        }).catch((err) => {
            toast.error(err?.networkError?.result?.errors[0]?.message);
        })
    }, [filterArchivesData]);

    /**
     * Method used to show warning popup to archive
     */
    const onArchive = useCallback((archiveId: string) => {
        setIsOpenArchives(true);
        setArchiveId(archiveId);
    }, []);

    const onDeleteCourse = useCallback((deleteId: string) => {
        setIsOpenDelete(true);
        setDeleteId(deleteId);
    }, [])

    return (
        <>
            <UpdatedHeader headerActionConst={headerActionConst} />
            {openFilter && <div className=" p-5 mb-5 border border-border-primary rounded-xl bg-light-blue gap-1 md:gap-2 2xl:gap-[18px] xl:gap-y-2 xl:gap-3 lg:gap-0.5 lg:gap-x-2.5 items-end">
                <form className='flex justify-between flex-wrap 2xl:flex-nowrap' onSubmit={formik.handleSubmit} >
                    <div className='w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-14px)]'>
                        <TextInput placeholder={t('Name of Course')} type='text' id='highlights1' name='courseName' onChange={formik.handleChange} value={formik?.values?.courseName} />
                    </div>
                    <div className='flex flex-wrap 2xl:flex-nowrap gap-1 md:gap-2 2xl:gap-[18px] xl:gap-y-2 xl:gap-3 lg:gap-0.5 lg:gap-x-2.5 w-full md:w-auto'>
                        <Button type='submit' className='btn-primary btn-normal w-full md:min-w-[160px] md:w-auto lg:mt-0' label={t('Search')} />
                        <Button type='button' onClick={resetFilter} className='btn-secondary btn-normal w-full md:min-w-[160px] md:w-auto lg:mt-0' label={t('Reset')} />
                    </div>
                </form>
            </div>}
            <div className='mb-3 bg-white rounded-xl overflow-auto border border-[#c8ced3] mx-7 p-3 md:p-5'>
                <div className='flex flex-col justify-between gap-3 mb-3 md:gap-5 md:mb-5 btn-group md:flex-row'>
                    <h6 className='w-full leading-7 xmd:w-auto'>{t('Archives List')}</h6>
                </div>
                <div className='w-full mb-3 overflow-auto bg-white border sm:w-auto rounded-t-xl custom-dataTable border-border-primary'>
                    <table>
                        <thead>
                            <tr>
                                {COL_ARR_CREATOR?.map((colValUser: ColArrType) => {
                                    return (
                                        <th scope='col' key={colValUser.fieldName}>
                                            <div className={`flex justify-center items-center ${colValUser.name == 'Status' ? 'justify-center' : ''}`}>
                                                {colValUser.name}
                                                {colValUser.sortable && (
                                                    <button onClick={() => onHandleSortArchives(colValUser.fieldName)}>
                                                        {(filterArchivesData.sortOrder === '' || filterArchivesData.sortField !== colValUser.fieldName) &&
                                                            <GetDefaultIcon className='w-3 h-3 ml-1 fill-white' />}
                                                        {filterArchivesData.sortOrder === 'ASC' && filterArchivesData.sortField === colValUser.fieldName &&
                                                            <ArrowSortingUp className="ml-1 fill-white" />}
                                                        {filterArchivesData.sortOrder === 'DESC' && filterArchivesData.sortField === colValUser.fieldName &&
                                                            <ArrowSortingDown className="ml-1 fill-white" />}
                                                    </button>
                                                )}
                                            </div>
                                        </th>
                                    );
                                })}

                                <th scope='col'>
                                    <div className='flex justify-center items-center'>{t('Action')}</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data?.getDraftAndArchiveCourses?.data?.courses?.map((course: ArchivesAndDraftData, index: number) => {
                                    const displayindexArchives = filterArchivesData?.index + index + 1;
                                    return <tr key={course.uuid}>
                                        <td scope='row' className='text-center'>
                                            {displayindexArchives}
                                        </td>
                                        <td className='text-center'>{course.title}</td>
                                        <td>
                                            <div className='btn-group flex justify-center '>
                                                <Link className='bg-transparent  btn-icon btn-default  mr-2' to={`/${ROUTES.app}/${ROUTES.tfsCoursesTemplates}/${ROUTES.courseDetails}/?uuid=${course.uuid}`} title='View' >
                                                    <Eye className='text-success' />
                                                </Link>
                                                <Link className='bg-transparent  mr-2 btn-default btn-icon' to={`/${ROUTES.app}/${ROUTES.updateEducationAndEngagement}/?uuid=${course.uuid}`} title='Edit' >
                                                    <Edit />
                                                </Link>
                                                <Button className='bg-transparent btn-icon btn-default' onClick={() => onArchive(course?.uuid)} label={''} title='Unarchive'>
                                                    <Archive />
                                                </Button>
                                                <Button className='bg-transparent btn-default btn-icon' onClick={() => onDeleteCourse(course?.uuid)} label={''} title='Delete'>
                                                    <Trash className='fill-error' />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                    {arcivesListLoader && <div className='w-full px-2.5 py-2 bg-white bg-opacity-75 flex justify-center '>
                        <div className='text-xl'><Loader /></div>
                    </div>}
                    {(data?.getDraftAndArchiveCourses?.data?.count === 0 ||
                        data?.getDraftAndArchiveCourses?.data === null) && (
                            <div className='flex justify-center'>
                                <div>{t('No Data')}</div>
                            </div>
                        )}
                </div>
                <div className='flex flex-wrap items-center mt-2'>
                    <div className='flex items-center mr-3 md:mr-7'>
                        <span className='text-sm font-normal text-gray-700 whitespace-nowrap '>
                            {t('Per Page')}
                        </span>
                        <select value={filterArchivesData.limit} onChange={handlePageDropselectArchives} className='border border-border-primary rounded-xl ml-2 px-3 text-sm py-1.5 text-gray-500 w-[70px] h-[36px] appearance-none bg-white'>
                            {SHOW_PAGE_COUNT_ARR?.map((item: number) => {
                                return <option key={item}>{item}</option>;
                            })}
                        </select>
                    </div>
                    <Pagination currentPage={filterArchivesData.page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        recordsPerPage={recordsPerPage}
                    />
                </div>
                {(isOpenArchives || isOpenDelete) && <CommonModel warningText={isOpenDelete ? DELETE_WARNING_TEXT : ARCHVIVES_WARNING_TEXT} onClose={() => onCloseArchives()} action={isOpenDelete ? handleDeleteCourse : handleArchiveCourse} show={isOpenArchives || isOpenDelete} disabled={deleteArchiveLoading || statusLoading} />}
            </div>
        </>
    )
}
export default ArchivesManagement;