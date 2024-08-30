import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/saga-blue/theme.css";

import _ from "lodash";
import CIcon from "@coreui/icons-react";
import { CButton } from "@coreui/react";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Paginator } from "primereact/paginator";
import { InputText } from "primereact/inputtext";
import React, { useState, useEffect } from "react";
import { cilCheckCircle, cilPencil, cilTrash, cilXCircle } from "@coreui/icons";

import { API } from "src/services/Api";
import { useToast } from "src/shared/toaster/Toaster";
import * as  Constant from "src/shared/constant/constant";
import { isEmpty } from "src/shared/handler/common-handler";
import Loader from "src/views/components/common/loader/loader";
import DeleteModal from "src/views/components/common/DeleteModalPopup/delete-modal";
import { CommonMaster } from "src/shared/enum/enum";

const SubAdminList = ({ hcpId, changeSection, updateTotalRecords }) => {
    const statusOptions = Constant.STATUS_OPTION;
    const { showSuccess, showError } = useToast();
    const initialFilters = {
        start: 0,
        email: '',
        lastName: '',
        isActive: '',
        firstName: '',
        length: Constant.DT_ROW,
    };

    const [deleteObj, setDeleteObj] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [subAdminList, setSubAdminList] = useState([]);
    const [filteredKeys, setFilteredKeys] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [searchParams, setSearchParams] = useState({ ...initialFilters });

    const filterMap = {
        email: searchParams.email,
        lastName: searchParams.lastName,
        isActive: searchParams.isActive,
        firstName: searchParams.firstName,
    };

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

    const getSubAdminList = data => {
        setIsLoading(true);
        API.getMasterList(handleSubAdminListResponseObj, data, true, Constant.SUB_ADMIN_LIST);
    }

    const handleSubAdminListResponseObj = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            if (response?.meta?.status) {
                const _subAdminList = response?.data?.original?.data?.map(subAdmin => {
                    return {
                        id: subAdmin?._id ?? '',
                        email: subAdmin?.email ?? '',
                        lastName: subAdmin?.last_name ?? '',
                        firstName: subAdmin?.first_name ?? '',
                        isActive: Boolean(subAdmin?.is_active ?? 0),
                    };
                }) ?? [];

                setSubAdminList([..._subAdminList]);
                updateTotalRecords(_subAdminList?.length ?? 0);
            }
        },
        error: err => {
            console.log(err);
            setSubAdminList([]);
            setIsLoading(false);
            updateTotalRecords(0);
        },
        complete: () => { },
    }

    const changeSubAdminStatus = data => {
        const { id, isActive } = data;
        if (id) {
            setIsLoading(true);
            const payload = { uuid: id, is_active: isActive ? 0 : 1 };
            API.UpdateStatus(handleChangeSubAdminStatusResponseObj, payload, true, id, Constant.SUB_ADMIN_STATUS_CHANGE);
        }
    }

    const handleChangeSubAdminStatusResponseObj = {
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

    const handleSubAdminSearchParamChange = e => {
        const { name, value } = e?.target;
        setSearchParams({ ...searchParams, [name]: value });
    }

    const handleSubAdminEdit = subAdminId => {
        changeSection("edit", { subAdminId });
    }

    const handleSubAdminDelete = subAdminObj => {
        const { id, firstName, lastName } = subAdminObj;
        const data = {
            _id: id,
            urlName: CommonMaster.SUB_ADMIN,
            name: `${firstName ?? ''} ${lastName ? (" " + lastName) : ''}`,
        };

        setDeleteObj(data);
        setShowDeleteModal(true);
    }

    const handleDeleteConfirmation = (value, isDeleted, message) => {
        setShowDeleteModal(value);
        if (isDeleted) {
            showSuccess(message);
            const filters = { ...searchParams };
            if (subAdminList.length === 1 && searchParams.start > 0) {
                filters.start -= filters.length;
                setSearchParams({ ...searchParams, start: filters.start });
            }

            applyFilters(filters);
        }
    }

    const subAdminHeaderTemplate = (
        <div className="table-header">
            <div name="filterFrm">
                <div className="row">
                    <div className="col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <InputText
                                name="firstName"
                                className="form-control"
                                value={searchParams.firstName}
                                onChange={handleSubAdminSearchParamChange} // NOSONAR
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
                                onChange={handleSubAdminSearchParamChange} // NOSONAR
                            />
                            <label>Last name</label>
                        </span>
                    </div>

                    <div className="col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <InputText
                                name="email"
                                className="form-control"
                                value={searchParams.email}
                                onChange={handleSubAdminSearchParamChange} // NOSONAR
                            />
                            <label>Email</label>
                        </span>
                    </div>

                    <div className="col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <Dropdown
                                name="isActive"
                                optionLabel="name"
                                options={statusOptions}
                                className="form-control"
                                value={searchParams.isActive}
                                onChange={handleSubAdminSearchParamChange} // NOSONAR
                            />
                            <label>Status</label>
                        </span>
                    </div>

                    <div className="col-md-12 col-lg-3 pb-3 search-reset">
                        <CButton
                            type="button"
                            color="primary"
                            className="mr-2"
                            onClick={e => { e.preventDefault(); applyFilters(); }}
                        >
                            Search
                        </CButton>

                        <CButton color="danger" onClick={resetParams}>Reset</CButton>
                    </div>
                </div>
            </div>
        </div>
    );

    const firstNameBodyTemplate = rowData => {
        return (
            <>
                <span className="p-column-title">First name</span>
                {rowData?.firstName ?? Constant.NO_VALUE}
            </>
        );
    }

    const lastNameBodyTemplate = rowData => {
        return (
            <>
                <span className="p-column-title">Last name</span>
                {rowData?.lastName ?? Constant.NO_VALUE}
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

    const subAdminStatusTemplate = rowData => {
        const styling = rowData?.isActive ? "text-success" : "text-danger";
        const iconStyle = rowData?.isActive ? cilCheckCircle : cilXCircle;

        return (
            <button
                type="button"
                title="Change Status"
                className={`btn btn-link ${styling}`}
                onClick={() => { changeSubAdminStatus(rowData); }}
            >
                <CIcon icon={iconStyle} size="lg" />
            </button>
        );
    }


    const actionBodyTemplate = rowData => {
        return (
            <>
                <span className="p-column-title">Action</span>
                <a title="Edit" className="mr-2" onClick={() => { handleSubAdminEdit(rowData.id); }}>
                    <CIcon icon={cilPencil} size="lg" />
                </a>

                <button
                    type="button"
                    title="Delete"
                    className="btn btn-link mr-2 text-danger"
                    onClick={() => { handleSubAdminDelete(rowData); }}
                >
                    <CIcon icon={cilTrash} size="lg" />
                </button>
            </>
        );
    }

    const applyFilters = filters => {
        const { start, length } = searchParams;
        let data = { start, length }, _filteredKeys = [];

        const appliedFilters = !_.isEmpty(filters) ? filters : filterMap;

        for (const filterKey in appliedFilters) {
            const value = appliedFilters[filterKey];
            if (filterKey === "firstName" && value) {
                data["first_name"] = value;
                _filteredKeys.push(filterKey);
            } else if (filterKey === "lastName" && value) {
                data["last_name"] = value;
                _filteredKeys.push(filterKey);
            } else if (filterKey === "isActive" && value) {
                data["is_active"] = value.code;
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

        data["account_id"] = hcpId;
        setFilteredKeys([..._filteredKeys]);
        getSubAdminList(data);
    }

    function resetParams() {
        const newParams = { ...searchParams, firstName: '', lastName: '', email: '', isActive: '' };
        setSearchParams({ ...newParams });
        applyFilters(newParams);
    }

    const handleSubAdminPageChange = e => {
        setSearchParams({ ...searchParams, start: e.first, length: e.rows });
    }

    return (
        <>
            {isLoading && <Loader />}

            <div className="datatable-responsive-demo custom-react-table">
                <div className="card">
                    <DataTable
                        stripedRows
                        showGridlines
                        value={subAdminList}
                        responsiveLayout="scroll"
                        header={subAdminHeaderTemplate}
                        sortField={searchParams.sort_field}
                        sortOrder={searchParams.sort_order}
                        className="p-datatable-responsive-demo"
                    >
                        {<Column field="firstName" header="First name" body={firstNameBodyTemplate} /> /* NOSONAR */}
                        {<Column field="lastName" header="Last name" body={lastNameBodyTemplate} /> /* NOSONAR */}
                        {<Column field="email" header="Email" body={emailBodyTemplate} /> /* NOSONAR */}
                        {<Column field="isActive" header="Status" body={subAdminStatusTemplate} /> /* NOSONAR */}
                        {<Column field="action" header="Action" body={actionBodyTemplate} /> /* NOSONAR */}
                    </DataTable>
                </div>
            </div>

            <DeleteModal
                name="Sub Admin"
                deleteObj={deleteObj}
                visible={showDeleteModal}
                onCloseDeleteModal={handleDeleteConfirmation}
            />
        </>
    );
};

export default SubAdminList;
