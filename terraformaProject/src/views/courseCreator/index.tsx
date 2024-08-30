import React, { ChangeEvent, ReactElement, useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import Pagination from '@components/Pagination/Pagination';
import Button from '@components/button/button';
import UpdatedHeader from '@components/header/updatedHeader';
import { ArrowSortingDown, ArrowSortingUp, Edit, Filter, GetDefaultIcon, Trash } from '@components/icons/icons';
import { DELETE_WARNING_TEXT, PAGE_LIMIT, PAGE_NUMBER, SHOW_PAGE_COUNT_ARR, } from '@config/constant';
import { useTranslation } from 'react-i18next';
import { FETCH_COURSE_CREATORS } from '@framework/graphql/queries/courseCreator';
import { CourseCreatorData, PaginationParamsCourseCreator } from 'src/types/courseCreator';
import CreateAndUpdateCourseCreator from './createOrUpdateCreateor';
import { toast } from 'react-toastify';
import { ColArrType } from '@types';
import Loader from '@components/common/loader';
import CommonModel from '@components/common/commonModel';
import { DELETE_CREATOR } from '@framework/graphql/mutations/courseCreator';
import { GET_ALL_LOCATIONS } from '@framework/graphql/queries/location';
import { useFormik } from 'formik';
import DropDown from '@components/dropdown/dropDown';
import TextInput from '@components/textInput/TextInput';

const CourseCreator = (): ReactElement => {
    const { t } = useTranslation();
    const [openFilter, setOpenFilter] = useState<boolean>(false);
    const [isDeleteCourseCreator, setIsDeleteCourseCreator] = useState<boolean>(false);
    const [filterDataCreator, setFilterDataCreator] = useState<PaginationParamsCourseCreator>({
        limit: PAGE_LIMIT,
        page: PAGE_NUMBER,
        location: '',
        sortOrder: 'descend',
        full_name: '',
        sortField: 'full_name',
        index: 0
    });
    const [recordsPerPage, setRecordsPerPage] = useState<number>(filterDataCreator.limit);
    const [deleteCreators, { loading: deleteCreatorLoading }] = useMutation(DELETE_CREATOR);
    const { data: courseCreatorList, refetch: getCourseCreatorList, loading: creatorListLoading } = useQuery(FETCH_COURSE_CREATORS, {
        fetchPolicy: 'network-only',
        variables: {
            filterData: {
                limit: filterDataCreator?.limit,
                page: filterDataCreator?.page,
                location: filterDataCreator?.location,
                sortOrder: filterDataCreator?.sortOrder,
                full_name: filterDataCreator?.full_name,
                sortField: filterDataCreator?.sortField,
            }
        },
    });
    const [isAdd, setIsAdd] = useState<boolean>(false);
    const [editParamId, setEditParamId] = useState<string>('');
    const COL_ARR_CREATOR = [
        { name: t('Sr.No'), sortable: false },
        { name: t('Name of Course creator'), sortable: true, fieldName: 'full_name' },
        { name: t('Assigned Locations'), sortable: false, fieldName: 'locations.location' },
    ] as ColArrType[];

    const { data: locations } = useQuery(GET_ALL_LOCATIONS);
    const initialValuesCreator: {
        creatorName: string;
        location: string;
    } = {
        creatorName: '',
        location: ''
    }

    const formik = useFormik({
        initialValues: initialValuesCreator,
        onSubmit() {
            //
        }
    });

    /**
     * Method used to reset the filter
     */
    const onResetCourseFilter = useCallback(() => {
        formik.resetForm();
        onSearchCreator();
    }, []);

    /**
     * Method used set header content
     * @returns reactElement
     */
    const headerActionConst = () => {
        return (
            <>
                <Button className={` ${openFilter ? 'btn-primary' : 'btn-secondary'} btn-normal md:w-[50px]`} label='' onClick={() => setOpenFilter(!openFilter)} title='Filter'>
                    <Filter />
                </Button>
                {
                    <Button label='+ Create Course Creator' className='btn-primary  btn-normal md:min-w-[150px] whitespace-nowrap' onClick={() => addCourseCreator()} title='+ Create Course Creator'>
                    </Button>
                }
            </>
        )
    }

    /**
    * Method used to close add new popup
    */
    const onCloseCreator = useCallback(() => {
        setIsAdd(false);
        setIsDeleteCourseCreator(false);
        setEditParamId('');
        getCourseCreatorList().catch((err) => {
            toast.error(err?.networkError?.result?.errors[0]?.message);
        })
    }, []);

    /**
     * Method used to add couser creator
     */
    const addCourseCreator = useCallback(() => {
        setIsAdd(true);
    }, [])

    /**
     *
     * @param sortFieldName Method used for storing sort data
     */
    const onHandleSortCreator = (sortFieldName: string) => {
        const updatedFilterCreator = {
            ...filterDataCreator,
            location: formik?.values?.location,
            full_name: formik?.values?.creatorName,
            sortField: sortFieldName,
            sortOrder: filterDataCreator.sortOrder === 'ascend' ? 'descend' : 'ascend',
        }
        setFilterDataCreator(updatedFilterCreator);

    };

    const totalCreator = courseCreatorList?.findAllCourseCreator?.data?.count;
    const totalPages = Math.ceil(totalCreator / recordsPerPage);

    /**
     * Method used for page chage
     */
    const handlePageChange = useCallback((newPage: number): void => {
        const updatedFilterCreator = {
            ...filterDataCreator,
            location: formik?.values?.location,
            full_name: formik?.values?.creatorName,
            page: newPage,
            index: (newPage - 1) * filterDataCreator.limit,
        };
        setFilterDataCreator(updatedFilterCreator);

    }, [filterDataCreator.limit])

    /**
     * Method used select number of records to show
     * @param e 
     */
    const handlePageDropselectCourse = (e: ChangeEvent<HTMLSelectElement>) => {
        const limit = Number(e?.target?.value);
        const updatedFilterCreator = {
            ...filterDataCreator,
            location: formik?.values?.location,
            full_name: formik?.values?.creatorName,
            limit: limit,
            page: 1,
            index: 0
        }
        setFilterDataCreator(updatedFilterCreator);

    }

    useEffect(() => {
        setRecordsPerPage(filterDataCreator.limit);
    }, [filterDataCreator.limit]);

    useEffect(() => {
        const updatedFilterData = {
            filterDataCreator: {
                limit: filterDataCreator?.limit,
                page: filterDataCreator?.page,
                sortOrder: filterDataCreator?.sortOrder,
                sortField: filterDataCreator?.sortField,
                location: formik?.values?.location,
                full_name: formik?.values?.creatorName
            }
        }
        getCourseCreatorList(updatedFilterData).catch((err) => {
            toast.error(err?.networkError?.result?.errors[0]?.message);
        })
    }, [filterDataCreator])

    /**
     * Method used to set filterdata
     */
    const onSearchCreator = useCallback(() => {
        const updatedFilterCreator = {
            ...filterDataCreator,
            location: formik?.values?.location,
            full_name: formik?.values?.creatorName
        }
        setFilterDataCreator(updatedFilterCreator)

    }, [filterDataCreator, formik]);

    /**
     * Methos used to edit course creator
     */
    const onEditCourseCreator = useCallback((id: string) => {
        setEditParamId(id);
        setIsAdd(true);
    }, []);

    /**
    * Methos used to delete course creator
    */
    const onDeleteCourseCreator = useCallback((id: string) => {
        setEditParamId(id);
        setIsDeleteCourseCreator(true);
    }, []);

    const handleDeleteCourseCreator = useCallback(() => {
        deleteCreators({
            variables: {
                userId: editParamId
            }
        }).then((res) => {
            toast.success(res?.data?.courseCreatorUserDelete?.message);
            onCloseCreator();
        }).catch((err) => {
            toast.error(err?.networkError?.result?.errors[0]?.message);
        })
    }, [editParamId])

    return (
        <>
            <UpdatedHeader headerActionConst={headerActionConst} />
            <div>
                {openFilter && <form onSubmit={formik.handleSubmit}>
                    <div className="flex justify-start flex-wrap 2xl:flex-nowrap p-5 mb-5 border border-border-primary rounded-xl bg-light-blue gap-1 md:gap-2 2xl:gap-[18px] xl:gap-y-2 xl:gap-3 lg:gap-0.5 lg:gap-x-2.5 items-end">
                        <div className='w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-14px)]'>
                            <TextInput value={formik.values.creatorName} placeholder={'Name of Course creator'} type='text' id='highlights1' name='creatorName' onChange={formik.handleChange} />
                        </div>
                        <DropDown value={formik.values.location} placeholder={'Location'} className='w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-14px)] -mt-2' label='' name='location' id='location' onChange={formik.handleChange} options={locations?.getLocations?.data?.map((loc: { location: string }) => { return { name: loc.location, key: loc.location } })} />
                        <Button type='button' className='btn-primary btn-normal w-full md:min-w-[160px] md:w-auto lg:mt-0' label={'Search'} onClick={onSearchCreator} />
                        <Button type='button' className='btn-secondary btn-normal w-full md:min-w-[160px] md:w-auto lg:mt-0' label={'Reset'} onClick={onResetCourseFilter} />
                    </div>
                </form>}
                <div className='bg-white rounded-xl overflow-auto border border-[#c8ced3] p-3 md:p-5'>
                    <div className='flex flex-col justify-between gap-3 mb-3 md:gap-5 md:mb-5 btn-group md:flex-row'>
                        <h6 className='w-full leading-7 xmd:w-auto'>{t('Course Creator List')}</h6>
                    </div>
                    <div className='w-full mb-3 overflow-auto bg-white border sm:w-auto rounded-t-xl custom-dataTable border-border-primary'>
                        <table>
                            <thead >
                                <tr>
                                    {COL_ARR_CREATOR?.map((colValUser: ColArrType, num: number) => {
                                        const key = colValUser.fieldName + num;
                                        return (
                                            <th scope='col' key={key}>
                                                <div className={`flex items-center ${colValUser.name == 'Status' ? 'justify-center' : ''}`}>
                                                    {colValUser.name}
                                                    {colValUser.sortable && (
                                                        <button onClick={() => onHandleSortCreator(colValUser.fieldName)}>
                                                            {(filterDataCreator.sortOrder === '' || filterDataCreator.sortField !== colValUser.fieldName) &&
                                                                <GetDefaultIcon className='w-3 h-3 ml-1 fill-white' />}
                                                            {filterDataCreator.sortOrder === 'ascend' && filterDataCreator.sortField === colValUser.fieldName &&
                                                                <ArrowSortingUp className="ml-1 fill-white" />}
                                                            {filterDataCreator.sortOrder === 'descend' && filterDataCreator.sortField === colValUser.fieldName &&
                                                                <ArrowSortingDown className="ml-1 fill-white" />}
                                                        </button>
                                                    )}
                                                </div>
                                            </th>
                                        );
                                    })}

                                    <th scope='col'>
                                        <div className='flex items-center'>{t('Action')}</div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {courseCreatorList?.findAllCourseCreator?.data?.data?.map((creator: CourseCreatorData, index: number) => {
                                    const srNumber = filterDataCreator?.index + index + 1;
                                    return <tr key={creator.user_uuid}>
                                        <td scope='row' className='text-center'>
                                            {srNumber}
                                        </td>
                                        <td className='text-left'>{creator.full_name}</td>
                                        <td className='text-left'>{creator.locations.map((locationDeatils) => locationDeatils?.location).join(', ')}</td>
                                        <td>
                                            <div className='flex justify-start btn-group'>
                                                <Button className='bg-transparent btn-default' onClick={() => onEditCourseCreator(creator?.user_uuid)} label={''} title='Edit'>
                                                    <Edit />
                                                </Button>
                                                <Button className='bg-transparent btn-default' onClick={() => onDeleteCourseCreator(creator?.user_uuid)} label={''} title='Delete'>
                                                    <Trash className='fill-error' />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>;
                                })}
                            </tbody>
                        </table>
                        {creatorListLoading && <div className='w-full px-2.5 py-2 bg-white bg-opacity-75 flex justify-center '>
                            <div className='text-xl'><Loader /></div>
                        </div>}
                        {(courseCreatorList?.findAllCourseCreator?.data?.count === 0 ||
                            courseCreatorList?.findAllCourseCreator?.data?.data === null) && (
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
                            <select value={filterDataCreator.limit} onChange={handlePageDropselectCourse} className='border border-border-primary rounded-xl ml-2 px-3 text-sm py-1.5 text-gray-500 w-[70px] h-[36px] appearance-none bg-white'>
                                {SHOW_PAGE_COUNT_ARR?.map((item: number) => {
                                    return <option key={item}>{item}</option>;
                                })}
                            </select>
                        </div>
                        <Pagination currentPage={filterDataCreator.page}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            recordsPerPage={recordsPerPage}
                        />
                    </div>
                    {isAdd&&<CreateAndUpdateCourseCreator isAdd={isAdd} onClose={onCloseCreator} editId={editParamId} />}
                </div>
                {isDeleteCourseCreator && <CommonModel warningText={DELETE_WARNING_TEXT} onClose={() => onCloseCreator()} action={handleDeleteCourseCreator} show={isDeleteCourseCreator} disabled={deleteCreatorLoading} />}

            </div>
        </>
    )
}
export default CourseCreator;