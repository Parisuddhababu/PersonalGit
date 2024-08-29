// eslint-disable-next-line
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import CIcon from '@coreui/icons-react';
import { CBadge, CButton } from '@coreui/react'
import DeleteModal from '../../common/DeleteModalPopup/delete-modal'
import { API } from '../../../../services/Api';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import * as  Constant from "../../../../shared/constant/constant"
import ImageModal from '../../common/ImageModalPopup/image-modal'
import Loader from "../../common/loader/loader"

import { cilCheckCircle, cilCloudUpload, cilList, cilPencil, cilPlus, cilTrash, cilXCircle } from '@coreui/icons';
import { CommonMaster, Permission } from 'src/shared/enum/enum';
import { useToast } from '../../../../shared/toaster/Toaster';
import { Paginator } from 'primereact/paginator';
import { useHistory } from "react-router-dom";
import permissionHandler from 'src/shared/handler/permission-handler';
import { isEmpty } from 'src/shared/handler/common-handler';

const CountryList = () => {
    let history = useHistory();

    const [isDeleteModalShow, setIsDeleteModalShow] = useState(false)
    const initialFilter = {
        start: 0,
        length: Constant.DT_ROW,
        sort_order: '',
        sort_field: '',
    }

    const [searchVal, setSearchVal] = useState(initialFilter)
    const [deleteObj, setDeleteObj] = useState({})
    const [clientData, setClientData] = useState([])
    const [selectedStatus, setSelectedStatus] = useState('');
    const [isImageShow, setIsImageShow] = useState(false)
    const [imageObj, setImageObj] = useState({})
    const [name, setname] = useState('')
    const [, setSelectedAccount] = useState(localStorage.getItem('account_id'))
    const [accountData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const { showError, showSuccess } = useToast();
    const [totalRecords, setTotalRecords] = useState(0);
    const [selectedFeatured, setSelectedFeatured] = useState('');
    const [filteredKeys, setFilteredKeys] = useState([]);

    const toast = useRef(null);


    const statusOption = Constant.STATUS_OPTION;
    const filterMap = { name, is_active: selectedStatus.code, is_show_in_top: selectedFeatured };

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

    const getClientData = (formData) => {
        setIsLoading(true)

        API.getMasterList(onClientList, formData, true, Constant.COUNTRY_LIST);
    }

    const onClientList = {
        cancel: (c) => {
        },
        success: (response) => {
            if (response.meta.status_code === 200) {
                setClientData(response?.data?.original?.data)
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

    const editData = (rowData) => {
        history.push(`/country/edit/?id=${rowData._id}`)
    }

    const onStatusChange = (e) => {
        setSelectedStatus(e.value);
    }

    const onFeaturedChange = e => {
        setSelectedFeatured(e.value);
    }

    const confirmDeleteProduct = (data) => {
        let obj = { ...data }
        obj.urlName = CommonMaster.COUNTRY
        obj._id = data._id
        setDeleteObj(obj)
        setIsDeleteModalShow(true);
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Action</span>
                {
                    permissionHandler(Permission.COUNTRY_UPDATE) &&
                    <a title="Edit" className="mr-2" onClick={() => editData(rowData)}><CIcon icon={cilPencil} size="lg" /></a>
                }
                {
                    permissionHandler(Permission.COUNTRY_DELETE) &&
                    <button className="btn btn-link mr-2 text-danger" title="Delete" onClick={() => confirmDeleteProduct(rowData)}><CIcon icon={cilTrash} size="lg" /></button>
                }
            </React.Fragment>
        );
    }

    const onUpdateStatus = (rowData) => {
        let obj = {
            "uuid": rowData._id,
            "is_active": rowData.is_active === Constant.StatusEnum.active ? Constant.StatusEnum.inactive : Constant.StatusEnum.active
        };

        setIsLoading(true);
        API.UpdateStatus(onUpdateStatusRes, obj, true, rowData.uuid, Constant.COUNTRY_STATUS);
    }

    const onUpdateStatusRes = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);

            if (response?.meta?.status) {
                if (response?.meta?.message) showSuccess(response.meta.message);
                const { uuid } = response?.data ?? {};

                if (uuid) {
                    let _clientData = clientData;
                    const clientIndex = _clientData.findIndex(clientObj => clientObj?._id === uuid);
                    _clientData[clientIndex]["is_active"] = _clientData[clientIndex]["is_active"] === 1 ? 0 : 1;
                    setClientData([..._clientData]);
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

    const onChangeLink = (e) => {
        setname(e.target.value)
    }

    const exportFile = (event) => {
        setIsLoading(true)
        const data = Object.assign({ },
            name && { name: name },
            selectedStatus && { is_active: selectedStatus?.code },
            selectedFeatured && { is_show_in_top: parseInt(selectedFeatured?.code) },
        );

        API.getMasterList(exportRes, data, true, Constant.COUNTRY_EXPORT_EXCEL);
    }

    const exportRes = {
        cancel: (c) => {
        },
        success: (response) => {
            if (response.meta.status_code === 200 || response.meta.status_code === 201) {
                setIsLoading(false)
                const resFile = response.data?.file;
                if (resFile) {
                    window.open(resFile, "_self");
                } else {
                    showError("No data available")
                }
            }
        },
        error: (error) => {
            setIsLoading(false)
            if (error.errors) {
                Object.values(error.errors).map(err => {
                    showError(err)
                })
            } else if (error?.meta?.message) {
                showError(error.meta.message)
            }
        },
        complete: () => {
        },
    }

    const header = (
        <div className="table-header">
            <div className="clearfix">
                <h5 className="p-m-0 float-start"><CIcon icon={cilList} className="mr-1" /> Country <CBadge color="danger" className="ms-auto">{totalRecords}</CBadge></h5>
                <div className="float-end">
                    <div className="common-add-btn">
                        {
                            permissionHandler(Permission.COUNTRY_CREATE) &&
                            <CButton color="primary" onClick={() => { history.push(`/country/add`) }}><CIcon icon={cilPlus} className="mr-1" />Add Country</CButton>
                        }
                        {
                            permissionHandler(Permission.COUNTRY_EXPORT) &&
                            <CButton type="button" disabled={clientData?.length === 0} onClick={(e) => exportFile(e)} className="btn-success p-mr-2"> <CIcon icon={cilCloudUpload} className="mr-1" />Export</CButton>
                        }
                    </div>
                </div>
            </div>

            <hr />
            <form name='filterFrm' onSubmit={(e) => setGlobalFilter(e)}>

                <div className="row">
                    <div className="col-md-6 col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <InputText className="form-control" maxLength="255" value={name} name="name" onChange={(e) => onChangeLink(e)} />
                            <label>Name </label>
                        </span>
                    </div>

                    <div className="col-md-6 col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <Dropdown className="form-control" value={selectedStatus} options={statusOption} onChange={onStatusChange} optionLabel="name" />
                            <label>Status </label>
                        </span>
                    </div>

                    <div className="col-md-6 col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <Dropdown
                                className="form-control"
                                value={selectedFeatured}
                                options={statusOption}
                                onChange={onFeaturedChange}
                                optionLabel="name"
                                optionValue="code"
                            />
                            <label>Featured</label>
                        </span>
                    </div>

                    <div className="col-md-12 col-lg-3 pb-3 search-reset">
                        <CButton color="primary" className="mr-2" type='submit' >Search</CButton>
                        <CButton color="danger" onClick={() => resetGlobalFilter()} >Reset</CButton>
                    </div>
                </div>
            </form>
        </div>
    );

    const nameBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </React.Fragment>
        )
    }

    const imageBodyTemplate = (rowData) => {
        return rowData?.country_flag ? <img src={rowData?.country_flag[0]?.path} onError={(e) => e.target.src = Constant.PRIME_URL} alt={rowData.image} className="product-image" onClick={(e) => onImageClick(e, rowData)} /> : "-";
    }


    const onCloseDeleteConfirmation = (value, isDelete, message) => {
        setIsDeleteModalShow(value)
        if (isDelete) {
            showSuccess(message)
            // Only one record on second page and delete then it should be come to previous page in all modules
            if (clientData.length === 1 && searchVal.start) {
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
        getClientData(data);
    }

    const resetGlobalFilter = () => {
        setname('')
        setSelectedAccount(localStorage.getItem('account_id'))
        setSearchVal(initialFilter)
        setSelectedStatus('');
        setSelectedFeatured('');
    }

    const onImageClick = (e, rowData) => {
        setImageObj(rowData?.country_flag[0])
        setIsImageShow(true)
    }

    const onCloseImageModal = () => {
        setIsImageShow(false)
    }

    const countryCodeBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Country Code</span>
                {rowData.country_code || Constant.NO_VALUE}
            </React.Fragment>
        );
    }

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



    const showTopBodyTemplate = (rowData) => {
        if (rowData?.is_show_in_top === Constant.StatusEnum.active) {
            return (
                <React.Fragment>
                    <span className="p-column-title">Status</span>

                    <button className="btn btn-link text-success" title="Show On Top"><CIcon icon={cilCheckCircle} size="lg" /></button>
                </React.Fragment>)
        } else {
            return (
                <React.Fragment>
                    <span className="p-column-title">Status</span>

                    <button className="btn btn-link text-danger" title="Show on Top" ><CIcon icon={cilXCircle} size="lg" /></button>
                </React.Fragment>)
        }
    }



    return (
        <>
            <Toast ref={toast} />
            {isLoading && <Loader />}

            <div className="datatable-responsive-demo custom-react-table">
                <div className="card">
                    <DataTable value={clientData} stripedRows className="p-datatable-responsive-demo" header={header} footer={clientData?.length > 0 ? footer : ''} showGridlines responsiveLayout="scroll"
                        sortField={searchVal.sort_field} sortOrder={searchVal.sort_order} onSort={(e) => onSort(e)}
                    >
                        <Column header="Image" body={imageBodyTemplate} className="text-center" style={{ width: '20%' }}></Column>

                        <Column field="name" header="Name" body={nameBodyTemplate}></Column>
                        <Column field="country_code" header="Country Code" body={countryCodeBodyTemplate}></Column>
                        {
                            permissionHandler(Permission.COUNTRY_STATUS) && <Column field="status" header="Status" body={statusBodyTemplate}></Column>
                        }
                        <Column field="is_show_in_top" header="Featured" body={showTopBodyTemplate}></Column>
                        {
                            (permissionHandler(Permission.COUNTRY_UPDATE) || permissionHandler(Permission.COUNTRY_DELETE)) &&
                            <Column field="action" header="Action" body={actionBodyTemplate} style={{ width: '10%' }}></Column>
                        }

                    </DataTable>
                </div>
            </div>
            <DeleteModal visible={isDeleteModalShow} onCloseDeleteModal={onCloseDeleteConfirmation} deleteObj={deleteObj} name="Our Client" />
            <ImageModal visible={isImageShow} imgObj={imageObj} onCloseImageModal={onCloseImageModal} />
        </>
    )
}

export default CountryList;
