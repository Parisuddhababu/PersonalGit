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
import { API } from '../../../../services/Api';
import * as  Constant from "../../../../shared/constant/constant"
import Loader from "../../common/loader/loader"
import { Paginator } from 'primereact/paginator';

import { cilCheckCircle, cilList, cilXCircle } from '@coreui/icons';
import { Permission } from 'src/shared/enum/enum';
import { useToast } from '../../../../shared/toaster/Toaster';
import permissionHandler from 'src/shared/handler/permission-handler';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { isEmpty } from 'src/shared/handler/common-handler';

const MasterModuleList = () => {
    const initialFilter = { start: 0, length: Constant.DT_ROW, sort_order: '', sort_field: '' };
    const statusChangeKeyValues = {
        master: { key: "is_master", endPoint: Constant.MASTER_LIST_STATUS },
        category: { key: "is_category_customize", endPoint: Constant.CATEGORY_LIST_STATUS },
        catalogue: { key: "is_catalogue_customize", endPoint: Constant.CATALOGUE_LIST_STATUS },
        collection: { key: "is_collection_customize", endPoint: Constant.COLLECTION_LIST_STATUS },
    };

    const [searchVal, setSearchVal] = useState(initialFilter)
    const [masterData, setMasterData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const { showError, showSuccess } = useToast();
    const [totalRecords, setTotalRecords] = useState(0);
    const [selectedPincode, setSelectedPincode] = useState([]);
    const [colorName, setcolorName] = useState('');
    const [masterStatus, setmasterStatus] = useState('');
    const [categoryStatus, setcategoryStatus] = useState('');
    const [collectionStatus, setcollectionStatus] = useState('');
    const [catalogueStatus, setcatalogueStatus] = useState('');
    const [codeStatus, setcodeStatus] = useState('');
    const [statusChangeData, setStatusChangeData] = useState({ data: null, id: '', key: '' });
    const [filteredKeys, setFilteredKeys] = useState([]);

    const statusOption = Constant.STATUS_OPTION

    const filterMap = {
        name: colorName,
        is_master: masterStatus.code,
        is_collection_customize: collectionStatus.code,
        is_category_customize: categoryStatus.code,
        is_catalogue_customize: catalogueStatus.code,
        code: codeStatus,
    };

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
    }, [searchVal]);

    useEffect(() => {
        if (statusChangeData.key) {
            const { data, id, key } = statusChangeData;
            const { endPoint } = statusChangeKeyValues[key]
            API.UpdateStatus(onUpdateStatusRes, data, true, id, endPoint);
        }
    }, [statusChangeData]);

    const getPincodeData = (formData) => {
        setIsLoading(true)
        API.getMasterList(onPincodeData, formData, true, Constant.MODULE_LIST);
    }

    // onPincodeData Response Data Method
    const onPincodeData = {
        cancel: (c) => {
        },
        success: (response) => {
            if (response.meta.status_code === 200) {
                setMasterData(response?.data?.original?.data)
                setTotalRecords(response?.data?.original.recordsTotal)
                setIsLoading(false)
            }
        },
        error: (error) => {
            setIsLoading(false)
        },
        complete: () => {
        },
    }

    // onUpdateStatusRes Response Data Method
    const onUpdateStatusRes = {
        cancel: () => { },
        success: response => { // NOSONAR
            setIsLoading(false);
            if (response?.meta?.status) {
                if (response?.meta?.message) showSuccess(response.meta.message);
                const { uuid } = response.data;

                if (uuid) {
                    let _masterData = masterData;
                    const masterRecordIndex = masterData.findIndex(dataObj => dataObj?._id === uuid);

                    if (masterRecordIndex >= 0 && statusChangeData.key) {
                        const { key } = statusChangeData;
                        const statusValue = statusChangeKeyValues[key]["key"];

                        if (statusValue) {
                            _masterData[masterRecordIndex][statusValue]
                            = _masterData[masterRecordIndex]?.[statusValue] === 1 ? 0 : 1;
                        }

                        setMasterData([ ..._masterData ]);
                        setStatusChangeData({ data: null, key: '', id: '' });
                    }
                } else {
                    onFilterData();
                }
            }
        },
        error: err => {
            setIsLoading(false);
            if (err?.meta?.message) showError(err.meta.message);
        },
        complete: () => { },
    }

    const isMaster = (rowData) => {
        let obj = {
            "uuid": rowData._id,
            "is_master": rowData.is_master === Constant.TryAtHomeEnum.yes ? Constant.TryAtHomeEnum.no : Constant.TryAtHomeEnum.yes
        }

        setIsLoading(true);
        setStatusChangeData({ key: "master", id: rowData._id, data: obj });
    }

    const categoryCustomize = (rowData) => {
        let obj = {
            "uuid": rowData._id,
            "is_category_customize": rowData.is_category_customize === Constant.CODEnum.yes ? Constant.CODEnum.no : Constant.CODEnum.yes
        }

        setIsLoading(true);
        setStatusChangeData({ key: "category", id: rowData._id, data: obj });
    }


    const collectionCustomize = (rowData) => {
        let obj = {
            "uuid": rowData._id,
            "is_collection_customize": rowData.is_collection_customize === Constant.CODEnum.yes ? Constant.CODEnum.no : Constant.CODEnum.yes
        }

        setIsLoading(true);
        setStatusChangeData({ key: "collection", id: rowData._id, data: obj });
    }

    const catelogueCustomize = (rowData) => {
        let obj = {
            "uuid": rowData._id,
            "is_catalogue_customize": rowData.is_catalogue_customize === Constant.CODEnum.yes ? Constant.CODEnum.no : Constant.CODEnum.yes
        }

        setIsLoading(true);
        setStatusChangeData({ key: "catalogue", id: rowData._id, data: obj });
    }

    const header = (
        <div className="table-header">
            <div className="clearfix table-header-content">
                <h5 className="p-m-0 float-start">
                    <CIcon icon={cilList} className="mr-1" /> Master Module
                    <CBadge color="danger" className="ms-auto">{totalRecords}</CBadge>
                </h5>
            </div>

            <hr />
            <form name='filterFrm' onSubmit={(e) => setGlobalFilter(e)}>
                <div className="row">
                    <div className="col-md-6 col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <InputText className="form-control" name="code" value={colorName} onChange={(e) => setcolorName(e.target.value)} />
                            <label>Module Name </label>
                        </span>
                    </div>

                    <div className="col-md-6 col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <Dropdown className="form-control" value={masterStatus} options={statusOption} onChange={(e) => setmasterStatus(e.value)} optionLabel="name" />
                            <label>Master </label>
                        </span>
                    </div>

                    <div className="col-md-6 col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <Dropdown className="form-control" value={categoryStatus} options={statusOption} onChange={(e) => setcategoryStatus(e.value)} optionLabel="name" />
                            <label>Category Customize </label>
                        </span>
                    </div>

                    <div className="col-md-6 col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <Dropdown className="form-control" value={collectionStatus} options={statusOption} onChange={(e) => setcollectionStatus(e.value)} optionLabel="name" />
                            <label>Collection Customize </label>
                        </span>
                    </div>
                    <div className="col-md-6 col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <Dropdown className="form-control" value={catalogueStatus} options={statusOption} onChange={(e) => setcatalogueStatus(e.value)} optionLabel="name" />
                            <label>Catalogue Customize </label>
                        </span>
                    </div>

                    <div className="col-md-6 col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <InputText className="form-control" name="code" value={codeStatus} onChange={(e) => setcodeStatus(e.target.value)} />
                            <label>Code </label>
                        </span>
                    </div>


                    <div className="col-md-12 col-lg-3 pb-3 search-reset">
                        <CButton type='submit' color="primary" className="mr-2">Search</CButton>
                        <CButton type='button' color="danger" onClick={() => resetGlobalFilter()} >Reset</CButton>
                    </div>
                </div>
            </form>
        </div>
    );


    const isMasterBodyTemplate = (rowData) => {
        if (rowData?.is_master === Constant.TryAtHomeEnum.yes) {
            return (
                <React.Fragment>
                    <span className="p-column-title">Status</span>

                    <button className="btn btn-link text-success" title="Master Status" onClick={() => isMaster(rowData)}><CIcon icon={cilCheckCircle} size="lg" /></button>
                </React.Fragment>)
        } else {
            return (
                <React.Fragment>
                    <span className="p-column-title">Status</span>

                    <button className="btn btn-link text-danger" title="Master Status" onClick={() => isMaster(rowData)}><CIcon icon={cilXCircle} size="lg" /></button>
                </React.Fragment>)
        }
    }

    const categoryCustomizeTemplate = (rowData) => {
        if (rowData?.is_category_customize === Constant.CODEnum.yes) {
            return (
                <React.Fragment>
                    <span className="p-column-title">Status</span>

                    <button className="btn btn-link text-success" title="Category Customize Status" onClick={() => categoryCustomize(rowData)}><CIcon icon={cilCheckCircle} size="lg" /></button>
                </React.Fragment>)
        } else {
            return (
                <React.Fragment>
                    <span className="p-column-title">Status</span>

                    <button className="btn btn-link text-danger" title="Category Customize Status" onClick={() => categoryCustomize(rowData)}><CIcon icon={cilXCircle} size="lg" /></button>
                </React.Fragment>)
        }
    }

    const collectioCustomizeTemplate = (rowData) => {
        if (rowData?.is_collection_customize === Constant.CODEnum.yes) {
            return (
                <React.Fragment>
                    <span className="p-column-title">Status</span>

                    <button className="btn btn-link text-success" title="Collection Customize Status" onClick={() => collectionCustomize(rowData)}><CIcon icon={cilCheckCircle} size="lg" /></button>
                </React.Fragment>)
        } else {
            return (
                <React.Fragment>
                    <span className="p-column-title">Status</span>

                    <button className="btn btn-link text-danger" title="Collection Customize Status" onClick={() => collectionCustomize(rowData)}><CIcon icon={cilXCircle} size="lg" /></button>
                </React.Fragment>)
        }
    }


    const catalogueCustomizeTemplate = (rowData) => {
        if (rowData?.is_catalogue_customize === Constant.CODEnum.yes) {
            return (
                <React.Fragment>
                    <span className="p-column-title">Status</span>

                    <button className="btn btn-link text-success" title="Catalogue Customize Status" onClick={() => catelogueCustomize(rowData)}><CIcon icon={cilCheckCircle} size="lg" /></button>
                </React.Fragment>)
        } else {
            return (
                <React.Fragment>
                    <span className="p-column-title">Status</span>

                    <button className="btn btn-link text-danger" title="Catalogue Customize Status" onClick={() => catelogueCustomize(rowData)}><CIcon icon={cilXCircle} size="lg" /></button>
                </React.Fragment>)
        }
    }

    const codeBodyTemplate = rowData => {
        const code = rowData.code ?? Constant.NO_VALUE;
        return (<><span className="p-column-title">Code</span>{code}</>);
    }

    const setGlobalFilter = (event) => {
        event.preventDefault();
        onFilterData()
    }

    const onFilterData = filters => {
        const { start, length, sort_field, sort_order } = searchVal;
        const data = { start, length }, _filteredKeys = [];

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
        getPincodeData(data);
    }


    const resetGlobalFilter = () => {
        setcolorName('')
        setmasterStatus('')
        setcategoryStatus('')
        setcollectionStatus('')
        setcatalogueStatus('')
        setcodeStatus('')
        setSearchVal(initialFilter);
    }

    const onselectRow = (e) => {
        setSelectedPincode(e.value)
    }

    const onPageChange = (e) => {
        // first: 0
        // page: 0
        // pageCount: 0
        // rows: total
        setSearchVal({ ...searchVal, length: e.rows })
        if (searchVal.start !== e.first) {
            setSearchVal({ ...searchVal, start: e.first })
        }

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
            {/* <Toast ref={toast} /> */}
            {isLoading && <Loader />}

            <div className="datatable-responsive-demo custom-react-table">
                <div className="card">
                    <DataTable value={masterData} stripedRows className="p-datatable-responsive-demo" header={header} footer={masterData?.length > 0 ? footer : ''} showGridlines responsiveLayout="scroll"
                        sortField={searchVal.sort_field} sortOrder={searchVal.sort_order} onSort={(e) => onSort(e)} selection={selectedPincode} onSelectionChange={e => onselectRow(e)} selectionMode='checkbox'
                    >
                        {/* <Column selectionMode="multiple" style={{ width: '3em' }} /> */}
                        {/* sortable */}
                        <Column field="name" header="Module Name"></Column>
                        {
                            permissionHandler(Permission.MASTTER_CODE) &&
                            <Column field="code" header="Code" body={codeBodyTemplate}></Column>
                        }
                        {
                            permissionHandler(Permission.MASTER_IS_MASTER) &&
                            <Column field="is_master" header="Master" body={isMasterBodyTemplate}></Column>
                        }
                        {
                            permissionHandler(Permission.MASTTER_CATEGORY_CUSTOMIZE) &&
                            <Column field="is_category_customize" header="Category Customsize" body={categoryCustomizeTemplate}></Column>
                        }

                        {
                            permissionHandler(Permission.MASTTER_COLLECTION_CUSTOMIZE) &&
                            <Column field="is_collection_customize" header="Collection Customize" body={collectioCustomizeTemplate}></Column>
                        }
                        {
                            permissionHandler(Permission.MASTTER_CATALOGUE_CUSTOMIZE) &&
                            <Column field="is_catalogue_customize" header="Catalogue Customize" body={catalogueCustomizeTemplate}></Column>
                        }
                       


                    </DataTable>
                </div>
            </div>
        </>
    )
}

export default MasterModuleList;
