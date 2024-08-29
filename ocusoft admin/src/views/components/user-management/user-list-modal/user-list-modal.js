// eslint-disable-next-line
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import React, { useState, useEffect } from 'react';
import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CCloseButton
} from '@coreui/react'
import * as Constant from "../../../../shared/constant/constant"
import { displayDateTimeFormat } from 'src/shared/handler/common-handler';

const UserListModal = (props) => {
    const [visible, setVisible] = useState(false)
    const [masterForm, setMasterForm] = useState({})
    const statusOption = Constant.STATUS_OPTION;

    useEffect(() => {
        setVisible(props.visible)
        setMasterForm(props.rowData)
    }, [props])

    const onCancel = () => {
        props.onCloseUserModal(false, false)
    }

    const getStatus = (is_active) => {
       const stsArr = statusOption.filter(val => val.code == is_active);
       return stsArr.length ? stsArr[0].name : Constant.NO_VALUE;
    }

    return (
        <>
            <CModal visible={visible} >
                <CModalHeader>
                    <CModalTitle>User Details</CModalTitle>
                    <CCloseButton onClick={onCancel}></CCloseButton>
                </CModalHeader>
                <CModalBody>
                   <div className='view-section'>
                       {masterForm.account_name && <p><b>Account Name:</b> {masterForm.account_name}</p>}
                       <p><b>Name:</b> {masterForm?.first_name + ' ' + masterForm?.last_name}</p>
                       <p><b>Email:</b> {masterForm.email}</p>
                       <p><b>Contacts:</b> {masterForm?.country?.country_phone_code}&nbsp;{masterForm.mobile}</p>
                       {masterForm.role_name && <p><b>Role:</b> {masterForm.role_name}</p>}
                       {masterForm.gender && <p><b>Gender:</b> {masterForm.gender.name}</p>}
                       <p><b>Status:</b> {getStatus(masterForm.is_active)}</p>
                       <p><b>Date:</b> {displayDateTimeFormat(masterForm.created_at)}</p>
                   </div>
                </CModalBody>
            </CModal>
        </>
    )
}

export default UserListModal
