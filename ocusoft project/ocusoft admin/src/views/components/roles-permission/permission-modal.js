// eslint-disable-next-line

import React, { useState, useEffect } from 'react';
import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CCloseButton,
    CModalFooter,
    CButton
} from '@coreui/react'
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import { API } from '../../../services/Api';
import * as Constant from "../../../shared/constant/constant"
import Loader from "../common/loader/loader"
import { useToast } from '../../../shared/toaster/Toaster';
import CheckboxTree from 'react-checkbox-tree';

const PermissionModal = (props) => {
    const [visible, setVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const [permissionData, setPermissionData] = useState([]);
    const { showError, showSuccess } = useToast();
    const [checked, setTreeChecked] = useState([]);
    const [expanded, setTreeExpanded] = useState([]);   

    useEffect(() => {
        setVisible(props.visible);
    }, [props])

    useEffect(() => {
        getPermissionDataById();
    }, [])

    const getPermissionDataById = () => {
        setIsLoading(true)
        API.getActiveDataList(Constant.PERMISSION_LIST + props.roleObj._id, getMasterRes, "", true);
    }

    // getMasterRes Response Data Method
    const getMasterRes = {
        cancel: (c) => {
        },
        success: (response) => { // NOSONAR
            setIsLoading(false)
            if (response.meta.status_code === 200) {
                let resVal = response.data;
                const newArray = [];
                const permissionItems = [];
                const defaultChecked = [];
                const defaultExpanded = [];
                for (const permission of resVal) {
                    if (permission.parent === '#') {
                        defaultExpanded.push(permission.id);
                        newArray[permission.id] = { label: permission.text, value: permission.id, children: [] };
                    } else {
                        // Default checked permissions
                      if(permission.state.selected){
                        defaultChecked.push(permission._id);
                      }
                      setTreeChecked(defaultChecked);
                      newArray[permission.parent].children.push({
                        label: permission.text,
                        value: permission._id
                      });
                    }
                  }
                for (const par in newArray) {
                    if (newArray.hasOwnProperty(par)) {
                        permissionItems.push(newArray[par]);
                    }
                }
                setPermissionData(permissionItems);
                // Default expanded permissions
                setTreeExpanded(defaultExpanded)
            }
        },
        error: (error) => {
            setIsLoading(false)
        },
        complete: () => {
        },
    }

    const assignPermission = () => {
        if(checked.length === 0){
            showError('Please select permission');
            return false;
        }
        const reqData = {
            permission_key : checked.toString()
        }
        setIsLoading(true)
        API.addMaster(permissionRes, reqData, true, Constant.ASSIGN_PERMISSION + props.roleObj._id);
    }

    const permissionRes = {
        cancel: (c) => {
        },
        success: (response) => {
            setIsLoading(false)
            if (response.meta.status_code === 200) {
                showSuccess(response.meta.message)
                onCancel();
            }
        },
        error: (error) => {
            setIsLoading(false)
            if (error.errors) {
                Object.values(error.errors).map(err => {
                    showError(err)
                })
            } else {
                showError(error.meta.message)
            }
        },
        complete: () => {
        },
    }

    const onCancel = () => {
        props.onClosePermissionModal(false, false)
    }

    const checkTreeIcons = {
        check: <span className="p-checkbox-icon p-c pi pi-check" />,
        uncheck: <span className="p-checkbox-icon p-c" />,
        halfCheck: <span className="pi pi-minus" />,
        expandClose: <span className="pi pi-plus" />,
        expandOpen: <span className="pi pi-minus" />,
        expandAll: <><span className="pi pi-minus-circle pi-large" /> <span className='ec-text'>Expand All</span></>,
        collapseAll: <><span className="pi pi-plus-circle pi-large" /><span className='ec-text'>Collapse All</span></>
    }

    return (
        <>
            {isLoading && <Loader />}
            <CModal visible={visible} size="lg">
                <CModalHeader>
                    <CModalTitle>Assign Permission : <b>{props.roleObj.name}</b></CModalTitle>
                    <CCloseButton onClick={onCancel}></CCloseButton> {/* NOSONAR */}
                </CModalHeader>
                <CModalBody className='overflow'>
                    <div className='card'>
                        <div className="card-body">
                            <div className="roles-permission-list">
                                <CheckboxTree
                                    nodes={permissionData}
                                    icons={checkTreeIcons}
                                    // nativeCheckboxes = {true}
                                    showExpandAll = {true}
                                    showNodeIcon = {false}
                                    checked={checked}
                                    expanded={expanded}
                                    onCheck={checked => setTreeChecked(checked)}
                                    onExpand={expanded => setTreeExpanded(expanded)}
                                />
                            </div>
                        </div>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="primary" onClick={() => assignPermission()}>Save</CButton>
                </CModalFooter>
            </CModal>
        </>
    )
}

export default PermissionModal
