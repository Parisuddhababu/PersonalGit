import PaymentStatus from "@/components/Payment/PaymentStatus";
import React from "react";

const PaymentSuccess = () => {
  return (
    <PaymentStatus status="success" message="Payment Successfully Completed" />
  );
};

export default PaymentSuccess;
