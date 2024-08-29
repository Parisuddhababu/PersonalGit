import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/saga-blue/theme.css";

import { API } from "src/services/Api";
import CIcon from "@coreui/icons-react";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { CBadge, CButton } from "@coreui/react";
import { DataTable } from "primereact/datatable";
import { Paginator } from "primereact/paginator";
import { InputText } from "primereact/inputtext";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { cilBook, cilCheckCircle, cilList, cilSync, cilXCircle } from "@coreui/icons";

import { CommonMaster } from "src/shared/enum/enum";
import { useToast } from "src/shared/toaster/Toaster";
import * as Constant from "src/shared/constant/constant";
import Loader from "src/views/components/common/loader/loader";
import { isEmpty, prescriptionStatusDirectory } from "src/shared/handler/common-handler";

const ProductMaster = () => {
    const { showError, showSuccess } = useToast();
    const history = useHistory(), statusOptions = Constant.STATUS_OPTION;
    const initialFilters = {
        sku: '',
        start: 0,
        name: '',
        status: '',
        micrositeStatus: '',
        prescriptionStatus: '',
        length: Constant.DT_ROW,
    };

    const [isLoading, setIsLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [filteredKeys, setFilteredKeys] = useState([]);
    const [masterProductList, setMasterProductList] = useState([]);
    const [searchParams, setSearchParams] = useState({ ...initialFilters });

    useEffect(() => {
        applyFilters();
    }, []);

    const getMasterProductList = data => {
        setIsLoading(true);
        API.getMasterList(handleInquiryListResponseObj, data, true, Constant.MASTER_PRODUCT_LIST);
    }

    const handleInquiryListResponseObj = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            if (response?.meta?.status) {
                setMasterProductList(response?.data?.original?.data ?? []);
                setTotalRecords(response?.data?.original?.recordsTotal ?? 0);
            }
        },
        error: err => {
            console.log(err);
            setIsLoading(false);
            setTotalRecords(0);
            setMasterProductList([]);
        },
        complete: () => { },
    }

    const syncProduct = id => {
        if (id) {
            setIsLoading(true);
            API.addMaster(handleSyncProductResponseObj, null, true, `${Constant.PRODUCT_MAGENTO_SYNC}/${id}`);
        }
    }

    const handleSyncProductResponseObj = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            const { status, message } = response?.meta ?? {};
            if (status && message) showSuccess(message);
        },
        error: err => {
            console.log(err);
            setIsLoading(false);
            const message = err?.meta?.message ?? "Something went wrong!";
            showError(message);
        },
        complete: () => { },
    }

    const changeStatus = data => {
        const { _id: id, is_active: isActive } = data;
        if (id) {
            setIsLoading(true);
            const payload = { uuid: id, is_active: isActive ? 0 : 1 };
            API.UpdateStatus(handleChangeStatusResponseObj, payload, true, id, Constant.MASTER_PRODUCT_STATUS_CHANGE);
        }
    }

    const handleChangeStatusResponseObj = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            if (response?.meta?.message) showSuccess(response.meta.message);
            applyFilters(searchParams);
        },
        error: err => {
            console.log(err);
            setIsLoading(false);
            if (err?.meta?.message) showError(err.meta.message);
        },
        complete: () => { },
    }


    const changePrescriptionStatus = (data, newStatus) => {
        const { _id: id } = data;
        if (id) {
            setIsLoading(true);
            const payload = { uuid: id, is_prescribed: newStatus };
            API.UpdateStatus(
                handleChangePrescriptionStatusResponseObj,
                payload,
                true,
                id,
                Constant.MASTER_PRODUCT_PRESCRIPTION_STATUS_CHANGE
            );
        }
    }

    const handleChangePrescriptionStatusResponseObj = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            if (response?.meta?.message) showSuccess(response.meta.message);
            applyFilters(searchParams);
        },
        error: err => {
            console.log(err);
            setIsLoading(false);
            if (err?.meta?.message) showError(err.meta.message);
        },
        complete: () => { },
    }

    const moveToViewPage = id => {
        if (id) history.push(`/master-products/view/?id=${id}`);
        else showError("Products details are unavailable.");
    }

    const handleSearchParamChange = e => {
        const { name: key, value } = e.target;
        setSearchParams({ ...searchParams, [key]: value });
    }

    const headerTemplate = (
        <div className="table-header">
            <div className="clearfix">
                <h5 className="p-m-0 float-start">
                    <CIcon icon={cilList} className="mr-1" />
                    {CommonMaster.PRODUCT_MASTER}
                    <CBadge color="danger" className="ms-auto">{totalRecords}</CBadge>
                </h5>
            </div>

            <hr />
            <form name="filterFrm" onSubmit={e => { e.preventDefault(); applyFilters(); }}>
                <div className="row">
                    <div className="col-md-6 col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <InputText
                                name="name"
                                className="form-control"
                                value={searchParams.name}
                                onChange={handleSearchParamChange} // NOSONAR
                            />
                            <label>Name</label>
                        </span>
                    </div>

                    <div className="col-md-6 col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <InputText
                                name="sku"
                                className="form-control"
                                value={searchParams.sku}
                                onChange={handleSearchParamChange} // NOSONAR
                            />
                            <label>SKU</label>
                        </span>
                    </div>

                    <div className="col-md-6 col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <Dropdown
                                name="status"
                                optionLabel="name"
                                options={statusOptions}
                                className="form-control"
                                value={searchParams.status}
                                onChange={handleSearchParamChange} // NOSONAR
                            />
                            <label>Magento Status</label>
                        </span>
                    </div>

                    <div className="col-md-6 col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <Dropdown
                                optionLabel="name"
                                name="micrositeStatus"
                                options={statusOptions}
                                className="form-control"
                                onChange={handleSearchParamChange} // NOSONAR
                                value={searchParams.micrositeStatus}
                            />
                            <label>Microsite Status</label>
                        </span>
                    </div>

                    <div className="col-md-6 col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <Dropdown
                                className="form-control"
                                name="prescriptionStatus"
                                onChange={handleSearchParamChange} // NOSONAR
                                options={prescriptionStatusDirectory}
                                value={searchParams.prescriptionStatus}
                            />
                            <label>Product Label</label>
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

    const magentoStatusBodyTemplate = rowData => {
        return (
            <CBadge
                className="ms-auto"
                style={{ fontSize: "15px" }}
                color={rowData.status === 1 ? "success" : "danger"}
            >
                {rowData.status === 1 ? "Active" : "Inactive"}
            </CBadge>
        );
    }

    const statusBodyTemplate = rowData => {
        const styling = rowData?.is_active ? "text-success" : "text-danger";
        const iconStyle = rowData?.is_active ? cilCheckCircle : cilXCircle;

        return (
            <button className={`btn btn-link ${styling}`} title="Change Status" onClick={() => { changeStatus(rowData); }}>
                <CIcon icon={iconStyle} size="lg" />
            </button>
        );
    }
    const isPrescribedBodyTemplate = rowData => {
        const { is_prescribed: isPrescribed } = rowData;
    
        const otcTitle = isPrescribed === 0 ? "" : "Change the label to OTC";
        const rxTitle = isPrescribed === 1 ? "" : "Change the label to RX";
        const trailTitle = isPrescribed === 2 ? "" : "Change the label to Trail";
    
        const isOtcActive = isPrescribed === 0;
        const isRxActive = isPrescribed === 1;
        const isTrailActive = isPrescribed === 2;
    
        let commonStyle = "prescription-label-style";
        const rxStyle = "rx-switch", otcStyle = "otc-switch", trailStyle = "trail-switch";
        const otcStatusStyle = isOtcActive ? "prescribed-active" : "prescribed-inactive";
        const rxStatusStyle = isRxActive ? "prescribed-active" : "prescribed-inactive";
        const trailStatusStyle = isTrailActive ? "prescribed-active" : "prescribed-inactive";
    
        return (
            <div className="prescribed-switch-body">
                <div
                    title={otcTitle}
                    className={`${commonStyle} ${otcStyle} ${otcStatusStyle}`}
                    onClick={() => { if (!isOtcActive) changePrescriptionStatus(rowData, 0); }}
                >
                    OTC
                </div>
    
                <div
                    title={rxTitle}
                    className={`${commonStyle} ${rxStyle} ${rxStatusStyle}`}
                    onClick={() => { if (!isRxActive) changePrescriptionStatus(rowData, 1); }}
                >
                    RX
                </div>
                <div
                    title={trailTitle}
                    className={`${commonStyle} ${trailStyle} ${trailStatusStyle}`}
                    onClick={() => { if (!isTrailActive) changePrescriptionStatus(rowData, 2); }}
                >
                    TRAIL
                </div>
            </div>
        );
    }

    const skuBodyTemplate = rowData => {
        return (
            <>
                <span className="p-column-title">SKU</span>
                {rowData?.sku ?? Constant.NO_VALUE}
            </>
        );
    }

    const nameBodyTemplate = rowData => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData?.name ?? Constant.NO_VALUE}
            </>
        );
    }

    const actionBodyTemplate = rowData => {
        return rowData?._id ? (
            <>
                <a title="View" className="mr-2" onClick={() => { moveToViewPage(rowData._id); }}>
                    <CIcon icon={cilBook} size="lg" />
                </a>

                <a title="Sync" className="mr-2 text-warning" onClick={() => { syncProduct(rowData.sku); }}>
                    <CIcon color="warning" icon={cilSync} size="lg" />
                </a>
            </>
        ) : (
            <></>
        );
    }

    const applyFilters = filters => {
        const { start, length } = searchParams;
        let data = { start, length }, _filteredKeys = [];

        const appliedFilters = filters ?? searchParams;

        for (const filter in appliedFilters) {
            const value = appliedFilters[filter];
            _filteredKeys.push(filter);

            if (filter === "status" && !isEmpty(value?.code)) {
                data["status"] = value.code;
            } else if (filter === "micrositeStatus" && !isEmpty(value?.code)) {
                data["is_active"] = value.code;
            } else if (filter === "prescriptionStatus" && !isEmpty(value)) {
                data["is_prescribed"] = prescriptionStatusDirectory.findIndex(status => status === value);
            } else if (filter === "start" || filter === "length" || !isEmpty(value)) {
                data[filter] = value;
            }
        }

        if (!filters) {
            data["start"] = 0;
            setSearchParams({ ...searchParams, start: 0 });
        }

        setFilteredKeys([..._filteredKeys]);
        getMasterProductList(data);
    }

    function resetParams(e) {
        e.preventDefault();
        setSearchParams({ ...initialFilters });
        applyFilters(initialFilters);
    }

    const handlePageChange = e => {
        const paginatedParams = { start: e.first, length: e.rows };
        const filters = { ...paginatedParams };

        if (filteredKeys.length) {
            filteredKeys.forEach(filterKey => {
                filters[filterKey] = searchParams[filterKey];
            });
        }

        setSearchParams({ ...searchParams, ...paginatedParams });
        applyFilters({ ...filters, ...paginatedParams });
    }

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

    return (
        <>
            {isLoading && <Loader />}

            <div className="datatable-responsive-demo custom-react-table">
                <div className="card">
                    <DataTable
                        stripedRows
                        showGridlines
                        header={headerTemplate}
                        responsiveLayout="scroll"
                        value={masterProductList}
                        sortField={searchParams.sort_field}
                        sortOrder={searchParams.sort_order}
                        className="p-datatable-responsive-demo"
                        footer={masterProductList?.length > 0 ? footerTemplate : <></>}
                    >
                        {<Column field="name" header="Name" body={nameBodyTemplate} /> /* NOSONAR */}
                        {<Column field="sku" header="SKU" body={skuBodyTemplate} /> /* NOSONAR */}
                        {<Column field="status" header="Magento Status" body={magentoStatusBodyTemplate} /> /* NOSONAR */}
                        {<Column field="is_active" header="Microsite Status" body={statusBodyTemplate} /> /* NOSONAR */}
                        {<Column field="is_prescribed" header="Product Label" body={isPrescribedBodyTemplate} /> /* NOSONAR */}
                        {<Column field="sap_id" header="Action" body={actionBodyTemplate} /> /* NOSONAR */}
                    </DataTable>
                </div>
            </div>
        </>
    );
};

export default ProductMaster;
