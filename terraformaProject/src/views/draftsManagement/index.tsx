import React, { ChangeEvent, ReactElement, useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import Pagination from '@components/Pagination/Pagination';
import Button from '@components/button/button';
import UpdatedHeader from '@components/header/updatedHeader';
import { ArrowSortingDown, ArrowSortingUp, Edit, Eye, Filter, GetDefaultIcon, Trash, } from '@components/icons/icons';
import { COUSER_FLAG, DELETE_WARNING_TEXT, PAGE_LIMIT, PAGE_NUMBER, ROUTES, SHOW_PAGE_COUNT_ARR, } from '@config/constant';
import { useTranslation } from 'react-i18next';
import { ArchivesAndDraftData, PaginationParamsArchives, SearchValueArchives } from 'src/types/archivesAndDrafts';
import { FETCH_ARCHIVES_AND_DRAFT } from '@framework/graphql/queries/archivesAndDraftManagement';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import CommonModel from '@components/common/commonModel';
import { DELETE_COURSE } from '@framework/graphql/mutations/archivesAndDraftsManagement';
import Loader from '@components/common/loader';
import TextInput from '@components/textInput/TextInput';
import { useFormik } from 'formik';


export type ColArrType = {
    name: string
    sortable: boolean
    fieldName: string
}

const DraftsManagement = (): ReactElement => {
    const { t } = useTranslation();
    const [openFilter, setOpenFilter] = useState<boolean>(false);
    const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [filterDataDraft, setFilterDataDraft] = useState<PaginationParamsArchives>({
        course_flag: COUSER_FLAG.isDraft,
        limit: PAGE_LIMIT,
        page: PAGE_NUMBER,
        sortOrder: 'DESC',
        search: '',
        sortField: 'createdAt',
        index: 0,
    });
    const [recordsPerPage, setRecordsPerPage] = useState<number>(filterDataDraft.limit);
    const { data, refetch: getDraftList, loading: draftListLoader } = useQuery(FETCH_ARCHIVES_AND_DRAFT, {
        variables: {
            courseFlag: {
                course_flag: COUSER_FLAG.isDraft,
                limit: PAGE_LIMIT,
                page: PAGE_NUMBER,
                sortOrder: 'DESC',
                search: '',
                sortField: 'createdAt',
            }
        },
        fetchPolicy: 'network-only'
    });
    const [deleteCousre, { loading: deleteDraftLoader }] = useMutation(DELETE_COURSE);
    const COL_ARR_CREATOR = [
        { name: t('Sr.No'), sortable: false },
        { name: t('Course Name'), sortable: true, fieldName: 'title' },
    ] as ColArrType[];

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
    const onHandleSortDraft = (sortFieldName: string) => {
        const updateFilterDraft = {
            ...filterDataDraft,
            sortField: sortFieldName,
            sortOrder: filterDataDraft.sortOrder === 'ASC' ? 'DESC' : 'ASC',
        }
        setFilterDataDraft(updateFilterDraft);

    };

    const totalCreator = data?.getDraftAndArchiveCourses?.data?.count;
    const totalPages = Math.ceil(totalCreator / recordsPerPage);
    const handlePageChange = useCallback((newPage: number): void => {
        const updatedFilterDraft = {
            ...filterDataDraft,
            page: newPage,
            index: (newPage - 1) * filterDataDraft.limit,
        };
        setFilterDataDraft(updatedFilterDraft);
    }, [filterDataDraft.limit])

    useEffect(() => {
        setRecordsPerPage(filterDataDraft.limit);
    }, [filterDataDraft.limit]);

    /**
   * Method used select number of records to show
   * @param e 
   */
    const handlePageDropselectDraft = (e: ChangeEvent<HTMLSelectElement>) => {
        const limit = Number(e?.target?.value);
        const updatedFilterDraft = {
            ...filterDataDraft,
            limit: limit,
            page: 1,
            index: 0
        }
        setFilterDataDraft(updatedFilterDraft);
    }

    const onSearchArchives = (value: SearchValueArchives) => {
        const updatedFilterDraft = {
            ...filterDataDraft,
            search: value?.courseName
        }
        setFilterDataDraft(updatedFilterDraft);
    };

    /**
    * Method used to close popups and refetch data
    */
    const onCloseDrafts = useCallback(() => {
        setIsOpenDelete(false);
        setDeleteId(null);
        getDraftList({
            courseFlag: {
                course_flag: filterDataDraft?.course_flag,
                limit: filterDataDraft?.limit,
                page: filterDataDraft?.page,
                sortOrder: filterDataDraft?.sortOrder,
                search: filterDataDraft?.search,
                sortField: filterDataDraft?.sortField,
            }
        }).catch((err) => {
            toast.error(err?.networkError?.result?.errors[0]?.message);
        })
    }, [filterDataDraft]);

    const handleDeleteCourse = useCallback(() => {
        if (deleteId && deleteId !== '') {
            deleteCousre({
                variables: {
                    courseId: deleteId
                }
            }).then((res) => {
                toast.success(res?.data?.deleteCourse?.message);
                onCloseDrafts();
            }).catch((err) => {
                toast.error(err?.networkError?.result?.errors[0]?.message);
            })
        }
    }, [deleteId]);

    const onDeleteCourse = useCallback((deleteId: string) => {
        setIsOpenDelete(true);
        setDeleteId(deleteId);
    }, []);

    useEffect(() => {
        getDraftList({
            courseFlag: {
                course_flag: filterDataDraft?.course_flag,
                limit: filterDataDraft?.limit,
                page: filterDataDraft?.page,
                sortOrder: filterDataDraft?.sortOrder,
                search: filterDataDraft?.search,
                sortField: filterDataDraft?.sortField,
            }
        }).catch((err) => {
            toast.error(err?.networkError?.result?.errors[0]?.message);
        })
    }, [filterDataDraft])

    const initialValuesDraft = {
        courseName: '',
    }
    const draftformik = useFormik({
        initialValues: initialValuesDraft,
        onSubmit(values) {
            onSearchArchives({ courseName: values?.courseName });
        }
    })
    const resetFilterDraft = () => {
        draftformik.resetForm();
        onSearchArchives(initialValuesDraft);
    }

    return (
        <>
            <UpdatedHeader headerActionConst={headerActionConst} />
            {openFilter && <div className=" p-5 mb-5 border border-border-primary rounded-xl bg-light-blue gap-1 md:gap-2 2xl:gap-[18px] xl:gap-y-2 xl:gap-3 lg:gap-0.5 lg:gap-x-2.5 items-end">
                <form className='flex justify-between flex-wrap 2xl:flex-nowrap' onSubmit={draftformik.handleSubmit} >
                    <div className='w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-14px)]'>
                        <TextInput placeholder={t('Name of Draft')} type='text' id='highlights1' name='courseName' onChange={draftformik.handleChange} value={draftformik?.values?.courseName} />
                    </div>
                    <div className='flex flex-wrap 2xl:flex-nowrap gap-1 md:gap-2 2xl:gap-[18px] xl:gap-y-2 xl:gap-3 lg:gap-0.5 lg:gap-x-2.5 w-full md:w-auto'>
                        <Button type='submit' className='btn-primary btn-normal w-full md:min-w-[160px] md:w-auto lg:mt-0' label={t('Search')} />
                        <Button type='button' onClick={resetFilterDraft} className='btn-secondary btn-normal w-full md:min-w-[160px] md:w-auto lg:mt-0' label={t('Reset')} />
                    </div>
                </form>
            </div>}
            <div className='mb-3 bg-white rounded-xl overflow-auto border border-[#c8ced3] mx-7 p-3 md:p-5'>
                <div className='flex flex-col justify-between gap-3 mb-3 md:gap-5 md:mb-5 btn-group md:flex-row'>
                    <h6 className='w-full leading-7 xmd:w-auto'>{t('Drafts List')}</h6>
                </div>
                <div className='w-full mb-3 overflow-auto bg-white border sm:w-auto rounded-t-xl custom-dataTable border-border-primary'>
                    <table>
                        <thead key='sorting'>
                            <tr>
                                {COL_ARR_CREATOR?.map((colValUser: ColArrType) => {
                                    return (
                                        <th scope='col' key={colValUser.fieldName}>
                                            <div className={`flex justify-center items-center ${colValUser.name == 'Status' ? 'justify-center' : ''}`}>
                                                {colValUser.name}
                                                {colValUser.sortable && (
                                                    <button onClick={() => onHandleSortDraft(colValUser.fieldName)}>
                                                        {(filterDataDraft.sortOrder === '' || filterDataDraft.sortField !== colValUser.fieldName) &&
                                                            <GetDefaultIcon className='w-3 h-3 ml-1 fill-white' />}
                                                        {filterDataDraft.sortOrder === 'ASC' && filterDataDraft.sortField === colValUser.fieldName &&
                                                            <ArrowSortingUp className="ml-1 fill-white" />}
                                                        {filterDataDraft.sortOrder === 'DESC' && filterDataDraft.sortField === colValUser.fieldName &&
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
                                    const displayindexArchives = filterDataDraft?.index + index + 1;
                                    return <tr key={course.uuid}>
                                        <td scope='row' className='text-center'>
                                            {displayindexArchives}
                                        </td>
                                        <td className='text-center'>{course.title}</td>
                                        <td>
                                            <div className='flex justify-center btn-group'>
                                                <Link className='bg-transparent btn-default btn-icon mr-2' to={`/${ROUTES.app}/${ROUTES.tfsCoursesTemplates}/${ROUTES.courseDetails}/?uuid=${course.uuid}`} title='View' >
                                                    <Eye className='text-success' />
                                                </Link>
                                                <Link className='bg-transparent btn-default btn-icon mr-2' to={`/${ROUTES.app}/${ROUTES.updateEducationAndEngagement}/?uuid=${course.uuid}`} title='Edit' >
                                                    <Edit />
                                                </Link>
                                                <Button className='bg-transparent btn-default btn-icon' onClick={() => onDeleteCourse(course?.uuid)} label={''} title='Delete' >
                                                    <Trash className='fill-error' />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                    {draftListLoader && <div className='w-full px-2.5 py-2 bg-white bg-opacity-75 flex justify-center '>
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
                        <select value={filterDataDraft.limit} onChange={handlePageDropselectDraft} className='border border-border-primary rounded-xl ml-2 px-3 text-sm py-1.5 text-gray-500 w-[70px] h-[36px] appearance-none bg-white'>
                            {SHOW_PAGE_COUNT_ARR?.map((item: number) => {
                                return <option key={item}>{item}</option>;
                            })}
                        </select>
                    </div>
                    <Pagination currentPage={filterDataDraft.page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        recordsPerPage={recordsPerPage}
                    />
                </div>
                {isOpenDelete && <CommonModel warningText={DELETE_WARNING_TEXT} onClose={onCloseDrafts} action={handleDeleteCourse} show={isOpenDelete} disabled={deleteDraftLoader} />}

            </div>
        </>
    )
}
export default DraftsManagement;