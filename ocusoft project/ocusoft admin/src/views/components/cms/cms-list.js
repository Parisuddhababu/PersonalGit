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
import * as  Constant from "../../../shared/constant/constant"
import Loader from "../common/loader/loader"
import { useToast } from '../../../shared/toaster/Toaster';
import { useHistory } from "react-router-dom";
import { cilList, cilPencil, cilTrash } from '@coreui/icons';
import { CommonMaster, Permission } from 'src/shared/enum/enum';
import { isEmpty } from 'src/shared/handler/common-handler';
import { Paginator } from 'primereact/paginator';
import permissionHandler from 'src/shared/handler/permission-handler';
import CommonHcpInput from 'src/shared/common/common-hcp-input';

const CMSList = () => {
    let history = useHistory();

    const primaryAccountId = localStorage.getItem("account_id");
    const [isDeleteModalShow, setIsDeleteModalShow] = useState(false)
    const adminRole = JSON.parse(localStorage.getItem('user_details'))?.role?.code;
    const initialFilter = {
        start: 0,
        length: Constant.DT_ROW,
        sort_order: '',
        sort_field: '',
    }

    const [searchVal, setSearchVal] = useState(initialFilter)
    const [deleteObj, setDeleteObj] = useState({})
    const [cmsData, setCmsData] = useState([])
    const [, setSelectedStatus] = useState('')
    const [selectedTitle, setSelectedTitle] = useState('');
    const [selectedAccount, setSelectedAccount] = useState(adminRole !== "SUPER_ADMIN" ? primaryAccountId : '');
    const [isLoading, setIsLoading] = useState(false)
    const { showSuccess } = useToast();
    const [totalRecords, setTotalRecords] = useState(0);
    const [filteredKeys, setFilteredKeys] = useState([]);

    const filterMap = { title: selectedTitle };

    useEffect(() => {
        if (searchVal) {
            const filters = {};

            if (filteredKeys.length) {
                filteredKeys.forEach(filterKey => {
                    filters[filterKey] = filterMap[filterKey];
                });
            }

            handleCmsListFilterData(filters);
        }
    }, [searchVal])

    const getCmsData = (formData) => {
        setIsLoading(true)

        API.getMasterList(onCmsList, formData, true, Constant.GETCMS);
    }

    const onAccountChange = (e) => {
        setSelectedAccount(e.target.value)
    }
    // onCmsList Response Data Method
    const onCmsList = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            if (response.meta.status_code === 200) {
                setCmsData(response?.data?.original?.data ?? []);
                setTotalRecords(response?.data?.original?.recordsTotal ?? 0);
            }
        },
        error: err => {
            setIsLoading(false);
            console.log(err);
        },
        complete: () => { },
    }

    const editData = (rowData) => {
        history.push(`/cms/edit/?id=${rowData._id}`)
    }

    const addData = () => {
        history.push('/cms/add');
    }

    const onChangeTitle = (e) => {
        setSelectedTitle(e.target.value)
    }

    const confirmDeleteCMS = data => {
        let obj = { ...data };
        obj.urlName = CommonMaster.CMS;
        obj.name = data.page_title;
        setDeleteObj(obj);
        setIsDeleteModalShow(true);
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                {
                    permissionHandler(Permission.CMS_UPDATE) && (
                        <a title="Edit" className="mr-2" onClick={() => editData(rowData)}>
                            <CIcon icon={cilPencil} size="lg" />
                        </a>
                    )
                }

                {
                    <button
                        className="btn btn-link mr-2 text-danger"
                        title="Delete"
                        onClick={() => confirmDeleteCMS(rowData)}
                    >
                        <CIcon icon={cilTrash} size="lg" />
                    </button>
                }
            </React.Fragment>
        );
    }

    const header = (
        <div className="table-header">
            <div className="clearfix">
                <h5 className="p-m-0 float-start"><CIcon icon={cilList} className="mr-1" /> CMS <CBadge color="danger" className="ms-auto">{totalRecords}</CBadge></h5>

            </div>

            <hr />
            <form name='filterFrm' onSubmit={(e) => setGlobalFilter(e)}>
                <div className="row">
                    <CommonHcpInput hcpValue={selectedAccount} handleHcpChange={onAccountChange} />

                    <div className="col-md-6 col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <InputText className="form-control" value={selectedTitle} name="title" onChange={(e) => onChangeTitle(e)} />
                            <label>Title </label>

                        </span>
                    </div>

                    <div className="col-md-6 col-lg-3 pb-3 search-reset">
                        <CButton color="primary" type='submit' className="mr-2" >Search</CButton>
                        <CButton color="danger" onClick={() => resetGlobalFilter()} >Reset</CButton>
                    </div>

                    <div className='col-md-6 col-lg-3 pb-3'>
                        <CButton color='primary' style={{ float: 'right' }} onClick={() => addData()}>Add CMS</CButton>
                    </div>
                </div>
            </form>
        </div>
    );

    const titleBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Title</span>
                {rowData.page_title}
            </React.Fragment>
        )
    }

    const onCloseDeleteConfirmation = (value, isDelete, message) => {
        setIsDeleteModalShow(value)
        if (isDelete) {
            showSuccess(message)
            const filters = { ...searchVal };
            if (cmsData.length === 1 && searchVal.start > 0) {
                filters.start -= filters.length;
                setSearchVal({ ...searchVal, start: filters.start });
            }

            handleCmsListFilterData(filters);
        }
    }

    const setGlobalFilter = (event) => {
        event.preventDefault()
        handleCmsListFilterData()

    }

    const handleCmsListFilterData = filters => {
        const { start, length, sort_field, sort_order } = searchVal;
        const data = { start, length }, _filteredKeys = [];

        if (sort_field) data["sort_param"] = sort_field;
        if (sort_order) data["sort_type"] = sort_order === 1 ? "asc" : "desc";
        const appliedFilters = filters ?? filterMap;

        for (const filterKey in appliedFilters) {
            const value = appliedFilters[filterKey];
            if (!isEmpty(value)) {
                data[filterKey] = value;
                _filteredKeys.push(filterKey);
            }
        }

        if (!filters) {
            data["start"] = 0;
            setSearchVal({ ...searchVal, start: 0 });
        }

        if (selectedAccount) data["account_id"] = selectedAccount;

        setFilteredKeys([..._filteredKeys]);
        getCmsData(data);
    }

    const resetGlobalFilter = () => {
        setSelectedStatus('')
        setSelectedTitle('')
        setSelectedAccount(adminRole !== "SUPER_ADMIN" ? localStorage.getItem('account_id') : '');
        setSearchVal(initialFilter)
    }

    const onPageChange = e => {
        setSearchVal({ ...searchVal, start: e.first, length: e.rows });
    }

    const footerTemplate = (
        <div className='table-footer'>
            <Paginator
                template={Constant.DT_PAGE_TEMPLATE}
                currentPageReportTemplate={Constant.DT_PAGE_REPORT_TEMP}
                first={searchVal.start}
                rows={searchVal.length}
                totalRecords={totalRecords}
                rowsPerPageOptions={Constant.DT_ROWS_LIST}
                onPageChange={onPageChange}
            />
        </div>
    );

    const onSort = e => {
        if (e.sortField) {
            setSearchVal({ ...searchVal, sort_field: e.sortField, sort_order: e.sortOrder })
        }
    }

    return (
        <>
            {isLoading && <Loader />}

            <div className="datatable-responsive-demo custom-react-table">
                <div className="card">
                    <DataTable
                        value={cmsData}
                        stripedRows
                        className="p-datatable-responsive-demo"
                        header={header}
                        footer={cmsData?.length > 0 ? footerTemplate : <></>}
                        showGridlines
                        responsiveLayout="scroll"
                        sortField={searchVal.sort_field}
                        sortOrder={searchVal.sort_order}
                        onSort={e => onSort(e)}
                    >
                        <Column field="page_title" sortable header="Title" body={titleBodyTemplate} />
                        <Column field="action" header="Action" style={{ width: '100px' }} body={actionBodyTemplate} />
                    </DataTable>
                </div>
            </div>

            <DeleteModal
                visible={isDeleteModalShow}
                onCloseDeleteModal={onCloseDeleteConfirmation}
                deleteObj={deleteObj}
                name="cms"
            />
        </>
    )
}

export default CMSList
