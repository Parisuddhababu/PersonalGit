// eslint-disable-next-line
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import CIcon from '@coreui/icons-react';
import { CBadge, CButton } from '@coreui/react'
import DeleteModal from '../../common/DeleteModalPopup/delete-modal'
import { API } from '../../../../services/Api';
import { Dropdown } from 'primereact/dropdown';
import * as  Constant from "../../../../shared/constant/constant"
import { InputText } from 'primereact/inputtext';
import Loader from "../../common/loader/loader"
import UserListModal from './../user-list-modal/user-list-modal'
import {
    cilCheckCircle,
    cilList,
    cilPencil,
    cilPlus,
    cilTrash,
    cilXCircle,
    cilContact,
    cilEnvelopeClosed,
} from '@coreui/icons';
import { useToast } from '../../../../shared/toaster/Toaster';
import { approveEnum, CommonMaster, emailEnum, UserEnum, UserTitleEnum } from 'src/shared/enum/enum';
import { useHistory, useLocation } from "react-router-dom";
import { Paginator } from 'primereact/paginator';
import {
    displayDateTimeFormat,
    requestDateFormatYY,
    PICKER_DISPLAY_DATE_FORMAT,
    emailLowerCase,
    isEmpty,
} from 'src/shared/handler/common-handler';
import permissionHandler from 'src/shared/handler/permission-handler';
import { Calendar } from 'primereact/calendar';

