import React from "react";
import { CCloseButton, CModalHeader, CModalTitle, CModal, CModalBody } from "@coreui/react";
import { displayDateTimeFormat } from "src/shared/handler/common-handler";

const TaxRateDetails = ({ handleCloseDialog, taxDetails }) => {
    const { country, state, postalCode, createdAt, updatedAt, rate, currency } = taxDetails;

    return (
        <CModal visible={true}>
            <CModalHeader className="bg-primary" onClose={handleCloseDialog}>
                <CModalTitle>Tax rate details</CModalTitle>
                <CCloseButton onClick={handleCloseDialog} />
            </CModalHeader>

            <CModalBody>
                {country && <p><b>Country:</b> {country}</p>}
                {state && <p><b>State:</b> {state}</p>}
                {postalCode && <p><b>Postal code:</b> {postalCode}</p>}
                {createdAt && <p><b>Created at:</b> {displayDateTimeFormat(createdAt)}</p>}
                {updatedAt && <p><b>Updated at:</b> {displayDateTimeFormat(updatedAt)}</p>}
                {rate && <p><b>Rate:</b> {`${currency ?? ''}${rate}`}</p>}
            </CModalBody>
        </CModal>
    );
};

export default TaxRateDetails;
