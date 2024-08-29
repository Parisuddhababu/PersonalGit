import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/saga-blue/theme.css";

import _ from "lodash";
import { API } from "src/services/Api";
import CIcon from "@coreui/icons-react";
import { Column } from "primereact/column";
import { Calendar } from "primereact/calendar";
import { CBadge, CButton } from "@coreui/react";
import { DataTable } from "primereact/datatable";
import { Paginator } from "primereact/paginator";
import { InputText } from "primereact/inputtext";
import React, { useState, useEffect } from "react";
import { cilCloudDownload, cilList } from "@coreui/icons";

import { CommonMaster } from "src/shared/enum/enum";
import { useToast } from "src/shared/toaster/Toaster";
import * as Constant from "src/shared/constant/constant";
import Loader from "src/views/components/common/loader/loader";
import CommonHcpInput from "src/shared/common/common-hcp-input";
import {
    isEmpty,
    downloadFile,
    requestDateFormatYY,
    displayDateTimeFormat,
    PICKER_DISPLAY_DATE_FORMAT,
} from "src/shared/handler/common-handler";

const CommissionReports = () => {
    const { showError } = useToast();
    const defaultFilters = ["start", "length"];
    const primaryHcpId = localStorage.getItem("account_id");
    const adminRole = JSON.parse(localStorage.getItem("user_details"))?.role?.code ?? '';
    const initialFilters = {
        start: 0,
        date: '',
        email: '',
        micrositeName: '',
        length: Constant.DT_ROW,
        hcp: adminRole !== "SUPER_ADMIN" ? primaryHcpId : '',
    };

    const [endDate, setEndDate] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [filteredKeys, setFilteredKeys] = useState([]);
    const [reportList, setReportList] = useState([]);
    const [searchParams, setSearchParams] = useState({ ...initialFilters });

    const filterMap = {
        email: searchParams.email,
        account_id: searchParams.hcp,
        first_name: searchParams.micrositeName,
        to_date: endDate ? requestDateFormatYY(endDate) : '',
        from_date: startDate ? requestDateFormatYY(startDate) : '',
    };

    useEffect(() => {
        applyCommissionFilters();
    }, []);

    useEffect(() => {
        const [_startDate, _endDate] = searchParams.date;
        setStartDate(_startDate);
        setEndDate(_endDate);
    }, [searchParams.date]);

    const getReportList = data => {
        setIsLoading(true);
        API.getMasterList(handleReportListResponseObj, data, true, Constant.COMMISSION_REPORT_LIST);
    }

    const handleReportListResponseObj = {
        cancel: () => { },
        success: response => { // NOSONAR
            setIsLoading(false);
            if (response?.meta?.status) {
                const responseData = Array.isArray(response?.data?.original?.data) ? response.data.original.data : [];

                const _reports = responseData?.map(reportObj => {
                    const {
                        hcp,
                        cart_summary: cart,
                        total_cost_price: originalPrice,
                        total_shipping_charges: shippingCharges,
                    } = reportObj ?? {};

                    const { tax_price: taxPrice, cart_count: orderItems } = cart ?? {};

                    return {
                        id: reportObj?._id ?? '',
                        orderItems: Math.floor(orderItems ?? 0),
                        taxPrice: +(taxPrice ?? 0)?.toFixed(2),
                        hcpEmail: hcp?.email ?? Constant.NO_VALUE,
                        shippingCharges: +(shippingCharges ?? 0)?.toFixed(2),
                        doctorPrice: +(reportObj?.total_cost ?? 0)?.toFixed(2),
                        orderNumber: reportObj?.order_number ?? Constant.NO_VALUE,
                        hcpName: `${hcp?.first_name ?? ''} ${hcp?.last_name ?? ''}`,
                        originalPrice: +(reportObj?.total_cost_price ?? 0)?.toFixed(2),
                        sellingDate: displayDateTimeFormat(reportObj?.created_at ?? null),
                        micrositeName: reportObj?.account?.account_name ?? Constant.NO_VALUE,
                        displayedOriginalPrice: +(+(originalPrice ?? 0) + +(shippingCharges ?? 0) + +(taxPrice ?? 0))?.toFixed(2),
                    };
                }) ?? [];

                setReportList([..._reports]);
                setTotalRecords(response?.data?.original?.recordsTotal ?? 0);
            }
        },
        error: err => {
            console.log(err);
            setTotalRecords(0);
            setIsLoading(false);
            setReportList([]);
        },
        complete: () => { },
    }

    const handleDownload = () => {
        const data = { start: searchParams.start, length: searchParams.length };

        for (const filterKey in filterMap) {
            const value = filterMap[filterKey];
            if (!isEmpty(value) && !defaultFilters.includes(filterKey)) data[filterKey] = value;
        }

        setIsLoading(true);
        API.getMasterList(handleGetReportListInCSVResponseObj, data, true, Constant.COMMISSION_REPORT_DOWNLOAD);
    }

    const handleGetReportListInCSVResponseObj = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            const fileUrl = response?.data?.original?.data?.file ?? '';
            if (fileUrl) downloadFile(fileUrl, "commission_report.xlsx");
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

    const handleCommissionSearchParamChange = e => {
        const { name, value } = e?.target ?? {};
        if (name) setSearchParams({ ...searchParams, [name]: value });
    }

    const handleDateChange = e => {
        setSearchParams({ ...searchParams, date: e.value });
    }

    const commissionHeaderTemplate = (
        <div className="table-header">
            <div className="clearfix">
                <h5 className="p-m-0 float-start">
                    <CIcon icon={cilList} className="mr-1" />
                    {CommonMaster.COMMISSION_REPORTS}&nbsp;
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
            <form name="filterFrm" onSubmit={e => { e.preventDefault(); applyCommissionFilters(); }}>
                <div className="row">
                    <CommonHcpInput
                        hcpValue={searchParams.hcp}
                        handleHcpChange={handleCommissionSearchParamChange}
                    />

                    <div className="col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <InputText
                                name="email"
                                className="form-control"
                                value={searchParams.email}
                                onChange={handleCommissionSearchParamChange} // NOSONAR
                            />
                            <label>Email</label>
                        </span>
                    </div>

                    <div className="col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <InputText
                                name="micrositeName"
                                className="form-control"
                                value={searchParams.micrositeName}
                                onChange={handleCommissionSearchParamChange} // NOSONAR
                            />
                            <label>Name</label>
                        </span>
                    </div>

                    <div className="col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <Calendar
                                showIcon
                                id="range"
                                readOnlyInput
                                appendTo="self"
                                selectionMode="range"
                                value={searchParams.date}
                                onChange={handleDateChange} // NOSONAR
                                dateFormat={PICKER_DISPLAY_DATE_FORMAT}
                                className="form-control border-0 px-0 py-0 custom-datepicker-input"
                            />
                            <label>Date Range</label>
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

    const dynamicBodyTemplate = (value, defaultValue) => {
        return <>{value ?? defaultValue ?? Constant.NO_VALUE}</>;
    }

    const commissionBodyTemplate = rowData => {
        const { doctorPrice, displayedOriginalPrice } = rowData;
        let commission = doctorPrice - displayedOriginalPrice;
        commission = commission >= 0 ? commission?.toFixed(2) : 0;
        return <>{commission ?? 0}</>;
    }

    const applyCommissionFilters = filters => {
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
        getReportList(data);
    }

    function resetParams() {
        setSearchParams({ ...initialFilters });
        applyCommissionFilters(initialFilters);
    }

    const handleCommissionPageChange = e => {
        const paginatedParams = { start: e.first, length: e.rows };
        const filters = { ...paginatedParams };

        if (filteredKeys.length) {
            filteredKeys.forEach(filterKey => {
                filters[filterKey] = filterMap[filterKey];
            });
        }

        setSearchParams({ ...searchParams, ...paginatedParams });
        applyCommissionFilters({ ...filters, ...paginatedParams });
    }

    const commissionFooterTemplate = (
        <div className="table-footer">
            <Paginator
                first={searchParams.start}
                rows={searchParams.length}
                totalRecords={totalRecords}
                template={Constant.DT_PAGE_TEMPLATE}
                rowsPerPageOptions={Constant.DT_ROWS_LIST}
                onPageChange={handleCommissionPageChange} // NOSONAR
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
                        value={reportList}
                        responsiveLayout="scroll"
                        header={commissionHeaderTemplate}
                        sortField={searchParams.sort_field}
                        sortOrder={searchParams.sort_order}
                        className="p-datatable-responsive-demo"
                        footer={reportList?.length > 0 ? commissionFooterTemplate : <></>}
                    >
                        <Column
                            header="Microsite Name"
                            field="micrositeName"
                            body={data => dynamicBodyTemplate(data["micrositeName"])} // NOSONAR
                        />
                        <Column
                            field="hcpName"
                            header="HCP Name"
                            body={data => dynamicBodyTemplate(data["hcpName"])} // NOSONAR
                        />
                        <Column
                            field="hcpEmail"
                            header="HCP Email"
                            body={data => dynamicBodyTemplate(data["hcpEmail"])} // NOSONAR
                        />
                        <Column
                            field="orderNumber"
                            header="Order Number"
                            body={data => dynamicBodyTemplate(data["orderNumber"])} // NOSONAR
                        />
                        <Column
                            field="originalPrice"
                            header="Original Price (USD)"
                            body={(data) => {
                                const displayedOriginalPrice = Number(data["displayedOriginalPrice"] ?? 0).toFixed(2);
                                return dynamicBodyTemplate(displayedOriginalPrice);
                              }}

                        />
                        <Column
                            field="doctorPrice"
                            header="Doctor Price (USD)"
                            body={(data) => {
                                const doctorPrice = Number(data["doctorPrice"] ?? 0).toFixed(2);
                                return dynamicBodyTemplate(doctorPrice);
                              }}
                        />
                        <Column
                            field="orderItems"
                            header="Total Qty"
                            body={data => dynamicBodyTemplate(data["orderItems"])} // NOSONAR
                        />
                        {<Column field="doctorPrice" header="Commission (USD)" body={commissionBodyTemplate} /> /* NOSONAR */}
                        <Column
                            field="sellingDate"
                            header="Selling Date"
                            body={data => dynamicBodyTemplate(data["sellingDate"])} // NOSONAR
                        />
                    </DataTable>
                </div>
            </div>
        </>
    );
};

export default CommissionReports;
