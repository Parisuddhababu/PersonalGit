// eslint-disable-next-line
import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import React, { useState, useEffect } from "react";
import CIcon from "@coreui/icons-react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { CFormCheck, CImage } from "@coreui/react";
import { cilCheck, cilXCircle, cilCloudUpload } from "@coreui/icons";
import { useLocation, useHistory } from "react-router-dom";
import { API } from "../../../../services/Api";
import * as Constant from "../../../../shared/constant/constant";
import { Dropdown } from "primereact/dropdown";
import Closeicon from "../../../../assets/images/close.svg";
import infoIcon from "../../../../assets/images/info-icon.png";
import { Tooltip } from "primereact/tooltip";
import ImageCropModal from "../../../../modal/ImageCropModal";
import Loader from "../../common/loader/loader";
import * as Regex from "../../../../shared/regex/regex";
import { useToast } from "../../../../shared/toaster/Toaster";
import { imageDimension } from "src/shared/constant/image-dimension";

const AddEditOwnereMessages = () => {
  const adminRole = JSON.parse(localStorage.getItem('user_details'))?.role?.code;
  let history = useHistory();

  const [masterForm, setMasterForm] = useState({
    owner_name: "",
    owner_designation: "",
    owner_message: "",
    owner_image: { url: "", noPicture: "", obj: "", uuid: "" },
    account: "",
    is_active: 1,
  });

  const search = useLocation().search;
  const id = new URLSearchParams(search).get("id");
  const [error, setErrors] = useState({});
  const [accountData, setAccountData] = useState([]);
  const [displayDialog, setDisplayDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showError, showSuccess } = useToast();

  const logoWidth = imageDimension.ABOUT_US_OWNER_MESSAGE_LOGO.width;
  const logoHeight = imageDimension.ABOUT_US_OWNER_MESSAGE_LOGO.height;
  const browseNote = `We recommend to you to please upload the image of : ${logoWidth} / ${logoHeight} for exact results`;

  const showDialog = () => {
    setDisplayDialog(true);
  };
  const setFormImageData = (imgData) => {
    setDisplayDialog(false);
    setMasterForm({
      ...masterForm,
      ["owner_image"]: {
        url: imgData.url,
        noPicture: imgData.noPicture,
        obj: imgData.obj,
      },
    });
    let errors = error;
    errors["owner_image"] = "";
    setErrors({ ...errors });
  };

  useEffect(() => {
    setMasterForm({ ...masterForm, ["account"]: localStorage.getItem("account_id") });
  }, [accountData]);

  useEffect(() => {
    getAccountData();
  }, []);

  useEffect(() => {
    if (id) {
      getOwnerMessageDataById();
    }
  }, []);

  // getMasterRes Response Data Method
  const getMasterRes = {
    cancel: (c) => { },
    success: (response) => {
      if (response.meta.status_code === 200) {
        let resVal = response.data;

        let obj = {
          is_active: resVal.is_active,
          owner_name: resVal.owner_name,
          owner_message: resVal.owner_message,
          owner_designation: resVal.owner_designation,
          account: resVal.account?.account_id,
        };
        if (resVal?.owner_image) {
          obj["owner_image"] = {
            url: resVal?.owner_image?.path,
            noPicture: resVal?.owner_image?.path ? true : false,
            obj: "",
            uuid: resVal?.owner_image?._id,
          };
        } else {
          obj["owner_image"] = { url: "", noPicture: "", obj: "", uuid: "" };
        }

        setIsLoading(false);

        setMasterForm(obj);
      }
    },
    error: (error) => {
      setIsLoading(false);
    },
    complete: () => { },
  };

  const getOwnerMessageDataById = () => {
    setIsLoading(true);
    API.getMasterDataById(
      getMasterRes,
      "",
      true,
      id,
      Constant.OWNER_MESSAGE_SHOW
    );
  };

  const onAccountChange = (e) => {
    setMasterForm({ ...masterForm, ["account"]: e.target.value });
    let errors = error;
    errors["account"] = "";
    setErrors({ ...errors });
  };

  const getAccountData = () => {
    API.getAccountDataByLoginId(accountRes, "", true);
  };

  // accountRes Response Data Method
  const accountRes = {
    cancel: (c) => { },
    success: (response) => {
      if (response.meta.status_code === 200) {
        let resVal = response.data;
        setAccountData(resVal);
      }
    },
    error: (error) => { },
    complete: () => { },
  };

  const onHandleValidation = () => {
    let errors = {};
    let formIsValid = true;
    let validationObj = {
      account: masterForm.account,
      owner_message: masterForm.owner_message.trim(),
      owner_image: masterForm.owner_image.url,
      owner_name: masterForm.owner_name.trim(),
      owner_designation: masterForm.owner_designation.trim(),
    };

    for (const [key, value] of Object.entries(validationObj)) {
      const keyName = key.replace(/_/g, " ");

      if (!value) {
        formIsValid = false;
        errors[key] = `${keyName} is required`;
      }
      if (key == "title" && value.length > Regex.CUST_TITLE_MAXLENGTH) {
        formIsValid = false;
        errors[
          key
        ] = `Maximum ${Regex.CUST_TITLE_MAXLENGTH} characters allow in ${key}`;
      }
      if (key == "owner_description" && value.length > Regex.CUST_DESC_MAXLENGTH) {
        formIsValid = false;
        errors[
          key
        ] = `Maximum ${Regex.CUST_DESC_MAXLENGTH} characters allow in ${key}`;
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
      setMasterForm({
        ...masterForm,
        [event.target.name]: event.target.checked ? 1 : 0,
      });
    } else if (event?.target?.type === "radio") {
      setMasterForm({ ...masterForm, [event.target.name]: radioVal ? 1 : 0 });
    } else {
      setMasterForm({ ...masterForm, [event.target.name]: event.target.value });
    }
  };

  const oncancleForm = (e) => {
    e.preventDefault();
    history.push("/owner-messages");
  };

  const onRemoveImage = (e, name, index) => {
    setMasterForm({
      ...masterForm,
      [name]: { url: "", noPicture: false, obj: {} },
    });
  };

  // updateMasterDataRes Response Data Method
  const addEditMasterDataRes = {
    cancel: (c) => { },
    success: (response) => {
      if (
        response.meta.status_code === 201 ||
        response.meta.status_code === 200
      ) {
        showSuccess(response.meta.message);
        setTimeout(() => {
          history.push("/owner-messages");
        }, 1000);
        setIsLoading(false);
      }
    },
    error: (error) => {
      setIsLoading(false);
      if (error.errors) {
        Object.values(error.errors).map(err => {
          showError(err)
        })
      } else {
        showError(error.meta.message)
      }
    },
    complete: () => { },
  };

  /**
   * Form Request Data Handler for create, update
   * @param e
   */
  const onSubmit = (e) => {
    e.preventDefault();
    const _accountId = (adminRole === 'SUPER_ADMIN') ? masterForm.account : localStorage.getItem('account_id');
    if (onHandleValidation()) {
      let resObj = {
        account_id: _accountId,
        owner_name: masterForm.owner_name,
        owner_message: masterForm.owner_message,
        owner_designation: masterForm.owner_designation,
        is_active: masterForm.is_active,
      };
      let formData = new FormData();
      formData.append("data", JSON.stringify(resObj));
      masterForm?.owner_image?.obj &&
        formData.append("owner_image", masterForm?.owner_image?.obj, masterForm?.owner_image?.obj?.name);

      setIsLoading(true);
      if (id) {
        API.UpdateMasterData(
          addEditMasterDataRes,
          formData,
          true,
          id,
          Constant.UPDATE_OWENER_MESSAGE
        );
      } else {
        API.addMaster(
          addEditMasterDataRes,
          formData,
          true,
          Constant.ADD_OWNER_MESSAGE
        );
      }
    }
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
            <h5 className="card-title">
              {id ? "Update Owner Message" : "Add Owner Message"}{" "}
            </h5>
          </div>
          <div className="card-body">
            <p className="col-sm-12 text-right">
              Fields marked with <span className="text-danger">*</span> are
              mandatory.
            </p>
            <div className="row">
              {
                adminRole === 'SUPER_ADMIN' && (
                  <div className="col-md-6 mb-3">
                    <span className="p-float-label custom-p-float-label">
                      <Dropdown
                        value={masterForm.account}
                        className="form-control"
                        options={accountData}
                        onChange={onAccountChange}
                        itemTemplate={accountDataTemplate}
                        valueTemplate={accountDataTemplate}
                        optionLabel="company_name"
                        filter
                        filterBy="company_name,code"
                        optionValue="_id"
                      />
                      <label>
                        HCP <span className="text-danger">*</span>
                      </label>
                    </span>
                    <p className="error">{error["account"]}</p>
                  </div>
                )
              }

              <div className="col-md-6 mb-3">
                <span className="p-float-label custom-p-float-label display-count">
                  <InputText
                    className="form-control"
                    name="owner_name"
                    maxLength={Regex.FIRSTNAME_MAXLENGTH}
                    value={masterForm.owner_name}
                    onChange={(e) => onHandleChange(e)}
                  />
                  <span className="character-count">
                    {masterForm.owner_name.length}/{Regex.FIRSTNAME_MAXLENGTH}
                  </span>
                  <label>
                    Owner Name <span className="text-danger">*</span>
                  </label>
                </span>
                <p className="error">{error["owner_name"]}</p>
              </div>
              <div className="col-md-6 mb-3">
                <span className="p-float-label custom-p-float-label display-count">
                  <InputText
                    className="form-control"
                    name="owner_designation"
                    value={masterForm.owner_designation}
                    onChange={(e) => onHandleChange(e)}
                    required
                  />
                  <label>
                    Owner Designation <span className="text-danger">*</span>
                  </label>
                </span>
                <p className="error">{error["owner_designation"]}</p>
              </div>
              <div className="col-md-6 mb-3">
                <span className="p-float-label custom-p-float-label display-count">
                  <InputTextarea
                    className="form-control"
                    rows={5}
                    maxLength={Regex.CUST_DESC_MAXLENGTH}
                    name="owner_message"
                    value={masterForm.owner_message}
                    onChange={(e) => onHandleChange(e)}
                    required
                  />
                  <span className="character-count">
                    {masterForm.owner_message.length}/
                    {Regex.CUST_DESC_MAXLENGTH}
                  </span>
                  <label>
                    Description <span className="text-danger">*</span>
                  </label>
                </span>
                <p className="error">{error["owner_message"]}</p>
              </div>

              <div className="col-md-6 mb-3 d-flex align-items-center">
                <div>
                  <label className="mr-2">Status</label>
                  <div>
                    <CFormCheck
                      inline
                      type="radio"
                      name="is_active"
                      id="active"
                      value={masterForm.is_active === 1 ? true : false}
                      checked={masterForm.is_active === 1 ? true : false}
                      label="Active"
                      onChange={(e) => onHandleChange(e, true)}
                      className="customradiobutton"
                    />
                    <CFormCheck
                      inline
                      type="radio"
                      name="is_active"
                      id="inactive"
                      value={masterForm.is_active !== 1 ? true : false}
                      checked={masterForm.is_active !== 1 ? true : false}
                      label="In Active"
                      onChange={(e) => onHandleChange(e, false)}
                      className="customradiobutton"
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <label>
                  Image <span className="text-danger">* </span>
                  <Tooltip target=".custom-tooltip-btn">{browseNote}</Tooltip>
                  <img className="custom-tooltip-btn" src={infoIcon} alt="!" />
                </label>
                <div className="form-control upload-image-wrap multi-upload-image-wrap">
                  {masterForm.owner_image.url && (
                    <div className="profile mb-3">
                      <div className="profile-wrapper">
                        {masterForm.owner_image.obj ? (
                          <CImage
                            src={masterForm.owner_image.url}
                            alt="File"
                            className="profile-img canvas"
                          />
                        ) : (
                          <CImage
                            src={masterForm.owner_image.url}
                            alt="File"
                            className="profile-img"
                          />
                        )}
                      </div>
                      {masterForm.owner_image.noPicture && (
                        <img
                          src={Closeicon}
                          className="remove-profile"
                          onClick={(e) => {
                            onRemoveImage(e, "owner_image");
                          }}
                        />
                      )}
                    </div>
                  )}
                  {masterForm.owner_image.url === "" && (
                    <div className="profile mb-3">
                      <div
                        className="profile-wrapper"
                        onClick={() => showDialog()}
                      >
                        <CIcon
                          icon={cilCloudUpload}
                          size="xl"
                          className="mr-1"
                        />{" "}
                        <p className="mb-0">Add Image</p>
                      </div>
                    </div>
                  )}
                </div>
                <p className="error">{error["owner_image"]}</p>
              </div>
            </div>
            {displayDialog && (
              <ImageCropModal
                visible={displayDialog}
                logoWidth={logoWidth}
                logoHeight={logoHeight}
                onCloseModal={() => setDisplayDialog(false)}
                cropImageData={(imageData) => setFormImageData(imageData)}
              />
            )}
          </div>
          <div className="card-footer">
            <button
              className="btn btn-primary mb-2 mr-2"
              onClick={(e) => {
                onSubmit(e);
              }}
            >
              <CIcon icon={cilCheck} className="mr-1" />
              {id ? "Update" : "Save"}
            </button>
            <button
              className="btn btn-danger mb-2"
              onClick={(e) => oncancleForm(e)}
            >
              <CIcon icon={cilXCircle} className="mr-1" />
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddEditOwnereMessages;
