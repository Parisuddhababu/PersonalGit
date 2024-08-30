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
import { API } from '../../../services/Api';
import { Toast } from 'primereact/toast';
import * as Constant from "../../../shared/constant/constant"
import { Dropdown } from 'primereact/dropdown';

const FilterPopup = (props) => {
    const [visible, setVisible] = useState(false)
    const [filter, setFilter] = useState('')
    const [filterOption, setFilterOption] = useState([{ id: 1, name: 'sdfsd' }])

    const toast = useRef(null);

    useEffect(() => {
        setVisible(props.visible)
    }, [props])

    useEffect(() => {
        getFilterData()
    }, [])

    const getFilterData = () => {
        API.getFilterList(filterRes, "", true);
    }

    const filterRes = {
        cancel: (c) => {
        },
        success: (response) => {
            if (response.meta.status_code === 200) {
                setFilterOption(response?.data)
            }
        },
        error: (error) => {


        },
        complete: () => {
        },
    }

    const onCancel = () => {
        props.onCloseImageModal(false, false)
    }

    const onFilterChange = (e) => {
        setFilter(e.value)
    }

    const onSave = () => {
        let resObj = {
            'category_id' :  props.id,
            'type_id' : filter
        }
     
        API.addMaster(addMasterRes, resObj, true, Constant.FILTERSEQUENCEADD);

    }

      // addMasterRes Response Data Method
      const addMasterRes = {
        cancel: (c) => {
        },
        success: (response) => {
            if (response.meta.status_code === 200 || response.meta.status_code === 201) {
                toast.current.show({ severity: 'success', detail: response.meta.message, life: 3000 });
                props.onCloseImageModal(false, true)

            }
        },
        error: (error) => {

            if (error.errors) {
                Object.values(error.errors).map(err => {
                    toast.current.show({ severity: 'error', detail: err, life: 3000 });
                })
            } else {
                toast.current.show({ severity: 'error', detail: error.meta.message, life: 3000 });

            }
        },
        complete: () => {
        },
    }

    return (
        <>
            <Toast ref={toast} />
            <CModal visible={visible} >
                <CModalHeader>
                    <CModalTitle>Add Filter</CModalTitle>
                    <CCloseButton onClick={onCancel}></CCloseButton>
                </CModalHeader>
                <CModalBody>
                    <form name="subMasterFrm" noValidate>
                        <div className="card">
                            <div className="card-body">
                                <p className="col-sm-12 text-right">Fields marked with <span className="text-danger">*</span> are mandatory.</p>

                                <div className="row">
                                    <div className="col-md-12 mb-3">
                                        <span className="p-float-label custom-p-float-label">
                                            <Dropdown value={filter} className="form-control" options={filterOption} onChange={(e) => onFilterChange(e)} optionLabel="name" optionValue="_id" appendTo="self"/>

                                            <label>Filter <span className="text-danger">*</span></label>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </CModalBody>

                <CModalFooter>
                    <CButton color="danger" onClick={onSave}>Save</CButton>
                    <CButton color="primary" onClick={onCancel}>Cancel</CButton>
                </CModalFooter>
            </CModal>
        </>
    )
}

export default FilterPopup
