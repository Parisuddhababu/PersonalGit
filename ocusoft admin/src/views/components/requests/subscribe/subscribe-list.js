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
import { API } from '../../../../services/Api';
import * as  Constant from "../../../../shared/constant/constant"
import { Calendar } from 'primereact/calendar';
import SendMail from '../../common/SendMailPopup/send-mail'
import Loader from "../../common/loader/loader"
import { cilList, cibGmail } from '@coreui/icons';
import { useToast } from '../../../../shared/toaster/Toaster';
import { displayDateTimeFormat, requestDateFormatYY, PICKER_DISPLAY_DATE_FORMAT, emailLowerCase, isEmpty } from 'src/shared/handler/common-handler';
import { Paginator } from 'primereact/paginator';
import permissionHandler from 'src/shared/handler/permission-handler';
import { Permission, CommonMaster } from 'src/shared/enum/enum';
import CommonHcpInput from 'src/shared/common/common-hcp-input';

const SubscribeList = () => {
    const primaryAccountId = localStorage.getItem("account_id");
    const adminRole = JSON.parse(localStorage.getItem('user_details'))?.role?.code;
    const [isMailModalShow, setIsMailModalShow] = useState(false)
    const initialFilter = {
        start: 0,
        length: Constant.DT_ROW,
        sort_order: '',
        sort_field: '',
    }

    const [searchVal, setSearchVal] = useState(initialFilter)
    const [mailObj, setMailObj] = useState({})
    const [subscribeData, setSubscribeData] = useState([])
    const [endDate, setEndDate] = useState(null)
    const [startDate, setStartDate] = useState(null)
    const [date, setDate] = useState(null);
    const [selectedEmail, setSelectedEmail] = useState('')
    const [selectedAccount, setSelectedAccount] = useState(adminRole !== "SUPER_ADMIN" ? primaryAccountId : '');
    const [isLoading, setIsLoading] = useState(false)
    const { showSuccess } = useToast();
    const [totalRecords, setTotalRecords] = useState(0);
    const [filteredKeys, setFilteredKeys] = useState([]);

    const filterMap = {
        email : emailLowerCase(selectedEmail),
        to_date : endDate ? requestDateFormatYY(endDate) : '',
        from_date : startDate ? requestDateFormatYY(startDate) : '',
    };

    useEffect(() => {
        if (searchVal ) {
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
        if (date) {
            setStartDate(date[0])
            setEndDate(date[1])
        }

    }, [date])

    const getSubscribeData = (formData) => {
        setIsLoading(true)

        API.getMasterList(onSubscribeDataRes, formData, true, Constant.GETSUBSCRIBEREQUEST);
    }

    const onSubscribeDataRes = {
        cancel: () => { },
        success: response => {
            setIsLoading(false)
            if (response?.meta?.status) {
                setSubscribeData(response?.data?.original?.data)
                setTotalRecords(response?.data?.original?.recordsTotal ?? 0);
            }
        },
        error: err => {
            setIsLoading(false);
            console.log(err);
        },
        complete: () => { },
    }

    const onChangeEmail = (e) => {
        setSelectedEmail(e.target.value)
    }

    const confirmMail = (data) => {
        setIsLoading(true)
        API.getMasterDataById(getMasterRes, "", true, data._id, Constant.SHOWSUBSCRIBEREQUEST);
    }

    // getMasterRes Response Data Method
    const getMasterRes = {
        cancel: (c) => {
        },
        success: (response) => {
            if (response.meta.status_code === 200) {
                let resVal = response.data
                setMailObj(resVal)
                setIsMailModalShow(true)
                setIsLoading(false)

            }
        },
        error: (error) => {

            setIsLoading(false)

        },
        complete: () => {
        },
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Action</span>
                <a title="Send Mail" className="mr-2" onClick={() => confirmMail(rowData)}><CIcon icon={cibGmail} size="lg" /></a>

                {/* <a title="Edit" className="mr-2" onClick={() => editData(rowData)}><CIcon icon={cilPencil} size="lg" /></a>
                <button className="btn btn-link mr-2 text-danger" title="Delete" onClick={() => confirmDeleteProduct(rowData)}><CIcon icon={cilTrash} size="lg" /></button> */}
                {/* <button className="btn btn-link " title="Change Sequence"><CIcon icon={cilSwapVertical} size="lg" /></button> */}
            </React.Fragment>
        );
    }

    const onDateChange = (event) => {
        setDate(event.value)
    }

    const onAccountChange = (e) => {
        setSelectedAccount(e.target.value)
    }

    const header = (
        <div className="table-header">
            <div className="clearfix">
                <h5 className="p-m-0 float-start"><CIcon icon={cilList} className="mr-1" />
                    {CommonMaster.SUBSCRIBE} <CBadge color="danger" className="ms-auto">{totalRecords}</CBadge>
                </h5>
            </div>

            <hr />
            <form name='filterFrm' onSubmit={(e) => setGlobalFilter(e)}>

            <div className="row">
                <CommonHcpInput handleHcpChange={onAccountChange} hcpValue={selectedAccount} />

                <div className="col-md-6 col-lg-3 pb-3">
                    <span className="p-float-label custom-p-float-label">
                        <InputText className="form-control" value={selectedEmail} name="email" onChange={(e) => onChangeEmail(e)} />
                        <label>Email </label>

                    </span>
                </div>
               

                <div className="col-md-6 col-lg-3 pb-3">
                    <span className="p-float-label custom-p-float-label">
                        <Calendar id="range" className="form-control border-0 px-0 py-0 custom-datepicker-input" dateFormat={PICKER_DISPLAY_DATE_FORMAT} showIcon appendTo="self" value={date} onChange={(e) => onDateChange(e)} selectionMode="range" readOnlyInput
                        />
                        <label>Date Range </label>

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

    const dateBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Date</span>
                {displayDateTimeFormat(rowData.created_at)}

            </React.Fragment>
        );
    }

    const onCloseMail = (value, isDelete, message) => {
        setIsMailModalShow(value)
        if (isDelete) {
            showSuccess(message)
            // getSubscribeData()
            onFilterData()
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
        const appliedFilters = filters ?? filterMap;

        for (const filterKey in appliedFilters) {
            const value = appliedFilters[filterKey];
            if (!isEmpty(value)) {
                data[filterKey] = value;
                _filteredKeys.push(filterKey);
            }
        }

        if (!filters) data["start"] = 0;
        if (selectedAccount) data["account_id"] = selectedAccount;

        setFilteredKeys([..._filteredKeys]);
        getSubscribeData(data);
    }

    const resetGlobalFilter = () => {
        setSelectedEmail('')
        setSelectedAccount('');
        setDate(null)
        setStartDate(null)
        setEndDate(null)
        setSearchVal(initialFilter)
    }

    const emailBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Email</span>
                {rowData.email}
            </React.Fragment>
        );
    }

    const handleSubscribePageChange = e => {
        setSearchVal({ ...searchVal, start: e.first, length: e.rows });
    }

    const subscribeListFooterTemplate = (
        <div className='table-footer'>
            <Paginator template={Constant.DT_PAGE_TEMPLATE}
                currentPageReportTemplate={Constant.DT_PAGE_REPORT_TEMP}
                first={searchVal.start} rows={searchVal.length} totalRecords={totalRecords}
                rowsPerPageOptions={Constant.DT_ROWS_LIST} onPageChange={handleSubscribePageChange}></Paginator>
        </div>
    );

    const handleSubscribeListSort = e => {
        if (e.sortField) setSearchVal({ ...searchVal, sort_field: e.sortField, sort_order: e.sortOrder })
    }

    return (
        <>
            {isLoading && <Loader />}

            <div className="datatable-responsive-demo custom-react-table">
                <div className="card">

                    <DataTable
                        value={subscribeData}
                        stripedRows
                        className="p-datatable-responsive-demo"
                        header={header}
                        footer={subscribeData?.length > 0 ? subscribeListFooterTemplate : ''}
                        showGridlines
                        responsiveLayout="scroll" 
                        sortField={searchVal.sort_field}
                        sortOrder={searchVal.sort_order}
                        onSort={handleSubscribeListSort}
                    >
                        {<Column header="Email" field='email' sortable body={emailBodyTemplate} /> /* NOSONAR */}
                        {<Column field="date" header="Date" body={dateBodyTemplate} /> /* NOSONAR */}
                        {
                            permissionHandler(Permission.SUBSCRIBE_REQ_REPLY_EMAIL) && (
                                <Column field="action" header="Action" body={actionBodyTemplate} /> // NOSONAR
                            )
                        }
                    </DataTable>
                </div>
            </div>
            <SendMail visible={isMailModalShow} onCloseMailModal={onCloseMail} mailObj={mailObj} name="subscribe" mailUrl={Constant.REPLYSUBSCRIBEEMAIL} />

        </>
    )
}

export default SubscribeList
