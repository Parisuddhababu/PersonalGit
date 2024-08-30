import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/saga-blue/theme.css";

import _ from "lodash";
import { API } from "src/services/Api";
import CIcon from "@coreui/icons-react";
import { Column } from "primereact/column";
import { useHistory } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";
import { CBadge, CButton } from "@coreui/react";
import { DataTable } from "primereact/datatable";
import { Paginator } from "primereact/paginator";
import { InputText } from "primereact/inputtext";
import React, { useState, useEffect } from "react";
import { cilList, cilPencil, cilTrash, cilPlus } from "@coreui/icons";

import { useToast } from "src/shared/toaster/Toaster";
import * as  Constant from "src/shared/constant/constant";
import { isEmpty } from "src/shared/handler/common-handler";
import Loader from "src/views/components/common/loader/loader";
import { Permission, CommonMaster } from "src/shared/enum/enum";
import permissionHandler from "src/shared/handler/permission-handler";
import DeleteModal from "src/views/components/common/DeleteModalPopup/delete-modal";

const HomePageConfigurations = () => {
    const primaryHcpId = localStorage.getItem("account_id");
    const { showSuccess } = useToast(), history = useHistory();
    const initialFilters = { start: 0, length: Constant.DT_ROW };
    const adminRole = JSON.parse(localStorage.getItem("user_details"))?.role?.code;

    const [title, setTitle] = useState('');
    const [hcpList, setHcpList] = useState([]);
    const [configList, setConfigList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [deleteObj, setDeleteObj] = useState(null);
    const [totalRecords, setTotalRecords] = useState(0);
    const [filteredKeys, setFilteredKeys] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [searchParams, setSearchParams] = useState({ ...initialFilters });
    const [hcp, setHcp] = useState(adminRole !== "SUPER_ADMIN" ? primaryHcpId : '');

    const filterMap = { title, hcp };

    useEffect(() => {
        if (adminRole === "SUPER_ADMIN") getHcpList();
    }, []);

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

    const getHcpList = () => {
        API.getAccountDataByLoginId(getHcpListResponseObj, null, true);
    }

    const getHcpListResponseObj = {
        cancel: () => { },
        success: response => {
            let _hcpList = [];
            if (response?.meta?.status && response?.data?.length) _hcpList = [...response.data];
            setHcpList([..._hcpList]);
        },
        error: err => {
            console.log(err);
        },
        complete: () => { },
    }

    const getConfigList = data => {
        setIsLoading(true);
        API.getMasterList(handleConfigListResponseObj, data, true, Constant.HOME_PAGE_CONFIG_LIST);
    }

    const handleConfigListResponseObj = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            if (response?.meta?.status) {
                setConfigList(response?.data?.original?.data ?? []);
                setTotalRecords(response?.data?.original?.recordsTotal ?? 0);
            }
        },
        error: err => {
            console.log(err);
            setIsLoading(false);
            setConfigList([]);
            setTotalRecords(0);
        },
        complete: () => { },
    }

    const confirmDeleteUser = data => {
        let obj = { ...data }
        obj.urlName = CommonMaster.HOME_PAGE_CONFIG;
        obj.name = data.title;

        setDeleteObj(obj);
        setShowDeleteModal(true);
    }

    const handleCloseDeleteConfirmation = (value, isDelete, message) => {
        setShowDeleteModal(value);
        setDeleteObj(null);

        if (isDelete) {
            showSuccess(message);
            const filters = { ...searchParams };
            if (configList.length === 1 && searchParams.start > 0) {
                filters.start -= filters.length;
                setSearchParams({ ...searchParams, start: filters.start });
            }

            applyFilters(filters);
        }
    }

    const moveToActionPage = key => {
        const startUrl = "/home-page-configurations/";
        const endUrl = key === "add" ? key : `edit/?id=${key}`;
        const url = startUrl + endUrl;
        history.push(url);
    }

    const hcpListTemplate = option => {
        return <>{`${option?.company_name ?? ''} (${option?.code ?? ''})`}</>;
    }

    const headerTemplate = (
        <div className="table-header">
            <div className="clearfix">
                <h5 className="p-m-0 float-start">
                    <CIcon icon={cilList} className="mr-1" />
                    {CommonMaster.HOME_PAGE_CONFIG}
                    <CBadge color="danger" className="ms-auto">{totalRecords}</CBadge>
                </h5>

                <div className="foat-end">
                    <div className="common-add-btn">
                        {
                            permissionHandler(Permission.HOME_PAGE_CONFIG_CREATE) && (
                                <div className="float-end">
                                    <div className="common-add-btn">
                                        <CButton color="primary" onClick={() => { moveToActionPage("add"); }}>{/* NOSONAR */}
                                            <CIcon icon={cilPlus} className="mr-1" />
                                            Add {CommonMaster.HOME_PAGE_CONFIG}
                                        </CButton>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>

            <hr />
            <form name="filterFrm" onSubmit={e => { e.preventDefault(); applyFilters(); }}>
                <div className="row">
                    {
                        adminRole === "SUPER_ADMIN" && (
                            <div className="col-md-4 mb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <Dropdown
                                        filter
                                        name="hcp"
                                        value={hcp}
                                        optionValue="_id"
                                        options={hcpList}
                                        className="form-control"
                                        optionLabel="company_name"
                                        filterBy="company_name,code"
                                        itemTemplate={hcpListTemplate} // NOSONAR
                                        valueTemplate={hcpListTemplate} // NOSONAR
                                        onChange={e => { setHcp(e.target.value); }} // NOSONAR
                                    />
                                    <label>HCP</label>
                                </span>
                            </div>
                        )
                    }

                    <div className="col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <InputText
                                name="title"
                                value={title}
                                className="form-control"
                                onChange={e => { setTitle(e.target.value); }} // NOSONAR
                            />
                            <label>Title</label>
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

    const titleTemplate = rowData => {
        return (
            <>
                <span className="p-column-title">Title</span>
                {rowData?.title ?? Constant.NO_VALUE}
            </>
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

    const actionBodyTemplate = rowData => {
        return (
            <>
                <span className="p-column-title">Action</span>
                {
                    permissionHandler(Permission.HOME_PAGE_CONFIG_UPDATE) && (
                        <a title="Edit" className="mr-2" onClick={() => { moveToActionPage(rowData._id); }}>
                            <CIcon icon={cilPencil} size="lg" />
                        </a>
                    )
                }

                {
                    permissionHandler(Permission.HOME_PAGE_CONFIG_DELETE) && (
                        <button
                            title="Delete"
                            className="btn btn-link mr-2 text-danger"
                            onClick={() => { confirmDeleteUser(rowData); }}
                        >
                            <CIcon icon={cilTrash} size="lg" />
                        </button>
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
            if (filterKey === "hcp" && value) {
                data["account_id"] = value;
                _filteredKeys.push(filterKey);
            } else if (!isEmpty(value)) {
                data[filterKey] = value;
                _filteredKeys.push(filterKey);
            }
        }

        if (!filters) {
            data["start"] = 0;
            setSearchParams({ ...searchParams, start: 0 });
        }

        setFilteredKeys([..._filteredKeys]);
        getConfigList(data);
    }

    function resetParams() {
        setTitle('');
        setHcp(adminRole !== "SUPER_ADMIN" ? primaryHcpId : '');

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
                        value={configList}
                        header={headerTemplate}
                        responsiveLayout="scroll"
                        sortField={searchParams.sort_field}
                        sortOrder={searchParams.sort_order}
                        className="p-datatable-responsive-demo"
                        footer={configList?.length > 0 ? footerTemplate : <></>}
                    >
                        {<Column field="title" header="Title" body={titleTemplate} /> /* NOSONAR */}
                        {adminRole === "SUPER_ADMIN" && <Column field="account" header="HCP" body={hcpBodyTemplate} /> /* NOSONAR */}
                        {<Column field="_id" header="View" body={actionBodyTemplate} />  /* NOSONAR */}
                    </DataTable>
                </div>
            </div>

            <DeleteModal
                deleteObj={deleteObj}
                visible={showDeleteModal}
                name={CommonMaster.HOME_PAGE_CONFIG}
                onCloseDeleteModal={handleCloseDeleteConfirmation} // NOSONAR
            />
        </>
    )
}

export default HomePageConfigurations;
