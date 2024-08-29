// eslint-disable-next-line
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import CIcon from '@coreui/icons-react';
import { CBadge, CButton } from '@coreui/react'
import DeleteModal from '../../common/DeleteModalPopup/delete-modal'
import { API } from '../../../../services/Api';
import { Dropdown } from 'primereact/dropdown';
import * as  Constant from "../../../../shared/constant/constant"
import { Calendar } from 'primereact/calendar';
import SendMail from '../../common/SendMailPopup/send-mail'
import Loader from "../../common/loader/loader"

import { cilList, cilTrash, cibGmail, cilPencil } from '@coreui/icons';
import { CommonMaster, Permission } from 'src/shared/enum/enum';
import { useToast } from '../../../../shared/toaster/Toaster';
import { displayDateTimeFormat, requestDateFormatYY, PICKER_DISPLAY_DATE_FORMAT, emailLowerCase, isEmpty } from 'src/shared/handler/common-handler';
import { Paginator } from 'primereact/paginator';
import permissionHandler from 'src/shared/handler/permission-handler';
import InquiryDetails from './inquiry-details';

const ContactUsList = (props) => {
    const accountVal = localStorage.getItem('is_main_account')
    const adminRole = JSON.parse(localStorage.getItem('user_details'))?.role?.code;
    const primaryaccountId = localStorage.getItem("account_id");
    const [isDeleteModalShow, setIsDeleteModalShow] = useState(false)
    const initialFilter = {
        start: 0,
        length: Constant.DT_ROW,
        sort_order: '',
        sort_field: '',
    }

    const statusConfig = [
        { label: "Unread", value: 1, checkValue: true },
        { label: "Responded", value: 2, checkValue: false },
        { label: "Archived", value: 3, checkValue: null },
    ];

    const [searchVal, setSearchVal] = useState(initialFilter)
    const [deleteObj, setDeleteObj] = useState({})
    const [contactUsData, setContactUsData] = useState([])
    const [selectedContactUsMaster, setSelectedContactUsMaster] = useState([]);
    const [deleteDataArr, setDeleteDataArr] = useState([])
    const [mailDataArr, setMailDataArr] = useState([])
    const [selectedEmail, setSelectedEmail] = useState('')
    const [endDate, setEndDate] = useState(null)
    const [startDate, setStartDate] = useState(null)
    const [date, setDate] = useState(null);
    const [selectedName, setSelectedName] = useState('');
    const [selectedStatus, setSelectedStatus] = useState(1);
    const [selectedAccount, setSelectedAccount] = useState(adminRole !== "SUPER_ADMIN" ? primaryaccountId : '');
    const [accountData, setAccountData] = useState([])
    const [mailObj, setMailObj] = useState({})
    const [isMailModalShow, setIsMailModalShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { showSuccess } = useToast();
    const [totalRecords, setTotalRecords] = useState(0);
    const [filteredKeys, setFilteredKeys] = useState([]);
    const [showInquiryDetails, setShowInquiryDetails] = useState(false);
    const [inquiryData, setInquiryData] = useState(null);

    const filterMap = {
        status: selectedStatus,
        first_name: selectedName,
        email: emailLowerCase(selectedEmail),
        to_date: endDate ? requestDateFormatYY(endDate) : '',
        from_date: startDate ? requestDateFormatYY(startDate) : '',
    };

    useEffect(() => {
        getAccountData()
    }, [])

    useEffect(() => {
        if (searchVal) {
            const filters = {};

            if (filteredKeys.length) {
                filteredKeys.forEach(filterKey => {
                    filters[filterKey] = filterMap[filterKey];
                });
            }

            onFilterData(filters);
        }

    }, [searchVal])

    useEffect(() => {
        if (date) {
            setStartDate(date[0])
            setEndDate(date[1])
        }

    }, [date])

    const getContactUsData = (formData) => {
        setIsLoading(true)

        API.getMasterList(onContactUsList, formData, true, Constant.GETCONTACTUS);
    }

    // onContactUsList Response Data Method
    const onContactUsList = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            if (response?.meta?.status) {
                setContactUsData(response?.data?.original?.data ?? []);
                setTotalRecords(response?.data?.original?.recordsTotal ?? 0);
            }
        },
        error: err => {
            console.log(err);
            setIsLoading(false);
        },
        complete: () => { },
    }



    const getAccountData = () => {
        if (adminRole === "SUPER_ADMIN") {
            setIsLoading(true);
            API.getMasterList(accountRes, null, true, Constant.ACCOUNT_LIST);
        }
    }

    // accountRes Response Data Method
    const accountRes = {
        cancel: (c) => {
        },
        success: (response) => {
            if (response?.data?.original?.data?.length > 0) {
                let resVal = response.data.original.data;
                setAccountData(resVal)
                setIsLoading(false)

            }
        },
        error: (error) => {
            setIsLoading(false)


        },
        complete: () => {
        },
    }


    const onAccountChange = (e) => {
        setSelectedAccount(e.target.value)
    }

    const onChangeName = (e) => {
        setSelectedName(e.target.value)
    }
    const onChangeEmail = (e) => {
        setSelectedEmail(e.target.value)
    }


    const confirmDeleteProduct = (data) => {
        let obj = { ...data }
        obj.urlName = CommonMaster.CONTACT_US
        obj.name = data.first_name
        setDeleteObj(obj)
        setIsDeleteModalShow(true)
    }


    const confirmMail = (data) => {
        setIsLoading(true);
        API.getMasterDataById(getMasterRes, "", true, data._id, Constant.SHOWCONTACTUS);
    }

    const showInquiryData = rowData => {
        setShowInquiryDetails(true);
        const status = statusConfig.find(statusObj => statusObj?.value === rowData.status)?.label ?? '';
        setInquiryData({
            status,
            name: rowData?.first_name ?? '',
            date: rowData?.created_at ?? '',
            email: rowData?.email ?? '',
            phoneCode: rowData?.country_phone_code ?? '',
            phone: rowData?.phone ?? '',
            message: rowData?.description ?? '',
        });
    }

    // getMasterRes Response Data Method
    const getMasterRes = {
        cancel: (c) => {
        },
        success: (response) => {
            if (response.meta.status_code === 200) {
                let resVal = response.data
                setMailObj(resVal)
                setIsMailModalShow(true)
                setIsLoading(false)

            }
        },
        error: (error) => {
            setIsLoading(false)


        },
        complete: () => {
        },
    }


    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <button
                    title="Details"
                    className="btn btn-link mr-2 text-success"
                    onClick={() => { showInquiryData(rowData); }}
                >
                    <CIcon icon={cilPencil} size="lg" />
                </button>

                <span className="p-column-title">Action</span>
                {
                    permissionHandler(Permission.CONTACTUS_MAIL) &&
                    <a title="Send Mail" className="mr-2" onClick={() => confirmMail(rowData)}><CIcon icon={cibGmail} size="lg" /></a>
                }
                {
                    permissionHandler(Permission.CONTACTUS_DELETE) &&
                    <button className="btn btn-link mr-2 text-danger" title="Delete" onClick={() => confirmDeleteProduct(rowData)}><CIcon icon={cilTrash} size="lg" /></button>
                }
            </React.Fragment>
        );
    }


    const onDeleteAll = (event) => {
        setDeleteDataArr(selectedContactUsMaster)
        setIsDeleteModalShow(true)
    }

    const sendMailAll = (event) => {
        setMailDataArr(selectedContactUsMaster)
        let emailArr = []
        let uuid = []
        selectedContactUsMaster?.map(val => {
            emailArr.push(val.email)
            uuid.push(val._id)
        })
        let obj = { email: emailArr.join(','), message: '', _id: uuid }
        setMailObj(obj)
        setIsMailModalShow(true)
    }

    const onDateChange = (event) => {
        setDate(event.value)
    }

    const checkDeletePermission = () => {
        if (selectedContactUsMaster.length === contactUsData?.length) {
            return !permissionHandler(Permission.CONTACTUS_DELETE_ALL);
        } else {
            return selectedContactUsMaster?.length === 0;
        }
    }

    const accountDataTemplate = option => {
        return (
            <>{`${option?.company_name ?? ''} (${option?.code ?? ''})`}</>
        )
    }

    const header = (
        <div className="table-header">
            <div className="clearfix">
                <h5 className="p-m-0 float-start"><CIcon icon={cilList} className="mr-1" />
                    {CommonMaster.CONTACT_US} <CBadge color="danger" className="ms-auto">{totalRecords}</CBadge>
                </h5>

                <div className="float-end">
                    <div className="common-add-btn">
                        {permissionHandler(Permission.CONTACTUS_MAIL) &&
                            <CButton color="primary" className="master-delete" disabled={selectedContactUsMaster?.length === 0} onClick={(e) => sendMailAll(e)}> Send Mail</CButton>
                        }
                        {
                            permissionHandler(Permission.CONTACTUS_DELETE_ALL) && (
                                <CButton
                                    color="primary"
                                    onClick={onDeleteAll} // NOSONAR
                                    className="master-delete btn-danger"
                                    disabled={!selectedContactUsMaster.length || checkDeletePermission()}
                                >
                                    <CIcon icon={cilTrash} className="mr-1" />
                                    {
                                        selectedContactUsMaster?.length > 1 ?
                                            selectedContactUsMaster.length === contactUsData.length ? // NOSONAR
                                                "Delete All" : // NOSONAR
                                                `Delete Selected (${selectedContactUsMaster.length})` : // NOSONAR
                                            "Delete"
                                    }
                                </CButton>
                            )
                        }
                    </div>
                </div>
            </div>

            <hr />
            <form name='filterFrm' onSubmit={(e) => setGlobalFilter(e)}>

                <div className="row">
                    {accountVal !== '0' && adminRole === 'SUPER_ADMIN' &&
                        <div className="col-md-6 col-lg-3 pb-3">
                            <span className="p-float-label custom-p-float-label">
                                <Dropdown
                                    value={selectedAccount}
                                    className="form-control"
                                    options={accountData}
                                    onChange={onAccountChange}
                                    itemTemplate={accountDataTemplate}
                                    valueTemplate={accountDataTemplate}
                                    optionLabel="company_name"
                                    optionValue="_id"
                                    filter
                                    filterBy="company_name,code"
                                />
                                <label>HCP</label>
                            </span>
                        </div>
                    }
                    <div className="col-md-6 col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <InputText className="form-control" maxLength="255" value={selectedName} name="name" onChange={(e) => onChangeName(e)} />
                            <label>Name </label>

                        </span>
                    </div>
                    <div className="col-md-6 col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <InputText className="form-control" value={selectedEmail} name="email" onChange={(e) => onChangeEmail(e)} />
                            <label> Email</label>
                        </span>
                    </div>

                    <div className="col-md-6 col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <Calendar id="range" className="form-control border-0 px-0 py-0 custom-datepicker-input" dateFormat={PICKER_DISPLAY_DATE_FORMAT} showIcon appendTo="self" value={date} onChange={(e) => onDateChange(e)} selectionMode="range" readOnlyInput />
                            <label>Date Range </label>

                        </span>
                    </div>

                    <div className="col-md-6 col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <Dropdown
                                optionLabel="label"
                                optionValue="value"
                                value={selectedStatus}
                                options={statusConfig}
                                className="form-control"
                                onChange={e => { setSelectedStatus(e.target.value); }} // NOSONAR
                            />
                            <label>Status</label>
                        </span>
                    </div>

                    <div className="col-md-12 col-lg-3 pb-3 search-reset">
                        <CButton color="primary" className="mr-2" type='submit' >Search</CButton>
                        <CButton color="danger" onClick={() => resetGlobalFilter()} >Reset</CButton>
                    </div>
                </div>
            </form>
        </div>
    );


    const emailBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Email</span>
                {rowData.email}
            </React.Fragment>
        );
    }

    const dateBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Date</span>
                {displayDateTimeFormat(rowData.created_at)}
            </React.Fragment>
        );
    }

    const handleStatusChange = (e, uuid) => {
        const data = { uuid, status: e.target.value };
        setIsLoading(true);
        API.UpdateStatus(handleStatusChangeResponseObj, data, true, uuid, Constant.CONTACTUSCHANGESTATUS);
    }

    const handleStatusChangeResponseObj = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            if (response?.meta?.message) showSuccess(response.meta.message);
            onFilterData();
        },
        error: err => {
            console.log(err);
            if (err?.meta?.message) showSuccess(err.meta.message);
        },
        complete: () => { }
    }

    const statusBodyTemplate = rowData => {
        const { _id: id, status } = rowData;
        return (
            <span className="p-float-label custom-p-float-label">
                {
                    adminRole === "SUPER_ADMIN" ? (
                        <Dropdown
                            value={status}
                            optionLabel="label"
                            optionValue="value"
                            options={statusConfig}
                            className="form-control"
                            onChange={e => { handleStatusChange(e, id); }} // NOSONAR
                        />
                    ) : (
                        statusConfig.find(statusObj => statusObj.value == status)?.label ?? Constant.NO_VALUE
                    )
                }
            </span>
        );
    }

    const onCloseDeleteConfirmation = (value, isDelete, message) => {
        setIsDeleteModalShow(value)
        setSelectedContactUsMaster([])
        setDeleteDataArr([])
        setMailDataArr([])
        if (isDelete) {
            showSuccess(message);
            const filters = { ...searchVal };
            if (contactUsData?.length === 1 && searchVal.start > 0) {
                filters.start -= filters.length;
                setSearchVal({ ...searchVal, start: filters.start });
            }

            onFilterData(filters);
        }
    }

    const setGlobalFilter = (event) => {
        event.preventDefault()
        onFilterData()

    }

    const onFilterData = filters => {
        const { start, length, sort_field, sort_order } = searchVal;
        const data = { start, length }, _filteredKeys = [];

        if (sort_field) data["sort_param"] = sort_field;
        if (sort_order) data["sort_type"] = sort_order === 1 ? "asc" : "desc";
        const appliedFilters = filters ?? filterMap;

        for (const filterKey in appliedFilters) {
            const value = appliedFilters[filterKey];
            if (!isEmpty(value)) {
                data[filterKey] = value;
                _filteredKeys.push(filterKey);
            }
        }

        if (!filters) {
            data["start"] = 0;
            setSearchVal({ ...searchVal, start: 0 });
        }
        if (selectedAccount) data["account_id"] = selectedAccount;

        setFilteredKeys([..._filteredKeys]);
        getContactUsData(data);
    }


    const resetGlobalFilter = () => {
        setSelectedName('')
        setSelectedEmail('')
        setSelectedAccount(adminRole !== "SUPER_ADMIN" ? primaryaccountId : '')
        setSelectedStatus(1);
        setDate(null)
        setStartDate(null)
        setEndDate(null)
        setSearchVal(initialFilter)
        // setGlobalFilter('', '', localStorage.getItem('account_id'), null, null)

    }

    const onselectRow = (e) => {
        setSelectedContactUsMaster(e.value)
    }

    const nameBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Name</span>
                {rowData.first_name}
            </React.Fragment>
        );
    }

    const hcpBodyTemplate = rowData => {
        return (
            <>
                <span className="p-column-title">HCP</span>
                {rowData?.account?.account_name ?? Constant.NO_VALUE}
            </>
        );
    }

    const onCloseMail = (value, isDelete, message) => {
        setIsMailModalShow(value)
        setSelectedContactUsMaster([])
        setDeleteDataArr([])
        setMailDataArr([])
        if (isDelete) {
            showSuccess(message)
            // getContactUsData()
            onFilterData()
        }
    }

    const onPageChange = e => {
        setSearchVal({ ...searchVal, start: e.first, length: e.rows });
    }

    const footer = (
        <div className='table-footer'>
            <Paginator template={Constant.DT_PAGE_TEMPLATE}
                currentPageReportTemplate={Constant.DT_PAGE_REPORT_TEMP}
                first={searchVal.start} rows={searchVal.length} totalRecords={totalRecords}
                rowsPerPageOptions={Constant.DT_ROWS_LIST} onPageChange={onPageChange}></Paginator>
        </div>
    );

    const onSort = (e) => {
        // sortField: "email"
        // sortOrder: 1 / -1


        if (e.sortField) {
            setSearchVal({ ...searchVal, sort_field: e.sortField, sort_order: e.sortOrder })
        }
    }



    return (
        <>
            {isLoading && <Loader />}

            <div className="datatable-responsive-demo custom-react-table">
                <div className="card">

                    <DataTable value={contactUsData} stripedRows className="p-datatable-responsive-demo" header={header} footer={contactUsData?.length > 0 ? footer : ''} showGridlines responsiveLayout="scroll"
                        sortField={searchVal.sort_field} sortOrder={searchVal.sort_order} onSort={(e) => onSort(e)} selection={selectedContactUsMaster} onSelectionChange={e => onselectRow(e)} selectionMode='checkbox'
                    >
                        {(permissionHandler(Permission.CONTACTUS_DELETE) || permissionHandler(Permission.CONTACTUS_MAIL)) &&
                            <Column selectionMode="multiple" style={{ width: '3em' }} />
                        }
                        <Column header="Name" field='first_name' sortable="custom" body={nameBodyTemplate}></Column>
                        {
                            adminRole === "SUPER_ADMIN" && (
                                <Column header="HCP" field="account" sortable="custom" body={hcpBodyTemplate} /> // NOSONAR
                            )
                        }
                        <Column field="email" header="Email" sortable="custom" body={emailBodyTemplate}></Column>
                        <Column field="date" header="Date" body={dateBodyTemplate}></Column>
                        {<Column field="status" header="Status" body={statusBodyTemplate} /> /* NOSONAR */}
                        {(permissionHandler(Permission.CONTACTUS_DELETE) || permissionHandler(Permission.CONTACTUS_MAIL)) &&
                            <Column field="action" header="Action" body={actionBodyTemplate} ></Column>
                        }
                    </DataTable>
                </div>
            </div>

            <DeleteModal visible={isDeleteModalShow} onCloseDeleteModal={onCloseDeleteConfirmation} deleteObj={deleteObj} deleteDataArr={deleteDataArr} name="Contact Us" deleteEndPoint={Constant.DELETEALLCONTACTUS} dataName="contactUs" />

            <SendMail visible={isMailModalShow} onCloseMailModal={onCloseMail} mailObj={mailObj} mailUrl={Constant.REPLYCONTACTUSEMAIL} mailDataArr={mailDataArr} name="Contact Us" sendMailEndPoint={Constant.REPLYCONTACTUSEMAIL} dataName="uuid" />

            {
                showInquiryDetails && inquiryData && (
                    <InquiryDetails
                        name={inquiryData.name}
                        date={inquiryData.date}
                        email={inquiryData.email}
                        phone={inquiryData.phone}
                        status={inquiryData.status}
                        message={inquiryData.message}
                        phoneCode={inquiryData.phoneCode}
                        handleCloseDialog={() => { setShowInquiryDetails(false); setInquiryData(null); }} // NOSONAR
                    />
                )
            }
        </>
    )
}

export default ContactUsList
