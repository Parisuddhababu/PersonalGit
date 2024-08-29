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

import { cilCheckCircle, cilList, cilPencil, cilXCircle } from '@coreui/icons';
import { Permission } from 'src/shared/enum/enum';
import { Paginator } from 'primereact/paginator';
import { useHistory } from "react-router-dom";
import permissionHandler from 'src/shared/handler/permission-handler';
import { isEmpty } from 'src/shared/handler/common-handler';

const SystemEmailList = () => {
    let history = useHistory();

    const [isDeleteModalShow, setIsDeleteModalShow] = useState(false)
    const initialFilter = {
        start: 0,
        length: Constant.DT_ROW,
        sort_order: '',
        sort_field: '',
    }

    const [searchVal, setSearchVal] = useState(initialFilter)
    const [deleteObj] = useState({})
    const [systemEmailData, setSystemEmailData] = useState([])
    const [selectedStatus, setSelectedStatus] = useState('')
    const [selectedSubject, setSelectedSubject] = useState('')
    const [, setSelectedTemplateType] = useState("")
    const [, setSelectedAccount] = useState(localStorage.getItem('account_id'))
    const [accountData, setAccountData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const { showError, showSuccess } = useToast();
    const [totalRecords, setTotalRecords] = useState(0);
    const [filteredKeys, setFilteredKeys] = useState([]);

    const statusOption = Constant.STATUS_OPTION;

    const filterMap = {
        subject: selectedSubject,
        is_active: selectedStatus.code,
    };

    useEffect(() => {
        getAccountData()
    }, [])

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
    }, [searchVal])

    useEffect(() => {
        setSelectedAccount(localStorage.getItem('account_id'))
    }, [accountData])

    const getSystemEmailData = (formData) => {
        setIsLoading(true)
        API.getMasterList(onFaqList, formData, true, Constant.GETSYSTEMEMAILS);
    }

    // onFaqList Response Data Method
    const onFaqList = {
        cancel: (c) => {
        },
        success: (response) => {
            if (response.meta.status_code === 200) {
                setSystemEmailData(response?.data?.original?.data)
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

    const editData = (rowData) => {
        history.push(`/system-email/edit/?id=${rowData._id}`)
    }

    const onStatusChange = (e) => {
        setSelectedStatus(e.value);
    }

    const onChangeSubject = (e) => {
        setSelectedSubject(e.target.value)
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Action</span>
                <a title="Edit" className="mr-2" onClick={() => editData(rowData)}><CIcon icon={cilPencil} size="lg" /></a>
            </React.Fragment>
        );
    }

    const onUpdateStatus = (rowData) => {
        let obj = {
            "id": rowData._id,
            "is_active": rowData.is_active === Constant.StatusEnum.active ? Constant.StatusEnum.inactive : Constant.StatusEnum.active
        }
        setIsLoading(true)

        API.UpdateStatus(onUpdateStatusRes, obj, true, rowData._id, Constant.UPDATESYSTEMEMAILSSTATUS);

    }

    const onUpdateStatusRes = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);

            if (response?.meta?.status) {
                if (response?.meta?.message) showSuccess(response.meta.message);
                const { uuid } = response?.data ?? {};

                if (uuid) {
                    let _systemEmailData = systemEmailData;
                    const systemIndex = _systemEmailData.findIndex(systemObj => systemObj?._id === uuid);
                    _systemEmailData[systemIndex]["is_active"] = _systemEmailData[systemIndex]["is_active"] === 1 ? 0 : 1;
                    setSystemEmailData([..._systemEmailData]);
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
                <h5 className="p-m-0 float-start"><CIcon icon={cilList} className="mr-1" /> System Email <CBadge color="danger" className="ms-auto">{totalRecords}</CBadge></h5>

            </div>

            <hr />
            <form name='filterFrm' onSubmit={(e) => setGlobalFilter(e)}>

                <div className="row">
                    <div className="col-md-6 col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <InputText className="form-control" value={selectedSubject} name="email_subject" onChange={(e) => onChangeSubject(e)} />
                            <label>Email Subject </label>

                        </span>
                    </div>

                    <div className="col-md-6 col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <Dropdown className="form-control" value={selectedStatus} options={statusOption} onChange={onStatusChange} optionLabel="name" />
                            <label>Status </label>

                        </span>
                    </div>
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

    const subjectBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Title</span>
                {rowData.email_subject}
            </React.Fragment>
        )
    }

    const purposeBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">CreatedAt</span>
                {rowData.template_purpose ? rowData.template_purpose : "-"}

            </React.Fragment>
        )
    }

    const onCloseDeleteConfirmation = (value, isDelete, message) => {
        setIsDeleteModalShow(value)
        if (isDelete) {
            showSuccess(message)
            // Only one record on second page and delete then it should be come to previous page in all modules
            if (systemEmailData.length === 1 && searchVal.start) {
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

    const resetGlobalFilter = () => {
        setSelectedStatus('')
        setSelectedSubject('')
        setSelectedTemplateType('')
        setSelectedAccount(localStorage.getItem('account_id'))
        setSearchVal(initialFilter)
        // setGlobalFilter('', '', '', localStorage.getItem('account_id'))
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
        getSystemEmailData(data);
    }

    const onPageChange = (e) => {
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
        if (e.sortField) {
            setSearchVal({ ...searchVal, sort_field: e.sortField, sort_order: e.sortOrder })
        }
    }

    return (
        <>
            {isLoading && <Loader />}

            <div className="datatable-responsive-demo custom-react-table">
                <div className="card">
                    <DataTable value={systemEmailData} stripedRows className="p-datatable-responsive-demo" header={header} footer={systemEmailData?.length > 0 ? footer : ''} showGridlines responsiveLayout="scroll"
                        sortField={searchVal.sort_field} sortOrder={searchVal.sort_order} onSort={(e) => onSort(e)}
                    >
                        <Column field="email_subject" header="Email Subject" body={subjectBodyTemplate} style={{ width: '40%' }}></Column>
                        <Column field="template_purpose" header="Template Purpose" body={purposeBodyTemplate}></Column>
                        {permissionHandler(Permission.EMAIL_TEMP_STATUS) &&
                            <Column field="status" header="Status" body={statusBodyTemplate}></Column>
                        }
                        {permissionHandler(Permission.EMAIL_TEMP_UPDATE) &&
                            <Column field="action" header="Action" body={actionBodyTemplate} ></Column>
                        }

                    </DataTable>
                </div>
            </div>
            <DeleteModal visible={isDeleteModalShow} onCloseDeleteModal={onCloseDeleteConfirmation} deleteObj={deleteObj} name="System Email" />
        </>
    )
}

export default SystemEmailList
