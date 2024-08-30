import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/saga-blue/theme.css";

import { API } from "src/services/Api";
import CIcon from "@coreui/icons-react";
import { Column } from "primereact/column";
import Loader from "../common/loader/loader";
import { CBadge, CButton } from "@coreui/react";
import { DataTable } from "primereact/datatable";
import { Paginator } from "primereact/paginator";
import { InputText } from "primereact/inputtext";
import React, { useState, useEffect, useRef } from "react";
import { cilBook, cilCloudDownload, cilCloudUpload, cilList } from "@coreui/icons";

import TaxRateDetails from "./details";
import { CommonMaster } from "src/shared/enum/enum";
import { useToast } from "src/shared/toaster/Toaster";
import * as  Constant from "src/shared/constant/constant";
import { isEmpty } from "src/shared/handler/common-handler";
import useFileUploader from "src/customHooks/useFileUploader";

const TaxRateList = () => {
    const fileUploadRef = useRef(null);
    const { showError, showSuccess } = useToast();
    const { handleFileImportAction } = useFileUploader();
    const initialFilters = { start: 0, length: Constant.DT_ROW };

    const [globalSearchValue, setGlobalSearchValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [taxRateList, setTaxRateList] = useState([]);
    const [detailsObj, setDetailsObj] = useState(null);
    const [totalRecords, setTotalRecords] = useState(0);
    const [filteredKeys, setFilteredKeys] = useState([]);
    const [showDetails, setShowDetails] = useState(false);
    const [searchParams, setSearchParams] = useState({ ...initialFilters });

    const filterMap = { search: globalSearchValue };

    useEffect(() => {
        if (searchParams) {
            const filters = {};

            if (filteredKeys.length) {
                filteredKeys.forEach(filterKey => {
                    filters[filterKey] = filterMap[filterKey];
                });
            }

            applyFilters(filters);
        }
    }, [searchParams]);

    const getTaxRateList = data => {
        setIsLoading(true);
        API.getMasterList(handleTaxRateListResponseObj, data, true, Constant.TAX_RATE_LIST);
    }

    const handleTaxRateListResponseObj = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            if (response?.meta?.status) {
                setTaxRateList(response?.data?.original?.data ?? [])
                setTotalRecords(response?.data?.original.recordsTotal)
            }
        },
        error: err => {
            console.log(err);
            setIsLoading(false);
        },
        complete: () => { },
    }

    const resetFileCache = () => {
        fileUploadRef.current.value = '';
    }

    const handleFileChange = e => {
        e.preventDefault();
        handleFileImportAction(
            e,
            "excel",
            resetFileCache,
            Constant.TAX_RATE_IMPORT_FILE,
            importTaxRateListResponse,
            setIsLoading
        );
    }

    const importTaxRateListResponse = {
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

    const getTaxRateDetails = id => {
        setIsLoading(true);
        API.getDrpData(handleGetTaxRateDetailsResponseObj, null, true, `${Constant.TAX_RATE_DETAILS}/${id}`);
    }

    const handleGetTaxRateDetailsResponseObj = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            if (response?.meta?.status && response?.data?.original?.data) {
                const _detailsObj = response.data.original.data;

                setShowDetails(true);
                setDetailsObj({
                    rate: _detailsObj?.rate ?? '',
                    createdAt: _detailsObj?.created_at ?? '',
                    postalCode: _detailsObj?.post_code ?? '',
                    updatedAt: _detailsObj?.updated_at ?? '',
                    state: _detailsObj?.state?.state_name ?? '',
                    country: _detailsObj?.country?.country_name ?? '',
                    currency: _detailsObj?.country?.currency_symbol ?? '',
                });
            }
        },
        error: err => {
            console.log(err);
            setIsLoading(false);
        },
        complete: () => { },
    }

    const downloadSampleFile = () => {
        const sampleFileUrl = Constant.TaxRateSampleFileUrl;
        fetch(sampleFileUrl)
            .then(async t => {
                return t.blob().then(b => {
                    let a = document.createElement('a');
                    a.href = URL.createObjectURL(b);
                    a.setAttribute("download", "sample_tax_details");
                    a.click();
                    a.remove();
                });
            })
            .catch(() => {
                showError("Error downloading the file.");
            });
    }

    const headerTemplate = (
        <div className="table-header">
            <div className="clearfix">
                <h5 className="p-m-0 float-start"><CIcon icon={cilList} className="mr-1" />
                    {CommonMaster.TAX_RATE} <CBadge color="danger" className="ms-auto">{totalRecords}</CBadge>
                </h5>

                <div className="foat-end">
                    <div className="common-add-btn">
                        <CButton
                            color="primary"
                            className="btn-primary mr-2"
                            onClick={() => { fileUploadRef.current.click(); }} // NOSONAR
                        >
                            <CIcon icon={cilCloudUpload} className="mr-1" />Import Excel
                        </CButton>

                        <input
                            type="file"
                            id="import_file"
                            ref={fileUploadRef}
                            onChange={handleFileChange}
                            className="form-control d-none"
                        />

                        <CButton
                            color="success"
                            className="btn-primary ml-2"
                            onClick={downloadSampleFile} // NOSONAR
                        >
                            <CIcon className="mr-1" icon={cilCloudDownload} />
                            Download Sample file
                        </CButton>
                    </div>
                </div>
            </div>

            <hr />
            <form name="filterFrm" onSubmit={e => { e.preventDefault(); applyFilters(); }}>
                <div className="row">
                    <div className="col-md-6 col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <InputText
                                name="globalSearchValue"
                                value={globalSearchValue}
                                className="form-control"
                                onChange={e => { setGlobalSearchValue(e.target.value); }} // NOSONAR
                            />
                            <label>Global search</label>
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

    const countryBodyTemplate = rowData => {
        return (
            <>
                <span className="p-column-title">Slug</span>
                {rowData?.country?.name ?? Constant.NO_VALUE}
            </>
        );
    }

    const taxCodeTemplate = rowData => {
        return (
            <>
                <span className="p-column-title">Tax code</span>
                {rowData?.code ?? Constant.NO_VALUE}
            </>
        );
    }

    const postalCodeTemplate = rowData => {
        return (
            <>
                <span className="p-column-title">Pincode</span>
                {rowData?.post_code ?? Constant.NO_VALUE}
            </>
        );
    }

    const rateBodyTemplate = rowData => {
        return (
            <>
                <span className="p-column-title">Rate</span>
                {rowData?.rate ?? Constant.NO_VALUE}
            </>
        );
    }

    const stateBodyTemplate = rowData => {
        return (
            <>
                <span className="p-column-title">Account</span>
                {rowData?.state?.name ?? Constant.NO_VALUE}
            </>
        );
    }

    const viewDetailsTemplate = rowData => {
        return (
            <>
                <span className="p-column-title">Action</span>
                <p>
                    <CIcon
                        size="lg"
                        icon={cilBook}
                        title="View tax details"
                        className="text-success cursor-pointer"
                        onClick={() => { getTaxRateDetails(rowData._id); }} // NOSONAR
                    />
                </p>
            </>
        );
    }

    const handleCloseDialog = () => {
        setShowDetails(false);
    }

    const applyFilters = filters => {
        const { start, length } = searchParams;
        let data = { start, length }, _filteredKeys = [];

        const appiledFilters = filters ?? filterMap;

        for (const filterKey in appiledFilters) {
            const value = filterMap[filterKey];
            if (!isEmpty(value)) {
                data[filterKey] = value;
                _filteredKeys.push(filterKey);
            }
        }

        setFilteredKeys([..._filteredKeys]);
        getTaxRateList(data);
    }

    function resetParams() {
        setGlobalSearchValue('');
        setSearchParams({ ...initialFilters });
    }

    const handlePageChange = e => {
        setSearchParams({ ...searchParams, start: e.first, length: e.rows });
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
                        value={taxRateList}
                        header={headerTemplate}
                        responsiveLayout="scroll"
                        sortField={searchParams.sort_field}
                        sortOrder={searchParams.sort_order}
                        className="p-datatable-responsive-demo"
                        footer={taxRateList?.length > 0 ? footerTemplate : <></>}
                    >
                        {<Column field="country" header="Country" body={countryBodyTemplate} /> /* NOSONAR */}
                        {<Column field="state" header="State" body={stateBodyTemplate} /> /* NOSONAR */}
                        {<Column field="code" header="Tax code" body={taxCodeTemplate} /> /* NOSONAR */}
                        {<Column field="pincode" header="Postal code" body={postalCodeTemplate} /> /* NOSONAR */}
                        {<Column field="rate" header="Rate (USD)" body={rateBodyTemplate} /> /* NOSONAR */}
                        {<Column field="_id" header="View" body={viewDetailsTemplate} /> /* NOSONAR */}
                    </DataTable>
                </div>
            </div>

            {
                showDetails && detailsObj && (
                    <TaxRateDetails handleCloseDialog={handleCloseDialog} taxDetails={detailsObj} /> // NOSONAR
                )
            }
        </>
    )
}

export default TaxRateList;
