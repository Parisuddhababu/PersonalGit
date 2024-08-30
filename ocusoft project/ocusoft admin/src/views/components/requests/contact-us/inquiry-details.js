import React from "react";
import { CCloseButton, CModalHeader, CModalTitle, CModal, CModalBody } from "@coreui/react";
import { displayDateTimeFormat } from "src/shared/handler/common-handler";

const InquiryDetails = ({ handleCloseDialog, name, email, phone, phoneCode, date, status, message }) => {
    return (
        <CModal visible={true}>
            <CModalHeader className="bg-primary" onClose={handleCloseDialog}>
                <CModalTitle>Inquiry details</CModalTitle>
                <CCloseButton onClick={handleCloseDialog} />
            </CModalHeader>

            <CModalBody>
                {name && <p>Name: {name}</p>}
                {email && <p>Email: {email}</p>}
                {phone && <p>{`${phoneCode ?? ''} ${phone}`}</p>}
                {date && <p>Created at: {displayDateTimeFormat(date)}</p>}
                {status && <p>Status: {status}</p>}
                {message && <p>Message: {message}</p>}
            </CModalBody>
        </CModal>
    );
};

export default InquiryDetails;
