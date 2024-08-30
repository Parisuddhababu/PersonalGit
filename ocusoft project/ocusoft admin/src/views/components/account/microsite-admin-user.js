import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash } from '@coreui/icons';
import * as  Constant from "../../../shared/constant/constant"
import { API } from '../../../services/Api';
import { CommonMaster, UserEnum } from 'src/shared/enum/enum';
import DeleteModal from '../common/DeleteModalPopup/delete-modal'
import { useToast } from '../../../shared/toaster/Toaster';
import { Paginator } from 'primereact/paginator';
import { useHistory } from "react-router-dom";
import Loader from "../common/loader/loader"

const MicrositeAdminUser = (props) => {
    let history = useHistory();

    const initialFilter = {
        start: 0,
        length: Constant.DT_ROW,
        sort_order: '',
        sort_field: '',
    }

    const [searchVal, setSearchVal] = useState(initialFilter)
    const [userList, setUserList] = useState([])
    const [isDeleteModalShow, setIsDeleteModalShow] = useState(false)
    const [deleteObj, setDeleteObj] = useState({})
    const { showSuccess } = useToast();
    const [totalRecords, setTotalRecords] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        getMicrositeData()
    }, [searchVal])

    const getMicrositeData = () => {
        const finalData = Object.assign({
            start: searchVal.start,
            length: searchVal.length,
            account_id: props?.id,
        },
            searchVal.sort_field && { sort_param: searchVal.sort_field },
            searchVal.sort_order && { sort_type: searchVal.sort_order === 1 ? 'asc' : 'desc' },
            { 'type': UserEnum.MICROSITE_ADMIN_USERS },
            props.account_listId && { account_list_id: props.account_listId }
        );
        setIsLoading(true)
        API.getMasterList(micrositeAdminUser, finalData, true, Constant.GETUSERS);

    }

    // micrositeAdminUser Response Data Method
    const micrositeAdminUser = {
        cancel: (c) => {
        },
        success: (response) => {
            if (response.meta.status_code === 200) {

                setUserList(response?.data?.original?.data)
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


    const confirmDeleteAddress = (e, data) => {

        let obj = { ...data }
        obj.urlName = CommonMaster.USER_MANAGEMENT;
        obj.name = data.first_name;
        setDeleteObj(obj)
        setIsDeleteModalShow(true)
    }

    const editData = (rowData) => {
        if (rowData?._id) {
            history.push(`/microsite-admin-users/edit/?id=${rowData._id}&type=3&is_account=true`)
        }
    }

    const micrositeAdminActionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Action</span>
                <a title="Edit" className="mr-2" onClick={() => editData(rowData)}><CIcon icon={cilPencil} size="lg" /></a>
                <button className="btn btn-link mr-2 text-danger" title="Delete" onClick={(e) => confirmDeleteAddress(e, rowData)}><CIcon icon={cilTrash} size="lg" /></button>
            </React.Fragment>
        );
    }

    const nameBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">User Name</span>
                <p>{rowData?.first_name}</p>
            </React.Fragment>
        );
    }

    const onCloseDeleteConfirmation = (value, isDelete, message) => {
        setIsDeleteModalShow(value)

        if (isDelete) {
            showSuccess(message)
            // Only one record on second page and delete then it should be come to previous page in all modules
            getMicrositeData()
        }
    }

    const handleMicrositeAdminPageChange = (e) => {
        setSearchVal({ ...searchVal, length: e.rows })
        if (searchVal.start !== e.first) {
            setSearchVal({ ...searchVal, start: e.first })
        }

    }

    const micrositeAdminFooterTemplate = (
        <div className='table-footer'>
            <Paginator template={Constant.DT_PAGE_TEMPLATE}
                currentPageReportTemplate={Constant.DT_PAGE_REPORT_TEMP}
                first={searchVal.start} rows={searchVal.length} totalRecords={totalRecords}
                rowsPerPageOptions={Constant.DT_ROWS_LIST} onPageChange={handleMicrositeAdminPageChange}></Paginator>
        </div>
    );

    const handleMicrositeAdminSort = (e) => {
        if (e.sortField) {
            setSearchVal({ ...searchVal, sort_field: e.sortField, sort_order: e.sortOrder })
        }
    }

    return (
        <>
            {isLoading && <Loader />}

            <div className="datatable-responsive-demo custom-react-table">
                <DataTable value={userList} className="p-datatable-responsive-demo" showGridlines responsiveLayout="scroll" footer={userList?.length > 0 ? micrositeAdminFooterTemplate : ''}
                    sortField={searchVal.sort_field} sortOrder={searchVal.sort_order} onSort={(e) => handleMicrositeAdminSort(e)}>
                    <Column field="first_name" header="Username" sortable body={nameBodyTemplate} ></Column>
                    <Column field="id" header="Action" style={{ width: '100px' }} body={micrositeAdminActionBodyTemplate}></Column>
                </DataTable>
            </div>
            <DeleteModal visible={isDeleteModalShow} onCloseDeleteModal={onCloseDeleteConfirmation} deleteObj={deleteObj} />

        </>
    )
}
export default MicrositeAdminUser