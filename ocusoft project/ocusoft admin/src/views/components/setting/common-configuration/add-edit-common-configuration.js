import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "react-image-crop/dist/ReactCrop.css";
import "primereact/resources/themes/saga-blue/theme.css";

import CIcon from "@coreui/icons-react";
import { cilCheck } from "@coreui/icons";
import { InputText } from "primereact/inputtext";
import React, { useState, useEffect } from "react";
import { useToast } from "src/shared/toaster/Toaster";
import * as Constant from "src/shared/constant/constant";
import Loader from "src/views/components/common/loader/loader";

import { API } from "src/services/Api";
import { Dropdown } from "primereact/dropdown";
import * as Regex from "src/shared/regex/regex";
import { CommonMaster } from "src/shared/enum/enum";

const AddEditCommonConfigurations = () => {
  const { showError, showSuccess } = useToast();
  const primaryAccountId = localStorage.getItem("account_id");
  const adminRole = JSON.parse(localStorage.getItem("user_details"))?.role?.code;

  const [masterForm, setMasterForm] = useState({
    twilio_sid: "",
    twilio_token: "",
    twilio_from: "",
    alphanumeric_sender_id: '',
    mobile_otp_expires: "",
  });
  const [error, setErrors] = useState({});
  const [selectedAccount, setSelectedAccount] = useState(primaryAccountId);
  const [accountData, setAccountData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (adminRole === "SUPER_ADMIN") getAccountData();
  }, []);

  useEffect(() => {
    if (selectedAccount) getCommonSettings();
  }, [selectedAccount]);

  const getCommonSettings = () => {
    const data = { account_id: selectedAccount };
    API.getMasterList(getMasterRes, data, true, Constant.COMMON_SETTING_SHOW);
  };

  const getMasterRes = {
    cancel: () => { },
    success: (response) => {
      setIsLoading(false);
      if (response.meta.status) {
        let responseData = response.data;
        const obj = {
          twilio_sid: responseData.sms_sid ?? '',
          twilio_token: responseData.sms_token ?? '',
          twilio_from: responseData.sms_from_number ?? '',
          mobile_otp_expires: responseData.mobile_otp_expired_time ?? '',
          alphanumeric_sender_id: responseData?.alphanumeric_sender_id ?? '',
        };

        setMasterForm({ ...obj });
        setErrors({});
        setEditMode(true);
      } else {
        setEditMode(false);
      }
    },
    error: err => {
      console.log(err);
      setIsLoading(false);
    },
    complete: () => { },
  };

  const getAccountData = () => {
    API.getDrpData(getAccountDataResponse, null, true, Constant.ACTIVE_ACCOUNT);
  }

  const getAccountDataResponse = {
    cancel: () => { },
    success: response => {
      let _accountData = [];
      if (response?.meta?.status && response?.data?.length) _accountData = response.data;
      setAccountData([..._accountData]);
    },
    error: err => {
      console.log(err);
    },
    complete: () => { }
  }

  const onHandleValidation = () => {
    let errors = {};
    let formIsValid = true;
    let validationObj = {
      twilio_sid: masterForm.twilio_sid,
      twilio_token: masterForm.twilio_token,
      twilio_from: masterForm.twilio_from,
      mobile_otp_expires: masterForm.mobile_otp_expires,
      alphanumeric_sender_id: masterForm.alphanumeric_sender_id,
    };

    for (const [key, value] of Object.entries(validationObj)) {
      const keyName = key.replace(/_/g, " ");

      if (value && key === "alphanumeric_sender_id") {
        const pattern = /[^a-z0-9]/ig;
        if (pattern.test(value)) {
          formIsValid = false;
          errors[key] = `${keyName} must contain only alphanumeric characters.`;
        }
      }

      if (!value && key !== "alphanumeric_sender_id") {
        formIsValid = false;
        errors[key] = `${keyName} is required`;
      }
      if (key === "twilio_from" && !Regex.PHONENUMBER_REGEX.test(value)) {
        formIsValid = false;
        errors[key] = `Please enter valid ${keyName}`;
      }

      setErrors({ ...errors });
    }
    return formIsValid;
  };

  const onHandleChange = (event, radioVal) => {
    let errors = error;
    errors[event.target.name] = "";
    setErrors({ ...errors });
    if (event?.target?.type === "checkbox") {
      setMasterForm({ ...masterForm, [event.target.name]: event.target.checked ? 1 : 0 })
    }
    setMasterForm({ ...masterForm, [event.target.name]: event.target.value });
  };

  const onSubmit = e => {
    e.preventDefault();

    if (onHandleValidation()) {
      let resObj = {
        account_id: selectedAccount,
        mobile_otp_expired_time: masterForm.mobile_otp_expires,
        sms_sid: masterForm.twilio_sid,
        sms_token: masterForm.twilio_token,
        sms_from_number: masterForm.twilio_from,
        alphanumeric_sender_id: masterForm.alphanumeric_sender_id ?? '',
      };

      setIsLoading(true);
      API.addMaster( addMasterRes, resObj, true, Constant.COMMON_SETTING_CREATE);
    }
  };

  const addMasterRes = {
    cancel: () => { },
    success: (response) => {
      if (
        response.meta.status_code === 200 ||
        response.meta.status_code === 201
      ) {
        showSuccess(response.meta.message_code);
        setIsLoading(false);
        getCommonSettings();
      }
    },
    error: (error) => {
      setIsLoading(false);
      if (error.errors) {
        Object.values(error.errors).map((err) => {
          showError(err);
        });
      } else {
        showError(error.meta.message_code);
      }
    },
    complete: () => { },
  };

  const accountDataTemplate = option => {
    return (
      <>{`${option?.company_name ?? ''} (${option?.code ?? ''})`}</>
    )
  }

  return (
    <div>
      {isLoading && <Loader />}

      <form name="subMasterFrm" noValidate>
        <div className="card">
          <div className="card-header">
            <h5 className="card-title">{CommonMaster.COMMON_CONFIGURATION} </h5>
          </div>
          <div className="card-body">
            <p className="col-sm-12 text-right">
              Fields marked with <span className="text-danger">*</span> are mandatory.
            </p>
            <div>
              {
                adminRole === "SUPER_ADMIN" && (
                  <div className="col-md-4">
                    <span className="p-float-label custom-p-float-label">
                      <Dropdown
                        filter
                        filterBy={"company_name,code"}
                        optionValue={"_id"}
                        optionLabel={"company_name"}
                        options={accountData}
                        value={selectedAccount}
                        className="form-control"
                        itemTemplate={accountDataTemplate}
                        valueTemplate={accountDataTemplate}
                        onChange={e => setSelectedAccount(e.target.value)}
                      />
                      <label>HCP <span className="text-danger">*</span></label>
                    </span>
                  </div>
                )
              }

              <fieldset className="fieldset">
                <legend className="legend">SMS Configuration</legend>

                <div className="row">
                  <div className="col-md-3 mb-3">
                    <span className="p-float-label custom-p-float-label">
                      <InputText
                        className="form-control"
                        name="twilio_sid"
                        value={masterForm.twilio_sid}
                        onChange={(e) => onHandleChange(e)}
                      />
                      <label>
                        Twilio SID <span className="text-danger">*</span>
                      </label>
                    </span>
                    <p className="error">{error["twilio_sid"]}</p>
                  </div>

                  <div className="col-md-3 mb-3">
                    <span className="p-float-label custom-p-float-label">
                      <InputText
                        className="form-control"
                        name="twilio_token"
                        value={masterForm.twilio_token}
                        onChange={(e) => onHandleChange(e)}
                      />
                      <label>
                        Twilio Token <span className="text-danger">*</span>
                      </label>
                    </span>
                    <p className="error">{error["twilio_token"]}</p>
                  </div>

                  <div className="col-md-3 mb-3">
                    <span className="p-float-label custom-p-float-label">
                      <InputText
                        className="form-control"
                        name="twilio_from"
                        value={masterForm.twilio_from}
                        onChange={(e) => onHandleChange(e)}
                      />
                      <label>
                        Twilio From <span className="text-danger">*</span>
                      </label>
                    </span>
                    <p className="error">{error["twilio_from"]}</p>
                  </div>

                  <div className="col-md-3 mb-3">
                    <span className="p-float-label custom-p-float-label">
                      <InputText
                        className="form-control"
                        name="alphanumeric_sender_id"
                        onChange={e => onHandleChange(e)}
                        value={masterForm.alphanumeric_sender_id}
                      />
                      <label>Alphanumeric Sender ID</label>
                    </span>
                    <p className="error">{error["alphanumeric_sender_id"]}</p>
                  </div>
                </div>
              </fieldset>

              <fieldset className="fieldset">
                <legend className="legend">Expired Time Configuration</legend>
                <div className="col-md-12 mb-3">
                  <span className="p-float-label custom-p-float-label">
                    <InputText
                      className="form-control"
                      name="mobile_otp_expires"
                      value={masterForm.mobile_otp_expires}
                      onChange={(e) => onHandleChange(e)}
                    />
                    <label>
                      Mobile OTP Expired Time{" "}
                      <span className="text-danger">*</span>
                    </label>
                  </span>
                  <p className="error">{error["mobile_otp_expires"]}</p>
                </div>
              </fieldset>
            </div>
          </div>

          <div className="card-footer">
            <button className="btn btn-primary mb-2 mr-2" onClick={onSubmit}>
              <CIcon icon={cilCheck} /> {!editMode ? "Save" : "Update"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddEditCommonConfigurations;
