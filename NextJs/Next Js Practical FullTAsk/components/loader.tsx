import React from "react";
import { CSpinner } from "@coreui/react";

const AppLoader = () => {
  return (
    <div className="overlay">
      <div className="overlay-inner">
        <CSpinner color="primary" />
        <span className="text-white mt-2">loading..</span>
      </div>
    </div>
  );
};

export default React.memo(AppLoader);
