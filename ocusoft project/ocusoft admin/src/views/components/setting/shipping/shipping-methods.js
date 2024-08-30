import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/saga-blue/theme.css";

import CIcon from "@coreui/icons-react";
import { Column } from "primereact/column";
import { useHistory } from "react-router-dom";
import { CBadge, CButton } from "@coreui/react";
import { DataTable } from "primereact/datatable";
import { Paginator } from "primereact/paginator";
import React, { useEffect, useRef, useState } from "react";
import { cilCheckCircle, cilCash, cilList, cilLocationPin, cilXCircle, cilBook } from "@coreui/icons";

import { API } from "src/services/Api";
import { InputText } from "primereact/inputtext";
import { CommonMaster } from "src/shared/enum/enum";
import { useToast } from "src/shared/toaster/Toaster";
import * as Constant from "src/shared/constant/constant";
import useFileUploader from "src/customHooks/useFileUploader";
import Loader from "src/views/components/common/loader/loader";

const ShippingRateList = () => {
    const { handleFileImportAction } = useFileUploader();
    const importRatesFileUploadRef = useRef(null);
    const importZonesFileUploadRef = useRef(null);
    const { showSuccess, showError } = useToast(), history = useHistory();
    const initialFilters = { start: 0, length: Constant.DT_ROW, title: '', code: '' };

    const [isLoading, setIsLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [filteredKeys, setFilteredKeys] = useState([]);
    const [shippingRates, setShippingRates] = useState([]);
    const [searchParams, setSearchParams] = useState(initialFilters);

    useEffect(() => {
        const filters = { start: searchParams.start, length: searchParams.length };
        filteredKeys.forEach(key => {
            filters[key] = searchParams[key];
        });

        filterShippingRates(filters);
    }, [searchParams.start, searchParams.length]);

    const filterShippingRates = filters => {
        const data = {}, _filterdKeys = [];
        const appliedFilters = filters ?? searchParams;

        for (const filter in appliedFilters) {
            const value = appliedFilters[filter];
            _filterdKeys.push(filter);

            if (filter === "start" || filter === "length" || value) {
                data[filter] = value;
            }
        }

        setIsLoading(true);
        if (!filters) {
            data["start"] = 0;
            setSearchParams({ ...searchParams, start: 0 });
        }

        setFilteredKeys([..._filterdKeys]);
        API.getMasterList(handleGetShippingRatesResponseObj, data, true, Constant.SHIPPING_RATE_LIST);
    };

    const handleGetShippingRatesResponseObj = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            if (response?.meta?.status) {
                const _totalRecords = response?.data?.original?.recordsTotal ?? 0;
                const _shippingRates = response?.data?.original?.data ?? [];
                setShippingRates([..._shippingRates]);
                setTotalRecords(_totalRecords);
            }
        },
        error: err => {
            console.log(err);
            setIsLoading(false);
        },
        complete: () => { },
    };

    const handlePageChange = e => {
        setSearchParams({ ...searchParams, start: e.first, length: e.rows });
    }

    const resetSearchParams = () => {
        setSearchParams({ ...initialFilters });
        filterShippingRates(initialFilters);
    }

    const handleInputChange = e => {
        const { name, value } = e?.target ?? {};
        setSearchParams({ ...searchParams, [name]: value });
    }

    const changeStatus = (e, rowData) => {
        e.preventDefault();
        const { _id: id } = rowData;
        const { active, inactive } = Constant.StatusEnum;

        let data = {
            uuid: id,
            is_active: rowData.is_active === active ? inactive : active
        };

        setIsLoading(true);
        API.UpdateStatus(handleStatusChangeResponseObj, data, true, id, Constant.CHANGE_SHIPPING_RATE_STATUS);
    }

    const moveToRatesListPage = () => {
        history.push("/shipping-rates");
    }

    const moveToZonesListPage = code => {
        if (code) history.push(`/shipping-zones/?code=${code}`);
        else showError("Shipping code is unavailable");
    }

    const handleStatusChangeResponseObj = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            const { status, message } = response?.meta ?? {};
            if (status && message) showSuccess(response.meta.message);
            filterShippingRates();
        },
        error: err => {
            setIsLoading(false);
            if (err?.meta?.message) showError(err.meta.message);
            console.log(err);
        },
        complete: () => { },
    }

    const headerTemplate = (
        <div className="table-header">
            <div className="clearfix row">
                <span>
                    <h5 className="p-m-0 float-start">
                        <CIcon icon={cilList} className="mr-1" />
                        {CommonMaster.SHIPPING_METHODS}
                        <CBadge color="danger" className="ms-auto">{totalRecords}</CBadge>
                    </h5>

                    <CButton
                        type="submit"
                        color="warning"
                        className="mr-2"
                        style={{ float: "right" }}
                        onClick={moveToRatesListPage} // NOSONAR
                    >
                        <CIcon icon={cilList} />&nbsp;&nbsp;View Shipping Rates
                    </CButton>

                    <CButton
                        type="submit"
                        color="primary"
                        className="mr-2"
                        style={{ float: "right" }}
                        onClick={() => { importRatesFileUploadRef.current.click(); }} // NOSONAR
                    >
                        <CIcon icon={cilCash} />&nbsp;&nbsp;Import Shipping Rates (Excel)
                    </CButton>

                    <CButton
                        type="submit"
                        color="primary"
                        className="mr-2"
                        style={{ float: "right" }}
                        onClick={() => { importZonesFileUploadRef.current.click(); }} // NOSONAR
                    >
                        <CIcon icon={cilLocationPin} />&nbsp;&nbsp;Import Shipping Zones (Excel)
                    </CButton>
                </span>
            </div>

            <hr />
            <form name="filterFrm" onSubmit={e => { e.preventDefault(); filterShippingRates(); }}>
                <div className="row">
                    <div className="col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <InputText
                                name="title"
                                id="inputtext"
                                className="form-control"
                                value={searchParams.title}
                                onChange={handleInputChange} // NOSONAR
                            />
                            <label>Title</label>
                        </span>
                    </div>

                    <div className="col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <InputText
                                name="code"
                                id="inputtext"
                                className="form-control"
                                value={searchParams.code}
                                onChange={handleInputChange} // NOSONAR
                            />
                            <label>Code</label>
                        </span>
                    </div>

                    <div className="col-md-12 col-lg-3 pb-3 search-reset">
                        <CButton type="submit" color="primary" className="mr-2">Search</CButton>
                        {<CButton type="button" color="danger" onClick={resetSearchParams}>Reset</CButton> /* NOSONAR */}
                    </div>
                </div>
            </form>
        </div>
    );

    const footerTemplate = (
        <div className="table-footer">
            <Paginator
                first={searchParams.start}
                rows={searchParams.length}
                totalRecords={totalRecords}
                onPageChange={handlePageChange} // NOSONAR
                template={Constant.DT_PAGE_TEMPLATE}
                rowsPerPageOptions={Constant.DT_ROWS_LIST}
                currentPageReportTemplate={Constant.DT_PAGE_REPORT_TEMP}
            />
        </div>
    );

    const titleBodyTemplate = rowData => {
        return <><span className="p-column-title">Title</span>{rowData.title ?? Constant.NO_VALUE}</>;
    };

    const codeBodyTemplate = rowData => {
        return <><span className="p-column-title">Code</span>{rowData.code ?? Constant.NO_VALUE}</>;
    };

    const statusBodyTemplate = rowData => {
        const isActive = rowData?.is_active === Constant.StatusEnum.active;
        const icon = isActive ? cilCheckCircle : cilXCircle;
        const style = isActive ? "text-success" : "text-danger";

        return (
            <>
                <span className="p-column-title">Status</span>

                <button className={`btn btn-link ${style}`} onClick={e => changeStatus(e, rowData)} title="Change Status">
                    <CIcon icon={icon} size="lg" />
                </button>
            </>
        );
    }

    const actionBodyTemplate = rowData => {
        return (
            <>
                <span className="p-column-title">View</span>
                <a title="View Shipping Zones" className="mr-2" onClick={() => { moveToZonesListPage(rowData.code); }}>
                    <CIcon icon={cilBook} size="lg" />
                </a>
            </>
        );
    }

    const resetRatesFileCache = () => {
        importRatesFileUploadRef.current.value = '';
    }

    const resetZonesFileCache = () => {
        importZonesFileUploadRef.current.value = '';
    }

    const handleFileChange = (e, key) => {
        let resetFileFn = null, url = '';

        if (key === "rate") {
            resetFileFn = resetRatesFileCache;
            url = Constant.IMPORT_SHIPPING_RATES;
        } else if (key === "zone") {
            resetFileFn = resetZonesFileCache;
            url = Constant.IMPORT_SHIPPING_ZONES;
        }

        if (resetFileFn && url) {
            handleFileImportAction(e, "excel", resetFileFn, url, importShippingResponseObj, setIsLoading);
        } else {
            showError("Something went wrong!");
        }
    }

    const importShippingResponseObj = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            if (response?.meta?.message) showSuccess(response.meta.message);
        },
        error: err => {
            console.log(err);
            setIsLoading(false);
            if (err?.errors?.file?.length) {
                err.errors.file.forEach(errMessage => { showError(errMessage); });
            } else {
                const message = err?.meta?.message ?? "Something went wrong.";
                showError(message);
            }
        },
        complete: () => { },
    }

    return (
        <>
            {isLoading && <Loader />}

            <div className="datatable-responsive-demo custom-react-table">
                <div className="card">
                    <DataTable
                        stripedRows
                        showGridlines
                        reorderableColumns
                        value={shippingRates}
                        header={headerTemplate}
                        responsiveLayout="scroll"
                        className="p-datatable-responsive-demo mb-4"
                        footer={shippingRates?.length ? footerTemplate : <></>}
                    >
                        {<Column field="title" sortable header="Title" body={titleBodyTemplate} /> /* NOSONAR */}
                        {<Column field="code" sortable header="Code" body={codeBodyTemplate} /> /* NOSONAR */}
                        {<Column field="is_active" header="Status" body={statusBodyTemplate} /> /* NOSONAR */}
                        {<Column field="_id" header="Action" body={actionBodyTemplate} /> /* NOSONAR */}
                    </DataTable>
                </div>
            </div>

            <input
                type="file"
                id="import_file"
                ref={importRatesFileUploadRef}
                className="form-control d-none"
                onChange={e => { handleFileChange(e, "rate"); }}
            />

            <input
                type="file"
                id="import_file"
                ref={importZonesFileUploadRef}
                className="form-control d-none"
                onChange={e => { handleFileChange(e, "zone"); }}
            />
        </>
    );
};

export default ShippingRateList;
