import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/saga-blue/theme.css";

import loaderImageSrc from "src/assets/images/loader.svg";
import React from "react";

const Loader = () => {
    return (
        <div className="diamond-loader-overlay">
            <div className="diamondCon">
                <img src={loaderImageSrc} />
            </div>
        </div>
    );
};

export default Loader;
