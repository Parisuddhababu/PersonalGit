// eslint-disable-next-line
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import React, { useState, useEffect } from 'react';
import CIcon from '@coreui/icons-react';
import { InputText } from 'primereact/inputtext';
import { CButton, CCloseButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import { useLocation } from "react-router-dom";
import { API } from '../../../services/Api';
import * as Constant from "../../../shared/constant/constant"
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import Loader from "../common/loader/loader"
import { useToast } from '../../../shared/toaster/Toaster';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { cilCheck, cilPlus, cilTrash, cilSettings } from '@coreui/icons';
import FooterDefault from './footerDefaultConfig';
import permissionHandler from 'src/shared/handler/permission-handler';
import { Permission } from 'src/shared/enum/enum';

const AddEditFooter = () => {
    const adminRole = JSON.parse(localStorage.getItem("user_details"))?.role?.code;
    const primaryAccountId = localStorage.getItem("account_id");

    const [masterForm, setMasterForm] = useState({
        menu1Obj: [{ title: '', url: '' }],
        menu2Obj: [{ title: '', url: '' }],
        menu3Obj: [{ title: '', url: '' }],
        menu4Obj: [{ title: '', url: '' }],
        menu1Checked: 0,
        menu2Checked: 0,
        menu3Checked: 0,
        menu4Checked: 0,
        menu1Title: '',
        menu2Title: '',
        menu3Title: '',
        menu4Title: '',
        copyright_text: '',
    });
    const search = useLocation().search;
    const id = new URLSearchParams(search).get('id');
    const [error, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false);
    const { showError, showSuccess } = useToast();
    const [isDefaultData, setIsDefaultData] = useState(false);
    const [isCopyDialog, setIsCopyDialog] = useState(false);
    const [accountData, setAccountData] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState('');

    useEffect(() => {
        if (adminRole === "SUPER_ADMIN") {
            getAccountData();
        } else {
            API.getMasterDataById(getMasterRes, '', true, primaryAccountId, Constant.FOOTER_SHOW);
            setSelectedAccount(primaryAccountId);
        }

        if (id) getPopupDataById();
    }, [])

    const getAccountData = () => {
        API.getDrpData(onGetAccountDataResponse, null, true, Constant.ACCOUNT_ACTIVE_LIST);
    }

    const onGetAccountDataResponse = {
        cancel: () => { },
        success: response => {
            if (response.meta.status_code === 200) {
                setAccountData(response.data);
            }
        },
        error: err => {
            console.log(err);
        },
        complete: () => { },
    }

    const getPopupDataById = () => {
        setIsLoading(true)
        API.getMasterDataById(getMasterRes, "", true, id, Constant.POPUP_SHOW);
    }

    const onAccountChange = e => {
        setSelectedAccount(e.target.value);
        let errors = error
        errors['account'] = ''
        setErrors({ ...errors });
        setIsLoading(true);
        API.getMasterDataById(getMasterRes, "", true, e.target.value, Constant.FOOTER_SHOW);
    }

    const setMenuData = (data) => {
        let resVal = data;
        let obj = {
            menu1Obj: [{ title: '', url: '' }],
            menu2Obj: [{ title: '', url: '' }],
            menu3Obj: [{ title: '', url: '' }],
            menu4Obj: [{ title: '', url: '' }],
            menu1Checked: 0,
            menu2Checked: 0,
            menu3Checked: 0,
            menu4Checked: 0,
            menu1Title: '',
            menu2Title: '',
            menu3Title: '',
            menu4Title: '',
            website: resVal.website_id ?? '',
            copyright_text: resVal.footer_copyright_text ?? '',
        }

        if (resVal?.footer_menus?.length > 0) {
            resVal?.footer_menus?.map((item, index) => {
                obj[`menu${index + 1}Title`] = item?.menu_header_title
                if (item?.menu_links.length > 0) {
                    let temp_arr = []
                    item?.menu_links?.map((menuItem, i) => {
                        temp_arr.push({ title: menuItem.title, url: menuItem.link })
                    })
                    obj[`menu${index + 1}Obj`] = temp_arr
                    obj[`menu${index + 1}Checked`] = item?.is_show;
                }
            });
        }

        setMasterForm(obj)
    }

    // getMasterRes Response Data Method
    const getMasterRes = {
        cancel: (c) => {
        },
        success: (response) => {
            if (response.meta.status_code === 200) {
                setIsLoading(false)
                let resVal = response.data;
                setMenuData(resVal);
            }
        },
        error: (error) => {
            setIsLoading(false)

        },
        complete: () => {
        },
    }

    const onHandleChange = (event, radioVal, index, name) => {
        // event.preventDefault()
        let errors = error
        errors[event.target.name] = ''
        setErrors({ ...errors });
        if (event?.target?.type === "checkbox") {
            setMasterForm({ ...masterForm, [event.target.name]: event.target.checked ? 1 : 0 })
        }
        else if (event?.target?.type === "radio") {
            setMasterForm({ ...masterForm, [event.target.name]: radioVal ? 1 : 0 })
        } else if (name) {
            if (index !== '') {
                let array = masterForm[event.target.name]
                array[index][name] = event.target.value
                setMasterForm({ ...masterForm, [event.target.name]: array })

            } else {
                let obj = masterForm[event.target.name]
                obj[name] = event.target.value
                setMasterForm({ ...masterForm, [event.target.name]: obj })

            }

        } else if (index !== '' && index !== undefined) {
            let array = masterForm[event.target.name]
            array[index] = event.target.value
            setMasterForm({ ...masterForm, [event.target.name]: array })
        } else {
            setMasterForm({ ...masterForm, [event.target.name]: event.target.value })
        }
    }

    const onSubmit = e => {
        e.preventDefault()

        let resObj = {
            footer_copyright_text: masterForm.copyright_text,
            is_active: 1,
            account_id: selectedAccount,
        }

        let footer_menus = []
        let menu_links_1 = []
        masterForm?.menu1Obj?.map((data, i) => {
            menu_links_1.push({ title: data.title, link: data.url })
        })
        masterForm.menu1Title && footer_menus.push({ menu_header_title: masterForm.menu1Title, menu_links: menu_links_1, is_show: masterForm?.menu1Checked })

        let menu_links_2 = []
        masterForm?.menu2Obj?.map((data, i) => {
            menu_links_2.push({ title: data.title, link: data.url })
        })
        masterForm.menu2Title && footer_menus.push({ menu_header_title: masterForm.menu2Title, menu_links: menu_links_2, is_show: masterForm?.menu2Checked })

        let menu_links_3 = []
        masterForm?.menu3Obj?.map((data, i) => {
            menu_links_3.push({ title: data.title, link: data.url })
        })
        masterForm.menu3Title && footer_menus.push({ menu_header_title: masterForm.menu3Title, menu_links: menu_links_3, is_show: masterForm?.menu3Checked })

        let menu_links_4 = []
        masterForm?.menu4Obj?.map((data, i) => {
            menu_links_4.push({ title: data.title, link: data.url })
        })
        masterForm.menu4Title && footer_menus.push({ menu_header_title: masterForm.menu4Title, menu_links: menu_links_4, is_show: masterForm?.menu4Checked })

        resObj['footer_menus'] = footer_menus
        setIsLoading(true)
        if (selectedAccount) {
            API.addMaster(addEditMasterRes, resObj, true, Constant.FOOTER_STORE);
        }
    }

    const resetForm = () => {
        let obj = {
            menu1Obj: [{ title: '', url: '' }],
            menu2Obj: [{ title: '', url: '' }],
            menu3Obj: [{ title: '', url: '' }],
            menu4Obj: [{ title: '', url: '' }],
            menu1Checked: 0,
            menu2Checked: 0,
            menu3Checked: 0,
            menu4Checked: 0,
            menu1Title: '',
            menu2Title: '',
            menu3Title: '',
            menu4Title: '',
            website: '',
            copyright_text: '',
        }
        setMasterForm(obj)
        setSelectedAccount('');
    }

    // addEditMasterRes Response Data Method
    const addEditMasterRes = {
        cancel: (c) => {
        },
        success: (response) => {
            setIsLoading(false);
            if (response.meta.status_code === 200 || response.meta.status_code === 201) {
                if (response?.meta?.message) showSuccess(response.meta.message);

                if (adminRole === "SUPER_ADMIN") {
                    setTimeout(() => {
                        resetForm()
                    }, 1000);
                } else {
                    API.getMasterDataById(getMasterRes, '', true, primaryAccountId, Constant.FOOTER_SHOW);
                }
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

    const isDisableDisplay = (menuName) => {
        switch (menuName) {
            case 'menu1Obj':
                if (masterForm.menu1Checked === 1) {
                    return false;
                }
                return true;
            case 'menu2Obj':
                if (masterForm.menu2Checked === 1) {
                    return false;
                }
                return true;
            case 'menu3Obj':
                if (masterForm.menu3Checked === 1) {
                    return false;
                }
                return true;
            case 'menu4Obj':
                if (masterForm.menu4Checked === 1) {
                    return false;
                }
                return true;

        }
    }

    const titleBodyTemplate = (rowData, indexData, name) => {
        return (
            <>
                <InputText className="form-control" disabled={isDisableDisplay(name)} value={masterForm?.[name]?.[indexData.rowIndex]?.title} name={name} onChange={(e) => onHandleChange(e, '', indexData.rowIndex, 'title')} placeholder='title' />

            </>)
    }

    const urlBodyTemplate = (rowData, indexData, name) => {
        return <InputText className="form-control" disabled={isDisableDisplay(name)} value={masterForm?.[name]?.[indexData.rowIndex]?.url} name={name} onChange={(e) => onHandleChange(e, '', indexData.rowIndex, 'url')} placeholder='url' />
    }

    const actionBodyTemplate = (rowData, indexData, name) => {
        return (
            <React.Fragment>
                {
                    !isDisableDisplay(name) ?
                        <>
                            {masterForm[name].length - 1 === indexData.rowIndex && <a title="Add" className="mr-2" onClick={(e) => addMenu1(name)}><CIcon icon={cilPlus} size="lg" /></a>
                            }
                            {(masterForm[name].length !== 1 && indexData.rowIndex !== 0) && <button className="btn btn-link mr-2 text-danger" title="Delete" onClick={(e) => deleteMenu1(e, indexData.rowIndex, name)}><CIcon icon={cilTrash} size="lg" /></button>
                            }
                        </>
                        : <></>
                }
            </React.Fragment>
        );
    }

    const addMenu1 = (name) => {
        // let arr = stoneData
        // arr.push(stonObj)
        let arr = masterForm[name]
        arr.push({ title: '', url: '' })
        setMasterForm({ ...masterForm, [name]: arr })
        // setStoneData(stoneData => [...stoneData, stonObj])
    }

    const deleteMenu1 = (e, index, name) => {
        e.preventDefault()
        let array = masterForm[name]
        array.splice(index, 1);
        setMasterForm({ ...masterForm, [name]: array })
        // setStoneData([...array])
    }

    const header1 = (
        <div className="table-header">

            <form name='filterFrm'>
                <div className="row">

                    <div className="col-lg-12 col-xl-6 pb-3 d-flex align-items-center custom-checkbox">
                        <Checkbox checked={Boolean(masterForm.menu1Checked === 1)} name="menu1Checked" onChange={(e) => onHandleChange(e)} className="me-3"></Checkbox> {/* NOSONAR */}
                        <span className="p-float-label custom-p-float-label">
                            <InputText disabled={Boolean(masterForm.menu1Checked !== 1)} className="form-control" value={masterForm.menu1Title} name="menu1Title" onChange={(e) => { onHandleChange(e) }} /> {/* NOSONAR */}
                            <label>Title </label>
                        </span>
                    </div>
                </div>
            </form>
        </div>
    );

    const header2 = (
        <div className="table-header">

            <form name='filterFrm'>
                <div className="row">

                    <div className="col-lg-12 col-xl-6 pb-3 d-flex align-items-center custom-checkbox">
                        <Checkbox checked={Boolean(masterForm.menu2Checked === 1)} name="menu2Checked" onChange={(e) => onHandleChange(e)} className="me-3"></Checkbox> {/* NOSONAR */}
                        <span className="p-float-label custom-p-float-label">
                            <InputText disabled={Boolean(masterForm.menu2Checked !== 1)} className="form-control" value={masterForm.menu2Title} name="menu2Title" onChange={(e) => { onHandleChange(e) }} /> {/* NOSONAR */}
                            <label>Title </label>
                        </span>
                    </div>
                </div>
            </form>
        </div>
    );

    const onCloseIsDefault = () => {
        setIsDefaultData(!isDefaultData)
    }

    const onCopyDefaultValue = async () => {
        setIsLoading(true);
        API.getMasterDataById(bindDefaultCopyValue, "", true, '', Constant.GET_DEFAULT_FOOTER);
        setIsCopyDialog(!isCopyDialog);
    }

    const bindDefaultCopyValue = {
        cancel: (c) => {
        },
        success: (response) => {
            if (response.meta.status_code === 200) {
                setIsLoading(false)
                let resVal = response.data?.original?.data[0];
                setMenuData(resVal);
            }
        },
        error: (error) => {
            setIsLoading(false)

        },
        complete: () => {
        },
    }

    const accountDataTemplate = option => {
        return (
            <>{`${option?.company_name ?? ''} (${option?.code ?? ''})`}</>
        )
    }

    return (

        <div>
            {isLoading && <Loader />}
            <form name="subMasterFrm" noValidate>
                <div className="">

                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title p-m-0 float-start">Footer Configuration </h5>
                            <div className="float-end">
                                <div className="common-add-btn">
                                    <CButton
                                        color="primary"
                                        onClick={onCloseIsDefault}
                                    >
                                        <CIcon icon={cilSettings} className="mr-1" />
                                        Default Configuration
                                    </CButton>
                                    <CButton
                                        color="warning"
                                        onClick={() => setIsCopyDialog(!isCopyDialog)}
                                    >
                                        <CIcon icon={cilSettings} className="mr-1" />
                                        Copy Configuration
                                    </CButton>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            {/* <p className="col-sm-12 text-right">Fields marked with  are mandatory.</p> */}
                            <div className="">
                                <fieldset className="fieldset">
                                    <legend className="legend">Basic Details</legend>

                                    <div className="row">
                                        {
                                            adminRole === "SUPER_ADMIN" && (
                                                <div className="col-lg-3 mb-3">
                                                    <span className="p-float-label custom-p-float-label">
                                                        <Dropdown
                                                            value={selectedAccount}
                                                            className="form-control"
                                                            options={accountData}
                                                            onChange={e => onAccountChange(e)}
                                                            itemTemplate={accountDataTemplate}
                                                            valueTemplate={accountDataTemplate}
                                                            optionLabel="company_name"
                                                            optionValue="_id"
                                                            filter
                                                            filterBy="company_name,code"
                                                        />
                                                        <label>HCP</label>
                                                    </span>
                                                    <p className="error">{error['website']}</p>
                                                </div>
                                            )
                                        }

                                        <div className="col-md-12 col-lg-3 mb-3">
                                            <span className="p-float-label custom-p-float-label">
                                                <InputText className="form-control" name="copyright_text" value={masterForm.copyright_text} onChange={(e) => onHandleChange(e)} />
                                                <label>Copyright Text </label>
                                            </span>
                                            {/* <p className="error">{error['url']}</p> */}
                                        </div>
                                    </div>
                                </fieldset>



                                <div className='row'>
                                    <div className='col-xl-6'>
                                        <fieldset className="fieldset">
                                            <legend className="legend">Menu 1</legend>
                                            <div className="data-table-responsive">
                                                <DataTable value={masterForm.menu1Obj} className="p-datatable-responsive-demo" header={header1}
                                                >
                                                    <Column field="title" header="Menu Title" body={(rowData, indexData) => titleBodyTemplate(rowData, indexData, 'menu1Obj')}></Column>
                                                    <Column field="url" header="Url" body={(rowData, indexData) => urlBodyTemplate(rowData, indexData, 'menu1Obj')}></Column>
                                                    <Column header="Action" body={(rowData, indexData) => actionBodyTemplate(rowData, indexData, 'menu1Obj')}></Column>

                                                </DataTable>
                                            </div>
                                        </fieldset>
                                    </div>
                                    <div className='col-xl-6'>
                                        <fieldset className="fieldset">
                                            <legend className="legend">Menu 2</legend>

                                            <div className="data-table-responsive">
                                                <DataTable value={masterForm.menu2Obj} className="p-datatable-responsive-demo" header={header2}
                                                >
                                                    <Column field="title" header="Menu Title" body={(rowData, indexData) => titleBodyTemplate(rowData, indexData, 'menu2Obj')}></Column>
                                                    <Column field="url" header="Url" body={(rowData, indexData) => urlBodyTemplate(rowData, indexData, 'menu2Obj')}></Column>
                                                    <Column header="Action" body={(rowData, indexData) => actionBodyTemplate(rowData, indexData, 'menu2Obj')}></Column>

                                                </DataTable>
                                            </div>
                                        </fieldset>
                                    </div>
                                    {/* <div className='col-xl-6'>
                                        <fieldset className="fieldset">
                                            <legend className="legend">Menu 3</legend>

                                            <div className="data-table-responsive">
                                                <DataTable value={masterForm.menu3Obj} className="p-datatable-responsive-demo" header={header3}
                                                >
                                                    <Column field="title" header="Menu Title" body={(rowData, indexData) => titleBodyTemplate(rowData, indexData, 'menu3Obj')}></Column>
                                                    <Column field="url" header="Url" body={(rowData, indexData) => urlBodyTemplate(rowData, indexData, 'menu3Obj')}></Column>
                                                    <Column header="Action" body={(rowData, indexData) => actionBodyTemplate(rowData, indexData, 'menu3Obj')}></Column>

                                                </DataTable>
                                            </div>
                                        </fieldset>
                                    </div>
                                    <div className='col-xl-6'>
                                        <fieldset className="fieldset">
                                            <legend className="legend">Menu 4</legend>

                                            <div className="data-table-responsive">
                                                <DataTable value={masterForm.menu4Obj} className="p-datatable-responsive-demo" header={header4}
                                                >
                                                    <Column field="title" header="Menu Title" body={(rowData, indexData) => titleBodyTemplate(rowData, indexData, 'menu4Obj')}></Column>
                                                    <Column field="url" header="Url" body={(rowData, indexData) => urlBodyTemplate(rowData, indexData, 'menu4Obj')}></Column>
                                                    <Column header="Action" body={(rowData, indexData) => actionBodyTemplate(rowData, indexData, 'menu4Obj')}></Column>

                                                </DataTable>
                                            </div>
                                        </fieldset>
                                    </div> */}
                                </div>


                            </div>

                        </div>
                    </div>

                    {
                        permissionHandler(Permission.FOOTER_DATA_STORE) && (
                            <div className="card-footer">
                                <button
                                    className="btn btn-primary mb-2 mr-2"
                                    onClick={e => onSubmit(e)}
                                    disabled={!selectedAccount}
                                >
                                    <CIcon icon={cilCheck} className="mr-1" /> Save
                                </button>
                            </div>
                        )
                    }
                </div>
            </form>
            <FooterDefault visible={isDefaultData}
                onClose={onCloseIsDefault}
            />

            <CModal visible={isCopyDialog}>
                <CModalHeader className="bg-primary" onClose={() => setIsCopyDialog(!isCopyDialog)}>
                    <CModalTitle>Copy Default Confirmation</CModalTitle>
                    <CCloseButton className="text-white" onClick={() => setIsCopyDialog(!isCopyDialog)}></CCloseButton>
                </CModalHeader>
                <CModalBody>Are you sure you want to Copy the Deafult Configuration in your system?</CModalBody>
                <CModalFooter>
                    <CButton color="danger" onClick={() => setIsCopyDialog(!isCopyDialog)}>Cancel</CButton>
                    <CButton color="primary" onClick={onCopyDefaultValue}>Copy</CButton>
                </CModalFooter>
            </CModal>

        </div>
    )
}

export default AddEditFooter
