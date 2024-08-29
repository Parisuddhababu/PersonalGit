// eslint-disable-next-line
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import React, { useState, useEffect } from 'react';
import CIcon from '@coreui/icons-react';
import { InputNumber } from 'primereact/inputnumber';
import { API } from '../../../../services/Api';
import * as Constant from "../../../../shared/constant/constant"
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import Loader from "../../common/loader/loader"
import { useToast } from '../../../../shared/toaster/Toaster';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { cilCheck, cilPlus, cilTrash } from '@coreui/icons';
import { InputText } from 'primereact/inputtext';

const AddProductConfigration = ({ accountData }) => {
    const accountVal = localStorage.getItem('is_main_account')
    const adminRole = JSON.parse(localStorage.getItem('user_details'))?.role?.code;
    const accountId = localStorage.getItem('account_id');
    const [countryData, setCountryData] = useState([])
    const [masterForm, setMasterForm] = useState({
        menu1Obj: [{ from: 0.00, to: 0.00, shippingCharge: 0.00 }],
        gift_charge: 0.00,
        cod_amount: 0.00,
        advance_payment: 0.00,
        stamping_charge: 0.00,
        halmark_charge: 0.00,
        price_breakup: 0,
        account: localStorage.getItem('account_id'),
        country_id: '',
        delivery_days: 1,
        cancel_order_days: 1,
        show_todays_rate: 0,
        show_sku: 0,
        show_quick_view: 0,
        show_add_to_cart: 0,
        show_short_desc: 0,
        show_long_desc: 0,
    })
    const [error, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false);
    const { showError, showSuccess } = useToast();
    const [currenyCode, setCurrencyCode] = useState();

    useEffect(() => {
        if (accountId && masterForm.country_id) {
            getProductConfigByAccount(accountId, masterForm.country_id);
        }
    }, [])

    useEffect(() => {
        setMasterForm({ ...masterForm, ['account']: accountId });
    }, [accountData])

    useEffect(() => {
        if (masterForm.account && masterForm.country_id) {
            let currenyCodeVal = countryData.find((ele) => ele._id == masterForm.country_id);
            if (currenyCodeVal?.currency_code) {
                setCurrencyCode(currenyCodeVal?.currency_code)
            }
            getProductConfigByAccount(masterForm.account, masterForm.country_id);
        }
    }, [masterForm.country_id, masterForm.account]);

    useEffect(() => {
        if (masterForm.account) {
            getCountryData();
        }
    }, [masterForm.account]);

    const onAccountChange = (e) => {
        setMasterForm({ ...masterForm, ['account']: e.target.value })

        let errors = error
        errors['account'] = ''
        setErrors({ ...errors });
    }

    const getProductConfigByAccount = (accountId, countryId) => {
        if (accountId && countryId) {
            setIsLoading(true);
            let productObj = {
                account_id: accountId,
                country_id: countryId
            }
            API.addMaster(getMasterRes, productObj, true, Constant.SHOW_PRODUCT_CONFIGRATION_DETAILS);
        }
    }

    // getMasterRes Response Data Method
    const getMasterRes = {
        cancel: () => { },
        success: (response) => {
            setIsLoading(false)
            if (response.meta.status_code === 200 || response.meta.status_code === 201) {
                if (response.data.length == 0) {
                    let objNew = {
                        country_id: masterForm.country_id,
                        account: masterForm.account,
                        menu1Obj: [{ from: 0.00, to: 0.00, shippingCharge: 0.00 }],
                        gift_charge: 0.00,
                        cod_amount: 0.00,
                        advance_payment: 0.00,
                        stamping_charge: 0.00,
                        halmark_charge: 0.00,
                        price_breakup: 0,
                        delivery_days: 1,
                        cancel_order_days: 1,
                        show_todays_rate: 0,
                        show_sku: 0,
                        show_quick_view: 0,
                        show_add_to_cart: 0,
                        show_short_desc: 0,
                        show_long_desc: 0,
                    };
                    setMasterForm(objNew);
                    return
                }
                let resVal = response.data[0];
                let obj = {
                    account: resVal.account.account_id || '',
                    menu1Obj: resVal.shipping_amount_criteria || [{ from: 0.00, to: 0.00, shippingCharge: 0.00 }],
                    gift_charge: resVal.gift_wrapping_charge || 0.00,
                    cod_amount: resVal.max_cod_amount || 0.00,
                    advance_payment: resVal.order_advance_payment || 0.00,
                    stamping_charge: resVal.stamping_charge || 0.00,
                    halmark_charge: resVal.hallmark_charge || 0.00,
                    price_breakup: resVal.view_price_breakup || 0,
                    country_id: resVal.country.country_id,
                    delivery_days: parseInt(resVal.max_order_delivery_days),
                    cancel_order_days: parseInt(resVal.cancel_order_days),
                    show_todays_rate: parseInt(resVal.show_todays_rate),
                    show_sku: parseInt(resVal.is_show_sku),
                    show_quick_view: parseInt(resVal.is_show_quick_view),
                    show_add_to_cart: parseInt(resVal.is_show_add_to_cart),
                    show_long_desc: parseInt(resVal.is_show_long_desc),
                    show_short_desc: parseInt(resVal.is_show_short_desc),
                }
                setMasterForm({ ...obj })

                setErrors({})
            }
        },
        error: (error) => {
            setIsLoading(false)
            // Reset form field when change account and data not found
            if (error?.meta.status_code === 404) {
                resetForm();
            }
        },
        complete: () => {
        },
    }

    const getCountryData = () => {
        if (masterForm.account) {
            const data = { account_id: masterForm.account };
            API.getMasterList(getCountryDataRes, data, true, Constant.ACTIVE_ACCOUNT_COUNTRY);
        }
    }

    // getTypeDataRes Response Data Method
    const getCountryDataRes = {
        cancel: (c) => {
        },
        success: (response) => {
            setIsLoading(false);
            let _countryData = [];
            if (response?.data?.length > 0) _countryData = response.data.filter(country => country);
            setCountryData(response.data);
        },
        error: (error) => {
            setIsLoading(false)

        },
        complete: () => {
        },
    }

    const onHandleValidation = () => {
        let errors = {}
        let formIsValid = true;
        let validationObj = {
            account: masterForm.account,
            gift_charge: masterForm.gift_charge,
            cod_amount: masterForm.cod_amount,
            delivery_days: masterForm.delivery_days,
            cancel_order_days: masterForm.cancel_order_days,
            country: masterForm.country_id
        }

        for (const [key, value] of Object.entries(validationObj)) {
            const keyName = key.replace(/_/g, ' ');
            if (!value) {
                formIsValid = false;
                errors[key] = `${keyName} is required`;
            }
            if (masterForm.delivery_days < 1) {
                formIsValid = false;
                errors['delivery_days'] = `delivery days must be grater then 0`;
            }
            if (masterForm.cancel_order_days < 1) {
                formIsValid = false;
                errors['cancel_order_days'] = `Cancel Order Days must be grater then 0`;
            }
            setErrors({ ...errors });
        }
        return formIsValid;
    }

    const onHandleChange = (event, radioVal, index) => {
        const { name } = event.originalEvent.target;
        let errors = error
        errors[name] = ''
        setErrors({ ...errors });
        if (event?.target?.type === "checkbox") {
            setMasterForm({ ...masterForm, [event.target.name]: event.target.checked ? 1 : 0 })
        } else if (event?.target?.type === "radio") {
            setMasterForm({ ...masterForm, [event.target.name]: radioVal ? 1 : 0 })
        } else if (name == 'from' || name == 'to' || name == 'shippingCharge') {
            const [...array] = masterForm.menu1Obj;
            array[index][name] = event.value;
            setMasterForm({ ...masterForm, menu1Obj: array })
        } else {
            setMasterForm({ ...masterForm, [event.originalEvent.target.name]: event.value })
        }
    }


    const onSubmit = e => { // NOSONAR
        e.preventDefault();
        const _accountId = (adminRole === 'SUPER_ADMIN') ? masterForm.account : localStorage.getItem('account_id');
        if (onHandleValidation()) {
            let resObj = {
                gift_wrapping_charge: masterForm.gift_charge,
                max_cod_amount: masterForm.cod_amount,
                order_advance_payment: masterForm.advance_payment,
                stamping_charge: masterForm?.stamping_charge,
                hallmark_charge: masterForm.halmark_charge,
                view_price_breakup: masterForm.price_breakup ? +(masterForm.price_breakup) : 0,
                account_id: _accountId,
                shipping_amount_criteria: masterForm.menu1Obj || [],
                country_id: masterForm.country_id,
                max_order_delivery_days: masterForm?.delivery_days ? +(masterForm.delivery_days) : 0,
                cancel_order_days: masterForm?.cancel_order_days ? +(masterForm.cancel_order_days) : 0,
                show_todays_rate: masterForm.show_todays_rate ? +(masterForm.show_todays_rate) : 0,
                is_show_sku: masterForm.show_sku ? +(masterForm.show_sku) : 0,
                is_show_quick_view: masterForm.show_quick_view ? +(masterForm.show_quick_view) : 0,
                is_show_add_to_cart: masterForm.show_add_to_cart ? +(masterForm.show_quick_view) : 0,
                is_show_short_desc: masterForm.show_short_desc ? +(masterForm.show_short_desc) : 0,
                is_show_long_desc: masterForm.show_long_desc ? +(masterForm.show_long_desc) : 0,
            }

            setIsLoading(true)
            API.addMaster(addEditMasterRes, resObj, true, Constant.PRODUCT_CONFIGRATION);
        }
    }

    // addEditMasterRes Response Data Method
    const addEditMasterRes = {
        cancel: (c) => {
        },
        success: (response) => {
            if (response.meta.status_code === 200 || response.meta.status_code === 201) {
                showSuccess(response.meta.message)
                setIsLoading(false)
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

    const resetForm = () => {
        let obj = {
            menu1Obj: [{ from: 0.00, to: 0.00, shippingCharge: 0.00 }],
            gift_charge: 0.00,
            cod_amount: 0.00,
            advance_payment: 0.00,
            stamping_charge: 0.00,
            halmark_charge: 0.00,
            price_breakup: 0,
            account: masterForm.account,
        }
        setMasterForm(obj)
    }

    const fromBodyTemplate = (rowData, indexData, name) => {
        return (
            <div className='input-group'>
                <InputNumber value={masterForm?.[name]?.[indexData.rowIndex]?.from} name="from" onChange={(e) => onHandleChange(e, '', indexData.rowIndex)} locale="en-IN" placeholder="INR 0.00" disabled={!currenyCode} />
                {
                    currenyCode &&
                    <span className="input-group-text text-uppercase" id="">{currenyCode}</span>
                }
            </div>)
    }

    const toBodyTemplate = (rowData, indexData, name) => {
        return (
            <div className='input-group'>
                <InputNumber value={masterForm?.[name]?.[indexData.rowIndex]?.to} name="to" onChange={(e) => onHandleChange(e, '', indexData.rowIndex)} locale="en-IN" placeholder="INR 0.00" disabled={!currenyCode} />
                {
                    currenyCode &&
                    <span className="input-group-text text-uppercase" id="">{currenyCode}</span>
                }
            </div>
        )
    }

    const shippingBodyTemplate = (rowData, indexData, name) => {
        return (
            <div className='input-group'>
                <InputNumber value={masterForm?.[name]?.[indexData.rowIndex]?.shippingCharge} name="shippingCharge" onChange={(e) => onHandleChange(e, '', indexData.rowIndex)} locale="en-IN" placeholder="INR 0.00" disabled={!currenyCode} />
                {
                    currenyCode &&
                    <span className="input-group-text text-uppercase" id="">{currenyCode}</span>
                }
            </div>
        )
    }

    const actionBodyTemplate = (rowData, indexData, name) => {
        return (
            <React.Fragment>
                {masterForm[name].length - 1 === indexData.rowIndex && <a title="Add" className="mr-2" onClick={(e) => addMenu1(name)}><CIcon icon={cilPlus} size="lg" /></a>
                }
                {(masterForm[name].length !== 1 && indexData.rowIndex !== 0) && <button className="btn btn-link mr-2 text-danger" title="Delete" onClick={(e) => deleteMenu1(e, indexData.rowIndex, name)}><CIcon icon={cilTrash} size="lg" /></button>
                }
            </React.Fragment>
        );
    }

    const addMenu1 = (name) => {
        let arr = masterForm[name]
        arr.push({ from: '', to: '', shippingCharge: '' })
        setMasterForm({ ...masterForm, [name]: arr })
    }

    const deleteMenu1 = (e, index, name) => {
        e.preventDefault()
        let array = masterForm[name]
        array.splice(index, 1);
        setMasterForm({ ...masterForm, [name]: array })
    }

    const onCountryChange = (e) => {
        setMasterForm({ ...masterForm, ['country_id']: e.target.value })
        let errors = error
        errors['country_id'] = ''
        setErrors({ ...errors });
    }

    const setDeliverDays = (e) => {
        setMasterForm({ ...masterForm, ['delivery_days']: e.target.value })
        let errors = error
        errors['delivery_days'] = ''
        setErrors({ ...errors });
    }

    const setCancelOrderDays = (e) => {
        setMasterForm({ ...masterForm, ['cancel_order_days']: e.target.value })
        let errors = error
        errors['cancel_order_days'] = ''
        setErrors({ ...errors });
    }

    const accountDataTemplate = option => {
        return (
            <>{`${option?.name ?? ''} (${option?.code ?? ''})`}</>
        )
    }

    return (

        <div>
            {isLoading && <Loader />}
            <form name="subMasterFrm" noValidate>
                <div className="">

                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title">Product Configuration </h5>
                        </div>
                        <div className="card-body">
                            {/* <p className="col-sm-12 text-right">Fields marked with  are mandatory.</p> */}
                            <div className='row'>
                                {
                                    adminRole === 'SUPER_ADMIN' && (
                                        <div className="col-md-6 mb-3">
                                            <span className="p-float-label custom-p-float-label">
                                                <Dropdown
                                                    value={masterForm.account}
                                                    className="form-control"
                                                    options={accountData}
                                                    onChange={onAccountChange}
                                                    itemTemplate={accountDataTemplate}
                                                    valueTemplate={accountDataTemplate}
                                                    optionLabel="name"
                                                    optionValue="_id"
                                                    filter
                                                    filterBy="name,code"
                                                />
                                                <label>Account <span className="text-danger">*</span></label>
                                            </span>
                                            <p className="error">{error['account']}</p>
                                        </div>
                                    )
                                }
                                <div className="col-md-6 mb-3">
                                    <span className="p-float-label custom-p-float-label">
                                        <Dropdown value={masterForm.country_id} className="form-control" options={countryData} onChange={onCountryChange} optionLabel="name" optionValue="_id" filter showClear filterBy="name" disabled={accountVal === '0'} />
                                        <label>Country <span className="text-danger">*</span></label>

                                    </span>
                                    <p className="error">{error['country']}</p>
                                </div>
                                <div className='col-xl-12'>
                                    <fieldset className="fieldset">
                                        <legend className="legend">Shipping Amount Criteria</legend>
                                        <div className="data-table-responsive">
                                            <DataTable value={masterForm.menu1Obj} className="p-datatable-responsive-demo"
                                            >
                                                <Column field="from" header="From(>=)" body={(rowData, indexData) => fromBodyTemplate(rowData, indexData, 'menu1Obj')}></Column>
                                                <Column field="to" header="To(<)" body={(rowData, indexData) => toBodyTemplate(rowData, indexData, 'menu1Obj')}></Column>
                                                <Column header="Shipping Charge" body={(rowData, indexData) => shippingBodyTemplate(rowData, indexData, 'menu1Obj')}></Column>
                                                <Column style={{ width: '100px' }} body={(rowData, indexData) => actionBodyTemplate(rowData, indexData, 'menu1Obj')}></Column>

                                            </DataTable>
                                        </div>
                                    </fieldset>
                                </div>

                                <div className='col-xl-12'>
                                    <fieldset className="fieldset">
                                        <legend className="legend">Gift Charge</legend>

                                        <div className="row">
                                            <div className="col-md-12 col-lg-6 col-xl-4 mb-3 ">
                                                <span className="p-float-label custom-p-float-label">
                                                    <div className='input-group'>
                                                        <InputNumber value={masterForm?.gift_charge} name="gift_charge" onChange={(e) => onHandleChange(e)} locale="en-IN" placeholder="INR 0.00" disabled={!currenyCode} />
                                                        {
                                                            currenyCode &&
                                                            <span className="input-group-text text-uppercase" id="">{currenyCode}</span>
                                                        }
                                                        <label>Gift Wrapping Charge <span className="text-danger">*</span></label>
                                                    </div>
                                                </span>
                                                <p className="error">{error['gift_charge']}</p>
                                            </div>
                                            <div className="col-md-12 col-lg-6 col-xl-4 mb-3">
                                                <span className="p-float-label custom-p-float-label color-picker-wrapper">
                                                    <div className='input-group'>
                                                        <InputNumber value={masterForm?.cod_amount} name="cod_amount" onChange={(e) => onHandleChange(e)} locale="en-IN" placeholder="INR 0.00" disabled={!currenyCode} />
                                                        {
                                                            currenyCode &&
                                                            <span className="input-group-text text-uppercase" id="">{currenyCode}</span>
                                                        }
                                                        <label>Maximum COD Amount <span className="text-danger">*</span> </label>
                                                    </div>
                                                </span>
                                                <p className="error">{error['cod_amount']}</p>
                                            </div>

                                            <div className="col-md-12 col-lg-6 col-xl-4 mb-3">
                                                <span className="p-float-label custom-p-float-label color-picker-wrapper">
                                                    <InputNumber value={masterForm?.advance_payment} name="advance_payment" onChange={(e) => onHandleChange(e)} suffix="%" />
                                                    {/* <InputText className="form-control" autoFocus value={masterForm.text_color} /> */}
                                                    <label>Order Advacne Payment(%)</label>
                                                </span>
                                                {/* <p className="error">{error['url']}</p> */}
                                            </div>

                                        </div>

                                    </fieldset>
                                </div>

                                <div className='col-xl-12'>
                                    <fieldset className="fieldset">
                                        <legend className="legend">Other Charges</legend>

                                        <div className="row">
                                            <div className="col-md-12 col-lg-6 mb-3">
                                                <span className="p-float-label custom-p-float-label">
                                                    <div className='input-group'>
                                                        <InputNumber
                                                            value={masterForm?.stamping_charge}
                                                            name="stamping_charge"
                                                            onChange={(e) => onHandleChange(e)}
                                                            locale="en-IN"
                                                            placeholder="INR 0.00"
                                                            disabled={!currenyCode}
                                                        />
                                                        {
                                                            currenyCode && (
                                                                <span className="input-group-text text-uppercase">
                                                                    {currenyCode}
                                                                </span>
                                                            )
                                                        }
                                                        <label>Stamping Charge</label>
                                                    </div>
                                                </span>
                                            </div>

                                            <div className="col-md-12 col-lg-6 mb-3">
                                                <span className="p-float-label custom-p-float-label color-picker-wrapper">
                                                    <div className='input-group'>
                                                        <InputNumber
                                                            value={masterForm?.halmark_charge}
                                                            name="halmark_charge"
                                                            onChange={e => onHandleChange(e)}
                                                            locale="en-IN"
                                                            placeholder="INR 0.00"
                                                            disabled={!currenyCode}
                                                        />
                                                        {
                                                            currenyCode && (
                                                                <span className="input-group-text text-uppercase">
                                                                    {currenyCode}
                                                                </span>
                                                            )
                                                        }
                                                        <label>Hallmark Charge</label>
                                                    </div>
                                                </span>
                                                <p className="error">{error['halmark_charge']}</p>
                                            </div>


                                        </div>

                                    </fieldset>
                                </div>

                                <div className='col-xl-12'>
                                    <fieldset className="fieldset">
                                        <legend className="legend">Order Settings</legend>

                                        <div className="row">
                                            <div className="col-md-12 col-lg-6 mb-3">
                                                <span className="p-float-label custom-p-float-label">
                                                    <InputText
                                                        type="number"
                                                        name="delivery_days"
                                                        className="form-control"
                                                        value={masterForm?.delivery_days}
                                                        onChange={e => setDeliverDays(e)}
                                                    />
                                                    <label>Max Delivery Days <span className="text-danger">*</span></label>
                                                </span>
                                                <p className="error">{error['delivery_days']}</p>
                                            </div>

                                            <div className="col-md-12 col-lg-6 mb-3">
                                                <span className="p-float-label custom-p-float-label">
                                                    <InputText className='form-control' value={masterForm?.cancel_order_days} name="cancel_order_days" onChange={(e) => setCancelOrderDays(e)} type="number" />
                                                    <label>Cancel Order Days <span className="text-danger">*</span></label>
                                                </span>
                                                <p className="error">{error['cancel_order_days']}</p>
                                            </div>
                                        </div>

                                    </fieldset>
                                </div>

                                <div className='col-xl-12'>
                                    <label>Price Breakup</label>
                                    <div className="col-lg-12 col-xl-6 pb-3 d-flex align-items-center custom-checkbox">
                                        <label>View Price Breakup </label>
                                        <Checkbox checked={masterForm.price_breakup === 1 ? true : false} name="price_breakup" onChange={(e) => onHandleChange(e)} className="me-3"></Checkbox>
                                    </div>
                                </div>

                                <div className='col-xl-12'>
                                    <div className="col-lg-12 col-xl-6 pb-3 d-flex align-items-center custom-checkbox">
                                        <label className="mt-2">{"Show Today's Rates"}</label>

                                        <Checkbox
                                            checked={masterForm.show_todays_rate === 1 ? true : false}
                                            name="show_todays_rate"
                                            onChange={e => onHandleChange(e)}
                                            className="me-3"
                                        />
                                    </div>
                                </div>

                                <div className="col-xl-12">
                                    <div className="col-lg-12 col-xl-6 pb-3 d-flex align-items-center custom-checkbox">
                                        <label className="mt-2">Show SKU</label>

                                        <Checkbox
                                            name="show_sku"
                                            className="me-3"
                                            onChange={e => onHandleChange(e)}
                                            checked={masterForm.show_sku ? true : false}
                                        />
                                    </div>
                                </div>

                                <div className="col-xl-12">
                                    <div className="col-lg-12 col-xl-6 pb-3 d-flex align-items-center custom-checkbox">
                                        <label>{"Show Quick View"}</label>
                                        <Checkbox
                                            checked={masterForm.show_quick_view === 1 ? true : false}
                                            name="show_quick_view"
                                            onChange={e => onHandleChange(e)}
                                            className="me-3"
                                        />
                                    </div>
                                </div>

                                <div className="col-xl-12">
                                    <div className="col-lg-12 col-xl-6 pb-3 d-flex align-items-center custom-checkbox">
                                        <label>{"Show Add to Cart"}</label>
                                        <Checkbox
                                            checked={masterForm.show_add_to_cart === 1 ? true : false}
                                            name="show_add_to_cart"
                                            onChange={e => onHandleChange(e)}
                                            className="me-3"
                                        />
                                    </div>
                                </div>

                                <div className="col-xl-12">
                                    <div className="col-lg-12 col-xl-6 pb-3 d-flex align-items-center custom-checkbox">
                                        <label>{"Show Short Description"}</label>
                                        <Checkbox
                                            className="me-3"
                                            name="show_short_desc"
                                            onChange={onHandleChange}
                                            checked={masterForm.show_short_desc === 1 ? true : false}
                                        />
                                    </div>
                                </div>

                                <div className="col-xl-12">
                                    <div className="col-lg-12 col-xl-6 pb-3 d-flex align-items-center custom-checkbox">
                                        <label>{"Show Long Description"}</label>
                                        <Checkbox
                                            className="me-3"
                                            name="show_long_desc"
                                            onChange={onHandleChange}
                                            checked={masterForm.show_long_desc === 1 ? true : false}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card-footer">
                        <button className="btn btn-primary mb-2 mr-2" onClick={(e) => { onSubmit(e) }}>
                            <CIcon icon={cilCheck} className="mr-1" />Save
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddProductConfigration;
