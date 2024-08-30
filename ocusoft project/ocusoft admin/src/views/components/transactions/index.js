import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/saga-blue/theme.css";

import _ from "lodash";
import { API } from "src/services/Api";
import CIcon from "@coreui/icons-react";
import { cilCloudDownload, cilList } from "@coreui/icons";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { CBadge, CButton } from "@coreui/react";
import { DataTable } from "primereact/datatable";
import { Paginator } from "primereact/paginator";
import { InputText } from "primereact/inputtext";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

import { useToast } from "src/shared/toaster/Toaster";
import * as Constant from "src/shared/constant/constant";
import Loader from "src/views/components/common/loader/loader";
import { CommonMaster, Permission } from "src/shared/enum/enum";
import CommonHcpInput from "src/shared/common/common-hcp-input";
import permissionHandler from "src/shared/handler/permission-handler";
import {
    isEmpty,
    downloadFile,
    orderStatusDirectory,
    displayDateTimeFormat,
    paymentStatusDirectory,
} from "src/shared/handler/common-handler";

const Transactions = () => {
    const history = useHistory();
    const defaultFilters = ["start", "length"];
    const { showSuccess, showError } = useToast();
    const primaryHcpId = localStorage.getItem("account_id");
    const adminRole = JSON.parse(localStorage.getItem("user_details"))?.role?.code ?? '';
    const initialFilters = {
        start: 0,
        number: '',
        status: '',
        lastName: '',
        firstName: '',
        paymentStatus: '',
        length: Constant.DT_ROW,
        hcp: adminRole !== "SUPER_ADMIN" ? primaryHcpId : '',
    };

    const [isLoading, setIsLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [filteredKeys, setFilteredKeys] = useState([]);
    const [transactionList, setTransactionList] = useState([]);
    const [searchParams, setSearchParams] = useState({ ...initialFilters });
    const [paymentStatusValueList, setPaymentStatusValueList] = useState([]);
    const [selectedTransactionIndex, setSelectedTransactionIndex] = useState(-1);
    const [selectedPaymentStatusValue, setSelectedPaymentStatusValue] = useState('');

    const filterMap = {
        account_id: searchParams.hcp,
        last_name: searchParams.lastName,
        order_number: searchParams.number,
        first_name: searchParams.firstName,
        order_status: getRuntimeStatus("status", orderStatusDirectory),
        payment_status: getRuntimeStatus("paymentStatus", paymentStatusDirectory),
    };

    function getRuntimeStatus(attribute, directory) {
        const statusIndex = directory.findIndex(status => status === searchParams[attribute]);
        return statusIndex >= 0 ? statusIndex : '';
    }

    useEffect(() => {
        applyTransactionFilters();
    }, []);

    useEffect(() => {
        if (selectedPaymentStatusValue && selectedTransactionIndex >= 0) {
            const valueIndex = paymentStatusDirectory.findIndex(status => status === selectedPaymentStatusValue);
            const orderId = transactionList[selectedTransactionIndex]?.id;
            changePaymentStatus(orderId, valueIndex);
        }
    }, [selectedPaymentStatusValue, selectedTransactionIndex]);

    const getTransactionList = data => {
        setIsLoading(true);
        API.getMasterList(handleTransactionListResponseObj, data, true, Constant.TRANSACTION_LIST);
    }

    const handleTransactionListResponseObj = {
        cancel: () => { },
        success: response => { // NOSONAR
            setIsLoading(false);
            if (response?.meta?.status) {
                const _paymentStatusValueList = [];
                const responseData = Array.isArray(response?.data?.original?.data) ? response.data.original.data : [];

                const _transactions = responseData.map(transactionObj => {
                    const paymentStatusValue = paymentStatusDirectory
                        ?.[+(transactionObj?.hcp_payment_status) ?? 0]
                        ?? "Pending";

                    _paymentStatusValueList.push(paymentStatusValue);
                    return {
                        id: transactionObj?._id ?? '',
                        paymentStatus: paymentStatusValue,
                        patientId: transactionObj?.user_info?.user_id ?? '',
                        number: transactionObj?.order_number ?? Constant.NO_VALUE,
                        sellingPrice: Number(transactionObj?.total_cost ?? 0)?.toFixed(2),
                        hcpName: transactionObj?.account?.account_name ?? Constant.NO_VALUE,
                        costPrice: Number(transactionObj?.total_cost_price ?? 0)?.toFixed(2),
                        tax: Number(transactionObj?.cart_summary?.tax_price ?? 0)?.toFixed(2),
                        date: displayDateTimeFormat(transactionObj?.created_at) ?? Constant.NO_VALUE,
                        shippingCharges: Number(transactionObj?.total_shipping_charges ?? 0)?.toFixed(2),
                        status: orderStatusDirectory?.[+(transactionObj?.order_status) ?? 1] ?? "In process",
                        patientName: `${transactionObj?.user_info?.first_name ?? ''} ${transactionObj?.user_info?.last_name ?? ''}`,
                    };
                });

                setTransactionList([..._transactions]);
                setPaymentStatusValueList([..._paymentStatusValueList]);
                setTotalRecords(response?.data?.original?.recordsTotal ?? 0);
            }
        },
        error: err => {
            console.log(err);
            setTotalRecords(0);
            setIsLoading(false);
            setTransactionList([]);
        },
        complete: () => { },
    }

    const changePaymentStatus = (orderId, statusValue) => {
        if (orderId) {
            setIsLoading(true);
            const data = { order_status: statusValue, id: orderId };
            API.getMasterList(handleChangePaymentStatusResponseObj, data, true, Constant.TRANSACTION_STATUS_CHANGE);
        }
    }

    const handleChangePaymentStatusResponseObj = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            if (response?.meta?.status && response?.meta?.message) showSuccess(response.meta.message);

            if (selectedPaymentStatusValue && selectedTransactionIndex > 0) {
                const _paymentStatusValueList = [...paymentStatusValueList];
                _paymentStatusValueList[selectedTransactionIndex] = selectedPaymentStatusValue;
                setPaymentStatusValueList([..._paymentStatusValueList]);
            }
        },
        error: err => {
            console.log(err);
            setIsLoading(false);
            const message
                = err?.errors?.order_status?.join(', ')
                ?? err?.meta?.message
                ?? "Something went wrong!";

            showError(message);
        },
        complete: () => { },
    };

    const handleDownload = () => {
        const data = { start: searchParams.start, length: searchParams.length };

        for (const filterKey in filterMap) {
            const value = filterMap[filterKey];
            if (!isEmpty(value) && !defaultFilters.includes(filterKey)) data[filterKey] = value;
        }

        setIsLoading(true);
        API.getMasterList(handleGetTransactionListInCSVResponseObj, data, true, Constant.TRANSACTION_LIST_CSV);
    }

    const handleGetTransactionListInCSVResponseObj = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            const fileUrl = response?.data?.original?.data?.file ?? '';
            if (fileUrl) downloadFile(fileUrl, "transactions.xlsx");
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

    const handleTransactionSearchParamChange = e => {
        const { name, value } = e?.target ?? {};
        if (name) setSearchParams({ ...searchParams, [name]: value });
    }

    const moveToPatientDetailPage = (e, patientId) => {
        if (patientId) history.push(`/patients/view/?id=${patientId}`);
        else showError("patient details are unavailable");
    }

    const moveToOrderDetailPage = (e, orderId) => {
        if (orderId) history.push(`/orders/view/?id=${orderId}`);
        else showError("order details are unavailable");
    }

    const transactionsHeaderTemplate = (
        <div className="table-header">
            <div className="clearfix">
                <h5 className="p-m-0 float-start">
                    <CIcon icon={cilList} className="mr-1" />
                    {CommonMaster.TRANSACTIONS}&nbsp;
                    <CBadge color="danger" className="ms-auto">{totalRecords}</CBadge>
                </h5>

                <button
                    type="button"
                    onClick={handleDownload}
                    style={{ float: "right" }}
                    className="btn btn-primary mb-2 mr-2"
                >
                    <CIcon icon={cilCloudDownload} className="mr-1" />
                    Download CSV
                </button>
            </div>

            <hr />
            <form name="filterFrm" onSubmit={e => { e.preventDefault(); applyTransactionFilters(); }}>
                <div className="row">
                    <CommonHcpInput
                        hcpValue={searchParams.hcp}
                        handleHcpChange={handleTransactionSearchParamChange}
                    />

                    <div className="col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <InputText
                                name="number"
                                className="form-control"
                                value={searchParams.number}
                                onChange={handleTransactionSearchParamChange} // NOSONAR
                            />
                            <label>Order number</label>
                        </span>
                    </div>

                    <div className="col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <InputText
                                name="firstName"
                                className="form-control"
                                value={searchParams.firstName}
                                onChange={handleTransactionSearchParamChange} // NOSONAR
                            />
                            <label>First name</label>
                        </span>
                    </div>

                    <div className="col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <InputText
                                name="lastName"
                                className="form-control"
                                value={searchParams.lastName}
                                onChange={handleTransactionSearchParamChange} // NOSONAR
                            />
                            <label>Last name</label>
                        </span>
                    </div>

                    <div className="col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <Dropdown
                                name="status"
                                className="form-control"
                                value={searchParams.status}
                                options={orderStatusDirectory}
                                onChange={handleTransactionSearchParamChange}
                            />
                            <label>Status</label>
                        </span>
                    </div>

                    <div className="col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <Dropdown
                                name="paymentStatus"
                                className="form-control"
                                options={paymentStatusDirectory}
                                value={searchParams.paymentStatus}
                                onChange={handleTransactionSearchParamChange}
                            />
                            <label>Payment status</label>
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

    const handlePaymentStatusValueChange = (e, index) => {
        const paymentStatusValue = e?.target?.value ?? '';
        setSelectedTransactionIndex(index);
        setSelectedPaymentStatusValue(paymentStatusValue);
    }

    const dynamicBodyTemplate = (value, defaultValue) => {
        return <>{value ?? defaultValue ?? Constant.NO_VALUE}</>;
    }

    const patientNameBodyTemplate = rowData => {
        const { patientId, patientName } = rowData;
        const isPermitted = permissionHandler(Permission.PATIENT_VIEW);

        return (
            <span
                title={`${isPermitted ? "click to view details" : ''}`}
                className={`${patientName && isPermitted ? "span-link" : ''}`}
                onClick={e => { if (patientName && isPermitted) moveToPatientDetailPage(e, patientId); }}
            >
                {patientName ?? Constant.NO_VALUE}
            </span>
        );
    }

    const orderNumberBodyTemplate = rowData => {
        const { id: orderId, number } = rowData;
        const isPermitted = permissionHandler(Permission.ORDER_LIST);

        return (
            <span
                title={`${isPermitted ? "click to view details" : ''}`}
                className={`${number && isPermitted ? "span-link" : ''}`}
                onClick={e => { if (number && isPermitted) moveToOrderDetailPage(e, orderId); }}
            >
                {number ?? Constant.NO_VALUE}
            </span>
        );
    }

    const paymentStatusBodyTemplate = (_, indexData) => {
        const index = indexData.rowIndex;
        const isDisabled = transactionList?.[index]?.status !== "Delivered";

        return (
            <>
                <span className="p-column-title">Payment Status</span>
                <Dropdown
                    disabled={isDisabled}
                    className="form-control"
                    options={paymentStatusDirectory}
                    value={paymentStatusValueList?.[index] ?? ''}
                    onChange={e => { if (!isDisabled) handlePaymentStatusValueChange(e, index); }}
                />
            </>
        );
    }

    const applyTransactionFilters = filters => {
        const _filteredKeys = [];
        const data = {
            start: filters?.start ?? searchParams?.start ?? 0,
            length: filters?.length ?? searchParams?.length ?? Constant.DT_ROW,
        };

        const appliedFilters = !_.isEmpty(filters) ? filters : filterMap;

        for (const filterKey in appliedFilters) {
            const value = appliedFilters[filterKey];
            if (!isEmpty(value) && !defaultFilters.includes(filterKey)) {
                data[filterKey] = value;
                _filteredKeys.push(filterKey);
            }
        }

        if (_.isEmpty(filters)) {
            data["start"] = 0;
            setSearchParams({ ...searchParams, start: 0 });
        }

        setFilteredKeys([..._filteredKeys]);
        getTransactionList(data);
    }

    function resetParams() {
        setSearchParams({ ...initialFilters });
        applyTransactionFilters(initialFilters);
    }

    const handleTransactionPageChange = e => {
        const paginatedParams = { start: e.first, length: e.rows };
        const filters = { ...paginatedParams };

        if (filteredKeys.length) {
            filteredKeys.forEach(filterKey => {
                filters[filterKey] = filterMap[filterKey];
            });
        }

        setSearchParams({ ...searchParams, ...paginatedParams });
        applyTransactionFilters({ ...filters, ...paginatedParams });
    }

    const transactionFooterTemplate = (
        <div className="table-footer">
            <Paginator
                first={searchParams.start}
                rows={searchParams.length}
                totalRecords={totalRecords}
                template={Constant.DT_PAGE_TEMPLATE}
                rowsPerPageOptions={Constant.DT_ROWS_LIST}
                onPageChange={handleTransactionPageChange} // NOSONAR
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
                        value={transactionList}
                        responsiveLayout="scroll"
                        header={transactionsHeaderTemplate}
                        sortField={searchParams.sort_field}
                        sortOrder={searchParams.sort_order}
                        className="p-datatable-responsive-demo"
                        footer={transactionList?.length > 0 ? transactionFooterTemplate : <></>}
                    >
                        {
                            adminRole === "SUPER_ADMIN" && (
                                <Column
                                    field="hcpName"
                                    header="HCP"
                                    body={data => dynamicBodyTemplate(data["hcpName"])} // NOSONAR
                                />
                            )
                        }
                        {<Column field="number" header="Number" body={orderNumberBodyTemplate} /> /* NOSONAR */}
                        {<Column header="Patient" field="patientName" body={patientNameBodyTemplate} /> /* NOSONAR */}
                        {
                            <Column
                                field="costPrice"
                                header="Cost Price (USD)"
                                body={data => { // NOSONAR
                                    return dynamicBodyTemplate(
                                        +(
                                            +(data["tax"] ?? 0) +
                                            +(data["costPrice"] ?? 0) +
                                            +(data["shippingCharges"] ?? 0)
                                        ).toFixed(2)
                                    );
                                }}
                            />
                        }
                        {
                            <Column
                                field="sellingPrice"
                                header="Selling Price (USD)"
                                body={data => dynamicBodyTemplate(data["sellingPrice"])} // NOSONAR
                            />
                        }
                        {
                            <Column
                                field="date"
                                header="Date"
                                body={data => dynamicBodyTemplate(data["date"])} // NOSONAR
                            />
                        }
                        {
                            <Column
                                field="status"
                                header="Status"
                                body={data => dynamicBodyTemplate(data["status"])} // NOSONAR
                            />
                        }
                        {
                            <Column
                                field="paymentStatus"
                                header="HCP Payment Status"
                                body={paymentStatusBodyTemplate} // NOSONAR
                            />
                        }
                    </DataTable>
                </div>
            </div>
        </>
    );
};

export default Transactions;
