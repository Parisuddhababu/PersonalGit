import { CButton, CCloseButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from "@coreui/react";
import { InputText } from "primereact/inputtext";
import React, { useState } from "react";

const OtpDialog = ({ handleCloseDialog, handleVerifyOtp }) => {
    const [otp, setOtp] = useState('');

    return (
        <CModal visible>
            <CModalHeader className="bg-primary">
                <CModalTitle>Enter OTP</CModalTitle>
                <CCloseButton onClick={handleCloseDialog}></CCloseButton>
            </CModalHeader>

            <CModalBody>
                <InputText
                    value={otp}
                    placeholder="OTP"
                    className="form-control"
                    onChange={e => { setOtp(e.target.value); }} // NOSONAR
                />
            </CModalBody>

            <CModalFooter>
                <CButton color="danger" onClick={handleCloseDialog}>Cancel</CButton>
                <CButton color="primary" onClick={() => { handleVerifyOtp(otp); }}>Verify</CButton> {/* NOSONAR */}
            </CModalFooter>
        </CModal>
    );
};

export default OtpDialog;
