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

import { cilCheckCircle, cilList, cilPencil, cilPlus, cilTrash, cilXCircle } from '@coreui/icons';
import { CommonMaster, Permission } from 'src/shared/enum/enum';
import { useToast } from '../../../shared/toaster/Toaster';
import { useHistory } from "react-router-dom";
import permissionHandler from 'src/shared/handler/permission-handler';

const NumberGeneratorList = () => {
    const primaryAccountId = localStorage.getItem("account_id");
    const accountVal = localStorage.getItem('is_main_account')
    const adminRole = JSON.parse(localStorage.getItem('user_details'))?.role?.code;
    const [isDeleteModalShow, setIsDeleteModalShow] = useState(false)
    let history = useHistory();

    const initialFilter = {
        start: 0,
        length: Constant.DT_ROW,
        sort_order: '',
        sort_field: '',
    }

    const [searchVal, setSearchVal] = useState(initialFilter)
    const [deleteObj, setDeleteObj] = useState({})
    const [numberGenerateData, setNumberGenerateData] = useState([])
    const [selectedAccount, setSelectedAccount] = useState(adminRole !== "SUPER_ADMIN" ? primaryAccountId : '');
    const [accountData, setAccountData] = useState([])
    const [deleteDataArr, setDeleteDataArr] = useState([])
    const [selectedNumberGenerate, setSelectedNumberGenerate] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const { showError, showSuccess } = useToast();
    const [totalRecords, setTotalRecords] = useState(0)
    const [typeList, setTypeList] = useState([])

    useEffect(() => {
        getAccountData()
    }, []);

    useEffect(() => {
        if (searchVal) {
            onFilterData()
        }
    }, [searchVal])

    const getAccountData = () => {
        if (adminRole === "SUPER_ADMIN") {
            setIsLoading(true);
            API.getMasterList(accountRes, null, true, Constant.ACCOUNT_LIST);
        }
    }

    // accountRes Response Data Method
    const accountRes = {
        cancel: (c) => {
        },
        success: (response) => {
            if (response?.data?.original?.data?.length > 0) {
                let resVal = response.data.original.data;
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

    const onAccountChange = (e) => {
        setSelectedAccount(e.target.value)
    }

    const getNumberGenerateData = (formData) => {
        setIsLoading(true)
        API.getMasterList(onNumberGenerateData, formData, true, Constant.NUMBER_GENERATOR_LIST);
    }

    // onNumberGenerateData Response Data Method
    const onNumberGenerateData = {
        cancel: (c) => {
        },
        success: (response) => {
            if (response.meta.status_code === 200) {
                const resData = response?.data?.original;
                setNumberGenerateData(resData?.data)
                setTotalRecords(resData.recordsTotal)
                setTypeList(resData.type_list);
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
        history.push(`/number-generator/edit/?id=${rowData._id}`)
    }

    const confirmDeleteNumberGenerator = (data) => {
        let obj = { ...data }
        obj.urlName = CommonMaster.NUMBER_GENERATOR
        setDeleteObj(obj)
        setIsDeleteModalShow(true)
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Action</span>
                {
                    permissionHandler(Permission.NUMBER_GENERATOR_UPDATE) &&
                    <a title="Edit" className="mr-2" onClick={() => editData(rowData)}><CIcon icon={cilPencil} size="lg" /></a>
                }
                {
                    permissionHandler(Permission.NUMBER_GENERATOR_DELETE) &&
                    <button className="btn btn-link mr-2 text-danger" title="Delete" onClick={() => confirmDeleteNumberGenerator(rowData)}><CIcon icon={cilTrash} size="lg" /></button>
                }
            </React.Fragment>
        );
    }

    const onUpdateStatus = (rowData) => {
        if (permissionHandler(Permission.NUMBER_GENERATOR_STATUS)) {
            let obj = {
                uuid: rowData._id,
                is_active: rowData.is_active === Constant.StatusEnum.active ? Constant.StatusEnum.inactive : Constant.StatusEnum.active
            };
            setIsLoading(true);
            API.UpdateStatus(onUpdateStatusRes, obj, true, rowData._id, Constant.NUMBER_GENERATOR_CHANGE_STATUS);
        }
    }

    const onUpdateStatusRes = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);

            if (response?.meta?.status) {
                if (response?.meta?.message) showSuccess(response.meta.message);
                const { uuid } = response?.data ?? {};

                if (uuid) {
                    let _numberGenerateData = numberGenerateData;
                    const numberIndex = _numberGenerateData.findIndex(numberObj => numberObj?._id === uuid);
                    _numberGenerateData[numberIndex]["is_active"] = _numberGenerateData[numberIndex]["is_active"] === 1 ? 0 : 1;
                    setNumberGenerateData([..._numberGenerateData]);
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

    const onDeleteAll = (event) => {
        setDeleteDataArr(selectedNumberGenerate)
        setIsDeleteModalShow(true)
    }

    const accountDataTemplate = option => {
        return (
            <>{`${option?.company_name ?? ''} (${option?.code ?? ''})`}</>
        )
    }

    const header = (
        <div className="table-header">
            <div className="clearfix table-header-content">
                <h5 className="p-m-0 float-start"><CIcon icon={cilList} className="mr-1" /> Number Generator <CBadge color="danger" className="ms-auto">{totalRecords}</CBadge></h5>
                <div className="float-end">
                    <div className="common-add-btn">
                        {
                            permissionHandler(Permission.NUMBER_GENERATOR_CREATE) &&
                            <CButton color="primary" onClick={() => { history.push(`/number-generator/add`) }}><CIcon icon={cilPlus} className="mr-1" />Add Number Generator</CButton>
                        }
                        {
                            permissionHandler(Permission.NUMBER_GENERATOR_DELETE) && (
                                <CButton
                                    color="primary"
                                    onClick={onDeleteAll}
                                    className="master-delete btn-danger"
                                    disabled={!selectedNumberGenerate?.length}
                                >
                                    <CIcon icon={cilTrash} className="mr-1" />
                                    {
                                        selectedNumberGenerate?.length > 1 // NOSONAR
                                            ? selectedNumberGenerate.length === numberGenerateData.length // NOSONAR
                                                ? "Delete All" // NOSONAR
                                                : `Delete Selected (${selectedNumberGenerate.length})` // NOSONAR
                                            : "Delete" // NOSONAR
                                    }
                                </CButton>
                            )
                        }
                    </div>
                </div>
            </div>

            <hr />
            {accountVal !== '0' && adminRole === 'SUPER_ADMIN' && (
                <form name='filterFrm' onSubmit={(e) => setGlobalFilter(e)}>
                    <div className="row">
                        <div className="col-md-6 col-lg-3 pb-3">
                            <span className="p-float-label custom-p-float-label">
                                <Dropdown
                                    value={selectedAccount}
                                    className="form-control"
                                    options={accountData}
                                    onChange={onAccountChange}
                                    optionLabel="company_name"
                                    itemTemplate={accountDataTemplate}
                                    valueTemplate={accountDataTemplate}
                                    optionValue="_id"
                                    filter
                                    filterBy="company_name,code"
                                />
                                <label>HCP</label>
                            </span>
                        </div>

                        <div className="col-md-12 col-lg-3 pb-3 search-reset">
                            <CButton type='submit' color="primary" className="mr-2">Search</CButton>
                            <CButton type='button' color="danger" onClick={() => resetGlobalFilter()} >Reset</CButton>
                        </div>
                    </div>
                </form>
            )}
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

    const typeBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Type</span>
                {rowData.type ? typeList?.[parseInt(rowData.type) - 1]?.code : Constant.NO_VALUE}
            </React.Fragment>
        );
    }

    const seriesBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Series</span>
                {rowData.series || Constant.NO_VALUE}
            </React.Fragment>
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

    const onCloseDeleteConfirmation = (value, isDelete, message) => {
        setIsDeleteModalShow(value)
        setSelectedNumberGenerate([])
        setDeleteDataArr([])
        if (isDelete) {
            showSuccess(message)
            const filters = { ...searchVal };
            if (numberGenerateData.length === 1 && searchVal.start > 0) {
                filters.start -= filters.length;
                setSearchVal({ ...searchVal, start: filters.start });
            } else {
                onFilterData();
            }
        }
    }

    const setGlobalFilter = (event) => {
        event.preventDefault();
        onFilterData()
    }

    const onFilterData = () => {
        const finalData = Object.assign({
            start: searchVal.start,
            length: searchVal.length
        },
            searchVal.sort_field && { sort_param: searchVal.sort_field },
            searchVal.sort_order && { sort_type: searchVal.sort_order === 1 ? 'asc' : 'desc' },
            selectedAccount && { account_id: selectedAccount },
        );

        getNumberGenerateData(finalData)

    }


    const resetGlobalFilter = () => {
        setSelectedAccount(adminRole !== "SUPER_ADMIN" ? primaryAccountId : '');
        setSearchVal(initialFilter)
    }

    const onselectRow = (e) => {
        setSelectedNumberGenerate(e.value)
    }

    const onPageChange = e => {
        setSearchVal({ ...searchVal, start: e.first, length: e.rows });
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
            {isLoading && <Loader />}

            <div className="datatable-responsive-demo custom-react-table">
                <div className="card">
                    <DataTable value={numberGenerateData} stripedRows className="p-datatable-responsive-demo" header={header} footer={numberGenerateData?.length > 0 ? footer : ''} showGridlines responsiveLayout="scroll"
                        sortField={searchVal.sort_field} sortOrder={searchVal.sort_order} onSort={(e) => onSort(e)} selection={selectedNumberGenerate} onSelectionChange={e => onselectRow(e)} selectionMode='checkbox'
                    >
                        {permissionHandler(Permission.NUMBER_GENERATOR_DELETE) &&
                            <Column selectionMode="multiple" style={{ width: '3em' }} />
                        }
                        {<Column field="series" header="Series" body={seriesBodyTemplate}></Column> /* NOSONAR */}
                        {
                            adminRole === "SUPER_ADMIN" && (
                                <Column field="account" header="HCP" body={hcpBodyTemplate} /> // NOSONAR
                            )
                        }
                        {<Column field="type" header="Type" body={typeBodyTemplate} /> /* NOSONAR */}

                        {
                            permissionHandler(Permission.NUMBER_GENERATOR_STATUS) &&
                            <Column field="status" header="Status" body={statusBodyTemplate}></Column> // NOSONAR
                        }{
                            (permissionHandler(Permission.NUMBER_GENERATOR_UPDATE) || permissionHandler(Permission.NUMBER_GENERATOR_DELETE)) &&
                            <Column field="action" header="Action" body={actionBodyTemplate} ></Column> // NOSONAR
                        }
                    </DataTable>
                </div>
            </div>
            <DeleteModal visible={isDeleteModalShow} onCloseDeleteModal={onCloseDeleteConfirmation} deleteObj={deleteObj} deleteDataArr={deleteDataArr} name="Number Generator" deleteEndPoint={Constant.NUMBER_GENERATOR_DELETEALL} dataName="number_generator" />
        </>
    )
}

export default NumberGeneratorList
