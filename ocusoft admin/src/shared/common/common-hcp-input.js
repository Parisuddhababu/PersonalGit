import React, { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";

import { API } from "src/services/Api";
import * as Constant from "src/shared/constant/constant";

const CommonHcpInput = ({ hcpValue, handleHcpChange }) => {
    const adminRole = JSON.parse(localStorage.getItem("user_details"))?.role?.code ?? '';

    const [hcpList, setHcpList] = useState([]);

    useEffect(() => {
        getHcpList();
    }, []);

    const getHcpList = () => {
        if (adminRole === "SUPER_ADMIN") {
            API.getMasterList(handleGetHcpListResponseObj, null, true, Constant.ACCOUNT_LIST);
        }
    }

    const handleGetHcpListResponseObj = {
        cancel: () => { },
        success: response => {
            let _hcpList = [];
            if (response?.data?.original?.data?.length > 0) {
                let responseData = response.data.original.data;
                _hcpList = [...responseData];
            }

            setHcpList([..._hcpList]);
        },
        error: err => {
            setHcpList([]);
            console.log(err);
        },
        complete: () => { },
    }

    const hcpDataTemplate = option => {
        return <>{`${option?.company_name ?? ''} (${option?.code ?? ''})`}</>;
    }

    return adminRole === "SUPER_ADMIN" ? (
        <div className="col-md-3">
            <span className="p-float-label custom-p-float-label">
                <Dropdown
                    filter
                    name="hcp"
                    value={hcpValue}
                    optionValue="_id"
                    options={hcpList}
                    className="form-control"
                    optionLabel="company_name"
                    onChange={handleHcpChange} // NOSONAR
                    filterBy="company_name,code"
                    itemTemplate={hcpDataTemplate} // NOSONAR
                    valueTemplate={hcpDataTemplate} // NOSONAR
                />
                <label>HCP</label>
            </span>
        </div>
    ) : (
        <></>
    );
}

export default CommonHcpInput;
