import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/saga-blue/theme.css";
import React, { useEffect, useState } from "react";
import { CCloseButton, CModal, CModalBody, CModalHeader } from "@coreui/react";
import Loader from "../common/loader/loader";
import * as Constant from "src/shared/constant/constant";
import { API } from "src/services/Api";
import { Checkbox } from "primereact/checkbox";

const SelectAddress = ({
  close, // NOSONAR
  onAddressSelect, // NOSONAR
  id, // NOSONAR
  defaultSelectedAddress,// NOSONAR
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [addressList, setAddressList] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(
    defaultSelectedAddress
  );
  useEffect(() => {
    getShippingAddress();
  }, []);

  const getShippingAddress = () => {
    setIsLoading(true);
    const data = {
      account_id: id,
    };
    const url = `${Constant.TRAIL_ORDERS_ADRESS_LIST}`;
    API.TrailOrderAddress(handleShipAddressResponseObj, data, true, url);
  };

  const handleShipAddressResponseObj = {
    cancel: () => {},
    success: (response) => {
      setIsLoading(false);
      setAddressList(response?.data?.original?.data);
    },
    error: (err) => {
      setIsLoading(false);
    },
    complete: () => {},
  };

  const handleAddressSelection = (address) => {
    setSelectedAddress(address);
    if (onAddressSelect) {
      onAddressSelect(address);
    }
    close();
  };
  return (
    <CModal scrollable visible size="lg">
      <CModalHeader>
        <h2>Select Address</h2>
        <CCloseButton onClick={close}></CCloseButton>
      </CModalHeader>

      <CModalBody>
        {isLoading && <Loader />}
        <div className="card">
          <div className="card-header">
            <h5 className="card-title">Select Address </h5>
          </div>
          <div className="card-body">
            <p className="col-sm-12 text-right">
              Select Any Shipping Address <span className="text-danger">*</span>
            </p>
            {addressList.map((address) => (
              <div // NOSONAR
                key={address._id}
                className="col-md-6 m-3 d-flex  align-items-center custom-checkbox adress-select"
                onClick={() => handleAddressSelection(address)}
              >
                <Checkbox checked={selectedAddress?.id === address?._id} />
                <span className="ml-5">
                  {`${address?.account?.company_name}, ${address?.address_line1}, ${address?.country?.name}, ${address?.state?.name}, ${address?.pincode}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CModalBody>
    </CModal>
  );
};

export default SelectAddress;
