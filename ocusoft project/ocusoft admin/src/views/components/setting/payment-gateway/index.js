import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';

import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import * as  Constant from "../../../../shared/constant/constant";
import Loader from "../../common/loader/loader";
import { cilCheckCircle, cilXCircle, cilPencil, cilTrash, cilPlus } from '@coreui/icons';
import { CommonMaster } from 'src/shared/enum/enum';
import { useHistory } from 'react-router-dom';
import { API } from 'src/services/Api';
import { Paginator } from 'primereact/paginator';
import { useToast } from 'src/shared/toaster/Toaster';
import DeleteModal from '../../common/DeleteModalPopup/delete-modal';
import { CButton } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { isEmpty } from 'src/shared/handler/common-handler';

const PaymentGatewayConfiguration = () => {
    const history = useHistory();
    const { showError, showSuccess } = useToast();
    const initialFilters = {
        start: 0,
        length: Constant.DT_ROW,
    };
    const statusOptions = Constant.STATUS_OPTION;

    const [searchVal, setSearchVal] = useState(initialFilters);
    const [totalRecords, setTotalRecords] = useState(0);
    const [paymentGatewayData, setPaymentGatewayData] = useState([]);
    const [isDeleteModalShow, setIsDeleteModalShow] = useState(false);
    const [deleteObj, setDeleteObj] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [selectedName, setSelectedName] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [filteredKeys, setFilteredKeys] = useState([]);

    const filterMap = {
        name: selectedName,
        is_active: selectedStatus.code,
    };

    useEffect(() => {
        setIsLoading(true);
    }, []);

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

    const getPaymentGatewayList = filters => {
        API.getMasterList(onGetPaymentGatewayListResponse, filters, true, Constant.PAYMENT_GATEWAY_LIST);
    }

    const onGetPaymentGatewayListResponse = {
        cancel: () => { },
        success: response => {
            if (response?.data?.original?.data) {
                const responseData = response.data.original.data;
                const _paymentGatewayData = responseData.map(paymentGatewayObj => {
                    return {
                        id: paymentGatewayObj?._id,
                        title: paymentGatewayObj?.name ?? '',
                        isActive: paymentGatewayObj?.is_active ?? 0,
                        keys: paymentGatewayObj?.keys,
                    }
                });

                setPaymentGatewayData([..._paymentGatewayData]);
                setTotalRecords(response.data.original.recordsTotal);
            }
            setIsLoading(false);
        },
        error: err => {
            console.log(err);
            setIsLoading(false);
        },
        complete: () => { }
    }

    const changeStatus = (pageId, updatedStatus) => {
        const data = {
            uuid: pageId,
            is_active: updatedStatus
        };

        setIsLoading(true);
        API.UpdateStatus(onChangeStatusResponse, data, true, null, Constant.CHANGE_PAYMENT_GATEWAY_STATUS);
    }

    const onChangeStatusResponse = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);

            if (response?.meta?.status) {
                if (response?.meta?.message) showSuccess(response.meta.message);
                const { uuid } = response?.data ?? {};

                if (uuid) {
                    let _paymentGatewayData = paymentGatewayData;
                    const gatewayIndex = _paymentGatewayData.findIndex(gatewayObj => gatewayObj?.id === uuid);
                    _paymentGatewayData[gatewayIndex]["isActive"] = _paymentGatewayData[gatewayIndex]["isActive"] === 1 ? 0 : 1;
                    setPaymentGatewayData([..._paymentGatewayData]);
                } else {
                    getPaymentGatewayList();
                }
            }
        },
        error: err => {
            if (err?.meta?.message) showError(err.meta.message);
            setIsLoading(false);
        },
        complete: () => { }
    }

    const confirmDeletePaymentGateway = data => {
        let obj = { ...data, _id: data?.id, name: data?.title };
        obj.urlName = CommonMaster.PAYMENT_GATEWAY_CONFIGURATION;
        setDeleteObj(obj);
        setIsDeleteModalShow(true);
    }

    const onCloseDeleteConfirmation = (value, isDelete, message) => {
        setIsDeleteModalShow(value);
        if (isDelete) {
            showSuccess(message);
            const filters = { ...searchVal };
            if (paymentGatewayData.length === 1 && searchVal.start > 0) {
                filters.start -= filters.length;
                setSearchVal({ ...searchVal, start: filters.start });
            }

            getPaymentGatewayList(filters);
        }
    }

    const onChangeName = e => {
        setSelectedName(e.target.value);
    }

    const onStatusChange = e => {
        setSelectedStatus(e.value);
    }

    const setGlobalFilter = e => {
        e.preventDefault();
        onFilterData();
    }

    const onFilterData = filters => {
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

        setFilteredKeys([..._filteredKeys]);
        getPaymentGatewayList(data);
    }

    const resetGlobalFilter = () => {
        setSelectedName('');
        setSelectedStatus('');
        setSearchVal(initialFilters);
    }

    const header = (
        <div className="table-header">
            <div className="clearfix row">
                <span>
                    <h5 className="p-m-0 float-start"> Payment Gateway Configuration </h5>

                    <CButton
                        color="primary"
                        className="mr-2"
                        style={{ float: 'right' }}
                        type='submit'
                        onClick={() => moveToAddEditPage("add")}
                    >
                        <CIcon icon={cilPlus} />&nbsp;&nbsp;Add Payment Gateway
                    </CButton>
                </span>
            </div>

            <hr />
            <form name='filterFrm' onSubmit={e => setGlobalFilter(e)}>
                <div className="row">
                    <div className="col-md-6 col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <InputText
                                id="inputtext"
                                maxLength="255"
                                className="form-control"
                                value={selectedName}
                                name="name"
                                onChange={e => onChangeName(e)}
                            />
                            <label>Name</label>
                        </span>
                    </div>

                    <div className="col-md-6 col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <Dropdown
                                className="form-control"
                                value={selectedStatus}
                                options={statusOptions}
                                onChange={e => onStatusChange(e)}
                                optionLabel="name"
                            />
                            <label>Status</label>
                        </span>
                    </div>

                    <div className="col-md-12 col-lg-3 pb-3 search-reset">
                        <CButton type='submit' color="primary" className="mr-2">Search</CButton>
                        <CButton type='button' color="danger" onClick={() => resetGlobalFilter()}>Reset</CButton>
                    </div>
                </div>
            </form>
        </div>
    );

    const titleBody = rowData => {
        return (<span>{rowData.title}</span>);
    }

    const statusBody = rowData => {
        return (
            <div>
                {
                    rowData?.isActive === Constant.StatusEnum.active ? (
                        <button
                            className="btn btn-link text-success"
                            title="payment gateway is active"
                            onClick={() => changeStatus(rowData.id, 0)}
                        >
                            <CIcon icon={cilCheckCircle} size="lg" />
                        </button>
                    ) : (
                        <button
                            className="btn btn-link text-danger"
                            title="payment gateway is not active"
                            onClick={() => changeStatus(rowData.id, 1)}
                        >
                            <CIcon icon={cilXCircle} size="lg" />
                        </button>
                    )
                }
            </div>
        );
    }

    const actionBody = (data, indexData) => {
        const index = indexData.rowIndex;
        return (
            <React.Fragment>
                <span className="p-column-title">Action</span>
                <a title="Edit" className="mr-2" onClick={() => moveToAddEditPage('edit', index)}>
                    <CIcon icon={cilPencil} size="lg" />
                </a>

                <button
                    className="btn btn-link mr-2 text-danger"
                    title="Delete"
                    onClick={() => confirmDeletePaymentGateway(data)}
                >
                    <CIcon icon={cilTrash} size="lg" />
                </button>
            </React.Fragment>
        );
    }

    const moveToAddEditPage = (action, index = null) => {
        let url = '/payment-gateway-configuration';
        if (action === 'edit' && index !== null) {
            url = `${url}/${action}/?id=${paymentGatewayData?.[index]?.['id']}`;
        } else {
            url = `${url}/${action}`;
        }
        history.push(url);
    }

    const onPageChange = e => {
        setSearchVal({ ...searchVal, start: e.first, length: e.rows });
    }

    const footer = (
        <div className='table-footer'>
            <Paginator
                template={Constant.DT_PAGE_TEMPLATE}
                currentPageReportTemplate={Constant.DT_PAGE_REPORT_TEMP}
                first={searchVal.start}
                rows={searchVal.length}
                totalRecords={totalRecords}
                rowsPerPageOptions={Constant.DT_ROWS_LIST}
                onPageChange={onPageChange}
            ></Paginator>
        </div>
    )

    return (
        <>
            {isLoading && <Loader />}

            <div className="datatable-responsive-demo custom-react-table">
                <div className="card">
                    <DataTable
                        value={paymentGatewayData}
                        stripedRows
                        className="p-datatable-responsive-demo"
                        header={header}
                        showGridlines
                        responsiveLayout="scroll"
                        footer={paymentGatewayData?.length > 0 ? footer : (<></>)}
                    >
                        <Column field='title' header="Payment Gateway" sortable body={titleBody}></Column>
                        <Column field='isActive' header="Status" body={statusBody}></Column>
                        <Column header="Action" body={actionBody}></Column>
                    </DataTable>
                </div>
            </div>

            <DeleteModal
                visible={isDeleteModalShow}
                onCloseDeleteModal={onCloseDeleteConfirmation}
                deleteObj={deleteObj}
                name={CommonMaster.PAYMENT_GATEWAY_CONFIGURATION}
                deleteEndPoint={Constant.DELETE_PAYMENT_GATEWAY}
                dataName="paymentGateway"
            />
        </>
    )
}

export default PaymentGatewayConfiguration;
