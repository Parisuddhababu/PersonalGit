import React, { ChangeEvent, ReactElement, useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import Pagination from '@components/Pagination/Pagination';
import Button from '@components/button/button';
import UpdatedHeader from '@components/header/updatedHeader';
import { ArrowSortingDown, ArrowSortingUp, Edit, Filter, GetDefaultIcon, Trash } from '@components/icons/icons';
import { DELETE_WARNING_TEXT, DrpAdminUserType, PAGE_LIMIT, PAGE_NUMBER, SHOW_PAGE_COUNT_ARR, UserTypes, } from '@config/constant';
import { useTranslation } from 'react-i18next';
import CreateAndUpdateCourseAdmin from './createOrUpdateCourseAdmin';
import { toast } from 'react-toastify';
import { ColArrType } from '@types';
import { FETCH_COURSE_ADMINS } from '@framework/graphql/queries/courseAdmin';
import {  CourseAdminData, PaginationParamsCourseAdmin } from 'src/types/courseAdmin';
import Loader from '@components/common/loader';
import CommonModel from '@components/common/commonModel';
import { DELETE_COURSE_ADMIN_RECORD } from '@framework/graphql/mutations/courseAdmin';
import TextInput from '@components/textInput/TextInput';
import DropDown from '@components/dropdown/dropDown';
import { GET_ALL_LOCATIONS } from '@framework/graphql/queries/courseCreator';
import { useFormik } from 'formik';

const CourseAdmin = (): ReactElement => {
    const { t } = useTranslation();
    const [openFilterAdmin, setOpenFilterAdmin] = useState<boolean>(false);
    const [isDeleteCourseAdmin, setIsDeleteCourseAdmin] = useState<boolean>(false);
    const [filterDataAdmin, setFilterDataAdmin] = useState<PaginationParamsCourseAdmin>({
        limit: PAGE_LIMIT,
        page: PAGE_NUMBER,
        location: '',
        sortOrder: 'descend',
        full_name: '',
        sortField: 'full_name',
        user_type: null,
        index: 0
    });
    const [recordsPerPageAdmin, setRecordsPerPageAdmin] = useState<number>(filterDataAdmin.limit);
    const [deleteAdmin, { loading: deleteAdminLoading }] = useMutation(DELETE_COURSE_ADMIN_RECORD);
    const { data: courseAdminList, refetch: getCourseAdminList, loading: adminListLoader } = useQuery(FETCH_COURSE_ADMINS, {
        fetchPolicy: 'network-only',
        variables: {
            filterData: {
                limit: PAGE_LIMIT,
                page: PAGE_NUMBER,
                location: '',
                sortOrder: 'descend',
                user_type: null,
                full_name: '',
                sortField: 'full_name',
            }
        },
    });
    const [isAddAdmin, setIsAddAdmin] = useState<boolean>(false);
    const [editParamId, setEditParamId] = useState<string>('');
    const COL_ARR_ADMIN = [
        { name: t('Sr.No'), sortable: false },
        { name: t('Name of Course Admin'), sortable: true, fieldName: 'full_name' },
        { name: t('User Type'), sortable: true, fieldName: 'user_type' },
        { name: t('Assigned Locations'), sortable: false, fieldName: 'locations.location' },
    ] as ColArrType[];
    const { data: locations } = useQuery(GET_ALL_LOCATIONS);
    const initialValuesAdmin: {
        adminName: string;
        location: string;
        userType: number | null;
    } = {
        adminName: '',
        location: '',
        userType: null,
    }

    const formik = useFormik({
        initialValues: initialValuesAdmin,
        onSubmit() {
            //
        }
    });

    /**
     * Method used to reset the filter
     */
    const onResetCourseAdminFilter = useCallback(() => {
        formik.resetForm();
        onSearchAdmin();
    }, []);

    /**
     * Method used set header content
     * @returns reactElement
     */
    const headerActionConstAdmin = () => {
        return (
            <>
                <Button className={` ${openFilterAdmin ? 'btn-primary' : 'btn-secondary'} btn-normal md:w-[50px]`} label='' onClick={() => setOpenFilterAdmin(!openFilterAdmin)} title='Filter'>
                    <Filter />
                </Button>
                {
                    <Button label='+ Create Course Admin' className='btn-primary  btn-normal md:min-w-[150px] whitespace-nowrap' onClick={() => addCourseAdmin()} title='+ Create Course Admin'>
                    </Button>
                }
            </>
        )
    }

    /**
    * Method used to close add new popup
    */
    const onCloseAdmin = useCallback(() => {
        setIsAddAdmin(false);
        setIsDeleteCourseAdmin(false);
        setEditParamId('');
        getCourseAdminList().catch((err) => {
            toast.error(err?.networkError?.result?.errors[0]?.message);
        })
    }, []);

    /**
     * Method used to add couser admin
     */
    const addCourseAdmin = useCallback(() => {
        setIsAddAdmin(true);
    }, [])

    /**
     *
     * @param sortFieldName Method used for storing sort data
     */
    const onHandleSortCourseAdmin = (sortFieldName: string) => {
        const updatedFilterDataAdmin = {
            ...filterDataAdmin,
            location: formik?.values?.location,
            full_name: formik?.values?.adminName,
            user_type:Number(formik?.values?.userType),
            sortField: sortFieldName,
            sortOrder: filterDataAdmin.sortOrder === 'ascend' ? 'descend' : 'ascend',
        }
        setFilterDataAdmin(updatedFilterDataAdmin);
    };

    const totalAdmin = courseAdminList?.findAllCourseAdministrator?.data?.count;
    const totalPagesAdmin = Math.ceil(totalAdmin / recordsPerPageAdmin);

    /**
     * Method used for page chage
     */
    const handlePageChangeAdmin = useCallback((newPage: number): void => {
        const updatedFilterDataAdmin = {
            ...filterDataAdmin,
            location: formik?.values?.location,
            full_name: formik?.values?.adminName,
            user_type: Number(formik?.values?.userType),
            page: newPage,
            index: (newPage - 1) * filterDataAdmin.limit,
        };
        setFilterDataAdmin(updatedFilterDataAdmin);
    }, [filterDataAdmin.limit])

    /**
     * Method used select number of records to show
     * @param e 
     */
    const handlePageDropselectCourseAdmin = (e: ChangeEvent<HTMLSelectElement>) => {
        const limit = Number(e?.target?.value);
        const updatedFilterDataAdmin = {
            ...filterDataAdmin,
            location: formik?.values?.location,
            full_name: formik?.values?.adminName,
            user_type: Number(formik?.values?.userType),
            limit: limit,
            page: 1,
            index: 0
        }
        setFilterDataAdmin(updatedFilterDataAdmin);
    }

    useEffect(() => {
        setRecordsPerPageAdmin(filterDataAdmin.limit);
    }, [filterDataAdmin.limit]);

    useEffect(() => {
        const updatedFilterDataAdmin = {
            filterData: {
                location: formik?.values?.location,
                full_name: formik?.values?.adminName,
                user_type: Number(formik?.values?.userType),
                limit: filterDataAdmin?.limit,
                page: filterDataAdmin?.page,
                sortOrder: filterDataAdmin?.sortOrder,
                sortField: filterDataAdmin?.sortField,
            }
        }
        getCourseAdminList(updatedFilterDataAdmin).catch((err) => {
            toast.error(err?.networkError?.result?.errors[0]?.message);
        })
    }, [filterDataAdmin])

    /**
     * Method used to set filterdataAdmin
     */
    const onSearchAdmin = useCallback(() => {
        const updatedFilterDataAdmin = {
            ...filterDataAdmin,
            location: formik?.values?.location,
            full_name: formik?.values?.adminName,
            user_type: formik?.values?.userType
        }
        setFilterDataAdmin(updatedFilterDataAdmin)

    }, [filterDataAdmin, formik]);

    /**
     * Methos used to edit course admin
     */
    const onEditCourseAdmin = useCallback((id: string) => {
        setEditParamId(id);
        setIsAddAdmin(true);
    }, []);

    /**
   * Methos used to delete course creator
   */
    const onDeleteCourseAdmin = useCallback((id: string) => {
        setEditParamId(id);
        setIsDeleteCourseAdmin(true);
    }, []);

    const handleDeleteCourseAdmin = useCallback(() => {
        deleteAdmin({
            variables: {
                userId: editParamId
            }
        }).then((res) => {
            toast.success(res?.data?.courseAdminDelete?.message);
            onCloseAdmin();
        }).catch((err) => {
            toast.error(err?.networkError?.result?.errors[0]?.message);
        })
    }, [editParamId])

    return (
        <>
            <UpdatedHeader headerActionConst={headerActionConstAdmin} />
            <div>
                {openFilterAdmin && <form onSubmit={formik.handleSubmit}>
                    <div className="flex justify-start flex-wrap 2xl:flex-nowrap p-5 mb-5 border border-border-primary rounded-xl bg-light-blue gap-1 md:gap-2 2xl:gap-[18px] xl:gap-y-2 xl:gap-3 lg:gap-0.5 lg:gap-x-2.5 items-end">
                        <div className='w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-14px)]'>
                            <TextInput value={formik.values.adminName} placeholder={'Name of Course Admin'} type='text' id='highlights1' name='adminName' onChange={formik.handleChange} />
                        </div>
                        <DropDown value={formik.values.userType ?? ''} placeholder={'User Type'} className='w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-14px)] -mt-2' label='' name='userType' id='location' onChange={formik.handleChange} options={DrpAdminUserType} />
                        <DropDown value={formik.values.location} placeholder={'Location'} className='w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-14px)] -mt-2' label='' name='location' id='location' onChange={formik.handleChange} options={locations?.getLocations?.data?.map((loc: { location: string }) => { return { name: loc.location, key: loc.location } })} />
                        <Button type='button' className='btn-primary btn-normal w-full md:min-w-[160px] md:w-auto lg:mt-0' label={'Search'} onClick={onSearchAdmin} />
                        <Button type='button' className='btn-secondary btn-normal w-full md:min-w-[160px] md:w-auto lg:mt-0' label={'Reset'} onClick={onResetCourseAdminFilter} />
                    </div>
                </form>}
                <div className='bg-white rounded-xl overflow-auto border border-[#c8ced3] p-3 md:p-5'>
                    <div className='flex flex-col justify-between gap-3 mb-3 md:gap-5 md:mb-5 btn-group md:flex-row'>
                        <h6 className='w-full leading-7 xmd:w-auto'>{t('Course admin List')}</h6>
                    </div>
                    <div className='w-full mb-3 overflow-auto bg-white border sm:w-auto rounded-t-xl custom-dataTable border-border-primary'>
                        <table>
                            <thead >
                                <tr>
                                    {COL_ARR_ADMIN?.map((colValUser: ColArrType, num: number) => {
                                        const key = colValUser.fieldName + num;
                                        return (
                                            <th scope='col' key={key}>
                                                <div className={`flex items-center ${colValUser.name == 'Status' ? 'justify-center' : ''}`}>
                                                    {colValUser.name}
                                                    {colValUser.sortable && (
                                                        <button onClick={() => onHandleSortCourseAdmin(colValUser.fieldName)}>
                                                            {(filterDataAdmin.sortOrder === '' || filterDataAdmin.sortField !== colValUser.fieldName) &&
                                                                <GetDefaultIcon className='w-3 h-3 ml-1 fill-white' />}
                                                            {filterDataAdmin.sortOrder === 'ascend' && filterDataAdmin.sortField === colValUser.fieldName &&
                                                                <ArrowSortingUp className="ml-1 fill-white" />}
                                                            {filterDataAdmin.sortOrder === 'descend' && filterDataAdmin.sortField === colValUser.fieldName &&
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
                                {courseAdminList?.findAllCourseAdministrator?.data?.data?.map((admin: CourseAdminData, index: number) => {
                                    const srNumber = filterDataAdmin?.index + index + 1;
                                    return <tr key={admin.user_uuid}>
                                        <td scope='row' className='text-center'>
                                            {srNumber}
                                        </td>
                                        <td className='text-left'>{admin.full_name}</td>
                                        <td className='text-left'>{UserTypes?.[admin.user_type]}</td>
                                        <td className='text-left'>{admin.locations.map((locationDeatils) => locationDeatils?.location).join(', ')}</td>
                                        <td>
                                            <div className='flex justify-start btn-group'>
                                                <Button className='bg-transparent btn-default' onClick={() => onEditCourseAdmin(admin?.user_uuid)} label={''} title='Edit'>
                                                    <Edit />
                                                </Button>
                                                <Button className='bg-transparent btn-default' onClick={() => onDeleteCourseAdmin(admin?.user_uuid)} label={''} title='Delete'>
                                                    <Trash className='fill-error' />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>;
                                })}
                            </tbody>
                        </table>
                        {adminListLoader && <div className='w-full px-2.5 py-2 bg-white bg-opacity-75 flex justify-center '>
                            <div className='text-xl'><Loader /></div>
                        </div>}
                        {(courseAdminList?.findAllCourseAdministrator?.data?.count === 0 ||
                            courseAdminList?.findAllCourseAdministrator?.data?.data === null) && (
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
                            <select value={filterDataAdmin.limit} onChange={handlePageDropselectCourseAdmin} className='border border-border-primary rounded-xl ml-2 px-3 text-sm py-1.5 text-gray-500 w-[70px] h-[36px] appearance-none bg-white'>
                                {SHOW_PAGE_COUNT_ARR?.map((item: number) => {
                                    return <option key={item}>{item}</option>;
                                })}
                            </select>
                        </div>
                        <Pagination currentPage={filterDataAdmin.page}
                            totalPages={totalPagesAdmin}
                            onPageChange={handlePageChangeAdmin}
                            recordsPerPage={recordsPerPageAdmin}
                        />
                    </div>
                   {isAddAdmin&& <CreateAndUpdateCourseAdmin isAdd={isAddAdmin} onClose={onCloseAdmin} editId={editParamId} />}
                </div>
                {isDeleteCourseAdmin && <CommonModel warningText={DELETE_WARNING_TEXT} onClose={() => onCloseAdmin()} action={handleDeleteCourseAdmin} show={isDeleteCourseAdmin} disabled={deleteAdminLoading} />}

            </div>
        </>
    )
}
export default CourseAdmin;