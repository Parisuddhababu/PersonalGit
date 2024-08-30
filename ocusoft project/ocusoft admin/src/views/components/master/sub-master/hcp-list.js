import React from "react";
import { CCloseButton, CModal, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";

import { uuid } from "src/shared/handler/common-handler";

const HCPList = ({ handleCloseList, hcpList }) => {
    return (
        <CModal visible scrollable>
            <CModalHeader className="bg-primary" onClose={handleCloseList}>
                <CModalTitle>HCP list</CModalTitle>
                <CCloseButton onClick={handleCloseList}></CCloseButton>
            </CModalHeader>

            <CModalBody style={{ fontSize: "16px" }}>
                {hcpList.map((hcp, hcpIndex) => <p key={uuid()}>{hcp}</p>)}
            </CModalBody>
        </CModal>
    );
};

export default HCPList;
