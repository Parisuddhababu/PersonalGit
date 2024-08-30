import React, { useState } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { CButton, CCloseButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from "@coreui/react";

const ReplyInquiry = ({ handleCloseAction, name, inquiry, email, handleSendReplyAction }) => {
    const [replyMessage, setReplyMessage] = useState('');

    return (
        <CModal visible scrollable size="lg">
            <CModalHeader className="bg-primary">
                <CModalTitle>Reply Inquiry via Mail</CModalTitle>
                <CCloseButton onClick={handleCloseAction} />
            </CModalHeader>

            <CModalBody>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-12">
                            {
                                name && email && (
                                    <p style={{ fontSize: "16px" }}>
                                        <b>Reply to</b>{` ${name}, ${email}`}
                                    </p>
                                )
                            }
                        </div>

                        <div className="col-md-12">
                            <p style={{ fontSize: "16px" }}><b>Inquiry</b><br />{inquiry}</p>
                        </div>

                        <div className="col-md-12 mt-3">
                            <span className="p-float-label custom-p-float-label">
                                <InputTextarea
                                    name="replyMessage"
                                    value={replyMessage}
                                    className="form-control"
                                    onChange={e => { setReplyMessage(e.target.value); }} // NOSONAR
                                />
                                <label>Reply Message</label>
                            </span>
                        </div>
                    </div>
                </div>
            </CModalBody>

            <CModalFooter>
                <CButton
                    color="danger"
                    disabled={!replyMessage}
                    onClick={e => { handleSendReplyAction(e, replyMessage); }} // NOSONAR
                >
                    Send
                </CButton>
                <CButton color="primary" onClick={handleCloseAction}>Cancel</CButton>
            </CModalFooter>
        </CModal>
    );
};

export default ReplyInquiry;
