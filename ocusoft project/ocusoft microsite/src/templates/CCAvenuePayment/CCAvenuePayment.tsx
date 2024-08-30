import Loader from "@components/customLoader/Loader";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { ICCAvenuePropsData } from "@templates/CCAvenuePayment";
import { getTypeBasedCSSPath } from "@util/common";
import { useEffect, useState } from "react";

const CCAvenuePaymentResponse = (props: ICCAvenuePropsData) => {
  const [isLoading, setisLoading] = useState<boolean>(false);

  useEffect(() => {
    if (props?.ccresponse?.data) {
      getPaymentStatusFromCCAvenue();
    }
  }, [props?.ccresponse]);

  const getPaymentStatusFromCCAvenue = () => {
    setisLoading(true);
  };


  return (
    <>
      <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.toasterDesign)} />
      {isLoading && <Loader />}
    </>
  );
};

export default CCAvenuePaymentResponse;
