import PaymentStatus from "@/components/Payment/PaymentStatus";
import React from "react";

const PaymentFail = () => {
  return (
    <PaymentStatus status="failed" message="Payment Failed"/>
  );
};

export default PaymentFail;


