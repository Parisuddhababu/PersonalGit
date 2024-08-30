import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import Pagination from '@components/Pagination/Pagination';
import Button from '@components/button/button';
import UpdatedHeader from '@components/header/updatedHeader';
import { ArrowSortingDown, ArrowSortingUp, Cross, Edit, Filter, GetDefaultIcon, ImportDoc } from '@components/icons/icons';
import TextInput from '@components/textInput/TextInput';
import { API_BASE_URL, PAGE_LIMIT, PAGE_NUMBER, SHOW_PAGE_COUNT_ARR } from '@config/constant';
import { ColArrType, DropdownOptionType } from '@types';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import filterServiceProps from '@components/filter/filter';
import { APIServices } from 'src/services/axiosCommon';
import { useFormik } from 'formik';
import useValidation from '@framework/hooks/validations';
import { GET_DIVERSION_ADMIN_WITH_PAGINATION } from '@framework/graphql/queries/divesionAdminManagement';
import { GET_USER_BY_LOCATION_ID, UPDATE_DIVERSION_REPORT_ADMIN } from '@framework/graphql/mutations/diversionAdminmanagement';
import { useDispatch, useSelector } from 'react-redux';
import { DiversionAdminType, setFullName, setLocationName, setUpdateLocationID, setUpdateLocationName } from 'src/redux/diversion-admin-slice';
import DropDown from '@components/dropdown/dropDown';
import { DiversionAdminDataRes } from 'src/types/diversionAdminManagament';

