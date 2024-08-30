import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";

import React from "react";
import { CCloseButton, CModal, CModalBody, CModalHeader } from "@coreui/react";

const EmailTemplate = ({ visible, handleCloseDialog, data }) => {
    return (
        <CModal visible={visible} size="lg" scrollable>
            <CModalHeader>
                <h2>Sent Email</h2><CCloseButton onClick={handleCloseDialog} />
            </CModalHeader>

            <CModalBody>
                <h1 style={{ fontSize: "21px" }}>{data.subject}</h1>

                <div style={{ fontSize: "15px", fontWeight: "bold" }}>
                    <b>{`${data.senderName} <${data.senderEmail}>`}</b><br />

                    <span>
                        {
                            `to ${data?.receiverName ?
                                `${data.receiverName} <${data.receiverEmail}>` :
                                data.receiverEmail
                            }`
                        }
                    </span>

                    <div style={{ float: "right" }}>
                        {moment(data.date).format("ddd, MMM DD, hh:mm A")}
                    </div>
                </div>

                <div dangerouslySetInnerHTML={{ __html: data.content }} />
            </CModalBody>
        </CModal>
    );
}

export default EmailTemplate;