const UserManagementList = (props) => {
    const accountVal = localStorage.getItem('is_main_account')
    const adminRole = JSON.parse(localStorage.getItem('user_details'))?.role?.code;
    const [isDeleteModalShow, setIsDeleteModalShow] = useState(false)
    const search = useLocation().search;
    const status = new URLSearchParams(search).get('status');
    const initialRender = {
        start: 0,
        length: Constant.DT_ROW,
        sort_order: '',
        sort_field: ''
    }
    const initialFilter = {
        type: props.type,
        account_id: '',
        fullname: '',
        email: '',
        mobile: '',
        role: '',
        is_active: status ? Constant.STATUS_OPTION[0] : '' // Get dashboard active data
    };
    const statusChangeKeyValues = {
        status: { key: "is_active", endPoint: Constant.UPDATEUSERSTATUS },
        emailVerified: { key: "is_email_verified", endPoint: Constant.VERIFYUSEREMAIL },
        adminApproved: { key: "is_admin_approved", endPoint: Constant.ADMIN_APPROVE },
        mobileVerified: { key: "is_mobile_verified", endPoint: Constant.MOBILE_APPROVE },
    };

    const [searchVal, setSearchVal] = useState(initialFilter)
    const [renderVal, setRenderVal] = useState(initialRender)
    const [deleteObj, setDeleteObj] = useState({})
    const [genderList, setGenderList] = useState([]);
    const [userManagementData, setUserManagementData] = useState([])
    const [totalRecords, setTotalRecords] = useState(0)
    const [accountData, setAccountData] = useState([])
    const [deleteDataArr, setDeleteDataArr] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const { showError, showSuccess } = useToast();
    const [isView, setIsView] = useState(false)
    const [rowData, setRowData] = useState({})
    const [roleData, setRoleData] = useState([])
    const [endDate, setEndDate] = useState(null)
    const [startDate, setStartDate] = useState(null)
    const [date, setDate] = useState(null);
    const [selectedIsMainWebsite, setSelectedIsMainWebsite] = useState('');
    const [statusChangeData, setStatusChangeData] = useState({ data: null, id: '', key: '' });
    const [filteredKeys, setFilteredKeys] = useState([]);
    const statusOption = Constant.STATUS_OPTION
    let history = useHistory();

    const filterMap = {
        role: searchVal.role,
        mobile: searchVal.mobile,
        fullname: searchVal.fullname,
        is_active: searchVal.is_active.code,
        email: emailLowerCase(searchVal.email),
        account_id: searchVal?.account_id ?? '',
        end_date: endDate ? requestDateFormatYY(endDate) : '',
        start_date: startDate ? requestDateFormatYY(startDate) : '',
    };

    useEffect(() => {
        getGenderList();
        if (!isAdminUser()) getAccountData();
    }, []);

    useEffect(() => {
        setSearchVal({ ...searchVal, role: '' });
        if (searchVal.account_id && accountData?.length) {
            const _isMainWebsite = accountData
                ?.find(account => account._id === searchVal.account_id)
                ?.is_main_website
                ?? ''
                ;

            setSelectedIsMainWebsite(_isMainWebsite);
        } else if (isAdminUser()) {
            const _isMainWebsite = adminRole === "SUPER_ADMIN" ? 1 : 0;
            setSelectedIsMainWebsite(_isMainWebsite);
        } else if (isMicroAdminUser() && adminRole !== "SUPER_ADMIN") {
            getRoleData();
        }
    }, [searchVal.account_id, accountData]);

    useEffect(() => {
        if (!isEmpty(selectedIsMainWebsite)) getRoleData();
    }, [selectedIsMainWebsite]);

    useEffect(() => {
        if (statusChangeData.key) {
            const { data, id, key } = statusChangeData;
            const { endPoint } = statusChangeKeyValues[key]
            API.UpdateStatus(onUserActionRes, data, true, id, endPoint);
        }
    }, [statusChangeData]);

    const getRoleData = () => {
        const data = {
            is_main_website: (adminRole === "SUPER_ADMIN") ? selectedIsMainWebsite : 0,
            is_show: 1,
        };

        API.getMasterList(getRoleDataResponse, data, true, Constant.ACTIVE_ROLE);
    }

    const getRoleDataResponse = {
        cancel: () => { },
        success: response => {
            let _roleData = [];
            if (response?.meta?.status && response?.data?.length) _roleData = response.data;
            setRoleData([..._roleData]);
        },
        error: err => {
            console.log(err);
        },
        complete: () => { }
    }

    const isAdminUser = () => {
        return props.type == UserEnum.ADMIN_USERS;
    }

    const isMicroAdminUser = () => {
        return props.type == UserEnum.MICROSITE_ADMIN_USERS;
    }

    useEffect(() => {
        const filters = {};

        if (filteredKeys.length) {
            filteredKeys.forEach(filterKey => {
                filters[filterKey] = filterMap[filterKey];
            });
        }

        getUserManagementData(filters);
    }, [renderVal])

    useEffect(() => {
        if (date) {
            setStartDate(date[0])
            setEndDate(date[1])
        }

    }, [date])

    const getUserManagementData = filters => {
        const { start, length, sort_field, sort_order } = renderVal;
        const { type } = searchVal;
        const data = { start, length, type }, _filteredKeys = [];

        if (sort_field) data["sort_param"] = sort_field;
        if (sort_order) data["sort_type"] = sort_order === 1 ? "asc" : "desc";
        const appiledFilters = filters ?? filterMap;

        for (const filterKey in appiledFilters) {
            const value = filterMap[filterKey];
            if (!isEmpty(value)) {
                data[filterKey] = value;
                _filteredKeys.push(filterKey);
            }
        }

        setFilteredKeys([..._filteredKeys]);
        API.getMasterList(userManagementList, data, true, Constant.GETUSERS);
    }

    const onPageChange = (e) => {
        setRenderVal({ ...renderVal, length: e.rows })
        if (renderVal.start !== e.first) {
            setRenderVal({ ...renderVal, start: e.first })
        }
    }
    const onSort = (e) => {
        if (e.sortField) {
            setRenderVal({ ...renderVal, sort_field: e.sortField, sort_order: e.sortOrder })
        }
    }

    const getGenderList = () => {
        API.getDrpData(onGetGenderListResponse, null, true, Constant.GENDER_LIST);
    }

    const onGetGenderListResponse = {
        cancel: () => { },
        success: response => {
            if (response?.meta?.status && response?.data?.length > 0) {
                const _genderList = response.data;
                setGenderList([..._genderList]);
            }
        },
        error: err => {
            console.log(err);
        },
        complete: () => { }
    }

    const getAccountData = () => {
        if (adminRole === "SUPER_ADMIN") {
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
            }
        },
        error: (e) => {
        }
    }

    // userManagementList Response Data Method
    const userManagementList = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            if (response.meta.status_code === 200) {
                setUserManagementData(response?.data?.original.data)
                setTotalRecords(response?.data?.original.recordsTotal)
            }
        },
        error: err => {
            setIsLoading(false);
            console.log(err);
        },
        complete: () => { },
    }

    const editData = (rowData) => {
        history.push(`/${props.routerName}/edit/?id=${rowData._id}&type=${props.type}`)
    }

    const confirmDeleteUser = (data) => {
        let obj = { ...data }
        obj.urlName = CommonMaster.USER_MANAGEMENT;
        obj.name = data.fullname;
        setDeleteObj(obj)
        setIsDeleteModalShow(true)
    }

    const isEmailVerify = (rowData) => {
        return (props.type == UserEnum.B2B_USERS || props.type == UserEnum.B2B2C_USERS) && rowData.is_email_verified === emailEnum.unverify;
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Action</span>
                {props.type != UserEnum.B2B2C_USERS && permissionHandler(props.Update) && <a title="Edit" className="mr-2" onClick={() => editData(rowData)}><CIcon icon={cilPencil} size="lg" /></a>}
                {
                    permissionHandler(props.Delete) && <button className="btn btn-link mr-2 text-danger" title="Delete" onClick={() => confirmDeleteUser(rowData)}><CIcon icon={cilTrash} size="lg" /></button>
                }{
                    permissionHandler(props.View) &&
                    <a className='mr-2' title="View" onClick={() => viewData(rowData)}><CIcon icon={cilContact} size="lg" /></a>
                }
                {isEmailVerify(rowData) && permissionHandler(props.VerifyEmail) && <button className="btn btn-link mr-2" title="Verify Email" onClick={() => onVerifyEmail(rowData)}><CIcon icon={cilEnvelopeClosed} size="lg" /></button>}
            </React.Fragment>
        );
    }

    const onUpdateStatus = (rowData) => {
        let obj = {
            uuid: rowData._id,
            is_active: rowData.is_active == Constant.StatusEnum.active ? Constant.StatusEnum.inactive : Constant.StatusEnum.active
        }

        setIsLoading(true);
        setStatusChangeData({ key: "status", id: rowData._id, data: obj });
    }

    const onVerifyEmail = (rowData) => {
        let obj = {
            uuid: rowData._id,
            is_email_verified: rowData.is_email_verified == emailEnum.verify ? emailEnum.unverify : emailEnum.verify
        };

        setIsLoading(true);
        setStatusChangeData({ key: "emailVerified", id: rowData._id, data: obj });
    }

    const onApproveUser = (rowData) => {
        let obj = {
            uuid: rowData._id,
            is_admin_approved: rowData.is_admin_approved === approveEnum.approve ? approveEnum.unapprove : approveEnum.approve
        };

        setIsLoading(true);
        setStatusChangeData({ key: "adminApproved", id: rowData._id, data: obj });
    }

    const onMobile = (rowData) => {
        let obj = {
            uuid: rowData._id,
            is_mobile_verified: rowData.is_mobile_verified === approveEnum.approve ? approveEnum.unapprove : approveEnum.approve
        };

        setIsLoading(true);
        setStatusChangeData({ key: "mobileVerified", id: rowData._id, data: obj });
    }

    // Change Status, Admin Approve and Email verify Response Data Method
    const onUserActionRes = {
        cancel: () => { },
        success: response => { // NOSONAR
            setIsLoading(false);

            if (response?.meta?.status) {
                if (response?.meta?.message) showSuccess(response.meta.message);
                const { uuid } = response.data;

                if (uuid) {
                    let _userManagementData = userManagementData;
                    const userIndex = userManagementData.findIndex(dataObj => dataObj?._id === uuid);

                    if (userIndex >= 0 && statusChangeData.key) {
                        const { key } = statusChangeData;
                        const statusValue = statusChangeKeyValues[key]["key"];

                        if (statusValue) {
                            _userManagementData[userIndex][statusValue]
                                = _userManagementData[userIndex]?.[statusValue] === 1 ? 0 : 1;
                        }

                        setUserManagementData([..._userManagementData]);
                        setStatusChangeData({ data: null, key: '', id: '' });
                    }
                }
            }
        },
        error: err => {
            setIsLoading(false);
            if (err?.meta?.message) showError(err.meta.message);
        },
        complete: () => { },
    }

    const viewData = (data) => {
        setRowData(data);
        setIsView(true)
    }

    const onDateChange = (event) => {
        setDate(event.value)
    }

    const accountDataTemplate = option => {
        return (
            <>{`${option?.company_name ?? ''} (${option?.code ?? ''})`}</>
        )
    }

    const header = (
        <div className="table-header">
            <div className="clearfix">
                <h5 className="p-m-0 float-start"><CIcon icon={cilList} className="mr-1" /> {props.masterName} <CBadge color="danger" className="ms-auto">{totalRecords}</CBadge></h5>
                {props.type != UserEnum.B2B2C_USERS && permissionHandler(props.Create) && <div className="float-end">
                    <div className="common-add-btn">
                        <CButton color="primary" onClick={() => { history.push(`/${props.routerName}/add?type=${props.type}`) }}><CIcon icon={cilPlus} className="mr-1" />Add {UserTitleEnum[props.type]}</CButton>
                    </div>
                </div>}
            </div>
            <hr />
            <form name='filterFrm' onSubmit={(e) => setGlobalFilter(e)}>
                <div className="row">
                    {
                        accountVal !== '0' && props.type != UserEnum.ADMIN_USERS && adminRole === 'SUPER_ADMIN' && (
                            <div className="col-md-6 col-lg-3 pb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <Dropdown
                                        value={searchVal.account_id}
                                        name='account_id'
                                        className="form-control"
                                        options={accountData}
                                        onChange={(e) => onHandleFilter(e)}
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
                        )
                    }

                    <div className="col-md-6 col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <InputText className="form-control" value={searchVal.fullname} name="fullname" onChange={(e) => onHandleFilter(e)} />
                            <label>Name </label>
                        </span>
                    </div>
                    <div className="col-md-6 col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <InputText className="form-control" value={searchVal.email} name="email" onChange={(e) => onHandleFilter(e)} />
                            <label>Email </label>
                        </span>
                    </div>
                    <div className="col-md-6 col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <InputText className="form-control" value={searchVal.mobile} name="mobile" onChange={(e) => onHandleFilter(e)} />
                            <label>Phone Number </label>
                        </span>
                    </div>

                    {
                        (isAdminUser() || isMicroAdminUser()) && (
                            <div className="col-md-6 col-lg-3 mb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <Dropdown
                                        value={searchVal.role}
                                        name="role"
                                        className="form-control"
                                        options={roleData}
                                        onChange={e => onHandleFilter(e)}
                                        optionLabel="name"
                                        optionValue="_id"
                                    />
                                    <label>Role</label>
                                </span>
                            </div>
                        )
                    }

                    <div className="col-md-6 col-lg-6 col-xl-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <Calendar id="range" className="form-control border-0 px-0 py-0 custom-datepicker-input" dateFormat={PICKER_DISPLAY_DATE_FORMAT} showIcon appendTo="self" value={date} onChange={(e) => onDateChange(e)} selectionMode="range" readOnlyInput />
                            <label>Date Range </label>

                        </span>
                    </div>
                    <div className="col-md-6 col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <Dropdown className="form-control" value={searchVal.is_active} name='is_active' options={statusOption} onChange={(e) => onHandleFilter(e)} optionLabel="name" />
                            <label>Status </label>
                        </span>
                    </div>
                    <div className="col-md-12 col-lg-3 search-reset pb-3">
                        <CButton type='submit' color="primary" className="mr-2">Search</CButton>
                        <CButton type='button' color="danger" onClick={() => resetGlobalFilter()} >Reset</CButton>
                    </div>
                </div>
            </form>
        </div>
    );

    const footer = (
        <div className='table-footer'>
            <Paginator template={Constant.DT_PAGE_TEMPLATE}
                currentPageReportTemplate={Constant.DT_PAGE_REPORT_TEMP}
                first={renderVal.start} rows={renderVal.length} totalRecords={totalRecords}
                rowsPerPageOptions={Constant.DT_ROWS_LIST} onPageChange={onPageChange}></Paginator>
        </div>
    );

    const statusBodyTemplate = (rowData) => {
        if (rowData?.is_active == Constant.StatusEnum.active) {
            return (
                <React.Fragment>
                    <span className="p-column-title">Status</span>

                    <button className="btn btn-link text-success" title="Change Status" onClick={() => onUpdateStatus(rowData)}><CIcon icon={cilCheckCircle} size="lg" /></button>
                </React.Fragment>)
        } else {
            return (
                <React.Fragment>
                    <span className="p-column-title">Status</span>

                    <button className="btn btn-link text-danger" title="Change Status" onClick={() => onUpdateStatus(rowData)}><CIcon icon={cilXCircle} size="lg" /></button>
                </React.Fragment>)
        }
    }

    const approveBodyTemplate = (rowData) => {
        if (rowData?.is_admin_approved == approveEnum.approve) {
            return (
                <React.Fragment>
                    <button className="btn btn-link text-success" title="Approve User" onClick={() => onApproveUser(rowData)}><CIcon icon={cilCheckCircle} size="lg" /></button>
                </React.Fragment>)
        } else {
            return (
                <React.Fragment>
                    <button className="btn btn-link text-danger" title="Approve User" onClick={() => onApproveUser(rowData)}><CIcon icon={cilXCircle} size="lg" /></button>
                </React.Fragment>)
        }
    }

    const mobileBodyTemplate = (rowData) => {
        if (rowData?.is_mobile_verified == approveEnum.approve) {
            return (
                <React.Fragment>
                    <button className="btn btn-link text-success" title="Mobile Verify" onClick={() => onMobile(rowData)}><CIcon icon={cilCheckCircle} size="lg" /></button>
                </React.Fragment>)
        } else {
            return (
                <React.Fragment>
                    <button className="btn btn-link text-danger" title="Mobile Verify" onClick={() => onMobile(rowData)}><CIcon icon={cilXCircle} size="lg" /></button>
                </React.Fragment>)
        }
    }

    const onCloseDeleteConfirmation = (value, isDelete, message) => {
        setIsDeleteModalShow(value)
        setDeleteDataArr([])
        if (isDelete) {
            showSuccess(message)
            if (userManagementData.length === 1 && renderVal.start) {
                setRenderVal({ ...renderVal, start: parseInt(renderVal.start) - parseInt(renderVal.length) });
            } else {
                getUserManagementData()
            }
        }
    }

    const onHandleFilter = event => {
        event.preventDefault();
        setSearchVal({ ...searchVal, [event.target.name]: event.target.value })
    }

    const setGlobalFilter = (e) => {
        e.preventDefault();
        getUserManagementData();
    }

    const resetGlobalFilter = () => {
        initialFilter.is_active = ''; // Reset dashboard active data
        setDate(null)
        setStartDate(null)
        setEndDate(null)
        setSearchVal(initialFilter);
        setRenderVal(initialRender);
    }

    const nameBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Name</span>
                <p>{rowData?.first_name + ' ' + rowData?.last_name}</p>
            </React.Fragment>
        )
    }


    const contactBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Phone Number</span>
                <p>{`${rowData?.country?.country_phone_code ?? ''}${rowData?.mobile ?? ''}`}</p>
            </React.Fragment>
        )
    }

    const emailBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Email</span>
                <p>{rowData?.email}</p>
            </React.Fragment>
        )
    }
    const roleBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Role</span>
                <p>{rowData?.role?.name || Constant.NO_VALUE}</p>
            </React.Fragment>
        )
    }

    const genderBodyTemplate = (rowData) => {
        const genderId = rowData?.gender_id;
        const genderObj = genderList.find(gender => gender._id === genderId);
        const gender = genderObj?.name ? genderObj.name : Constant.NO_VALUE;

        return (
            <React.Fragment>
                <span className="p-column-title">Gender</span>
                <p>{gender}</p>
            </React.Fragment>
        )
    }

    const accountBodyTemplate = rowData => {
        return (
            <React.Fragment>
                <span className="p-column-title">Account</span>
                <p>{rowData?.register?.company_name ?? Constant.NO_VALUE}</p>
            </React.Fragment>
        );
    }

    const dateBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Date</span>
                <p>{displayDateTimeFormat(rowData.created_at)}</p>
            </React.Fragment>
        )
    }

    const onCloseUserModal = () => {
        setRowData({});
        setIsView(false)
    }

    const showIsAdminApproved = () => {
        return props.type == UserEnum.B2B_USERS || props.type == UserEnum.B2B2C_USERS || props.masterName == CommonMaster.MICROSITE_ADMIN_USERS
    }

    return (
        <>
            {isLoading && <Loader />}
            <div className="datatable-responsive-demo custom-react-table">
                <div className="card">
                    <DataTable value={userManagementData} className="p-datatable-responsive-demo" header={header} showGridlines responsiveLayout="scroll"
                        footer={userManagementData?.length > 0 ? footer : ''} sortField={renderVal.sort_field} sortOrder={renderVal.sort_order} onSort={(e) => onSort(e)}>
                        <Column field="fullname" header="Name" sortable body={nameBodyTemplate}></Column>
                        <Column field="mobile" header="Phone Number" body={contactBodyTemplate}></Column>
                        <Column field="email" header="Email" sortable body={emailBodyTemplate} style={{ width: '200px' }}></Column>
                        {(props.type == UserEnum.ADMIN_USERS || props.type == UserEnum.MICROSITE_ADMIN_USERS) && <Column field="role_name" header="Role" body={roleBodyTemplate}></Column>}
                        {props.type == UserEnum.B2B_USERS && <Column field="gender" sortable header="Gender" body={genderBodyTemplate}></Column>}
                        {props.type != UserEnum.ADMIN_USERS && <Column field="account" header="Account" body={accountBodyTemplate}></Column>}
                        <Column field="created_at" header="Date" sortable body={dateBodyTemplate}></Column>
                        {permissionHandler(props.Status) &&
                            <Column field="is_active" header="Status" sortable body={statusBodyTemplate}></Column>
                        }
                        {showIsAdminApproved() && permissionHandler(props.Approve) && <Column field="is_admin_approved" header="Approve" sortable body={approveBodyTemplate}></Column>}
                        {(props.type == UserEnum.B2B_USERS || props.type == UserEnum.B2B2C_USERS) && permissionHandler(props.Approve) && <Column field="is_mobile_verified" header="Mobile Verify" sortable body={mobileBodyTemplate}></Column>}
                        {
                            (permissionHandler(props.Update) || permissionHandler(props.View) || permissionHandler(props.Delete) || permissionHandler(props.VerifyEmail)) &&
                            <Column field="id" header="Action" body={actionBodyTemplate}></Column>
                        }
                    </DataTable>
                </div>
            </div>
            <DeleteModal visible={isDeleteModalShow} onCloseDeleteModal={onCloseDeleteConfirmation} deleteObj={deleteObj} deleteDataArr={deleteDataArr} name={props.masterName} />
            <UserListModal visible={isView} rowData={rowData} onCloseUserModal={onCloseUserModal} />
        </>
    )
}

export default UserManagementList