const DiversionAdminManagement = (): ReactElement => {
    const { t } = useTranslation();
    const COL_ARR_DIVERSION_ADMIN_MANAGEMENT = [
        { name: t('Sr.No'), sortable: false },
        { name: t('Location'), sortable: true, fieldName: 'location.location' },
        { name: t('Full Name'), sortable: true, fieldName: 'user.first_name,user.last_name' },
    ] as ColArrType[];
    const [filterData, setFilterData] = useState({
        limit: PAGE_LIMIT,
        page: PAGE_NUMBER,
        sortOrder: 'descend',
        nameSearch: '',
        locationSearch: '',
        sortField: 'createdAt',
        index: 0
    });
    const dispatch = useDispatch();
    const diversionAdminDetails = useSelector((state: { diversionAdminManagement: DiversionAdminType }) => state.diversionAdminManagement);
    const [employeeDrpData, setEmployeeDrpData] = useState<DropdownOptionType[]>([]);
    const { updateDiversionAdminValidationSchema } = useValidation();
    const [isAdd, setIsAdd] = useState<boolean>(false);
    const [openFilter, setOpenFilter] = useState<boolean>(false);
    const [recordsPerPage, setRecordsPerPage] = useState<number>(filterData.limit);
    const { data, refetch: refetchDiversionAdminListData } = useQuery(GET_DIVERSION_ADMIN_WITH_PAGINATION, {
        fetchPolicy: 'network-only',
        variables: filterData ?? {
            limit: PAGE_LIMIT,
            page: PAGE_NUMBER,
            sortOrder: 'descend',
            nameSearch: '',
            locationSearch: '',
            sortField: 'createdAt',
        }
    });
    const [UpdateDiversionAdmin, { loading: updateDiversionAdminLodingState }] = useMutation(UPDATE_DIVERSION_REPORT_ADMIN);
    const [getUserByLocationId] = useMutation(GET_USER_BY_LOCATION_ID);

    /**
     * Method refetchs the list data if there any change in filterData  
     */
    useEffect(() => {
        refetchDiversionAdminListData(filterData).catch((err) => toast.error(err.networkError.result.errors[0].message));
    }, [filterData])

    /**
     * Method used to records per page
     */
    useEffect(() => {
        setRecordsPerPage(filterData?.limit)
    }, [filterData?.limit])

    const totalDiversionAdminsListCount = data?.getDiverAdminWithPagination?.data?.count || 0;
    const totalPages = Math.ceil(totalDiversionAdminsListCount / recordsPerPage);

    /**
     * Method that handles the page changes
     */
    const handlePageChange = useCallback((newPage: number): void => {
        const updatedFilterData = {
            ...filterData,
            page: newPage,
            index: (newPage - 1) * filterData.limit,
        };
        setFilterData(updatedFilterData);
        filterServiceProps.saveState('filterDiversionAdmin', JSON.stringify(updatedFilterData));
    }, [filterData.limit])

    /**
     *
     * @param sortFieldName Method used for storing sort data
     */
    const onHandleSortDIversionAdmin = (sortFieldName: string) => {
        setFilterData({
            ...filterData,
            sortField: sortFieldName,
            sortOrder: filterData.sortOrder === 'ascend' ? 'descend' : 'ascend',
        });
    };

    /**
     *
     * @param e Method used for change dropdown for page limit
     */
    const onPageDrpSelectDiversionAdmin = (e: string) => {
        const newLimit = Number(e);
        const updatedFilterData = {
            ...filterData,
            limit: newLimit,
            page: PAGE_NUMBER,
            index: 0,
        };
        setFilterData(updatedFilterData);
        filterServiceProps.saveState('filterDiversionAdmin', JSON.stringify(updatedFilterData));
    };

    /**
     * Method used to close add new popup
     */
    const onClose = useCallback(() => {
        formik.resetForm();
        setIsAdd(false);
    }, []);

    /**
     * Method used to download csv file of diversion admin list
     */
    const onDownloadDiversionAdminCsv = useCallback(() => {
        APIServices.getList(`${API_BASE_URL}/export-diversion-admin-csv`)
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Diversion-admin-list.csv');
                document.body.appendChild(link);
                link.click();
                toast.success(response?.data?.message);
            })
            .catch((err) => {
                toast.error(err.message);
            });
    }, []);

    /**
     * Method that provides the add new button to breadcrumb
     * @returns Add new button 
     */
    const headerActionConst = () => {
        return (
            <Button className={` ${openFilter ? 'btn-primary' : 'btn-secondary'} btn-normal md:w-[50px]`} label='' onClick={() => setOpenFilter((prev) => !prev)}>
                <Filter />
            </Button>
        )
    };

    const initialValues = {
        diversionAdminData: {
            user_id: '',
            location_id: ''
        }
    }

    /**
     * Method used to validate form 
     */
    const formik = useFormik({
        initialValues,
        validationSchema: updateDiversionAdminValidationSchema,
        onSubmit: (values) => {
            UpdateDiversionAdmin({
                variables:
                {
                    diversionAdminData: {
                        user_id: values?.diversionAdminData?.user_id,
                        location_id: diversionAdminDetails?.updateLocationId
                    }
                }
            })
                .then((res) => {
                    toast.success(res?.data?.updateDiversionReportAdmin?.message);
                    refetchDiversionAdminListData(filterData).catch((err) => toast.error(err.networkError.result.errors[0].message));
                    onClose();
                })
                .catch((err) => toast.error(err.networkError.result.errors[0].message))
        }
    })

    /**
     * Method used to edit diversion admin
     */
    const onEditDiversionAdmin = useCallback((data: DiversionAdminDataRes) => {
        dispatch(setUpdateLocationName(data?.location?.location));
        dispatch(setUpdateLocationID(data?.location?.uuid));
        formik.setFieldValue('diversionAdminData.location_id', data?.location?.uuid);
        getUserByLocationId({
            variables: {
                locationId: data?.location?.uuid
            }
        }).then((res) => {
            setEmployeeDrpData(res?.data?.getUserByLocationId?.data?.map((data: {
                user: {
                    first_name: string;
                    last_name: string;
                    user_type: number;
                    uuid: string;
                }
            }) => {
                return { name: data?.user?.first_name + ' ' + data?.user?.last_name, key: data?.user?.uuid, uuid: data?.user?.uuid };
            }));
        })
        if (data?.user !== null) {
            formik.setFieldValue('diversionAdminData.user_id', data?.user?.uuid)
        }
        setIsAdd(true);
    }, []);

    /**
     * Method used to set search value in filterData
     */
    const handleSearchLocation = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setLocationName(e.target.value));
    };

    /**
     * Method used to set search value in filterData
     */
    const handleSearchFullName = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setFullName(e.target.value));

    };

    const handleChange = () => {
        setFilterData({
            ...filterData,
            nameSearch: diversionAdminDetails?.fullName,
            locationSearch: diversionAdminDetails?.locationName,
        });
    }

    const handleReset = () => {
        refetchDiversionAdminListData({
            ...filterData,
            nameSearch: '',
            locationSearch: '',
        }).catch((err) => toast.error(err.networkError.result.errors[0].message));
        setFilterData({
            ...filterData,
            nameSearch: '',
            locationSearch: '',
        })
        dispatch(setLocationName(''));
        dispatch(setFullName(''));
    };
    return (
        <>
            <UpdatedHeader headerActionConst={headerActionConst} />
            {openFilter &&
                <div className="flex justify-start flex-wrap 2xl:flex-nowrap p-3 md:p-5 mb-3 md:mb-5 border border-border-primary rounded-xl bg-light-blue gap-2 2xl:gap-[18px] items-start">
                    <div className='w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-14px)]'>
                        <TextInput placeholder={t('Location Name')} required={true} name='categoryName' onChange={handleSearchLocation} value={diversionAdminDetails?.locationName} />
                    </div>
                    <div className='w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-14px)]'>
                        <TextInput placeholder={t('Full Name')} required={true} name='fullName' onChange={handleSearchFullName} value={diversionAdminDetails?.fullName} />
                    </div>
                    <Button className='btn-primary btn-normal w-full md:min-w-[160px] md:w-auto lg:mt-0' label={t('Search')} onClick={() => handleChange()} />
                    <Button className='btn-secondary btn-normal w-full md:min-w-[160px] md:w-auto lg:mt-0' label={t('Reset')} onClick={handleReset} />
                </div>
            }
            <div className='mb-3 bg-white rounded-xl overflow-auto border border-[#c8ced3] mx-7 p-3 md:p-5'>
                <div className='flex flex-col justify-between gap-3 mb-3 md:gap-5 md:mb-5 btn-group md:flex-row'>
                    <h6 className='w-full leading-7 xmd:w-auto'>{t('Diversion admin List')}</h6>

                    <div className='w-full flex flex-wrap gap-y-3 gap-x-4 2xl:gap-5 md:w-auto'>
                        <button className="w-full btn btn-gray sm:w-[260px] p-3.5" onClick={() => onDownloadDiversionAdminCsv()}>
                            Export Diversion admin List  <ImportDoc className='order-2 ml-auto' />
                        </button>
                    </div>
                </div>
                <div className='w-full mb-3 overflow-auto bg-white border sm:w-auto rounded-t-xl custom-dataTable border-border-primary'>
                    <table>
                        <thead key='sorting'>
                            <tr>
                                {COL_ARR_DIVERSION_ADMIN_MANAGEMENT?.map((colValUser: ColArrType) => {
                                    return (
                                        <th scope='col' key={colValUser.fieldName}>
                                            <div className={`flex ${['location.location'].includes(colValUser.fieldName) ? 'justify-start' : 'justify-center'}`}>
                                                {colValUser.name}
                                                {colValUser.sortable && (
                                                    <button
                                                        onClick={() => onHandleSortDIversionAdmin(colValUser.fieldName)}
                                                    >
                                                        {(filterData.sortOrder === '' || filterData.sortField !== colValUser.fieldName) &&
                                                            <GetDefaultIcon className='w-3 h-3 ml-1 fill-white' />}
                                                        {filterData.sortOrder === 'ascend' && filterData.sortField === colValUser.fieldName &&
                                                            <ArrowSortingUp className="ml-1 fill-white" />}
                                                        {filterData.sortOrder === 'descend' && filterData.sortField === colValUser.fieldName &&
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
                            {data?.getDiverAdminWithPagination?.data?.diversionAdmin?.map((data: DiversionAdminDataRes, index: number) => {
                                const displayIndex = filterData?.index + index + 1;
                                return (
                                    <tr key={data?.location?.uuid}>
                                        <td scope='row' className='text-center'>
                                            {displayIndex}
                                        </td>
                                        <td className='text-start'>{data?.location?.location}</td>
                                        <td className='text-center'>{data?.user !== null ? data?.user?.first_name + ' ' + data?.user?.last_name : '--'}</td>
                                        <td>
                                            <div className='flex gap-3 text-left md:gap-5 btn-group'>
                                                <Button className='bg-transparent btn-default' onClick={() => onEditDiversionAdmin(data)} label={''}>
                                                    <Edit />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {(data?.getDiverAdminWithPagination?.data?.count === 0 ||
                        data?.getDiverAdminWithPagination?.data === null) && (
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
                        <select value={filterData.limit} className='border border-border-primary rounded-xl ml-2 px-3 text-sm py-1.5 text-gray-500 w-[70px] h-[36px] appearance-none bg-white'
                            onChange={(e) => onPageDrpSelectDiversionAdmin(e.target.value)}
                        >
                            {SHOW_PAGE_COUNT_ARR?.map((item: number) => {
                                return <option key={item}>{item}</option>;
                            })}
                        </select>
                    </div>
                    <Pagination
                        currentPage={filterData.page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        recordsPerPage={recordsPerPage}
                    />
                </div>
                <div key="addPopUp" id='defaultModal' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`fixed top-0 left-0 right-0 z-50 h-full bg-modal modal ${isAdd ? '' : 'hidden'}`}>
                    <div id='changeUserStatusModel' tabIndex={-1} data-modal-show={true} aria-hidden='false' className="flex items-center justify-center h-full py-5 transition-all duration-300">
                        <div className='w-full mx-5 sm:max-w-[780px]'>
                            {/* <!-- Modal content --> */}
                            <div className='relative bg-white rounded-xl'>
                                {/* <!-- Modal header --> */}
                                <div className='flex items-center justify-between px-5 py-4 border-b md:py-6 bg-accents-2 rounded-t-xl'>
                                    <p className='text-lg font-bold md:text-xl text-baseColor'>{'Update Diversion admin'}</p>
                                    <Button onClick={() => onClose()} label={t('')}>
                                        <span className='text-xl-22'><Cross className='text-error' /></span>
                                    </Button>
                                </div>
                                {/* <!-- Modal body --> */}
                                <div className='w-full'>
                                    <form onSubmit={formik.handleSubmit}>
                                        <div className='p-5 max-h-[calc(100vh-260px)] overflow-auto grid grid-cols-1 gap-4 sm:grid-cols-2'>
                                            <div className='max-sm:mb-3  sm:inline-block col-span-1'>
                                                <TextInput
                                                    type='text'
                                                    id='location_id'
                                                    label={t('Location Name')}
                                                    value={diversionAdminDetails?.updateLocationName}
                                                    placeholder={t('Location Name')}
                                                    required={true}
                                                    disabled={true}
                                                />
                                            </div>
                                            <div className='max-sm:mb-3  sm:inline-block col-span-1'>
                                                <DropDown
                                                    placeholder={t('Select Employee')}
                                                    name='diversionAdminData.user_id'
                                                    onChange={formik.handleChange}
                                                    value={formik?.values?.diversionAdminData?.user_id}
                                                    options={employeeDrpData}
                                                    id='user_id'
                                                    label={t('Select Employee')}
                                                    required={true}
                                                    error={(formik.errors?.diversionAdminData?.user_id && formik?.touched?.diversionAdminData?.user_id) ? formik?.errors?.diversionAdminData?.user_id : ''}
                                                />
                                            </div>
                                        </div>
                                        <div className='flex flex-col items-center justify-end p-5 border-t border-solid md:space-x-3 md:flex-row border-border-primary'>
                                            {<Button className={'btn-primary btn-normal w-full md:w-auto min-w-[160px]'} type='submit'
                                                label={t('Update')}
                                                disabled={updateDiversionAdminLodingState}
                                            />}
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>);
}

export default DiversionAdminManagement;