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
import { API } from '../../../services/Api';
import { Dropdown } from 'primereact/dropdown';
import * as Constant from "../../../shared/constant/constant"
import { InputText } from 'primereact/inputtext';
import Loader from "../common/loader/loader"
import { cilCheckCircle, cilList, cilPencil, cilXCircle } from '@coreui/icons';
import { useToast } from '../../../shared/toaster/Toaster';
import { CommonMaster, Permission } from 'src/shared/enum/enum';
import { useHistory } from "react-router-dom";
import { displayDateFormat, emailLowerCase, isEmpty } from 'src/shared/handler/common-handler';
import { Paginator } from 'primereact/paginator';
import permissionHandler from 'src/shared/handler/permission-handler';

const AccountList = () => {
    const adminRole = JSON.parse(localStorage.getItem('user_details'))?.role?.code;
    const initialRender = {
        start: 0,
        length: Constant.DT_ROW,
        sort_order: '',
        sort_field: ''
    }
    const initialFilter = {
        company_name: '',
        email: '',
        mobile: '',
        code: '',
        is_active: ''
    }
    const [searchVal, setSearchVal] = useState(initialFilter)
    const [renderVal, setRenderVal] = useState(initialRender)
    const [accountData, setAccountData] = useState([])
    const [totalRecords, setTotalRecords] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [filteredKeys, setFilteredKeys] = useState([]);
    const { showError, showSuccess } = useToast();
    const statusOption = Constant.STATUS_OPTION
    let history = useHistory();

    const filterMap = {
        company_name: searchVal.company_name,
        email: emailLowerCase(searchVal.email),
        mobile: searchVal.mobile,
        is_active: searchVal.is_active.code,
        code: searchVal.code,
    };

    useEffect(() => {
        if (adminRole === "SUPER_ADMIN") {
            const filters = {};

            if (filteredKeys.length) {
                filteredKeys.forEach(filterKey => {
                    filters[filterKey] = filterMap[filterKey];
                });
            }

            getAccountData(filters);
        } else {
            getMicrositeAdminData();
        }
    }, [renderVal]);

    const getAccountData = filters => {
        const { start, length, sort_field, sort_order } = renderVal;
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

        setFilteredKeys([..._filteredKeys]);
        API.getMasterList(accountListRes, data, true, Constant.ACCOUNT_LIST);
    }

    const onPageChange = e => {
        setRenderVal({ ...renderVal, start: e.first, length: e.rows });
    }

    const accountListRes = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            if (response?.meta?.status) {
                const _accountData = response?.data?.original?.data ?? [];
                const _totalRecords = response?.data?.original?.recordsTotal ?? 0;

                setTotalRecords(_totalRecords);
                setAccountData([..._accountData]);
            }
        },
        error: err => {
            console.log(err);
            setIsLoading(false);
        },
        complete: () => { },
    }

    const getMicrositeAdminData = () => {
        const id = localStorage.getItem("account_id");
        if (id) {
            API.getMasterDataById(getMicrositeAdminDataResponse, "", true, id, Constant.ACCOUNT_SHOW);
        }
    }

    const getMicrositeAdminDataResponse = {
        cancel: () => { },
        success: response => {
            let _accountData = [];
            let _micrositeAccountData = {};
            if (response?.meta?.status && response?.data) {
                const responseData = response.data;
                _micrositeAccountData = {
                    _id: responseData?._id ?? '',
                    is_active: responseData?.is_active ?? '',
                    name: responseData?.name ?? '',
                    mobile: responseData?.mobile ?? '',
                    company_name: responseData?.company_name ?? '',
                    is_admin_approved: responseData?.is_admin_approved ?? 0,
                    email: responseData?.email ?? '',
                    code: responseData?.code ?? '',
                    verification_date: responseData?.verification_date ?? '',
                };
            }

            _accountData.unshift(_micrositeAccountData);
            setAccountData([..._accountData]);
        },
        error: err => {
            console.log(err);
        },
        complete: () => { }
    }

    const editData = (rowData) => {
        history.push(`/hcp/edit/?id=${rowData._id}`)
    }

    function actionBodyTemplate(rowData) {
        return (
            <>
                <span className="p-column-title">Action</span>
                {
                    permissionHandler(Permission.HCP_UPDATE) && (
                        <a title="Edit" className="mr-2" onClick={() => { editData(rowData); }}>
                            <CIcon icon={cilPencil} size="lg" />
                        </a>
                    )
                }
            </>
        );
    }

    const onUpdateStatus = (rowData) => {
        let obj = {
            uuid: rowData._id,
            is_active: rowData.is_active === Constant.StatusEnum.active ? Constant.StatusEnum.inactive : Constant.StatusEnum.active
        }
        setIsLoading(true)
        API.UpdateStatus(onUpdateStatusRes, obj, true, rowData._id, Constant.ACCOUNT_STATUS);
    }

    const handleApprovalStatusChange = (id, isActive) => {
        setIsLoading(true);
        const data = { uuid: id, is_admin_approved: isActive ? 1 : 0 };
        API.UpdateStatus(handleApprovalStatusChangeResponseObj, data, true, id, Constant.APPROVAL_CHANGE);
    }

    const handleApprovalStatusChangeResponseObj = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);

            if (response?.meta?.status) {
                if (response?.meta?.message) showSuccess(response.meta.message);
                const { uuid } = response?.data ?? {};

                if (uuid) {
                    let _accountData = accountData;
                    const accountIndex = _accountData.findIndex(account => account?._id === uuid);
                    _accountData[accountIndex]["is_admin_approved"] = _accountData[accountIndex]["is_admin_approved"] === 1 ? 0 : 1;
                    setAccountData([..._accountData]);
                }
            }
        },
        error: err => {
            setIsLoading(false);
            if (err?.meta?.message) showError(err.meta.message);
        },
        complete: () => { },
    };

    const onUpdateStatusRes = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);

            if (response?.meta?.status) {
                if (response?.meta?.message) showSuccess(response.meta.message);
                const { uuid } = response?.data ?? {};

                if (uuid) {
                    let _accountData = accountData;
                    const accountIndex = _accountData.findIndex(account => account?._id === uuid);
                    _accountData[accountIndex]["is_active"] = _accountData[accountIndex]["is_active"] === 1 ? 0 : 1;
                    setAccountData([..._accountData]);
                }
            }
        },
        error: err => {
            setIsLoading(false);
            if (err?.meta?.message) showError(err.meta.message);
        },
        complete: () => { },
    };

    const header = (
        <div className="table-header">
            <div className="clearfix">
                <h5 className="p-m-0 float-start">
                    <CIcon icon={cilList} className="mr-1" />
                    {CommonMaster.HCP}
                    <CBadge color="danger" className="ms-auto">{totalRecords}</CBadge>
                </h5>
            </div>
            <hr />

            <form name='filterFrm' onSubmit={(e) => setGlobalFilter(e)}>
                <div className="row">
                    <div className="col-md-6 col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <InputText className="form-control" value={searchVal.company_name} name="company_name" onChange={(e) => onHandleFilter(e)} />
                            <label>Company Name </label>
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
                            <InputText
                                className="form-control"
                                value={searchVal.code}
                                name="code"
                                onChange={e => onHandleFilter(e)}
                            />
                            <label>Code</label>
                        </span>
                    </div>

                    <div className="col-md-6 col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <InputText className="form-control" value={searchVal.mobile} name="mobile" onChange={(e) => onHandleFilter(e)} />
                            <label>Mobile </label>
                        </span>
                    </div>
                    <div className="col-md-6 col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <Dropdown className="form-control" value={searchVal.is_active} name='is_active' options={statusOption} onChange={(e) => onHandleFilter(e)} optionLabel="name" />
                            <label>Status </label>
                        </span>
                    </div>
                    <div className="col-md-12 col-lg-3 search-reset pb-3">
                        <CButton color="primary" className="mr-2" type='submit' >Search</CButton>
                        <CButton color="danger" onClick={() => resetGlobalFilter()} >Reset</CButton>
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

    function statusBodyTemplate(rowData) {
        if (rowData?.is_active === Constant.StatusEnum.active) {
            return (
                <React.Fragment>
                    <span className="p-column-title">Status</span>

                    <button className="btn btn-link text-success" title="Change Status" onClick={() => onUpdateStatus(rowData)}><CIcon icon={cilCheckCircle} size="lg" /></button>
                </React.Fragment>
            )
        } else {
            return (
                <React.Fragment>
                    <span className="p-column-title">Status</span>

                    <button className="btn btn-link text-danger" title="Change Status" onClick={() => onUpdateStatus(rowData)}><CIcon icon={cilXCircle} size="lg" /></button>
                </React.Fragment>
            )
        }
    }

    function adminApprovedBodyTemplate(rowData) {
        const { active } = Constant.StatusEnum;
        const value = rowData?.is_admin_approved ?? false;
        const isActive = value === active;

        const icon = isActive ? cilCheckCircle : cilXCircle;
        const style = isActive ? "text-success" : "text-danger";

        return (
            <>
                <span className="p-column-title">Admin approved</span>
                <button
                    title="Change Status"
                    className={`btn btn-link ${style}`}
                    onClick={() => { handleApprovalStatusChange(rowData._id, !isActive); }}
                >
                    <CIcon icon={icon} size="lg" />
                </button>
            </>
        );
    }

    const onHandleFilter = event => {
        event.preventDefault();
        setSearchVal({ ...searchVal, [event.target.name]: event.target.value })
    }

    const setGlobalFilter = (event) => {
        event.preventDefault()
        getAccountData();
    }

    const resetGlobalFilter = () => {
        setSearchVal(initialFilter);
        setRenderVal(initialRender);
    }

    function nameBodyTemplate(rowData) {
        return (
            <React.Fragment>
                <span className="p-column-title">Company Name</span>
                <p>{rowData?.company_name || Constant.NO_VALUE}</p>
            </React.Fragment>
        )
    }


    function contactBodyTemplate(rowData) {
        return (
            <React.Fragment>
                <span className="p-column-title">Mobile</span>
                <p>{rowData?.mobile ?? Constant.NO_VALUE}</p>
            </React.Fragment>
        );
    }

    function emailBodyTemplate(rowData) {
        return (
            <React.Fragment>
                <span className="p-column-title">Email</span>
                <p>{rowData?.email ?? '-'}</p>
            </React.Fragment>
        );
    }

    function codeBodyTemplate(rowData) {
        return (
            <>
                <span className="p-column-title">Email</span>
                <p>{rowData?.code}</p>
            </>
        )
    }

    function dateBodyTemplate(rowData) {
        return (
            <React.Fragment>
                <span className="p-column-title">Date</span>
                <p>{displayDateFormat(rowData.verification_date)}</p>
            </React.Fragment>
        )
    }

    const onSort = (e) => {
        if (e.sortField) {
            setRenderVal({ ...renderVal, sort_field: e.sortField, sort_order: e.sortOrder })
        }
    }

    return (
        <>
            {isLoading && <Loader />}

            <div className="datatable-responsive-demo custom-react-table">
                <div className="card">
                    <DataTable
                        value={accountData}
                        className="p-datatable-responsive-demo"
                        header={adminRole === "SUPER_ADMIN" ? header : <></>}
                        showGridlines
                        responsiveLayout="scroll"
                        footer={(accountData?.length > 0 && adminRole === "SUPER_ADMIN") ? footer : <></>}
                        sortField={renderVal.sort_field}
                        sortOrder={renderVal.sort_order}
                        onSort={onSort}
                        selectionMode="checkbox"
                    >
                        {<Column field="name" sortable header="Name" body={nameBodyTemplate} /> /* NOSONAR */}
                        {<Column field="mobile" header="Mobile" body={contactBodyTemplate} /> /* NOSONAR */}
                        {<Column field="email" header="Email" body={emailBodyTemplate} /> /* NOSONAR */}
                        {<Column field="code" header="Code" body={codeBodyTemplate} /> /* NOSONAR */}
                        {<Column field="verification_date" sortable header="Verification Date" body={dateBodyTemplate} /> /* NOSONAR */}
                        {
                            permissionHandler(Permission.HCP_STATUS) && (
                                <Column field="status" header="Status" body={statusBodyTemplate} /> // NOSONAR
                            )
                        }
                        {
                            adminRole === "SUPER_ADMIN" && (
                                <Column header="Admin approved" field="is_admin_approved" body={adminApprovedBodyTemplate} /> // NOSONAR
                            )
                        }
                        {
                            (permissionHandler(Permission.HCP_UPDATE) || permissionHandler(Permission.HCP_DELETE)) && (
                                <Column field="action" header="Action" body={actionBodyTemplate} /> // NOSONAR
                            )
                        }
                    </DataTable>
                </div>
            </div>
        </>
    )
}

export default AccountList