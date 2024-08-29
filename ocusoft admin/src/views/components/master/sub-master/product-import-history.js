import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';

import React, { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { cilList } from '@coreui/icons';
import { CBadge } from '@coreui/react';
import { Paginator } from 'primereact/paginator';

import * as  Constant from "../../../../shared/constant/constant";
import Loader from "../../common/loader/loader";
import { API } from '../../../../services/Api';
import permissionHandler from 'src/shared/handler/permission-handler';
import { Permission } from 'src/shared/enum/enum';

const ProductImportHistory = () => {
    const initialFilters = { start: 0, length: Constant.DT_ROW };
    let history = useHistory();

    const [appliedFilters, setAppliedFilters] = useState(initialFilters);
    const [isLoading, setIsLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [productImportHistoryList, setProductImportHistoryList] = useState([]);

    useEffect(() => {
        setIsLoading(true);
        getProductImportHistoryList(initialFilters);
    }, []);

    const getProductImportHistoryList = filterData => {
        API.getMasterList(onGetProductImportHistoryList, filterData, true, Constant.PRODUCT_IMPORT_HISTORY_LIST);
    }

    const onGetProductImportHistoryList = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            if (response?.meta?.status) {
                setTotalRecords(response?.data?.original?.recordsTotal ?? 0);
                let _productImportHistoryList = [];

                if (response?.data?.original?.data?.length > 0) {
                    _productImportHistoryList = response.data.original.data.map(responseObj => {
                        return {
                            id: responseObj?._id,
                            failureCount: responseObj?.total_failure_count ?? '',
                            successCount: responseObj?.total_success_count ?? '',
                            user: `${responseObj?.user?.first_name ?? ''} ${responseObj?.user?.last_name ?? ''}`
                        }
                    });
                }

                setProductImportHistoryList([ ..._productImportHistoryList ]);
            }
        },
        error: err => {
            setIsLoading(false);
            console.log(err);
        },
        complete: () => { }
    }

    const onPageChange = e => {
        setAppliedFilters({ ...appliedFilters, start: e.first });
        const filterData = { start: e.first, length: appliedFilters?.length };
        if (appliedFilters?.user) filterData["user"] = appliedFilters.user;

        getProductImportHistoryList(filterData);
    }

    const viewData = id => {
        history.push(`/product-import-history/view/?id=${id}`);
    }

    const header = (
        <div className="table-header">
            <div className="clearfix">
                <h5 className="p-m-0 float-start">
                    <CIcon icon={cilList} className="mr-1" /> Product Import History
                    <CBadge color="danger" className="ms-auto">{totalRecords}</CBadge>
                </h5>
            </div>
        </div>
    );

    const userBodyTemplate = rowData => {
        return (
            <>
                <span className="p-column-title">User Name</span> {rowData.user}
            </>
        );
    }

    const failureCountBodyTemplate = rowData => {
        return (
            <>
                <span className="p-column-title">Total Failure Count</span> {rowData.failureCount}
            </>
        );
    }

    const successCountBodyTemplate = rowData => {
        return (
            <>
                <span className="p-column-title">Total Success Count</span> {rowData.successCount}
            </>
        );
    }

    const viewBodyTemplate = rowData => {
        return (
            rowData?.id && permissionHandler(Permission.PRODUCT_IMPORT_HISTORY_SHOW) ? (
                <a title="View" className="mr-2" onClick={() => viewData(rowData.id)}>View</a>
            ) : (
                <></>
            )
        );
    }

    const footer = (
        <div className='table-footer'>
            <Paginator
                template={Constant.DT_PAGE_TEMPLATE}
                currentPageReportTemplate={Constant.DT_PAGE_REPORT_TEMP}
                first={appliedFilters.start}
                rows={appliedFilters.length}
                totalRecords={totalRecords}
                rowsPerPageOptions={Constant.DT_ROWS_LIST}
                onPageChange={onPageChange}
            ></Paginator>
        </div>
    );

    return (
        <>
            {isLoading && <Loader />}

            <div className="datatable-responsive-demo custom-react-table">
                <div className="card">
                    <DataTable
                        value={productImportHistoryList}
                        stripedRows
                        className="p-datatable-responsive-demo"
                        header={header}
                        footer={productImportHistoryList?.length > 0 ? footer : ''}
                        showGridlines
                        responsiveLayout="scroll"
                    >
                        <Column field="user" header="User Name" body={userBodyTemplate}></Column>
                        <Column field="failureCount" header="Total Failure Count" body={failureCountBodyTemplate}></Column>
                        <Column field="successCount" header="Total Success Count" body={successCountBodyTemplate}></Column>
                        <Column field="successCount" header="Action" body={viewBodyTemplate}></Column>
                    </DataTable>
                </div>
            </div>
        </>
    )
}

export default ProductImportHistory;
