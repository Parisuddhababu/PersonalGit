// eslint-disable-next-line
import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import React, { useState, useEffect, useRef } from "react";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CCloseButton,
} from "@coreui/react";
import { Toast } from "primereact/toast";
import { useToast } from "src/shared/toaster/Toaster";
import * as Constant from "src/shared/constant/constant";
import { API } from "src/services/Api";
import Loader from "src/views/components/common/loader/loader";

const CancelModal = (props) => {
  const { showSuccess, showError } = useToast();
  const [visible, setVisible] = useState(false);
  const toast = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setVisible(props?.isVisible); //NOSONAR
  }, [props.isVisible]); //NOSONAR

  const onClose = () => {
    props.onCloseCancelModal(false); //NOSONAR
  };
  const onCancel = () => {
    console.log(props);
    setIsLoading(true);
    const data = { order_id: props?.cancelId }; //NOSONAR
    if (props?.apiType === "orders") { //NOSONAR
      API.getMasterList( 
        handleCancelOrderResponseObj,
        data,
        true,
        Constant.CANCEL_ORDER
      );
    } else if (props?.apiType === "Trail_orders") { //NOSONAR
      API.getMasterList(
        handleCancelOrderResponseObj,
        data,
        true,
        Constant.TRAIL_ORDER_CANCEL
      );
    }
    else{
      return;
    }
  };

  const handleCancelOrderResponseObj = {
    cancel: () => {},
    success: (response) => {
      setIsLoading(false);
      if (response?.meta?.message) {
        showSuccess(response.meta.message);
        props.onCloseCancelModal(true); //NOSONAR
      }
    },
    error: (err) => {
      setIsLoading(false);
      const message = err?.meta?.message ?? "Something went wrong!";
      showError(message);
    },
    complete: () => {},
  };

  return (
    <>
      <Toast ref={toast} />
      {isLoading && <Loader />}
      <CModal visible={visible} onClose={onClose}>
        <CModalHeader className="bg-primary">
          <CModalTitle>Cancel Order Confirmation</CModalTitle>
          <CCloseButton onClick={onClose} />
        </CModalHeader>
        <CModalBody>Are you sure you want to cancel the order?</CModalBody>
        <CModalFooter>
          <CButton color="danger" onClick={onClose}>
            No
          </CButton>
          <CButton color="primary" onClick={onCancel}>
            Yes
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default CancelModal;
