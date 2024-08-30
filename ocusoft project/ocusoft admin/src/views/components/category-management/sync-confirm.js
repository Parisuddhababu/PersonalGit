import React from "react";
import {
    CModal,
    CButton,
    CModalBody,
    CModalTitle,
    CCloseButton,
    CModalFooter,
    CModalHeader,
} from "@coreui/react";

const SyncConfirm = ({ handleClose, name, syncAction }) => {
    return (
        <CModal visible>
            <CModalHeader className="bg-primary" onClose={handleClose}>
                <CModalTitle>Sync confirmation</CModalTitle>
                <CCloseButton onClick={handleClose} />
            </CModalHeader>

            <CModalBody>Are you sure you want to sync <b>{name}</b>?</CModalBody>

            <CModalFooter>
                <CButton color="danger" onClick={handleClose}>Cancel</CButton>
                <CButton color="primary" onClick={syncAction}>Sync</CButton>
            </CModalFooter>
        </CModal>
    );
};

export default SyncConfirm;
