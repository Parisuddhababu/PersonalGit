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
import * as Constant from "../../../../shared/constant/constant"
import { CommonMaster, ADD_EDIT_BASE_CONFIGURATION } from "../../../../shared/enum/enum";
import Loader from "../../common/loader/loader"
import * as APPCONSTANTS from "src/shared/constant/constant";
import { useToast } from 'src/shared/toaster/Toaster';

const DeleteModal = (props) => {
    const { showError } = useToast();
    const [visible, setVisible] = useState(false)
    const [deleteData, setDeleteData] = useState({})
    const toast = useRef(null);
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setVisible(props.visible)
        setDeleteData(props.deleteObj)
    }, [props])

    const onClose = () => {
        props.onCloseDeleteModal(false, false)
    }

    const onDelete = () => {
        setIsLoading(true)
        API.deleteMaster(deleteMasterRes, "", true, deleteData._id, getDeleteUrls());
    }

    // deleteMasterRes Response Data Method
    const deleteMasterRes = {
        cancel: () => { },
        success: response => {
            setIsLoading(false)
            if (response?.meta?.status) {
                props.onCloseDeleteModal(false, true, response.meta.message, deleteData);
            }
        },
        error: err => {
            setIsLoading(false)
            const message = err?.meta?.message ?? "Something went wrong";
            showError(message);
            onClose();
        },
        complete: () => { },
    }

    const getDeleteUrls = () => {
        switch (deleteData.urlName) { // NOSONAR
            case CommonMaster.PRICE:
                return Constant.DELETEPRICE
            case CommonMaster.METAL_WEIGHT:
                return Constant.DELETEMETAL
            case CommonMaster.COLOR_STONE:
                return Constant.DELETECOLORSTONE
            case CommonMaster.METAL_PRICE_TYPE:
                return Constant.DELETEMETALPRICETYPE
            case CommonMaster.LABOUR_CHARGE:
                return Constant.DELETELABOURCHARGED
            case CommonMaster.CAREER_DESIGNATION:
                return Constant.DELETECAREERDESIGNATION
            case CommonMaster.CAREER_LOCATION:
                return Constant.DELETECAREERLOCATION
            case CommonMaster.DIAMOND_QUALITY:
                return Constant.DELETEDIAMONDQUALITY
            case CommonMaster.CAREER_REFERENCE:
                return Constant.DELETECAREERREFERENCE
            case CommonMaster.DIAMOND_CLARITIES:
                return Constant.DELETEDIAMONDCLARITIES
            case CommonMaster.DIAMOND_COLOR:
                return Constant.DELETEDIAMONDCOLOR
            case CommonMaster.DIAMOND_SHAPES:
                return Constant.DELETEDIAMONDSHAPES
            case CommonMaster.DIAMOND_SIEVES:
                return Constant.DELETEDIAMONDSIEVES
            case CommonMaster.LENGTH:
                return Constant.DELETELENGTH
            case CommonMaster.GAUGE:
                return Constant.DELETEGAUGE
            case CommonMaster.SHOP_MODULES:
                return Constant.DELETESHOPFORMODULE
            case CommonMaster.PRODUCT_CERTIFICATES:
                return Constant.DELETEPRODUCTCERTIFICATE
            case CommonMaster.RETURN_REASONS:
                return Constant.DELETERETURNREASONS
            case CommonMaster.SOLITAIR_COLOR:
                return Constant.DELETESOLITAIRECOLOR
            case CommonMaster.SOLITAIR_CUT:
                return Constant.DELETESOLITAIRECUT
            case CommonMaster.SOLITAIR_CLARITY:
                return Constant.DELETESOLITAIRECLARITY
            case CommonMaster.SOLITAIR_SHAPE:
                return Constant.DELETESOLITAIRESHAPE
            case CommonMaster.SOLITAIR_POLISH:
                return Constant.DELETESOLITAIREPOLISH
            case CommonMaster.SOLITAIR_SYMMETRY:
                return Constant.DELETESOLITAIRESYMMETRY
            case CommonMaster.SOLITAIR_LABS:
                return Constant.DELETESOLITAIRELABS
            case CommonMaster.SOLITAIR_EYE_CLEAN:
                return Constant.DELETESOLITAIREEYECLEAN
            case CommonMaster.OCCASION:
                return Constant.DELETEOCCASION
            case CommonMaster.BANGLE_SIZE:
                return Constant.DELETEBANGLESIZE
            case CommonMaster.BANGLE_BRACELATE:
                return Constant.DELETEBANGLEBRACELATESIZE
            case CommonMaster.PRODUCT_WEAR_TAG:
                return Constant.DELETEPRODUCTWEARTAG
            case CommonMaster.METAL_PURITY:
                return Constant.DELETEMETALPURITY
            case CommonMaster.GENDER:
                return Constant.DELETEGENDER
            case CommonMaster.PRODUCT_LOOKS_TAG:
                return Constant.DELETEPRODUCTLOOKSTAG
            case CommonMaster.METAL_TYPE:
                return Constant.DELETEMETALTYPE
            case CommonMaster.FAQ:
                return Constant.DELETEFAQ
            case CommonMaster.EVENT:
                return Constant.DELETEEVENT
            case CommonMaster.COUPON:
                return Constant.DELETECOUPONS
            case CommonMaster.GROUP_MASTER:
                return Constant.DELETEGROUPMASTER
            case CommonMaster.CONTACT_US:
                return Constant.DELETECONTACTUS
            case CommonMaster.BLOG:
                return Constant.DELETEBLOG
            case CommonMaster.TESTIMONIAL:
                return Constant.DELETETESTIMONIALS
            case CommonMaster.RINGSIZE:
                return Constant.DELETERINGSIZE
            case CommonMaster.CATEGORY_MANAGEMENT:
                return Constant.DELETECATEGORY
            case CommonMaster.FILTER_SEQUENCE:
                return Constant.FILTERDELETE
            case CommonMaster.CONTACTADDRESS:
                return Constant.DELETECONTACTADDRESS
            case CommonMaster.OUR_CLIENTS:
                return Constant.DELETEOURCLIENTS
            case CommonMaster.BANNER:
                return Constant.DELETEBANNER
            case CommonMaster.USER_MANAGEMENT:
                return Constant.DELETEUSER
            case CommonMaster.ROLE_PERMISSION:
                return Constant.ROLE_DELETE
            case CommonMaster.HCP:
                 return Constant.ACCOUNT_DELETE  
             case CommonMaster.ACCOUNT_ADDRESS:
                 return Constant.ADDRESS_DELETE  
            case CommonMaster.COUNTRY:
                return Constant.COUNTRY_DELETE   
            case CommonMaster.STATE:
                return Constant.STATE_DELETE
            case CommonMaster.CITY:
                return Constant.CITY_DELETE
            case CommonMaster.SLUG_MASTER:
                return Constant.SLUG_DELETE
            case CommonMaster.CATEGORY_TYPE:
                return Constant.CATEGORYTYPE_DELETE
            case CommonMaster.POPUP_MASTER:
                return Constant.POPUP_DELETE
            case CommonMaster.PRODUCT_ENQUIRY:
                return Constant.DELETE_PRODUCT_QUESTION
            case CommonMaster.PRODUCT:
                return Constant.PRODUCT_DELETE 
            case CommonMaster.PLAN:
                return Constant.PLAN_DELETE  
            case CommonMaster.CATALOGUE :
                return Constant.DELETE_PRODUCT_GROUP   
            case CommonMaster.NUMBER_GENERATOR:
                return Constant.NUMBER_GENERATOR_DELETE
            case CommonMaster.PINCODE :
                return Constant.PINCODE_DELETE    
            case CommonMaster.CAREER_JOBS :
                return Constant.CAREEAR_DELETE    
            case CommonMaster.OWNER_MESSAGES :
                return Constant.OWNER_MESSAGES_DELETE
            case CommonMaster.COLLECTION:
                return Constant.DELETE_COLLECTION
            case CommonMaster.STYLE:
                return Constant.DELETE_STYLE
            case CommonMaster.ORDER:
                return Constant.ORDER_DELETE
            case CommonMaster.PRODUCT_TAG:
                return Constant.PRODUCT_TAG_DELETE
            case CommonMaster.BASE_TEMPLATE:
                return Constant.DELETE_TEMPLATE
            case ADD_EDIT_BASE_CONFIGURATION:
                return Constant.DELETECATEGORYDOC
            case CommonMaster.LABOUR_CHARGE_TYPE:
                return Constant.DELETELABOURCHARGETYPE
            case CommonMaster.PAYMENT_GATEWAY_CONFIGURATION:
                return Constant.DELETE_PAYMENT_GATEWAY
            case CommonMaster.CMS:
                return Constant.DELETECMS
            case CommonMaster.QUICK_LINKS:
                return Constant.DELETE_QUICK_LINK
            case CommonMaster.COMMON_CONFIGURATION:
                return Constant.DELETETESTIMONIALSDOC
            case CommonMaster.PRODUCT_TAG_IMAGE:
                return APPCONSTANTS.DELETEDOCUMENT
            case CommonMaster.CATALOGUE_TEMPLATE:
                return Constant.DELETE_CATALOGUE_TEMPLATE;
            case CommonMaster.PDF_CONFIG:
                return Constant.CATALOGUE_DELETE_DOC;
            case CommonMaster.HCP_INQUIRIES:
                return Constant.HCP_INQUIRY_DELETE;
            case CommonMaster.HOME_PAGE_CONFIG:
                return Constant.HOME_PAGE_CONFIG_DELETE;
            case CommonMaster.PRESCRIBED_PRODUCTS:
                return Constant.DELETE_PRESCRIBED_PRODUCT;
            case CommonMaster.SUB_ADMIN:
                return Constant.DELETE_SUB_ADMIN;
            case CommonMaster.DELETE_CATELOGUE:
                return Constant.DELETE_PRODUCT;
            case CommonMaster.DELETE_RECOMMENDED_PRODUCT:
                return Constant.DELETE_RECOMMENDED_PRODUCTS
            
        }
    }

    const onDeleteMultiple = () => {
        setIsLoading(true)
        let temp_arr = []
        props.deleteDataArr?.map((deleteObj, index) => {
            temp_arr.push(deleteObj._id);
        })
        let obj = {
            [props.dataName] : temp_arr
        }
        API.deleteAllMaster(deleteAllMasterRes, obj, true, props.deleteEndPoint);

    }

    // deleteAllMasterRes Response Data Method
    const deleteAllMasterRes = {
        cancel: () => { },
        success: (response) => {
            if (response.meta.status_code === 200) {
                props.onCloseDeleteModal(false, true, response.meta.message, deleteData);
                setIsLoading(false)
            }
        },
        error: err => {
            setIsLoading(false);
            const message = err?.meta?.message ?? "Something went wrong";
            showError(message);
            onClose();
        },
        complete: () => { },
    }

    return (
        <>
            <Toast ref={toast} />
            {isLoading && <Loader />}
            <CModal visible={visible}>
                <CModalHeader className="bg-primary" onClose={() => onClose()}>
                    <CModalTitle>Delete Confirmation</CModalTitle>
                    <CCloseButton onClick={() => onClose()}></CCloseButton>
                </CModalHeader>
                {props?.deleteDataArr?.length > 0 ? <CModalBody>Are you sure you want to delete {props?.name}?</CModalBody>
                    : <CModalBody>Are you sure you want to delete <b>{deleteData?.name}</b>?</CModalBody>
                }{

                }
                <CModalFooter>
                    <CButton color="danger" onClick={() => { onClose() }}>No</CButton>
                    <CButton color="primary" onClick={() => { props?.deleteDataArr?.length > 0 ? onDeleteMultiple() : onDelete() }}>Yes</CButton>
                </CModalFooter>
            </CModal>
        </>
    )
}

export default DeleteModal
