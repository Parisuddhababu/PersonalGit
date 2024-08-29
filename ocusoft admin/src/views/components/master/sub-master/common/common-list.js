import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";

import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Paginator } from "primereact/paginator";
import { useHistory } from "react-router-dom";
import CIcon from "@coreui/icons-react";
import { Dropdown } from "primereact/dropdown";
import { CButton, CBadge } from "@coreui/react";
import { cilCheckCircle, cilCloudUpload, cilList, cilPencil, cilPlus, cilTrash, cilXCircle } from "@coreui/icons";

import { API } from "src/services/Api";
import * as  Constant from "src/shared/constant/constant";
import Loader from "../../../common/loader/loader";
import { CommonMaster, Permission } from "src/shared/enum/enum";
import { useToast } from "src/shared/toaster/Toaster";
import ImageModal from "../../../common/ImageModalPopup/image-modal";
import permissionHandler from "src/shared/handler/permission-handler";
import websiteHandler from "src/shared/handler/website-handler";
import DeleteModal from "../../../common/DeleteModalPopup/delete-modal";
import { isEmpty } from "src/shared/handler/common-handler";

const CommonMasterList = props => { // NOSONAR
    let history = useHistory();

    const accountVal = localStorage.getItem("is_main_account")
    const adminRole = JSON.parse(localStorage.getItem("user_details"))?.role?.code;
    const primaryAccountId = localStorage.getItem("account_id");

    const initialFilter = {
        start: 0,
        length: Constant.DT_ROW,
        sort_order: '',
        sort_field: '',
    }

    const [isDeleteModalShow, setIsDeleteModalShow] = useState(false)
    const [searchVal, setSearchVal] = useState(initialFilter);
    const [deleteObj, setDeleteObj] = useState({})
    const [masterListData, setMasterListData] = useState([])
    const [selectedStatus, setSelectedStatus] = useState('')
    const [selectedDefault, setSelectedDefault] = useState('')
    const [selectedName, setSelectedName] = useState('')
    const [selectedAccount, setSelectedAccount] = useState('')
    const [accountData, setAccountData] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [Isaccount, setIsaccount] = useState(false);
    const [isImageShow, setIsImageShow] = useState(false)
    const [imageObj, setImageObj] = useState({})
    const { showError, showSuccess } = useToast();
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedMetalPriceType, setSelectedMetalPriceType] = useState('');
    const [filteredKeys, setFilteredKeys] = useState([]);

    const metalPriceTypeEnabledModules = [
        CommonMaster.LABOUR_CHARGE,
        CommonMaster.METAL_TYPE,
        CommonMaster.METAL_PURITY
    ];

    const typeEnabledModules = [
        CommonMaster.METAL_TYPE,
        CommonMaster.METAL_PURITY
    ];

    const countryEnabledModules = [
        CommonMaster.LABOUR_CHARGE,
        CommonMaster.PRODUCT_CERTIFICATES,
    ];

    const statusOption = Constant.STATUS_OPTION

    const modules = [
        CommonMaster.RETURN_REASONS,
        CommonMaster.PRODUCT_CERTIFICATES,
        CommonMaster.PRODUCT_LOOKS_TAG,
        CommonMaster.PRODUCT_WEAR_TAG,
        CommonMaster.CAREER_DESIGNATION,
        CommonMaster.CAREER_LOCATION,
        CommonMaster.CAREER_REFERENCE,
        CommonMaster.CAREER_JOBS
    ];

    const filterMap = {
        name: selectedName,
        is_active: selectedStatus.code,
        is_default: selectedDefault.code,
    };

    if (websiteHandler(props.masterName)) {
        filterMap["account_id"] = adminRole === "SUPER_ADMIN" ? selectedAccount : primaryAccountId;
    }

    if (countryEnabledModules.includes(props.masterName)) filterMap["country_id"] = selectedCountry;

    if (metalPriceTypeEnabledModules.includes(props.masterName)) {
        if (typeEnabledModules.includes(props.masterName)) {
            filterMap["type"] = selectedMetalPriceType;
        } else {
            filterMap["metal_type"] = selectedMetalPriceType;
        }
    }

    useEffect(() => {
        getAccountData();
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

    useEffect(() => {
        setMasterListData(props.data)
        setIsLoading(props.loading)
        if (props.masterName === CommonMaster.LABOUR_CHARGE) {
            if (selectedCountry?.length === 0) {
                setSelectedCountry(props.selectedCountry);
            }

            if (selectedMetalPriceType?.length === 0) {
                setSelectedMetalPriceType(props.selectedMetalPriceType);
            }
        }
    }, [props])

    useEffect(() => {
        const { masterName } = props;
        const isAccount = websiteHandler(masterName);
        setIsaccount(isAccount)
    }, [(props && props.masterName)])


    const getAccountData = () => {
        setIsLoading(true)
        API.getAccountDataByLoginId(accountRes, "", true)
    }

    // accountRes Response Data Method
    const accountRes = {
        cancel: (c) => {
        },
        success: (response) => {
            if (response.meta.status_code === 200) {
                let resVal = response.data
                setAccountData(resVal)
                setIsLoading(false)
            }
        },
        error: (error) => {
            setIsLoading(false)
        },
        complete: () => {
        },
    }

    const onAccountChange = (e) => {
        setSelectedAccount(e.target.value)
    }

    const onCountryChange = e => {
        setSelectedCountry(e.target.value);
    }

    const onMetalPriceTypeChange = e => {
        setSelectedMetalPriceType(e.target.value);
    }

    const editData = (rowData) => {
        history.push(`/${props.routerName}/edit/?id=${rowData._id}&name=${props?.masterName}`)
    }

    const onStatusChange = (e) => {
        setSelectedStatus(e.value);
    }

    const onDefaultChange = (e) => {
        setSelectedDefault(e.value);
    }

    const onChangeName = (e) => {
        setSelectedName(e.target.value)
    }

    const confirmDeleteProduct = (data) => {
        let obj = { ...data }
        obj.urlName = props.masterName
        setDeleteObj(obj)
        setIsDeleteModalShow(true)
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Action</span>
                {permissionHandler(props.Update) &&
                    <a title="Edit" className="mr-2" onClick={() => editData(rowData)}><CIcon icon={cilPencil} size="lg" /></a>
                }{
                    permissionHandler(props.Delete) &&
                    <button className="btn btn-link mr-2 text-danger" title="Delete" onClick={() => confirmDeleteProduct(rowData)}><CIcon icon={cilTrash} size="lg" /></button>
                }
                {/* <button className="btn btn-link " title="Change Sequence"><CIcon icon={cilSwapVertical} size="lg" /></button> */}
            </React.Fragment>
        );
    }

    const onUpdateStatus = (rowData) => {
        let obj = {
            "uuid": rowData._id,
            "is_active": rowData.is_active === Constant.StatusEnum.active ? Constant.StatusEnum.inactive : Constant.StatusEnum.active
        }
        setIsLoading(true)
        API.UpdateStatus(onUpdateStatusRes, obj, true, rowData._id, getUrl());

    }

    // onUpdateStatusRes Response Data Method
    const onUpdateStatusRes = {
        cancel: () => { setIsLoading(false); },
        success: (response) => {
            setIsLoading(false);
            if (response?.meta?.status) {
                if (response?.meta?.message) showSuccess(response.meta.message);
                const uuid = response?.data?.uuid ?? '';

                if (uuid) {
                    let _masterListData = masterListData;
                    const dataIndex = masterListData.findIndex(dataObj => dataObj?._id === uuid);
                    const isSubjectActive = _masterListData?.[dataIndex]?.is_active ?? 1;
                    if (dataIndex > -1) {
                        _masterListData[dataIndex]["is_active"] = isSubjectActive === 1 ? 0 : 1;
                    }

                    setMasterListData([..._masterListData]);
                } else {
                    getData();
                }
            }
        },
        error: err => {
            setIsLoading(false);

            if (err?.meta?.message) {
                showError(err.meta.message);
            }
        },
        complete: () => { },
    }
    const exportFile = (event) => {
        setIsLoading(true)
        const data = Object.assign({},
            selectedName && { name: selectedName },
            (
                adminRole !== "SUPER_ADMIN" &&
                props?.masterName === CommonMaster.PRODUCT_CERTIFICATES
            ) ? { account_id: primaryAccountId } : (Isaccount && { account_id: selectedAccount }),
            selectedStatus && { is_active: selectedStatus?.code },
            selectedDefault && { is_default: selectedDefault?.code },
            (
                props.masterName === CommonMaster.LABOUR_CHARGE ||
                props.masterName === CommonMaster.PRODUCT_CERTIFICATES
            ) && selectedCountry && { country_id: selectedCountry },
        );

        API.getMasterList(exportRes, data, true, getExportUrl());
    }

    const exportRes = {
        cancel: (c) => {
        },
        success: (response) => {
            if (response.meta.status_code === 200 || response.meta.status_code === 201) {
                setIsLoading(false)
                const resFile = response.data?.file;
                if (resFile) {
                    window.open(resFile, "_self");
                } else {
                    showError("No data available")
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

    const accountDataTemplate = option => {
        return (
            <>{`${option?.name ?? ''} (${option?.code ?? ''})`}</>
        )
    }

    const header = (
        <div className="table-header">
            <div className="clearfix table-header-content">
                <h5 className="p-m-0 float-start"><CIcon icon={cilList} className="mr-1" /> {props?.masterName} <CBadge color="danger" className="ms-auto">{props.totalRecords}</CBadge></h5>
                {(permissionHandler(props.Create) || permissionHandler(props.Export)) &&
                    <div className="float-end">
                        <div className="common-add-btn">
                            {permissionHandler(props.Create) && <CButton color="primary" onClick={() => { history.push(`/${props.routerName}/add/?name=${props.masterName}`) }}><CIcon icon={cilPlus} className="mr-1" />Add {props?.masterName}</CButton>}
                            {props.isExport && permissionHandler(props.Export) && <CButton type="button" disabled={masterListData?.length === 0} onClick={(e) => exportFile(e)} className="btn-success p-mr-2"> <CIcon icon={cilCloudUpload} className="mr-1" />Export</CButton>}
                        </div>
                    </div>
                }
            </div>

            <hr />
            <form name='filterFrm' onSubmit={(e) => setGlobalFilter(e)}>
                <div className="row">
                    {
                        accountVal !== '0' && Isaccount && adminRole === "SUPER_ADMIN" && (
                            <div className="col-md-6 col-lg-3 pb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <Dropdown
                                        value={selectedAccount}
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
                                    <label>Account </label>
                                </span>
                            </div>
                        )
                    }

                    {
                        (
                            props?.masterName === CommonMaster.LABOUR_CHARGE ||
                            props?.masterName === CommonMaster.PRODUCT_CERTIFICATES
                        ) && (
                            <div className="col-md-6 col-lg-3 pb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <Dropdown
                                        value={selectedCountry}
                                        className="form-control"
                                        options={props?.countryList}
                                        onChange={e => onCountryChange(e)}
                                        optionLabel="name"
                                        optionValue="_id"
                                        filter
                                        filterBy='name'
                                    />
                                    <label>Country</label>
                                </span>
                            </div>
                        )
                    }

                    <div className="col-md-6 col-lg-3 pb-3">
                        {/* <label>Name </label>
                        <InputText className="form-control" value={selectedName} placeholder="Search Name" name="name" onChange={(e) => onChangeName(e)} /> */}
                        <span className="p-float-label custom-p-float-label">
                            <InputText id="inputtext" maxLength="255" className="form-control" value={selectedName} name="name" onChange={(e) => onChangeName(e)} />
                            <label htmlFor="inputtext">Name</label>
                        </span>
                    </div>

                    <div className="col-md-6 col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <Dropdown className="form-control" value={selectedStatus} options={statusOption} onChange={onStatusChange} optionLabel="name" />
                            <label>Status </label>

                        </span>
                    </div>

                    <div className="col-md-6 col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <Dropdown className="form-control" value={selectedDefault} options={statusOption} onChange={onDefaultChange} optionLabel="name" />
                            <label>Default </label>

                        </span>
                    </div>

                    {
                        metalPriceTypeEnabledModules.includes(props?.masterName) && (
                            <div className="col-md-6 col-lg-3 pb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <Dropdown
                                        value={selectedMetalPriceType}
                                        className="form-control"
                                        options={props?.metalPriceTypeList}
                                        onChange={e => onMetalPriceTypeChange(e)}
                                        optionLabel="code"
                                        optionValue="code"
                                        filter
                                        filterBy="name,code"
                                    />
                                    <label>Metal Price Type</label>
                                </span>
                            </div>
                        )
                    }

                    <div className="col-md-12 col-lg-3 pb-3 search-reset">
                        <CButton type='submit' color="primary" className="mr-2">Search</CButton>
                        <CButton type='button' color="danger" onClick={() => resetGlobalFilter()} >Reset</CButton>
                    </div>
                </div>
            </form>
        </div>
    );

    const statusBodyTemplate = (rowData) => {
        if (rowData?.is_active === Constant.StatusEnum.active) {
            return (
                <React.Fragment>
                    <span className="p-column-title">Status</span>

                    <button className="btn btn-link text-success" title="Change Status" onClick={() => onUpdateStatus(rowData)}><CIcon icon={cilCheckCircle} size="lg" /></button>
                </React.Fragment>)
        } else {
            return (
                <React.Fragment>
                    <span className="p-column-title">Status</span>

                    <button className="btn btn-link text-danger" title="Change Status" onClick={() => onUpdateStatus(rowData)}><CIcon icon={cilXCircle} size="lg" /></button>
                </React.Fragment>)
        }
    }

    const defaultBodyTemplate = (rowData) => {
        if (rowData?.is_default === 1) {
            return (
                <React.Fragment>
                    <span className="p-column-title">Default</span>

                    <button className="btn btn-link text-success pe-none" title="Default"><CIcon icon={cilCheckCircle} size="lg" /></button>
                </React.Fragment>)
        } else {
            return (
                <React.Fragment>
                    <span className="p-column-title">Default</span>

                    <button className="btn btn-link text-danger pe-none" title="Default"><CIcon icon={cilXCircle} size="lg" /></button>
                </React.Fragment>)
        }
    }

    const nameBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </React.Fragment>
        );
    }

    const rangeBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Range</span>
                {`${rowData.min} - ${rowData.max}`}
            </React.Fragment>
        );
    }


    const codeBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Code</span>
                <p>{rowData.code || Constant.NO_VALUE}</p>
            </React.Fragment>
        );
    }

    const metalPriceTypeBodyTemplate = rowData => {
        let key = "metal_type";
        if (typeEnabledModules.includes(props?.masterName)) {
            key = "type";
        }

        return (
            <React.Fragment>
                <span className="p-column-title">Metal Price Type</span>
                <p>{rowData[key] || Constant.NO_VALUE}</p>
            </React.Fragment>
        )
    }

    const onCloseDeleteConfirmation = (value, isDelete, message) => {
        setIsDeleteModalShow(value)
        if (isDelete) {
            showSuccess(message)
            // Only one record on second page and delete then it should be come to previous page in all modules
            if (masterListData.length === 1 && searchVal.start) {
                setSearchVal({ ...searchVal, start: parseInt(searchVal.start) - parseInt(searchVal.length) });
            } else {
                getData()
            }
        }
    }

    const getData = () => {
        switch (props?.masterName) { // NOSONAR
            case CommonMaster.METAL_WEIGHT:
                props.getMetalData()
                break
            case CommonMaster.PRICE:
                props.getPriceData()
                break
            case CommonMaster.COLOR_STONE:
                props.getColorStoneData()
                break
            case CommonMaster.METAL_PRICE_TYPE:
                props.getMetalPriceTypeData()
                break
            case CommonMaster.LABOUR_CHARGE_TYPE:
                props.getLabourChargeTypeData()
                break
            case CommonMaster.LABOUR_CHARGE:
                props.getLabourChargeData()
                break
            case CommonMaster.CAREER_DESIGNATION:
                props.getCareerDesignationData()
                break
            case CommonMaster.CAREER_LOCATION:
                props.getCareerLocationData()
                break
            case CommonMaster.DIAMOND_QUALITY:
                props.getDiamondQualityData()
                break
            case CommonMaster.CAREER_REFERENCE:
                props.getReferenceData()
                break
            case CommonMaster.DIAMOND_CLARITIES:
                props.getDiamondClarities()
                break
            case CommonMaster.DIAMOND_COLOR:
                props.getDiamondColor()
                break
            case CommonMaster.DIAMOND_SHAPES:
                props.getDiamondShapes()
                break
            case CommonMaster.DIAMOND_SIEVES:
                props.getDiamondSieves()
                break
            case CommonMaster.LENGTH:
                props.getLengthData()
                break
            case CommonMaster.GAUGE:
                props.getGaugeData()
                break
            case CommonMaster.SHOP_MODULES:
                props.getShopeData()
                break
            case CommonMaster.PRODUCT_CERTIFICATES:
                props.getProductData()
                break
            case CommonMaster.RETURN_REASONS:
                props.getReturnData()
                break
            case CommonMaster.SOLITAIR_COLOR:
                props.getSolitaireColorData()
                break
            case CommonMaster.SOLITAIR_CUT:
                props.getSolitaireCutData()
                break
            case CommonMaster.SOLITAIR_CLARITY:
                props.getSolitaireClarityData()
                break
            case CommonMaster.SOLITAIR_SHAPE:
                props.getSolitaireShapeData()
                break
            case CommonMaster.SOLITAIR_POLISH:
                props.getSolitairePolishData()
                break
            case CommonMaster.SOLITAIR_SYMMETRY:
                props.getSolitaireSymmetryData()
                break
            case CommonMaster.SOLITAIR_LABS:
                props.getSolitaireLabsData()
                break
            case CommonMaster.SOLITAIR_EYE_CLEAN:
                props.getSolitaireEyeCleansData()
                break
            case CommonMaster.OCCASION:
                props.getOccasionData()
                break
            case CommonMaster.BANGLE_SIZE:
                props.getBracelateSizeData()
                break
            case CommonMaster.BANGLE_BRACELATE:
                props.getBracelateData()
                break
            case CommonMaster.PRODUCT_WEAR_TAG:
                props.getProductWearData()
                break
            case CommonMaster.METAL_PURITY:
                props.getMetalPurity()
                break
            case CommonMaster.GENDER:
                props.getGender()
                break
            case CommonMaster.PRODUCT_LOOKS_TAG:
                props.getProductLooksTag()
                break
            case CommonMaster.METAL_TYPE:
                props.getMetalType()
                break
        }
    }

    const getUrl = () => {
        switch (props.masterName) { // NOSONAR
            case CommonMaster.METAL_WEIGHT:
                return Constant.UPDATEMETALSTATUS
            case CommonMaster.PRICE:
                return Constant.UPDATEPRICESTATUS
            case CommonMaster.COLOR_STONE:
                return Constant.UPDATECOLORSTONESTATUS
            case CommonMaster.METAL_PRICE_TYPE:
                return Constant.UPDATEMETALPRICETYPESTATUS
            case CommonMaster.LABOUR_CHARGE_TYPE:
                return Constant.UPDATELABOURCHARGETYPESTATUS
            case CommonMaster.LABOUR_CHARGE:
                return Constant.UPDATELABOURCHARGEDSTATUS
            case CommonMaster.CAREER_DESIGNATION:
                return Constant.UPDATECAREERDESIGNATIONSTATUS
            case CommonMaster.CAREER_LOCATION:
                return Constant.UPDATECAREERLOCATIONSTATUS
            case CommonMaster.DIAMOND_QUALITY:
                return Constant.UPDATEDIAMONDQUALITYSTATUS
            case CommonMaster.CAREER_REFERENCE:
                return Constant.UPDATECAREERREFERENCESTATUS
            case CommonMaster.DIAMOND_CLARITIES:
                return Constant.UPDATEDIAMONDCLARITIESSTATUS
            case CommonMaster.DIAMOND_COLOR:
                return Constant.UPDATEDIAMONDCOLORSTATUS
            case CommonMaster.DIAMOND_SHAPES:
                return Constant.UPDATEDIAMONDSHAPESSTATUS
            case CommonMaster.DIAMOND_SIEVES:
                return Constant.UPDATEDIAMONDSIEVESSTATUS
            case CommonMaster.LENGTH:
                return Constant.UPDATELENGTHSTATUS
            case CommonMaster.GAUGE:
                return Constant.UPDATEGAUGESTATUS
            case CommonMaster.SHOP_MODULES:
                return Constant.UPDATESHOPFORMODULESTATUS
            case CommonMaster.PRODUCT_CERTIFICATES:
                return Constant.UPDATEPRODUCTCERTIFICATESTATUS
            case CommonMaster.RETURN_REASONS:
                return Constant.UPDATERETURNREASONSSTATUS
            case CommonMaster.SOLITAIR_COLOR:
                return Constant.UPDATESOLITAIRECOLORSTATUS
            case CommonMaster.SOLITAIR_CUT:
                return Constant.UPDATESOLITAIRECUTSTATUS
            case CommonMaster.SOLITAIR_CLARITY:
                return Constant.UPDATESOLITAIRECLARITYSTATUS
            case CommonMaster.SOLITAIR_SHAPE:
                return Constant.UPDATESOLITAIRESHAPESTATUS
            case CommonMaster.SOLITAIR_POLISH:
                return Constant.UPDATESOLITAIREPOLISHSTATUS
            case CommonMaster.SOLITAIR_SYMMETRY:
                return Constant.UPDATESOLITAIRESYMMETRYSTATUS
            case CommonMaster.SOLITAIR_LABS:
                return Constant.UPDATESOLITAIRELABSSTATUS
            case CommonMaster.SOLITAIR_EYE_CLEAN:
                return Constant.UPDATESOLITAIREEYECLEANSTATUS
            case CommonMaster.OCCASION:
                return Constant.UPDATEOCCASIONSTATUS
            case CommonMaster.BANGLE_SIZE:
                return Constant.UPDATEBANGLESIZESTATUS
            case CommonMaster.BANGLE_BRACELATE:
                return Constant.UPDATEBANGLEBRACELATESIZESTATUS
            case CommonMaster.PRODUCT_WEAR_TAG:
                return Constant.UPDATEPRODUCTWEARTAGSTATUS
            case CommonMaster.METAL_PURITY:
                return Constant.UPDATEMETALPURITYSTATUS
            case CommonMaster.GENDER:
                return Constant.UPDATEGENDERSTATUS
            case CommonMaster.PRODUCT_LOOKS_TAG:
                return Constant.UPDATEPRODUCTLOOKSTAGSTATUS
            case CommonMaster.METAL_TYPE:
                return Constant.UPDATEMETALTYPESTATUS
        }
    }

    const getMoveUrl = () => {
        switch (props.masterName) { // NOSONAR
            case CommonMaster.METAL_WEIGHT:
                return Constant.MOVEMETAL
            case CommonMaster.PRICE:
                return Constant.MOVEPRICE
            case CommonMaster.COLOR_STONE:
                return Constant.MOVECOLORSTONE
            case CommonMaster.LABOUR_CHARGE:
                return Constant.MOVELABOURCHARGED
            case CommonMaster.CAREER_DESIGNATION:
                return Constant.MOVECAREERDESIGNATION
            case CommonMaster.CAREER_LOCATION:
                return Constant.MOVECAREERLOCATION
            case CommonMaster.DIAMOND_QUALITY:
                return Constant.MOVEDIAMONDQUALITY
            case CommonMaster.CAREER_REFERENCE:
                return Constant.MOVECAREERREFERENCE
            case CommonMaster.DIAMOND_CLARITIES:
                return Constant.MOVEDIAMONDCLARITIES
            case CommonMaster.DIAMOND_COLOR:
                return Constant.MOVEDIAMONDCOLOR
            case CommonMaster.DIAMOND_SHAPES:
                return Constant.MOVEDIAMONDSHAPES
            case CommonMaster.DIAMOND_SIEVES:
                return Constant.MOVEDIAMONDSIEVES
            case CommonMaster.LENGTH:
                return Constant.MOVELENGTH
            case CommonMaster.GAUGE:
                return Constant.MOVEGAUGE
            case CommonMaster.SHOP_MODULES:
                return Constant.MOVESHOPFORMODULE
            case CommonMaster.PRODUCT_CERTIFICATES:
                return Constant.MOVEPRODUCTCERTIFICATE
            case CommonMaster.RETURN_REASONS:
                return Constant.MOVERETURNREASONS
            case CommonMaster.SOLITAIR_COLOR:
                return Constant.MOVESOLITAIRECOLOR
            case CommonMaster.SOLITAIR_CUT:
                return Constant.MOVESOLITAIRECUT
            case CommonMaster.SOLITAIR_CLARITY:
                return Constant.MOVESOLITAIRECLARITY
            case CommonMaster.SOLITAIR_SHAPE:
                return Constant.MOVESOLITAIRESHAPE
            case CommonMaster.SOLITAIR_POLISH:
                return Constant.MOVESOLITAIREPOLISH
            case CommonMaster.SOLITAIR_SYMMETRY:
                return Constant.MOVESOLITAIRESYMMETRY
            case CommonMaster.SOLITAIR_LABS:
                return Constant.MOVESOLITAIRELABS
            case CommonMaster.SOLITAIR_EYE_CLEAN:
                return Constant.MOVESOLITAIREEYECLEAN
            case CommonMaster.OCCASION:
                return Constant.MOVEOCCASION
            case CommonMaster.BANGLE_SIZE:
                return Constant.MOVEBANGLESIZE
            case CommonMaster.BANGLE_BRACELATE:
                return Constant.MOVEBANGLEBRACELATESIZE
            case CommonMaster.PRODUCT_WEAR_TAG:
                return Constant.MOVEPRODUCTWEARTAG
            case CommonMaster.METAL_PURITY:
                return Constant.MOVEMETALPURITY
            case CommonMaster.GENDER:
                return Constant.MOVEGENDER
            case CommonMaster.PRODUCT_LOOKS_TAG:
                return Constant.MOVEPRODUCTLOOKSTAG
            case CommonMaster.METAL_TYPE:
                return Constant.MOVEMETALTYPE
            case CommonMaster.METAL_PRICE_TYPE:
                return Constant.MOVEMETALPRICETYPE
            case CommonMaster.LABOUR_CHARGE_TYPE:
                return Constant.MOVELABOURCHARGETYPE
        }
    }
    const getExportUrl = () => {
        if (props.masterName === CommonMaster.CAREER_LOCATION) {
            return Constant.CAREER_LOCATION_EXPORT_EXCEL;
        }
    }

    const setGlobalFilter = (event) => {
        event.preventDefault();
        onFilterData()
    }

    const onFilterData = filters => {
        const { start, length, sort_field, sort_order } = searchVal;
        const data = { start, length }, _filteredKeys = [];

        if (sort_field) data["sort_param"] = sort_field;
        if (sort_order) data["sort_type"] = sort_order === 1 ? "asc" : "desc";
        const appiledFilters = filters ?? filterMap;

        for (const filterKey in appiledFilters) {
            const value = filterMap[filterKey];
            if (!isEmpty(value)) {
                data[filterKey] = value;
                _filteredKeys.push(filterKey);
            }
        }

        if (props.masterName === CommonMaster.LABOUR_CHARGE) {
            if (!filteredKeys.includes("country_id")) _filteredKeys.push("country_id");
            if (!filteredKeys.includes("metal_type")) _filteredKeys.push("metal_type");
            data["country_id"] = selectedCountry;
            data["metal_type"] = selectedMetalPriceType;
        }

        setFilteredKeys([..._filteredKeys]);
        props.onSearch(data);
    }

    const resetGlobalFilter = () => {
        setSelectedStatus('');
        setSelectedName('');
        setSelectedDefault('');
        setSelectedMetalPriceType('');
        setSelectedAccount('');

        if (props.masterName === CommonMaster.LABOUR_CHARGE) {
            initialFilter.metal_type = props?.defaultMetalPriceType;
            initialFilter.country_id = props?.defaultCountry;
            setSelectedCountry(props?.defaultCountry);
            setSelectedMetalPriceType(props?.defaultMetalPriceType);
            setSearchVal(initialFilter);
        } else if (props.masterName === CommonMaster.PRODUCT_CERTIFICATES) {
            setSelectedCountry('');
            setSearchVal(initialFilter);
        } else {
            setSearchVal(initialFilter);
        }
    }


    const onColReorder = () => {
    }

    const onRowReorder = (e) => {
        let obj = { 'uuid': masterListData[e.dragIndex]._id, 'newposition': e.dropIndex + 1, 'oldposition': e.dragIndex + 1 }
        setIsLoading(true)

        API.MoveData(moveStatusRes, obj, true, getMoveUrl());
    }

    // moveStatusRes Response Data Method
    const moveStatusRes = {
        cancel: (c) => {
        },
        success: (response) => {
            if (response.meta.status_code === 200) {
                showSuccess(response.meta.message)


                setIsLoading(false)

                getData()
            }
        },
        error: (error) => {
            showError(error.meta.message)


            setIsLoading(false)

        },
        complete: () => {
        },
    }

    const handlePageChange = e => {
        setSearchVal({ ...searchVal, start: e.first, length: e.rows });
    }

    const footer = (
        <div className="table-footer">
            <Paginator
                first={searchVal.start}
                rows={searchVal.length}
                onPageChange={handlePageChange}
                totalRecords={props.totalRecords}
                template={Constant.DT_PAGE_TEMPLATE}
                rowsPerPageOptions={Constant.DT_ROWS_LIST}
                currentPageReportTemplate={Constant.DT_PAGE_REPORT_TEMP}
            />
        </div>
    );

    const onSort = e => {
        setSearchVal({ ...searchVal, sort_field: e.sortField, sort_order: e.sortOrder });
    }

    const onImageClick = (e, rowdata) => {
        e.stopPropagation();
        setImageObj(rowdata?.image)
        setIsImageShow(true)
    }

    const onCloseImageModal = () => {
        setIsImageShow(false)
    }

    const imageBodyTemplate = (rowData) => {
        return rowData?.image ? <img src={rowData?.image?.path} onError={(e) => e.target.src = Constant.PRIME_URL} alt={rowData.image?.file_name} className="product-image" onClick={(e) => onImageClick(e, rowData)} /> : "-";
    }

    const checkMovePermission = () => {
        switch (props.masterName) {
            case CommonMaster.PRICE:
                return permissionHandler(Permission.PRICE_RANGE_MOVE);
            case CommonMaster.COLOR_STONE:
                return permissionHandler(Permission.COLOR_STONE_MOVE);
            case CommonMaster.LABOUR_CHARGE:
                return permissionHandler(Permission.LABOUR_CHARGE_MOVE);
            case CommonMaster.LENGTH:
                return permissionHandler(Permission.LENGTH_MOVE);
            case CommonMaster.SHOP_MODULES:
                return permissionHandler(Permission.SHOP_MOVE);
            case CommonMaster.GAUGE:
                return permissionHandler(Permission.GAUGE_MOVE);
            case CommonMaster.OCCASION:
                return permissionHandler(Permission.OCCASION_MOVE);
            case CommonMaster.GENDER:
                return permissionHandler(Permission.GENDER_MOVE);
            case CommonMaster.DIAMOND_QUALITY:
                return permissionHandler(Permission.DIAMOND_QUALITY_MOVE);
            case CommonMaster.DIAMOND_SIEVES:
                return permissionHandler(Permission.DIAMOND_SIEVES_MOVE);
            case CommonMaster.DIAMOND_SHAPES:
                return permissionHandler(Permission.DIAMOND_SHAPE_MOVE);
            case CommonMaster.DIAMOND_CLARITIES:
                return permissionHandler(Permission.DIAMOND_CLARITY_MOVE);
            case CommonMaster.DIAMOND_COLOR:
                return permissionHandler(Permission.DIAMOND_COLOR_MOVE);
            case CommonMaster.SOLITAIR_EYE_CLEAN:
                return permissionHandler(Permission.SOLITAIRE_EYE_CLEAN_MOVE);
            case CommonMaster.SOLITAIR_LABS:
                return permissionHandler(Permission.SOLITAIRE_LABS_MOVE);
            case CommonMaster.SOLITAIR_SYMMETRY:
                return permissionHandler(Permission.SOLITAIRE_SYMMETRY_MOVE);
            case CommonMaster.SOLITAIR_POLISH:
                return permissionHandler(Permission.SOLITAIRE_POLISH_MOVE);
            case CommonMaster.SOLITAIR_SHAPE:
                return permissionHandler(Permission.SOLITAIRE_SHAPE_MOVE);
            case CommonMaster.SOLITAIR_CLARITY:
                return permissionHandler(Permission.SOLITAIRE_CLARITY_MOVE);
            case CommonMaster.SOLITAIR_CUT:
                return permissionHandler(Permission.SOLITAIRE_CUT_MOVE);
            case CommonMaster.METAL_WEIGHT:
                return permissionHandler(Permission.METAL_WEIGHT_MOVE);
            case CommonMaster.METAL_TYPE:
                return permissionHandler(Permission.METAL_TYPE_MOVE);
            case CommonMaster.METAL_PURITY:
                return permissionHandler(Permission.METAL_PURITY_MOVE);
            case CommonMaster.BANGLE_BRACELATE:
                return permissionHandler(Permission.BANGLE_BRACELET_MOVE);
            case CommonMaster.BANGLE_SIZE:
                return permissionHandler(Permission.BANGLE_SIZE_MOVE);
            case CommonMaster.METAL_PRICE_TYPE:
                return permissionHandler(Permission.METAL_PRICE_TYPE);
            case CommonMaster.LABOUR_CHARGE_TYPE:
                return permissionHandler(Permission.LABOUR_CHARGE_TYPE);
            default:
                return false;
        }
    }

    return (
        <>
            {isLoading && <Loader />}

            <div className="datatable-responsive-demo custom-react-table">
                <div className="card">
                    <DataTable
                        stripedRows
                        showGridlines
                        header={header}
                        onSort={onSort}
                        reorderableColumns
                        value={masterListData}
                        responsiveLayout="scroll"
                        onRowReorder={onRowReorder}
                        onColReorder={onColReorder}
                        sortField={searchVal.sort_field}
                        sortOrder={searchVal.sort_order}
                        className="p-datatable-responsive-demo"
                        footer={masterListData?.length > 0 ? footer : ''}
                    >
                        {
                            !modules.includes(props?.masterName) && checkMovePermission() && (
                                <Column rowReorder style={{ width: "5%" }} />
                            )
                        }

                        <Column field="name" header="Name" sortable body={nameBodyTemplate} style={{ width: "20%" }} />

                        {
                            props?.masterName === "Price" && (
                                <Column
                                    field="range"
                                    header="Range"
                                    body={rangeBodyTemplate}
                                    style={{ width: "20%" }}
                                />
                            )
                        }

                        {
                            props.masterName === "Product Certificates" && (
                                <Column
                                    className="text-center"
                                    body={imageBodyTemplate}
                                    style={{ width: "30%" }}
                                    header="Certificate Image"
                                />
                            )
                        }

                        {
                            props?.masterName !== "Price" && (
                                <Column
                                    sortable
                                    field="code"
                                    header="Code"
                                    body={codeBodyTemplate}
                                    style={{ width: "30%" }}
                                />
                            )
                        }

                        {
                            metalPriceTypeEnabledModules.includes(props?.masterName) && (
                                <Column
                                    field="metal_type"
                                    style={{ width: "30%" }}
                                    header="Metal Price Type"
                                    body={metalPriceTypeBodyTemplate}
                                />
                            )
                        }

                        <Column field="default" header="Default" body={defaultBodyTemplate} style={{ width: "10%" }} />

                        {
                            permissionHandler(props.Status) && (
                                <Column
                                    field="status"
                                    header="Status"
                                    style={{ width: "10%" }}
                                    body={statusBodyTemplate}
                                />
                            )
                        }

                        {
                            (permissionHandler(props.Update) || permissionHandler(props.Delete)) && (
                                <Column
                                    field="action"
                                    header="Action"
                                    style={{ width: "10%" }}
                                    body={actionBodyTemplate}
                                />
                            )
                        }
                    </DataTable>
                </div>
            </div>

            <DeleteModal visible={isDeleteModalShow} onCloseDeleteModal={onCloseDeleteConfirmation} deleteObj={deleteObj} />
            <ImageModal visible={isImageShow} imgObj={imageObj} onCloseImageModal={onCloseImageModal} />
        </>
    )
}

export default CommonMasterList;
