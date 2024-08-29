// eslint-disable-next-line
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import React, { useState, useEffect, useRef } from 'react';
import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CButton,
    CCloseButton
} from '@coreui/react'
import { API } from '../../../../services/Api';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';

const SendMail = (props) => {
    const [, setVisible] = useState(false)
    const [, setMailPopupData] = useState({})
    const [mailData, setMailData] = useState({
        email:props?.selectedRowData ? props.selectedRowData.email : '',
        message: '',
        uuids: props?.selectedRowData ? props.selectedRowData.id :''
    })
    const [isDisable, setIsDisable] = useState(false)
    const toast = useRef(null);
    useEffect(() => {
        setVisible(props.visible)
        setMailPopupData(props.mailObj)
        setMailData({ ...mailData, 'email': props.mailObj.email, 'uuids': props.mailObj._id })
    }, [props])

    useEffect(() => {
        getDisableValue()
    }, [mailData])

    const getDisableValue = () => {
        if (mailData.message.trim() !== '') {
            setIsDisable(false)
        } else {
            setIsDisable(true)
        }
    }

    const onHandleChange = (e) => {
        setMailData({ ...mailData, [e.target.name]: e.target.value })
    }

    const onCancel = () => {
        setMailData({
            email: '',
            message: '',
            uuids: ''
        })
        props.onCloseMailModal(false, false)
    }

    const onSendMail = () => {
        let obj = {
            'message': mailData.message,
            'uuids' : props?.selectedRowData ? props.selectedRowData._id : mailData.uuids
        }
        setIsDisable(true)
        if (props.setLoader) props.setLoader();
        API.sendMail(sendMailRes, obj, true, props.mailUrl)
    }



    const sendMailRes = {
        cancel: (c) => {
        },
        success: (response) => {
            if (props.unsetLoader) props.unsetLoader();
            if (response.meta.status_code === 200 || response.meta.status_code === 201) {
                setMailData({ email: '', message: '' })
                setIsDisable(false)
                props.onCloseMailModal(false, true, response.meta.message)
            }
        },
        error: (error) => {
            if (props.unsetLoader) props.unsetLoader();
            if (error?.meta?.message) {
                toast.current.show({ severity: 'error', detail: error?.meta?.message, life: 3000 });
            }
            setIsDisable(false)
        },
        complete: () => {
        },
    }
    return (
        <>
            <Toast ref={toast} />

            <CModal visible={props.visible}>
                <CModalHeader className="bg-primary">
                    <CModalTitle>Send Mail</CModalTitle>
                    <CCloseButton onClick={onCancel}></CCloseButton>

                </CModalHeader>
                <CModalBody>
                    <div className="card-body">
                        <p className="col-sm-12 text-right">Fields marked with <span className="text-danger">*</span> are mandatory.</p>

                        <div className="row">
                            <div className="col-md-12 mb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <InputText className="form-control" name="email" disabled required value={mailData.email }  onChange={(e) => onHandleChange(e)}  />
                                    <label>Email</label>

                                </span>
                            </div>
                            <div className="col-md-12 mb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <InputTextarea className="form-control" name="message" required value={mailData.message} onChange={(e) => onHandleChange(e)} />
                                    <label>Message <span className="text-danger">*</span></label>

                                </span>
                            </div>
                        </div>
                    </div>
                </CModalBody>

                <CModalFooter>
                    <CButton color="danger" disabled={isDisable} onClick={onSendMail}>Send</CButton>
                    <CButton color="primary" onClick={onCancel}>Cancel</CButton>
                </CModalFooter>
            </CModal>
        </>
    )
}

export default SendMail
