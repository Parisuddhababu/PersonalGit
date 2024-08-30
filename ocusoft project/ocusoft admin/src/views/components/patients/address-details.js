import React from "react";
import { CCloseButton, CModal, CModalBody, CModalHeader } from "@coreui/react";

const AddressDetail = ({ closeDetailsDialog, addressDetails }) => {
    return (
        <CModal scrollable visible style={{ width: "100px" }}>
            <CModalHeader>
                <h4>Full address details</h4>
                <CCloseButton onClick={closeDetailsDialog} />
            </CModalHeader>

            <CModalBody style={{ fontSize: "18px" }}>
                {addressDetails?.name ?? Constant.NO_VALUE}<br />
                {addressDetails?.phone ?? Constant.NO_VALUE}<br />
                {addressDetails?.address ?? Constant.NO_VALUE}<br />
                {addressDetails?.city ?? ''}<br />
                {addressDetails?.state ?? ''}
                {addressDetails?.zip ? ` - ${addressDetails?.zip}` : ''}<br />
                {addressDetails?.country ?? ''}
            </CModalBody>
        </CModal>
    );
};

export default AddressDetail;
