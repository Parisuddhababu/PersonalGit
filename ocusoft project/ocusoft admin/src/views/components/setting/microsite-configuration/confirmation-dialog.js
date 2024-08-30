import React from "react";
import { CButton, CCloseButton, CModalHeader, CModalTitle, CModal, CModalBody, CModalFooter } from "@coreui/react";

const ConfirmationDialog = ({ handleCloseDialog, handleLaunchAction }) => {
    return (
        <CModal visible={true}>
            <CModalHeader className="bg-primary" onClose={handleCloseDialog}>
                <CModalTitle>Launch Confirmation</CModalTitle>
                <CCloseButton onClick={handleCloseDialog} />
            </CModalHeader>

            <CModalBody>
                <p>Are you sure you want to save and launch the site with selected settings?</p>
            </CModalBody>

            <CModalFooter>
                <CButton color="danger" onClick={handleCloseDialog}>Cancel</CButton>
                <CButton color="primary" onClick={handleLaunchAction}>Launch</CButton>
            </CModalFooter>
        </CModal>
    );
};

export default ConfirmationDialog;
