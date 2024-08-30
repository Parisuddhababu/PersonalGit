import React, { useCallback, useEffect, useState } from 'react'
import Button from '@components/button/button'
import DropDown from '@components/dropdown/dropDown'
import UpdatedHeader from '@components/header/updatedHeader'
import { ArrowSortingDown, ArrowSortingUp, Cross, Download, DropdownArrowDown, Filter2, GetDefaultIcon } from '@components/icons/icons'
import { useTranslation } from 'react-i18next'
import { ColArrType, PaginationParams } from 'src/types/cms';
import { GET_TENANTS_CONTRACTORS_COMPANIES, GET_WASTE_AUDIT_REPORT_WITH_PAGINATION } from '@framework/graphql/queries/wasteAuditReport'
import { useMutation, useQuery } from '@apollo/client'
import Pagination from '@components/Pagination/Pagination'
import { DELETE_WARNING_TEXT, SHOW_PAGE_COUNT_ARR, USER_TYPE, WasteAuditDrpData, getSignUrl } from '@config/constant'
import filterServiceProps from '@components/filter/filter';
import { toast } from 'react-toastify'
import { CREATE_WASTE_AUDIT_REPORT_REQUEST, DELETE_WASTE_AUDIT_REPORT } from '@framework/graphql/mutations/wasteAuditReport'
import CommonModel from '@components/common/commonModel'
import { useFormik } from 'formik'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { DropdownOptionType } from '@types'
import { SUBSCRIBER_LOCATION } from '@framework/graphql/queries/createEmployeeLocation'
import useValidation from '@framework/hooks/validations'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { UserProfileType } from 'src/types/common'
import DeleteBtn from '@components/common/deleteBtn'
import Loader from '@components/common/loader'

