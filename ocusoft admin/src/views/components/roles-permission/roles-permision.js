// eslint-disable-next-line
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import CIcon from '@coreui/icons-react';
import { CBadge, CButton } from '@coreui/react'
import DeleteModal from '../common/DeleteModalPopup/delete-modal'
import { API } from '../../../services/Api';
import { Dropdown } from 'primereact/dropdown';
import * as  Constant from "../../../shared/constant/constant"
import Loader from "../common/loader/loader"
import { useToast } from '../../../shared/toaster/Toaster';
import PermissionModal from './permission-modal';
import { cilCheckCircle, cilList, cilLockLocked, cilPencil, cilPlus, cilTrash, cilXCircle } from '@coreui/icons';
import { CommonMaster } from 'src/shared/enum/enum';
import { useHistory } from "react-router-dom";
import { Paginator } from 'primereact/paginator';
import { isEmpty } from 'src/shared/handler/common-handler';

const RolePermissionList = () => {
    const initialFilter = {
        start: 0,
        length: Constant.DT_ROW,
        sort_order : '',
        sort_field : ''
    }
    const [isDeleteModalShow, setIsDeleteModalShow] = useState(false)
    const [searchVal, setSearchVal] = useState(initialFilter);
    const [deleteObj, setDeleteObj] = useState({})
    const [roleData, setRoleData] = useState([])
    const [selectedStatus, setSelectedStatus] = useState('')
    const [selectedTitle, setSelectedTitle] = useState('')
    const [isPermissionShow, setIsPermissionShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [totalRecords, setTotalRecords] = useState(initialFilter.length)
    const [roleObj, setRoleObj] = useState({});
    const history = useHistory();
    const [filteredKeys, setFilteredKeys] = useState([]);

    const { showError, showSuccess } = useToast();

    const statusOption = Constant.STATUS_OPTION;

    const filterMap = {
        name: selectedTitle,
        is_active: selectedStatus.code,
    };

    useEffect(() => {
        if(searchVal) {
            const filters = {};

            if (filteredKeys.length) {
                filteredKeys.forEach(filterKey => {
                    filters[filterKey] = filterMap[filterKey];
                });
            }

            onFilterData(filters);
        }
    }, [searchVal])

    const getRoleData = (data) => {
        setIsLoading(true)
        API.getMasterList(onRoleList, data, true, Constant.ROLE_LIST);
    }

    // onRoleList Response Data Method
    const onRoleList = {
        cancel: (c) => {
        },
        success: (response) => {
            setIsLoading(false)
            if (response.meta.status_code === 200) {
                const resData = response.data;
                setRoleData(resData?.original.data)
                setTotalRecords(resData?.original.recordsTotal)
            }
        },
        error: (error) => {
            setIsLoading(false)
        },
        complete: () => {
        },
    }

    const editData = (rowData) => {
        history.push(`/roles-permission/edit/?id=${rowData._id}`)
    }

    const onStatusChange = (e) => {
        setSelectedStatus(e.value);
    }

    const onChangeTitle = (e) => {
        setSelectedTitle(e.target.value)
    }

    const confirmDeleteRole = (data) => {
        let obj = { ...data }
        obj.urlName = CommonMaster.ROLE_PERMISSION
        obj.name = data.name
        setDeleteObj(obj)
        setIsDeleteModalShow(true)
    }

    const changePermission = (data) => {
        setRoleObj(data);
        setIsPermissionShow(true)
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Action</span>
                <a title="Edit" className="mr-2" onClick={() => editData(rowData)}><CIcon icon={cilPencil} size="lg" /></a>
                <button className="btn btn-link mr-2 text-danger" title="Delete" onClick={() => confirmDeleteRole(rowData)}><CIcon icon={cilTrash} size="lg" /></button>
                <a title="Assign Permission" className="mr-2" onClick={() => changePermission(rowData)}><CIcon icon={cilLockLocked} size="lg" /></a>
            </React.Fragment>
        );
    }

    const onUpdateStatus = (rowData) => {
        let obj = {
            "uuid": rowData._id,
            "is_active": parseInt(rowData.is_active) === Constant.StatusEnum.active ? Constant.StatusEnum.inactive : Constant.StatusEnum.active
        }
        setIsLoading(true)
        API.UpdateStatus(onUpdateStatusRes, obj, true, rowData._id, Constant.ROLE_STATUS);
    }

    const onUpdateStatusRes = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);

            if (response?.meta?.status) {
                if (response?.meta?.message) showSuccess(response.meta.message);
                const { uuid } = response?.data ?? {};

                if (uuid) {
                    let _roleData = roleData;
                    const roleIndex = _roleData.findIndex(roleObj => roleObj?._id === uuid);
                    _roleData[roleIndex]["is_active"] = _roleData[roleIndex]["is_active"] === 1 ? 0 : 1;
                    setRoleData([..._roleData]);
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
    };

    const header = (
        <div className="table-header">
            <div className="clearfix">
                <h5 className="p-m-0 float-start"><CIcon icon={cilList} className="mr-1" /> {CommonMaster.ROLE_PERMISSION}  <CBadge color="danger" className="ms-auto">{totalRecords}</CBadge></h5>
                <div className="float-end">
                    <div className="common-add-btn">
                        <CButton color="primary" onClick={() => { history.push(`/roles-permission/add`) }}><CIcon icon={cilPlus} className="mr-1" />Add Role</CButton>
                    </div>
                </div>
            </div>
            <hr />
            <form name='filterFrm' onSubmit={(e) => setGlobalFilter(e)}>
                <div className="row">
                    <div className="col-md-6 col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <InputText className="form-control" value={selectedTitle} name="name" onChange={(e) => onChangeTitle(e)} />
                            <label>Name </label>
                        </span>
                    </div>
                    <div className="col-md-6 col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <Dropdown className="form-control" value={selectedStatus} options={statusOption} onChange={onStatusChange} optionLabel="name" />
                            <label>Status </label>
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

    const statusBodyTemplate = (rowData) => {
        if (parseInt(rowData?.is_active) === Constant.StatusEnum.active) {
            return (
                <React.Fragment>
                    <span className="p-column-title">Status</span>
                    <button className="btn btn-link text-success" title="Change Status" onClick={() => onUpdateStatus(rowData)}><CIcon icon={cilCheckCircle} size="lg" /></button>
                </React.Fragment>)
        } else {
            return (
                <React.Fragment>
                    <span className="p-column-title">Status</span>
                    <button className="btn btn-link text-danger" title="Change Status" onClick={() => onUpdateStatus(rowData)}><CIcon icon={cilXCircle} size="lg" /></button>
                </React.Fragment>)
        }
    }

    const nameBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </React.Fragment>
        )
    }
    const codeBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Code</span>
                {rowData.code}
            </React.Fragment>
        );
    }

    const onCloseDeleteConfirmation = (value, isDelete, message) => {
        setIsDeleteModalShow(value)
        if (isDelete) {
            showSuccess(message)
            // Only one record on second page and delete then it should be come to previous page in all modules
            if(roleData.length === 1 && searchVal.start){
                setSearchVal({...searchVal, start : parseInt(searchVal.start) - parseInt(searchVal.length)});
            }else{
                onFilterData()
            }
        }
    }

    const setGlobalFilter = (e) => {
        e.preventDefault();
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
        getRoleData(data);
    }

    const resetGlobalFilter = () => {
        setSelectedStatus('')
        setSelectedTitle('')
        setSearchVal(initialFilter)
    }

    const onClosePermissionModal = () => {
        setRoleObj({});
        setIsPermissionShow(false)
    }

    const onPageChange = (e) => {
        // first: 0
        // page: 0
        // pageCount: 0
        // rows: total
        setSearchVal({...searchVal, length : e.rows})
        if(searchVal.start !== e.first){
            setSearchVal({...searchVal, start : e.first})
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

        if(e.sortField){
            setSearchVal({...searchVal, sort_field : e.sortField, sort_order: e.sortOrder})
        }
    }

    return (
        <>
            {isLoading && <Loader />}

            <div className="datatable-responsive-demo custom-react-table">
                <div className="card">
                    <DataTable value={roleData} stripedRows className="p-datatable-responsive-demo" header={header} footer={roleData?.length > 0 ? footer : ''} showGridlines responsiveLayout="scroll"
                    sortField={searchVal.sort_field} sortOrder={searchVal.sort_order} onSort={(e) => onSort(e) }
                    >
                        <Column field="name" header="Name" sortable body={nameBodyTemplate}></Column>
                        <Column field="code" header="Code" sortable body={codeBodyTemplate} ></Column>
                        <Column field="is_active" header="Status" sortable body={statusBodyTemplate}></Column>
                        <Column field="action" header="Action" body={actionBodyTemplate} ></Column>
                    </DataTable>
                </div>
            </div>
            <DeleteModal visible={isDeleteModalShow} onCloseDeleteModal={onCloseDeleteConfirmation} deleteObj={deleteObj} name="Roles and Permission" />
            {isPermissionShow && <PermissionModal visible={isPermissionShow} onClosePermissionModal={onClosePermissionModal} roleObj={roleObj} />}
        </>
    )
}

export default RolePermissionList
