import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/saga-blue/theme.css";

import _ from "lodash";
import CIcon from "@coreui/icons-react";
import { Column } from "primereact/column";
import { CBadge, CButton } from "@coreui/react";
import { DataTable } from "primereact/datatable";
import { Paginator } from "primereact/paginator";
import { InputText } from "primereact/inputtext";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { cilBook, cilCloudDownload, cilList, cilUserPlus } from "@coreui/icons";

import { API } from "src/services/Api";
import { useToast } from "src/shared/toaster/Toaster";
import * as  Constant from "src/shared/constant/constant";
import Loader from "src/views/components/common/loader/loader";
import { Permission, CommonMaster } from "src/shared/enum/enum";
import CommonHcpInput from "src/shared/common/common-hcp-input";
import permissionHandler from "src/shared/handler/permission-handler";
import { downloadFile, isEmpty } from "src/shared/handler/common-handler";

const PatientList = () => {
    const history = useHistory();
    const { showError } = useToast();
    const primaryHcpId = localStorage.getItem("account_id");
    const adminRole = JSON.parse(localStorage.getItem("user_details"))?.role?.code ?? '';
    const initialFilters = {
        start: 0,
        name: '',
        email: '',
        phone: '',
        length: Constant.DT_ROW,
        hcp: adminRole !== "SUPER_ADMIN" ? localStorage.getItem("account_id") : '',
    };

    const [hcpList, setHcpList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [patientList, setPatientList] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [filteredKeys, setFilteredKeys] = useState([]);
    const [searchParams, setSearchParams] = useState({ ...initialFilters });

    const filterMap = {
        name: searchParams.name,
        email: searchParams.email,
        phone: searchParams.phone,
        account_id: searchParams.hcp,
    };

    useEffect(() => {
        getHcpList();
    }, []);

    useEffect(() => {
        if (searchParams) {
            const filters = { start: searchParams.start, length: searchParams.length };
            if (filteredKeys.length) {
                filteredKeys.forEach(filterKey => {
                    filters[filterKey] = filterMap[filterKey];
                });
            }

            applyFilters(filters);
        }
    }, [searchParams.start, searchParams.length]);

    const getHcpList = () => {
        API.getMasterList(hcpListResponseObj, null, true, Constant.ACTIVE_ACCOUNT_LIST);
    }

    const hcpListResponseObj = {
        cancel: () => { },
        success: response => {
            let _hcpList = [];
            if (response?.meta?.status && response?.data?.length) _hcpList = response.data;
            setHcpList([..._hcpList]);
        },
        error: err => {
            console.log(err);
        },
        complete: () => { }
    }

    const getPatientList = data => {
        setIsLoading(true);
        API.getMasterList(handlePatientListResponseObj, data, true, Constant.PATIENT_LIST);
    }

    const handlePatientListResponseObj = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            if (response?.meta?.status) {
                setPatientList(response?.data?.original?.data ?? []);
                setTotalRecords(response?.data?.original?.recordsTotal ?? 0);
            }
        },
        error: err => {
            console.log(err);
            setPatientList([]);
            setTotalRecords(0);
            setIsLoading(false);
        },
        complete: () => { },
    }

    const handlePatientSearchParamChange = e => {
        const { name, value } = e?.target;
        setSearchParams({ ...searchParams, [name]: value });
    }

    const moveToDetailsPage = id => {
        if (id) history.push(`/patients/view/?id=${id}`);
        else showError("patient id is unavailable.");
    }

    const getPatientListInCSV = e => {
        e.preventDefault();
        const { hcp } = searchParams;
        const data = hcp ? { account_id: hcp } : null;

        setIsLoading(true);
        API.getMasterList(handleGetPatientListInCSVResponseObj, data, true, Constant.PATIENT_LIST_CSV);
    }

    const moveToPatientAddPage = e => {
        e.preventDefault();
        history.push("/patients/add");
    }

    const handleGetPatientListInCSVResponseObj = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            const fileUrl = response?.data?.file ?? '';
            if (fileUrl) downloadFile(fileUrl, "patients.xlsx");
            else showError("Excel file is unavailable.");
        },
        error: err => {
            console.log(err);
            setIsLoading(false);
            const message = err?.meta?.message ?? "Something went wrong!";
            showError(message);
        },
        complete: () => { },
    }

    const patientsHeaderTemplate = (
        <div className="table-header">
            <div className="clearfix">
                <h5 className="p-m-0 float-start">
                    <CIcon icon={cilList} className="mr-1" />
                    {CommonMaster.PATIENTS}
                    <CBadge color="danger" className="ms-auto">{totalRecords}</CBadge>
                </h5>

                <div className="float-end d-flex">
                    <CButton color="primary" onClick={getPatientListInCSV} type="button">
                        <CIcon icon={cilCloudDownload} size="sm" />&nbsp;
                        Download CSV
                    </CButton>

                    <CButton color="success" onClick={moveToPatientAddPage} type="button">
                        <CIcon icon={cilUserPlus} size="sm" />&nbsp;
                        Add Patient
                    </CButton>
                </div>
            </div>

            <hr />
            <form name="filterFrm" onSubmit={e => { e.preventDefault(); applyFilters(); }}>
                <div className="row">
                    <CommonHcpInput
                        hcpList={hcpList}
                        hcpValue={searchParams.hcp}
                        handleHcpChange={handlePatientSearchParamChange}
                    />

                    <div className="col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <InputText
                                name="name"
                                className="form-control"
                                value={searchParams.name}
                                onChange={handlePatientSearchParamChange} // NOSONAR
                            />
                            <label>Name</label>
                        </span>
                    </div>

                    <div className="col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <InputText
                                name="email"
                                className="form-control"
                                value={searchParams.email}
                                onChange={handlePatientSearchParamChange} // NOSONAR
                            />
                            <label>Email</label>
                        </span>
                    </div>

                    <div className="col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <InputText
                                name="phone"
                                className="form-control"
                                value={searchParams.phone}
                                onChange={handlePatientSearchParamChange} // NOSONAR
                            />
                            <label>Phone</label>
                        </span>
                    </div>

                    <div className="col-md-12 col-lg-3 pb-3 search-reset">
                        <CButton color="primary" className="mr-2" type="submit">Search</CButton>
                        <CButton color="danger" onClick={resetParams}>Reset</CButton>
                    </div>
                </div>
            </form>
        </div>
    );

    const nameBodyTemplate = rowData => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {`${rowData?.first_name ?? ''} ${rowData?.last_name ?? ''}` ?? Constant.NO_VALUE}
            </>
        );
    }

    const emailBodyTemplate = rowData => {
        return (
            <>
                <span className="p-column-title">Email</span>
                {rowData?.email ?? Constant.NO_VALUE}
            </>
        );
    }

    const mobileBodyTemplate = rowData => {
        return (
            <>
                <span className="p-column-title">Mobile</span>
                {`${rowData?.country?.country_phone_code ?? ''} ${rowData?.mobile ?? ''}`}
            </>
        );
    }

    const orderCountBodyTemplate = rowData => {
        return (
            <>
                <span className="p-column-title">Total orders</span>
                {rowData?.total_order_count ?? Constant.NO_VALUE}
            </>
        );
    }

    const totalAmountBodyTemplate = rowData => {
        return (
            <>
                <span className="p-column-title">Total amount</span>
                {+(rowData?.total_spend_money ?? 0)?.toFixed(2)}
            </>
        );
    }

    const hcpBodyTemplate = rowData => {
        return (
            <>
                <span className="p-column-title">HCP</span>
                {rowData?.account?.company_name ?? Constant.NO_VALUE}
            </>
        );
    }

    const viewBodyTemplate = rowData => {
        return (
            <>
                <span className="p-column-title">View</span>
                {
                    permissionHandler(Permission.PATIENT_VIEW) && (
                        <a title="View" className="mr-2" onClick={() => { moveToDetailsPage(rowData._id); }}>
                            <CIcon icon={cilBook} size="lg" />
                        </a>
                    )
                }
            </>
        );
    }

    const applyFilters = filters => {
        const { start, length } = searchParams;
        let data = { start, length }, _filteredKeys = [];

        const appliedFilters = !_.isEmpty(filters) ? filters : filterMap;

        for (const filterKey in appliedFilters) {
            const value = appliedFilters[filterKey];
            if (filterKey === "name" && value) {
                data["username"] = value;
                _filteredKeys.push(filterKey);
            } else if (filterKey === "phone" && value) {
                data["mobile"] = value;
                _filteredKeys.push(filterKey);
            } else if (filterKey === "hcp" && value) {
                data["account_id"] = value;
                _filteredKeys.push(filterKey);
            } else if (!isEmpty(value)) {
                data[filterKey] = value;
                _filteredKeys.push(filterKey);
            }
        }

        if (_.isEmpty(filters)) {
            data["start"] = 0;
            setSearchParams({ ...searchParams, start: 0 });
        }

        setFilteredKeys([..._filteredKeys]);
        getPatientList(data);
    }

    function resetParams() {
        const newParams = {
            ...searchParams,
            name: '',
            email: '',
            phone: '',
            hcp: adminRole !== "SUPER_ADMIN" ? primaryHcpId : '',
        };

        setSearchParams({ ...newParams });
        applyFilters(newParams);
    }

    const handlePatientPageChange = e => {
        setSearchParams({ ...searchParams, start: e.first, length: e.rows });
    }

    const patientsFooterTemplate = (
        <div className="table-footer">
            <Paginator
                first={searchParams.start}
                rows={searchParams.length}
                totalRecords={totalRecords}
                template={Constant.DT_PAGE_TEMPLATE}
                onPageChange={handlePatientPageChange} // NOSONAR
                rowsPerPageOptions={Constant.DT_ROWS_LIST}
                currentPageReportTemplate={Constant.DT_PAGE_REPORT_TEMP}
            />
        </div>
    );

    return (
        <>
            {isLoading && <Loader />}

            <div className="datatable-responsive-demo custom-react-table">
                <div className="card">
                    <DataTable
                        stripedRows
                        showGridlines
                        value={patientList}
                        responsiveLayout="scroll"
                        header={patientsHeaderTemplate}
                        sortField={searchParams.sort_field}
                        sortOrder={searchParams.sort_order}
                        className="p-datatable-responsive-demo"
                        footer={patientList?.length > 0 ? patientsFooterTemplate : <></>}
                    >
                        {
                            adminRole === "SUPER_ADMIN" && (
                                <Column field="account" header="HCP" body={hcpBodyTemplate} /> // NOSONAR
                            )
                        }
                        {<Column field="name" header="Name" body={nameBodyTemplate} /> /* NOSONAR */}
                        {<Column field="email" header="Email" body={emailBodyTemplate} /> /* NOSONAR */}
                        {<Column field="mobile" header="Mobile" body={mobileBodyTemplate} /> /* NOSONAR */}
                        {<Column field="total_order_count" header="Total orders" body={orderCountBodyTemplate} /> /* NOSONAR */}
                        {<Column field="total_spend_money" header="Total amount (USD)" body={totalAmountBodyTemplate} /> /* NOSONAR */}
                        {
                            permissionHandler(Permission.PATIENT_VIEW) && (
                                <Column field="_id" header="View" body={viewBodyTemplate} /> // NOSONAR
                            )
                        }
                    </DataTable>
                </div>
            </div>
        </>
    );
};

export default PatientList;
