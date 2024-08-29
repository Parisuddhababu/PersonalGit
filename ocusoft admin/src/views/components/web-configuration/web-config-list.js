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
import DeleteModal from '../common/DeleteModalPopup/delete-modal'
import { API } from '../../../services/Api';
import { Dropdown } from 'primereact/dropdown';
import * as  Constant from "../../../shared/constant/constant"
import Loader from "../common/loader/loader"
import { Paginator } from 'primereact/paginator';
import { useHistory } from "react-router-dom";

import { cilCheckCircle, cilList, cilPencil, cilPlus, cilTrash, cilXCircle } from '@coreui/icons';
import { CommonMaster } from 'src/shared/enum/enum';
import { useToast } from '../../../shared/toaster/Toaster';

const WebConfigList = () => {
    let history = useHistory();

    const accountVal = localStorage.getItem('is_main_account')
    const [isDeleteModalShow, setIsDeleteModalShow] = useState(false)
    const initialFilter = {
        start: 0,
        length: Constant.DT_ROW,
        sort_order: '',
        sort_field: '',
    }

    const [searchVal, setSearchVal] = useState(initialFilter)
    const [deleteObj, setDeleteObj] = useState({})
    const [webConfigData] = useState([])
    const [selectedStatus, setSelectedStatus] = useState('')
    const [, setSelectedTitle] = useState('')
    const [selectedAccount, setSelectedAccount] = useState(localStorage.getItem('account_id'))
    const [accountData, setAccountData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [, setformFieldData] = useState([]);
    const [selectFormField] = useState('')
    const [, setslugData] = useState([]);
    const [Slug, setSlug] = useState('')
    const { showError, showSuccess } = useToast();
    const [totalRecords] = useState(0)

    useEffect(() => {
        getAccountData()
        getFormFeild()
    }, [])
    useEffect(() => {
        // setMasterListData(props.data)
        if (searchVal) {
            onFilterData()
        }
    }, [searchVal])

    useEffect(() => {
        setSelectedAccount(localStorage.getItem('account_id'))
        getSlug()
    }, [accountData])

    const getWebConfigList = (formData) => {
        setIsLoading(true)

        API.getMasterList(onWebConfigList, formData, true, Constant.POPUP_LIST);
    }
    const getAccountData = () => {
        setIsLoading(true)

        API.getAccountDataByLoginId(accountRes, "", true)
    }

    // accountRes Response Data Method
    const accountRes = {
        cancel: (c) => {
        },
        success: (response) => {
            if (response.meta.status_code === 200) {
                let resVal = response.data
                setAccountData(resVal)
                setIsLoading(false)
            }
        },
        error: (error) => {
            setIsLoading(false)


        },
        complete: () => {
        },
    }

    const getFormFeild = () => {
        setIsLoading(true);
        API.getActiveDataList(Constant.POPUP_FIELD, getFormfieldRes, "", true)
    }

    const getFormfieldRes = {
        cancel: (c) => {
        },
        success: (response) => {
            setIsLoading(false)
            if (response.meta.status_code === 200) {
                setformFieldData(response.data)
            }
        },
        error: (error) => {
            setIsLoading(false)

        },
        complete: () => {
        },
    }

    const getSlug = () => {
        setIsLoading(true);
        API.getMasterDataById(getSlugRes, "", true, selectedAccount, Constant.SLUG);
    }

    const getSlugRes = {
        cancel: (c) => {
        },
        success: (response) => {
            setIsLoading(false)
            if (response.meta.status_code === 200) {
                setslugData(response.data)
            }
        },
        error: (error) => {
            setIsLoading(false)

        },
        complete: () => {
        },
    }


    const onAccountChange = (e) => {
        setSelectedAccount(e.target.value)
    }
    // onWebConfigList Response Data Method
    const onWebConfigList = {
        cancel: (c) => {
        },
        success: (response) => {
            if (response.meta.status_code === 200) {
                // setWebConfigData(response?.data?.original?.data)
                // setTotalRecords(response?.data?.original.recordsTotal)

                setIsLoading(false)
            }
        },
        error: (error) => {
            setIsLoading(false)


        },
        complete: () => {
        },
    }

    const editData = (rowData) => {
        history.push(`/popup/edit/?id=${rowData._id}`)
    }

    const confirmDeleteProduct = (data) => {
        let obj = { ...data }
        obj.urlName = CommonMaster.WEB_CONFIG
        setDeleteObj(obj)
        setIsDeleteModalShow(true)
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Action</span>
                {/* {permissionHandler(Permission.POPUP_MASTER_UPDATE) && ( */}
                <a title="Edit" className="mr-2" onClick={() => editData(rowData)}><CIcon icon={cilPencil} size="lg" /></a>
                {/* )} */}
                {/* {permissionHandler(Permission.POPUP_MASTER_DELETE) && ( */}
                <button className="btn btn-link mr-2 text-danger" title="Delete" onClick={() => confirmDeleteProduct(rowData)}><CIcon icon={cilTrash} size="lg" /></button>
                {/* )} */}

            </React.Fragment>
        );
    }

    const onUpdateStatus = (rowData) => {
        let obj = {
            "uuid": rowData._id,
            "is_active": rowData.is_active === Constant.StatusEnum.active ? Constant.StatusEnum.inactive : Constant.StatusEnum.active
        }
        setIsLoading(true)

        API.UpdateStatus(onUpdateStatusRes, obj, true, rowData._id, Constant.POPUP_STATUS);

    }

    // onUpdateStatusRes Response Data Method
    const onUpdateStatusRes = {
        cancel: (c) => {
        },
        success: (response) => {
            if (response.meta.status_code === 200) {
                showSuccess(response.meta.message)


                // getTestimonialData()
                onFilterData()
            }
        },
        error: (error) => {
            showError(error.meta.message)

            setIsLoading(false)

        },
        complete: () => {
        },
    }

    const header = (
        <div className="table-header">
            <div className="clearfix">
                <h5 className="p-m-0 float-start"><CIcon icon={cilList} className="mr-1" /> {CommonMaster.WEB_CONFIG} <CBadge color="danger" className="ms-auto">{totalRecords}</CBadge></h5>
                {/* {(permissionHandler(Permission.POPUP_MASTER_CREATE) && */}
                <div className="float-end">
                    <div className="common-add-btn">
                        <CButton color="primary" onClick={() => { history.push(`/web-config/add`) }}><CIcon icon={cilPlus} className="mr-1" />Add</CButton>
                    </div>
                </div>
                {/* )} */}
            </div>

            <hr />
            <form name='filterFrm' onSubmit={(e) => setGlobalFilter(e)}>

                <div className="row">

                    {accountVal !== '0' &&
                        <div className="col-md-6 col-lg-3 pb-3">
                            <span className="p-float-label custom-p-float-label">
                                <Dropdown value={selectedAccount} className="form-control" options={accountData} onChange={onAccountChange} optionLabel="name" optionValue="_id" />
                                <label>Account </label>

                            </span>
                        </div>
                    }


                    <div className="col-md-12 col-lg-3 pb-3 search-reset">
                        <CButton color="primary" className="mr-2" type='submit'>Search</CButton>
                        <CButton color="danger" onClick={() => resetGlobalFilter()} >Reset</CButton>
                    </div>
                </div>
            </form>
        </div>
    );

    const statusBodyTemplate = (rowData) => {
        if (rowData?.is_active === Constant.StatusEnum.active) {
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

    const onCloseDeleteConfirmation = (value, isDelete, message) => {
        setIsDeleteModalShow(value)
        if (isDelete) {
            showSuccess(message)
            // Only one record on second page and delete then it should be come to previous page in all modules
            if (webConfigData.length === 1 && searchVal.start) {
                setSearchVal({ ...searchVal, start: parseInt(searchVal.start) - parseInt(searchVal.length) });
            } else {
                onFilterData()
            }
        }
    }

    const setGlobalFilter = (event) => {
        event.preventDefault()
        onFilterData()
    }


    const onFilterData = () => {

        const finalData = Object.assign({
            start: searchVal.start,
            length: searchVal.length
        },
            searchVal.sort_field && { sort_param: searchVal.sort_field },
            searchVal.sort_order && { sort_type: searchVal.sort_order === 1 ? 'asc' : 'desc' },
            selectFormField && { 'form_field': selectFormField },
            selectedAccount && { 'account_id': selectedAccount },
            selectedStatus && { 'is_active': selectedStatus?.code },
            Slug && { 'slug_master_id': Slug },
        );

        getWebConfigList(finalData)
    }

    const resetGlobalFilter = () => {
        setSelectedStatus('')
        setSelectedTitle('')
        setSelectedAccount(localStorage.getItem('account_id'))
        setSlug('')
        setSearchVal(initialFilter)

        // setGlobalFilter('', '', '')
    }

    const onRowReorder = (e) => {
        let obj = { 'uuid': webConfigData[e.dragIndex]._id, 'newposition': e.dropIndex + 1, 'oldposition': e.dragIndex + 1 }
        setIsLoading(true)

        API.MoveData(moveStatusRes, obj, true, Constant.MOVETESTIMONIALS);
    }

    // moveStatusRes Response Data Method
    const moveStatusRes = {
        cancel: (c) => {
        },
        success: (response) => {
            if (response.meta.status_code === 200) {
                showSuccess(response.meta.message)

                onFilterData()
            }
        },
        error: (error) => {
            showError(error.meta.message)

            setIsLoading(false)

        },
        complete: () => {
        },
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
                    <DataTable
                        value={webConfigData}
                        stripedRows
                        className="p-datatable-responsive-demo"
                        header={header}
                        footer={webConfigData?.length > 0 ? footer : ''}
                        showGridlines
                        responsiveLayout="scroll"
                        reorderableColumns
                        onRowReorder={onRowReorder} // NOSONAR
                        sortField={searchVal.sort_field}
                        sortOrder={searchVal.sort_order}
                        onSort={onSort} // NOSONAR
                    >
                        <Column field="account" header="Account" ></Column>
                        <Column field="date" header="Date" ></Column>
                        {/* {permissionHandler(Permission.POPUP_MASTER_STATUS) && */}
                        <Column field="status" header="Status" body={statusBodyTemplate}></Column>
                        {/* } */}
                        {/* {(permissionHandler(Permission.POPUP_MASTER_UPDATE) || permissionHandler(Permission.POPUP_MASTER_DELETE)) && */}
                        <Column field="action" header="Action" body={actionBodyTemplate} ></Column>
                        {/* } */}

                    </DataTable>
                </div>
            </div>
            <DeleteModal visible={isDeleteModalShow} onCloseDeleteModal={onCloseDeleteConfirmation} deleteObj={deleteObj} name={CommonMaster.SLUG_MASTER} />

        </>
    )
}

export default WebConfigList