function Index() {
    const { t } = useTranslation();
    const COL_ARR_DOWNLOAD_WASTE_AUDIT_MANAGEMENT = [
        { name: t('Sr.No'), sortable: false },
        { name: t('Title And Highlights'), sortable: true, fieldName: t('title'), },
        { name: t('Date'), sortable: true, fieldName: t('date'), },
    ] as ColArrType[];
    const [filterData, setFilterData] = useState<PaginationParams>({
        sortOrder: 'descend',
        sortField: 'createdAt',
        limit: 10,
        page: 1,
        index: 0
    });
    const [togglePopUp, setTogglePopUp] = useState<boolean>(false);
    const { requestReportSchema } = useValidation();
    const [stateDrpData, setStateDrpData] = useState<DropdownOptionType[]>([]);
    const [companyDrpData, setCompanyDrpData] = useState<DropdownOptionType[]>([]);
    const [createWasteAuditRequest] = useMutation(CREATE_WASTE_AUDIT_REPORT_REQUEST)   
    const [isDelete, setIsDelete] = useState<boolean>(false);
    const [deleteWasteAudit, deleteLoading] = useMutation(DELETE_WASTE_AUDIT_REPORT);
    const { data, refetch, loading } = useQuery(GET_WASTE_AUDIT_REPORT_WITH_PAGINATION, { variables: { filterData: { sortOrder: 'descend', sortField: 'createdAt', limit: 10, page: 1 } } });
    const { data: companyData } = useQuery(GET_TENANTS_CONTRACTORS_COMPANIES, { variables: { companyType: 2 }});
    const [screenSize, setScreenSize] = useState(getCurrentDimension());
    const [headerActionToggle, setHeaderActionToggle] = useState(false);
    const [headerButtonToggle, setHeaderButtonToggle] = useState(false);
    const [activeItem, setActiveItem] = useState<number | null>(null);
    const [recordsPerPage, setRecordsPerPage] = useState<number>(filterData.limit);
    const totalInvoicePage = data?.getWasteAuditReportWithPagination?.data?.count || 0;
    const totalPages = Math.ceil(totalInvoicePage / recordsPerPage);
    const [bannerObj, setBannerObj] = useState({} as { uuid: string, title: string, date: string, status: number, waste_audit_highlights: { highlight: string, uuid: string }[], performance_current: number, performance_potential: number, performance_capture_rate: number })

    function getCurrentDimension() {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
        };
    }

    const initialValues = {
        branchId: '',
        companyId: '',
        selectedDate: new Date(),
    }

    const toggleItem = (index: number) => {
        if (activeItem === index) {
            setActiveItem(null); // Close the currsently open item if clicked again
        } else {
            setActiveItem(index); // Open the clicked item
        }
    };

    const formik = useFormik({
        initialValues,
        validationSchema: requestReportSchema,
        onSubmit: (values) => {
            createWasteAuditRequest({
				variables: {
                    wasteAuditData: {
                        branch_id: values?.branchId,
                        company_id: values?.companyId,
                        date: moment(values?.selectedDate).format('MM/YYYY'),
                    }
                }
            }).then((res) => {
				const data = res.data.createWasteAuditReportRequest
				toast.success(data?.message);
                setTogglePopUp(false);
                formik.resetForm();
			})
				.catch((err) => {
					toast.error(err?.networkError?.result?.errors?.[0]?.message);
				});
        },
    })

    const { data: subscriberLocation } = useQuery(SUBSCRIBER_LOCATION, { variables: { companyId: formik.values.companyId }, skip: !formik.values.companyId });

    useEffect(() => {
        if (subscriberLocation?.subscriberLocations) {
            const tempDataArr = [] as DropdownOptionType[];
            subscriberLocation?.subscriberLocations?.data?.map((data: { location: string, uuid: string }) => {
                tempDataArr.push({ name: data.location, key: data?.uuid });
            });
            setStateDrpData(tempDataArr);
        }
    }, [subscriberLocation]);

    useEffect(() => {
        if (companyData?.getTenantsContractorsCompanies?.data) {
            const tempDataArr = [] as DropdownOptionType[];
            companyData?.getTenantsContractorsCompanies?.data?.map((data: { name: string, uuid: string }) => {
                tempDataArr.push({ name: data.name, key: data?.uuid });
            });
            setCompanyDrpData(tempDataArr);
        }
    }, [companyData]);

    const handleWasteAuditSortChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSortOption = event.target.value;
        const [sortField, sortOrder] = selectedSortOption.split(':');
        setFilterData({
            ...filterData,
            sortField,
            sortOrder,
        });
    }, [filterData]);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { index, ...newObject } = filterData;
        refetch({filterData: newObject}).catch((err) => toast.error(err))
    }, [filterData])

    useEffect(() => {
        const headerActionToggle = () => {
            const headerAction = screenSize.width < 768;
            setHeaderActionToggle(headerAction);
        };

        const updateDimension = () => {
            setScreenSize(getCurrentDimension());
        };

        headerActionToggle();
        window.addEventListener('resize', updateDimension);

        return () => {
            window.removeEventListener('resize', updateDimension);
        };
    }, [screenSize]);

    const newRequestBtn = useCallback(() => {
        setTogglePopUp(true)
    }, [])

    const headerActionBtn = useCallback(() => {
        setHeaderButtonToggle(!headerButtonToggle)
    }, [])

	const { userProfileData } = useSelector(((state: { userProfile: { userProfileData: UserProfileType } }) => state.userProfile));
    const userType = userProfileData?.getProfile?.data?.user_type ?? ''

    const headerActionConst = useCallback(() => {
        return (
            <>
                {!headerActionToggle &&
                    <div className='flex items-center w-full gap-3 ml-3 max-md:flex-wrap xmd:w-auto md:ml-0'>
                        <span className='leading-5.5 w-full md:w-auto whitespace-nowrap'>Sort By</span>
                        <div className='w-full xmd:w-[150px]'>
                            <DropDown
                                className='w-full -mt-2'
                                label=''
                                name='appInvoice'
                                onChange={handleWasteAuditSortChange}
                                value={filterData.sortField + ':' + filterData.sortOrder}
                                error=""
                                options={WasteAuditDrpData}
                                id='appInvoice'
                            />
                        </div>
                    </div>
                }
                {(userType === USER_TYPE.SUBSCRIBER_EMPLOYEE || userType === USER_TYPE.SUBSCRIBER_ADMIN) && <Button
                    className='btn btn-secondary btn-normal whitespace-nowrap xmd:w-[160px] ml-3 md:ml-0'
                    type='button'
                    label={t('+ New Request')}
                    onClick={newRequestBtn}
                />}
                {headerActionToggle &&
                    <Button className={`btn ${headerButtonToggle ? 'btn-primary' : 'border-primary border btn-secondary'} w-10 ml-auto mr-2 md:w-[50px]`} type='submit' label={''} onClick={headerActionBtn}>
                        <Filter2 className='order-2' fontSize='17' />
                    </Button>
                }
            </>
        )
    }, [filterData, userType]);

    useEffect(() => {
        setRecordsPerPage(filterData.limit);
    }, [filterData.limit]);

    /**
     *
     * @param sortFieldName Method used for storing sort data
    */
    const onHandleSortInvoice = useCallback((sortFieldName: string) => {
        setFilterData({
            ...filterData,
            sortField: sortFieldName,
            sortOrder: filterData.sortOrder === 'ascend' ? 'descend' : 'ascend',
        });
    }, [filterData]);

    /**
     *
     * @param e Method used for change dropdown for page limit
    */
    const onPageDrpSelectInvoice = (e: string) => {
        const newLimit = Number(e);
        const updatedFilterData = {
            ...filterData,
            limit: newLimit,
            page: 1,
            index: 0
        };
        setFilterData(updatedFilterData);
        filterServiceProps.saveState('filterValueWasteAudit', JSON.stringify(updatedFilterData));
    };

    const handlePageChange = useCallback((newPage: number): void => {
        const updatedFilterData = {
            ...filterData,
            page: newPage,
            index: (newPage - 1) * filterData.limit,
        };
        setFilterData(updatedFilterData);
        filterServiceProps.saveState('filterValueWasteAudit', JSON.stringify(updatedFilterData));
    }, [filterData.limit]);

    const onClose = useCallback(() => {
        setIsDelete(false);
    }, [])

    const onRemove = useCallback(() => {
        deleteWasteAudit({
            variables: {
                reportId: bannerObj?.uuid,
            },
        })
            .then((res) => {
                const data = res.data
                toast.success(data?.deleteWasteAudit?.message)
                refetch();
                setIsDelete(false);
            })
            .catch((err) => {
                toast.error(err.networkError.result.errors[0].message)
                setIsDelete(false);
            })
    }, [bannerObj])

    const onDownload = useCallback(async (id: string) => {
        const url = await getSignUrl(id);
        fetch(url).then(response => {
            response.blob().then(blob => {
                const fileURL = window.URL.createObjectURL(blob);
                const alink = document.createElement('a');
                alink.href = fileURL;
                alink.download = id;
                alink.click();
            })
        })
       
    }, []);

    const onCancel = useCallback(() => {
        setTogglePopUp(false);
        formik.resetForm();
    }, [])

    const onChangeDate = (date: Date | null) => {
        formik.setFieldValue('selectedDate', date)
    } 

    return (
        <>
            <UpdatedHeader headerActionConst={headerActionConst} headerTitle='Waste Audit Reports' />
            {(loading || deleteLoading?.loading) && <Loader />}
            <div>
                <div className='w-full mb-3 overflow-auto bg-white border rounded-xl rounded-t-xl border-border-primary'>
                    <div className='w-full mb-3 overflow-auto sm:w-auto custom-dataTable audit-table'>
                        <table>
                            <thead>
                                <tr>
                                    {COL_ARR_DOWNLOAD_WASTE_AUDIT_MANAGEMENT?.map((wasteAuditVal: ColArrType) => {
                                        return (
                                            <th scope='col' key={wasteAuditVal.name}>

                                                <div className='flex items-center'>
                                                    {wasteAuditVal.name}
                                                    {wasteAuditVal.sortable && (
                                                        <button onClick={() => onHandleSortInvoice(wasteAuditVal.fieldName)} title=''>
                                                            {(filterData.sortOrder === '' || filterData.sortField !== wasteAuditVal.fieldName) && <GetDefaultIcon className="fill-white" />}
                                                            {filterData.sortOrder === 'ascend' && filterData.sortField === wasteAuditVal.fieldName && <ArrowSortingUp className="ml-1 fill-white" />}
                                                            {filterData.sortOrder === 'descend' && filterData.sortField === wasteAuditVal.fieldName && <ArrowSortingDown className="ml-1 fill-white" />}
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
                            <tbody className='border border-solid border-border-primary text-baseColor'>
                                {data?.getWasteAuditReportWithPagination?.data?.reports?.map((data: { uuid: string, title: string, date: string, status: number, waste_audit_highlights: { highlight: string, uuid: string }[], performance_current: number, performance_potential: number, performance_capture_rate: number, attachment: string }, index: number) => {
                                    const displayIndex = filterData?.index as number + index + 1;
                                    
                                    return (
                                        <tr className='h-[60px] text-base cursor-pointer bg-accents-2' key={data?.uuid} >
                                            <td className={`text-left ${activeItem === index ? 'align-top' : ''}`} >
                                                {displayIndex}
                                            </td>
                                            <td className={`text-left font-bold ${activeItem === index ? 'align-top' : ''}`} >
                                                <p className={`${activeItem === index && 'mb-5'}`}>{t(data?.title)}</p>

                                                <div className={`${activeItem === index ? 'mb-2 flex gap-5 2xl:gap-[30px] flex-wrap' : 'h-0 hidden'}`}>
                                                    <div className="p-5 border border-solid border-border-primary rounded-xl bg-light-blue">
                                                        <p className='mb-3 font-semibold'>Top Three Recyclable Materials in the Garbage</p>
                                                        <ul className='font-normal list-disc list-inside'>
                                                            {data?.waste_audit_highlights?.map((highlightsData: { highlight: string, uuid: string }) => (
                                                                <li className='text-sm leading-6' key={highlightsData?.uuid}>{highlightsData?.highlight}</li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    <div className="p-5 border border-solid border-border-primary rounded-xl bg-light-blue">
                                                        <p className='mb-3 font-semibold'>Waste Diversion Performance</p>
                                                        <div className="flex justify-center">
                                                            <div className="border-r px-[30px] flex justify-center flex-col items-center ">
                                                                <p className='font-normal text-sm mb-2.5'>Current</p>
                                                                <span className='text-4xl text-primary leading-11'>{data?.performance_current}%</span>
                                                            </div>

                                                            <div className="border-r px-[30px] flex justify-center flex-col items-center">
                                                                <p className='font-normal text-sm mb-2.5'>Potential</p>
                                                                <span className='text-4xl text-primary leading-11'>{data?.performance_potential}%</span>
                                                            </div>

                                                            <div className="px-[30px] flex justify-center flex-col items-center">
                                                                <p className='text-sm font-normal whitespace-nowrap'>Capture Rate</p>
                                                                <span className='text-4xl text-primary leading-11'>{data?.performance_capture_rate}%</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={`text-left ${activeItem === index ? 'align-top' : ''}`} >
                                                {data?.date}
                                            </td>
                                            <td className={`text-left ${activeItem === index ? 'align-top' : ''} `}>
                                                <div className="flex items-center text-primary ">
                                                    <button className='flex items-center gap-1 underline' type='button' onClick={() => onDownload(data.attachment)}>                                                    
                                                        {/* </button><button className='flex items-center gap-1 underline' type='button' onClick={() => onDownload(data?.uuid)}  title={`${t('Download')}`} > */}
                                                        <Download />
                                                        {t('Download')}
                                                    </button>
                                                    <DeleteBtn className='ml-2' data={data} setObj={setBannerObj} setIsDelete={setIsDelete} />
                                                    <button onClick={() => toggleItem(index)} className={`flex cursor-pointer items-center justify-center ${activeItem === index ? 'rotate-180 ml-3' : 'ml-3'}`} title=''><DropdownArrowDown /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {(data?.getWasteAuditReportWithPagination?.data?.count === 0) && (
                            <div className='flex justify-center'>
                                <div>No Data</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className='flex flex-wrap items-center gap-2 px-5 mt-2 md:gap-5 text-slate-700'>
                <div className='flex items-center'>
                    <span className='mr-2 text-sm whitespace-nowrap'>{t('Per Page')}</span>
                    <select value={filterData.limit} className='border border-border-primary rounded-xl ml-2 px-3 text-sm py-1.5 text-gray-500 w-[70px] h-[36px] appearance-none bg-white' onChange={(e) => onPageDrpSelectInvoice(e.target.value)}>
                        {SHOW_PAGE_COUNT_ARR?.map((data: number) => {
                            return <option key={data}>{data}</option>;
                        })}
                    </select>
                </div>
                <div>
                    <Pagination currentPage={filterData.page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        recordsPerPage={recordsPerPage}
                    />
                </div>
            </div>

            {isDelete && (
                <CommonModel
                    warningText={DELETE_WARNING_TEXT}
                    onClose={onClose}
                    action={onRemove}
                    show={isDelete}
                />
            )}

            {togglePopUp &&
                <div id='defaultModal' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`fixed top-0 left-0 right-0 z-50 h-full bg-modal modal ${togglePopUp ? '' : 'hidden'}`}>
                    <div id='changeUserStatusModel' tabIndex={-1} data-modal-show={true} aria-hidden='false' className="flex items-center justify-center h-full py-5 transition-all duration-300">
                        <div className='w-full mx-5 sm:max-w-[780px]'>
                            {/* <!-- Modal content --> */}
                            <div className='relative bg-white rounded-xl'>
                                {/* <!-- Modal header --> */}
                                <div className='flex items-center justify-between px-5 py-4 border-b md:py-6 bg-accents-2 rounded-t-xl'>
                                    <p className='text-lg font-bold md:text-xl text-baseColor'>{t('Request Report')}</p>
                                    <Button onClick={onCancel} label={t('')}  title={`${t('Close')}`} >
                                        <span className='text-xl-22'><Cross className='text-error' /></span>
                                    </Button>
                                </div>
                                {/* <!-- Modal body --> */}
                                <div className='w-full'>
                                    <form>
                                        <div className='p-5 max-h-[calc(100vh-260px)] flex justify-between overflow-auto flex-wrap'>
                                            <div className='mb-5 sm:w-[calc(50%-10px)] sm:inline-block request-report'>
                                                <label>
                                                    Select Date<span className='text-error'> *</span>
                                                </label>
                                                <DatePicker
                                                    selected={formik.values.selectedDate}
                                                    onChange={(date: Date | null) => onChangeDate(date)}
                                                    dateFormat="MM/yyyy"
                                                    showMonthYearPicker
                                                    placeholderText="MM/YYYY"
                                                    className='customInput'
                                                    maxDate={new Date()}
                                                />
                                            </div>
                                            <div className='mb-5 sm:w-[calc(50%-20px)] sm:inline-block'>
                                                <DropDown placeholder={t('Select Contractor Company')} className='w-full' label={t('Contractor Company')} inputIcon={<span className='text-xs'><DropdownArrowDown className='fill-dark-grey' /></span>} onChange={formik.handleChange} value={formik.values.companyId} options={companyDrpData} name='companyId' id='companyId' error={formik.errors.companyId && formik.touched.companyId ? formik.errors.companyId : ''} required={true} />
                                            </div>
                                            {formik?.values?.companyId && <div className='mb-5 sm:w-[calc(50%-10px)] sm:inline-block'>
                                                <DropDown placeholder={t('Select Location')} className='w-full' label={t('Location')} inputIcon={<span className='text-xs'><DropdownArrowDown className='fill-dark-grey' /></span>} onChange={formik.handleChange} value={formik.values.branchId} options={stateDrpData} name='branchId' id='branchId' error={formik.errors.branchId && formik.touched.branchId ? formik.errors.branchId : ''} required={true} />
                                            </div>}
                                        </div>
                                        <div className='flex flex-col items-center justify-end p-5 border-t border-solid md:space-x-3 md:flex-row border-border-primary'>
                                            <Button className='btn-primary btn-normal mb-2 md:mb-0 w-full md:w-auto min-w-[160px]' type='button' label={t('Schedule')} onClick={formik.handleSubmit}  title={`${t('Schedule')}`}  />
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default Index
