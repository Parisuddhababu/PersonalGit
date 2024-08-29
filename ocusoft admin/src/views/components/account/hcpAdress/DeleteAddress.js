import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/saga-blue/theme.css";
import React, { useState } from "react";
import { CCloseButton, CModal, CModalBody, CModalHeader } from "@coreui/react";
import { cilCheck } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { API } from "src/services/Api";
import Loader from "../../common/loader/loader";
import { useToast } from "src/shared/toaster/Toaster";

const DeleteAddress = ({ close, completed, address }) => { // NOSONAR
    const { showError, showSuccess } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const onDeleteAddress = async () => {
        setIsLoading(true)
        API.deletehcpAddress(_deleteAddress, {}, true, address);
    };

    const _deleteAddress = {
        cancel: () => {
            setIsLoading(false)
        },
        success: (response) => { // NOSONAR
            setIsLoading(false)
            if (response.meta.status_code === 200) {
                showSuccess(response.meta?.message)
                completed()
                close()
                return
            }
            showError(response.meta?.message)
        },
        error: err => {
            console.log(err);
            setIsLoading(false)
            showError('Failed to delete address, try again.')
        },
        complete: () => {
        },
    }

    return (
        <CModal scrollable visible size="lg">
            <CModalHeader>
                <h2>Delete Address</h2>
                <CCloseButton onClick={e => { e.preventDefault(); close() }}></CCloseButton>
            </CModalHeader>

            <CModalBody>
                {isLoading && <Loader />}
                <form name="subMasterFrm">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title">Are you sure you want to delete address?</h5>
                        </div>
                        <div className="card-footer">
                            <button type="button" className="btn btn-primary mb-2 mr-2" onClick={onDeleteAddress}><CIcon icon={cilCheck} />Yes</button>
                            <button type="button" className="btn btn-secondary mb-2 mr-2" onClick={() => close()}><CIcon icon={cilCheck} />No</button>
                        </div>
                    </div>
                </form>
            </CModalBody>
        </CModal>
    );
};

export default DeleteAddress;
