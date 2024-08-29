// eslint-disable-next-line
import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import React, { useState, useEffect, useRef } from "react";
import CIcon from "@coreui/icons-react";
import { InputText } from "primereact/inputtext";
import {
  cilCheck,
  cilXCircle,
  cilReload,
  cilCloudUpload,
  cilPencil,
  cilTrash,
} from "@coreui/icons";
import { useLocation, useHistory } from "react-router-dom";
import { API } from "../../../services/Api";
import * as Constant from "../../../shared/constant/constant";
import { Dropdown } from "primereact/dropdown";
import { CommonMaster } from "src/shared/enum/enum";
import { TabView, TabPanel } from "primereact/tabview";
import { CImage, CBadge } from "@coreui/react";
import Closeicon from "../../../assets/images/close.svg";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import * as Regex from "../../../shared/regex/regex";
import { useToast } from "../../../shared/toaster/Toaster";
import ImageCropModal from "../../../modal/ImageCropModal";
import Loader from "../common/loader/loader";
import { imageDimension } from "src/shared/constant/image-dimension";
import { Calendar } from "primereact/calendar";
import {
  isEmpty,
  PICKER_DISPLAY_DATE_FORMAT,
} from "src/shared/handler/common-handler";
import FileHolder from "src/shared/file-system/file-holder";
import SubAdmin from "./sub-admin";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import AddAddress from "./hcpAdress/add-address";
import DeleteAddress from "./hcpAdress/DeleteAddress";
import UpdateAddress from "./hcpAdress/update-address";

const AddEditAccount = () => {
  let history = useHistory();
  const faviconImageUploadRef = useRef(null);
  const logoImageUploadRef = useRef(null);
  const profileImageUploadRef = useRef(null);
  const adminRole = JSON.parse(localStorage.getItem("user_details"))?.role
    ?.code;
  const search = useLocation().search;
  const id = new URLSearchParams(search).get("id");
  const [displayDialog, setDisplayDialog] = useState(false);
  const logoWidth = imageDimension.ACCOUNT.width;
  const logoHeight = imageDimension.ACCOUNT.height;
  const [isLoading, setIsLoading] = useState(false);

  const [masterForm, setMasterForm] = useState({
    company_name: "",
    est_year: null,
    verification_date: new Date().toLocaleDateString("en-US"),
    url: "",
    cover_image: { url: "", noPicture: "", obj: "", uuid: "" },
    logo: { url: "", noPicture: "", obj: "", uuid: "" },
    favicon_image: { url: "", noPicture: "", obj: "", uuid: "" },
    is_active: 1,
    other_detail: "",
    gst_number: "",
    registration_number: "",
    fax: "",
    bank_name: "",
    account_number: "",
    vat_number: "",
    ifsc: "",
    swift_code: "",
    license_number: "",
    license_state: "",
    license_expiration_date: "",
    tax_exemption_number: "",
    buy_group_member_number: "",
    email: "",
    mobile_number: "",
    country: "",
    announcement: "",
    link: "",
    first_name: "",
    designation: "",
    last_name: "",
    catalogue: "",
    profile_image: { url: "", noPicture: "", obj: "", uuid: "" },
  });
  const [uuid, setUuid] = useState("");
  const [error, setErrors] = useState({});
  const [activeIndex1, setActiveIndex1] = useState(0);
  const { showError, showSuccess } = useToast();
  const [expiryDate, setExpiryDate] = useState(null);
  const [catalogueData, setCatalogueData] = useState([]);
  const [isSubAdminTabDisabled, setIsSubAdminTabDisabled] = useState(true);
  const [addAddressModal, setAddAddressModal] = useState(false);
  const [addressData, setAddressData] = useState([]);
  const [updateAddressModal, setUpdateAddressModal] = useState(false);
  const [_editAddress, setEditAddress] = useState();
  const [deleteAddressModal, setDeleteAddressModal] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  useEffect(() => {
    getCatalogueData();
    if (id) {
      getAddressData();
      !deleteAddressModal &&
        !updateAddressModal &&
        !addAddressModal &&
        getAccountDataById();
    }
  }, []);

  const getAddressData = () => {
    const data = { start: 0, length: 10, account_id: id };
    API.getMasterList(
      handleGetAddressDataResponseObj,
      data,
      true,
      Constant.GETCONTACTADDRESS
    );
  };

  const handleGetAddressDataResponseObj = {
    cancel: () => {},
    success: (response) => {
      setIsLoading(false);
      if (response?.meta?.status) {
        setAddressData(response?.data?.original?.data);
      }
    },
    error: (err) => {
      console.log(err);
      setIsLoading(false);
    },
    complete: () => {},
  };
  const getAccountDataById = () => {
    API.getMasterDataById(getMasterRes, "", true, id, Constant.ACCOUNT_SHOW);
  };

  const getMasterRes = {
    cancel: (c) => {},
    success: (response) => {
      setIsLoading(false);
      //NOSONAR
      // NOSONAR
      if (response.meta.status_code === 200) {
        let resVal = response.data;
        let obj = {
          ...resVal,
          designation: resVal?.prefix ?? "",
          catalogue: resVal?.assigned_catalogue_id ?? "",
          first_name: resVal?.user?.first_name ?? "",
          last_name: resVal?.user?.last_name ?? "",
          url: getFormattedUrl(resVal?.url ?? ""),
          link: resVal?.header_link ?? "",
          mobile_number: resVal?.mobile ?? "",
          swift_code: resVal?.swift_code ?? "",
          vat_number: resVal?.vat_number ?? "",
          country: resVal?.country?.country_id ?? "",
          other_detail: resVal.other_detail ? resVal.other_detail : "",
          license_expiration_date: resVal?.license_expiration_date
            ? new Date(resVal.license_expiration_date)
            : new Date(),
        };

        obj["logo"] = {
          obj: "",
          url: resVal?.site_logo?.path ?? "",
          uuid: resVal?.site_logo?._id ?? "",
          noPicture: Boolean(resVal?.site_logo?.path),
        };

        obj["favicon_image"] = {
          obj: "",
          url: resVal?.favicon_icon?.path ?? "",
          uuid: resVal?.favicon_icon?._id ?? "",
          noPicture: Boolean(resVal?.favicon_icon?.path),
        };

        obj["profile_image"] = {
          obj: "",
          url: resVal?.user?.profile_image?.path ?? "",
          uuid: resVal?.user?.profile_image?._id ?? "",
          noPicture: Boolean(resVal?.user?.profile_image?.path),
        };

        if (resVal.visiting_card) {
          obj["cover_image"] = {
            url: resVal?.visiting_card?.path,
            noPicture: Boolean(resVal?.visiting_card?.path),
            obj: "",
            uuid: resVal?.visiting_card?._id,
          };
        } else {
          obj["cover_image"] = { url: "", noPicture: false, obj: "", uuid: "" };
        }

        const loggedInUserData = JSON.parse(
          localStorage.getItem("user_details")
        );

        const accountUserId = resVal?.user?._id ?? "";
        const loggedInUserId = loggedInUserData?._id ?? "";
        const isSubAdminUser =
          accountUserId === loggedInUserId && adminRole === "MICROSITE_ADMIN";

        if (obj?.prescribe_expiry_date)
          setExpiryDate(obj.prescribe_expiry_date);

        const isSubAdminEnabled = adminRole === "SUPER_ADMIN" || isSubAdminUser;
        setIsSubAdminTabDisabled(!isSubAdminEnabled);
        setMasterForm({
          ...obj,
          verification_date: masterForm.verification_date,
        });
      }
    },
    error: (err) => {
      console.log(err);
    },
    complete: () => {},
  };

  const getCatalogueData = () => {
    API.getDrpData(
      handleGetCatalogueDataResponseObj,
      null,
      true,
      Constant.GET_CATALOGUE_LIST
    );
  };

  const handleGetCatalogueDataResponseObj = {
    cancel: () => {},
    success: (response) => {
      setIsLoading(false);
      if (response?.meta?.status && response?.data?.length) {
        const responseData = response.data;
        setCatalogueData([...responseData]);
      }
    },
    error: (err) => {
      setIsLoading(false);
      console.log(err);
    },
    complete: () => {},
  };

  const onHandleValidation = () => {
    let errors = {},
      formIsValid = true,
      validationObj = {
        url: masterForm?.url ?? "",
        expiry_date: expiryDate ?? "",
      };

    for (const [key, value] of Object.entries(validationObj)) {
      const keyName = key.replace(/_/g, " ");
      if (isEmpty(value)) {
        formIsValid = false;
        errors[key] = `${keyName} is required`;
      }
    }

    setErrors({ ...errors });
    return formIsValid;
  };

  const onHandleChange = (event, radioVal) => {
    event.preventDefault();
    let errors = error;
    errors[event.target.name] = "";

    if (event.target.name === "gst_number" && masterForm["vat_number"]) {
      errors["vat_number"] = "";
    }

    if (event.target.name === "ifsc" && masterForm["swift_code"]) {
      errors["swift_code"] = "";
    }

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

  const onCancleForm = (e) => {
    e.preventDefault();
    history.push("/hcp");
  };

  function getFormattedUrl(url) {
    const scheme = "https://";
    return url.replaceAll(
      new RegExp(`${scheme}|${Constant.SITE_DOMAIN}`, "ig"),
      ""
    );
  }

  const onSubmit = (e) => {
    e.preventDefault();
    let resObj;

    const { url } = masterForm;
    const newUrl = getFormattedUrl(url);

    if (onHandleValidation()) {
      resObj = {
        company_name: masterForm.company_name ?? "",
        est_year: masterForm.est_year,
        verification_date: masterForm.verification_date,
        url: Constant.SITE_SCHEME + newUrl + Constant.SITE_DOMAIN,
        subdomain_url:
          Constant.SITE_SCHEME + `preview_${newUrl}` + Constant.SITE_DOMAIN,
        other_detail: masterForm.other_detail ?? "",
        email: masterForm.email,
        mobile: masterForm.mobile_number,
        country: masterForm.country,
        is_active: masterForm.is_active,
        license_number: masterForm.license_number,
        license_state: masterForm.license_state,
        license_expiration_date: masterForm.license_expiration_date,
        tax_exemption_number: masterForm.tax_exemption_number,
        buy_group_member_number: masterForm.buy_group_member_number,
        announcement: masterForm.announcement,
        header_link: masterForm.link,
        prefix: masterForm.designation,
        first_name: masterForm.first_name,
        last_name: masterForm.last_name,
        assigned_catalogue_id: masterForm.catalogue,
        prescribe_expiry_date: expiryDate,
      };

      let formData = new FormData();
      formData.append("data", JSON.stringify(resObj));

      if (masterForm?.cover_image?.obj) {
        formData.append(
          "visiting_card",
          masterForm?.cover_image?.obj,
          masterForm?.cover_image?.obj?.name
        );
      }

      if (masterForm?.logo?.obj) {
        formData.append(
          "site_logo",
          masterForm?.logo?.obj,
          masterForm?.logo?.obj?.name
        );
      }

      if (masterForm?.favicon_image?.obj) {
        formData.append(
          "favicon_icon",
          masterForm?.favicon_image?.obj,
          masterForm?.favicon_image?.obj?.name
        );
      }

      if (masterForm?.profile_image?.obj) {
        formData.append("profile_image", masterForm?.profile_image?.obj);
      }

      setIsLoading(true);

      if (id) {
        if (!deleteAddressModal && !updateAddressModal && !addAddressModal) {
          API.UpdateMasterData(
            addEditMasterRes,
            formData,
            true,
            id,
            Constant.ACCOUNT_UPDATE
          );
        }
      } else {
        API.addMaster(
          addEditMasterRes,
          formData,
          true,
          Constant.ACCOUNT_CREATE
        );
      }
    }
  };

  // addEditMasterRes Response Data Method
  const addEditMasterRes = {
    cancel: () => {},
    success: (response) => {
      setIsLoading(false);
      if (response?.meta?.status) {
        const resData = response.data;
        if (response?.meta?.message) showSuccess(response.meta.message);
        history.push("/hcp");
        if (resData?._id) setUuid(resData._id);
      }
    },
    error: (err) => {
      setIsLoading(false);
      if (err.errors) {
        Object.values(err.errors).map((err) => {
          showError(err);
        });
      } else if (err?.meta?.message) {
        showError(err.meta.message);
      }
    },
    complete: () => {},
  };

  const resetFileCache = (imageKey) => {
    switch (imageKey) {
      case "logo":
        logoImageUploadRef.current.value = "";
        break;
      case "favicon_image":
        faviconImageUploadRef.current.value = "";
        break;
      default:
        break;
    }
  };

  const onHandleUpload = (event, imageKey) => {
    const targetImg = event.target.files[0];
    if (targetImg) {
      const imgSize = Constant.IMAGE_SIZE;
      const fileTypes = ["image/jpeg", "image/jpg", "image/png"];

      if (imageKey === "favicon_image") {
        const extension = targetImg.name.split(".")[1];
        const allowedExtensions = ["jpg", "png", "jpeg", "ico"];

        if (!allowedExtensions.includes(extension)) {
          showError("Only jpg, png, jpeg & ico file types are allowed.");
          resetFileCache(imageKey);
          return;
        }
      } else if (
        imageKey !== "favicon_image" &&
        !fileTypes.includes(targetImg.type)
      ) {
        showError(Constant.IMAGE_ERR);
        resetFileCache(imageKey);
        return;
      }

      if (targetImg.size / 1000 / 1024 < imgSize) {
        const reader = new FileReader();

        reader.onload = (e) => {
          setMasterForm({
            ...masterForm,
            [imageKey]: {
              url: e.target.result,
              noPicture: true,
              obj: targetImg,
            },
          });
          let errors = error;
          errors[imageKey] = "";
          setErrors({ ...errors });
        };

        reader.readAsDataURL(targetImg);
      } else {
        showError(Constant.IMAGE_MAX_SIZE);
        resetFileCache(imageKey);
      }
    }
  };

  const setFormImageData = (imgData) => {
    setDisplayDialog(false);
    setMasterForm({
      ...masterForm,
      ["cover_image"]: {
        url: imgData.url,
        noPicture: imgData.noPicture,
        obj: imgData.obj,
      },
    });
    let errors = error;
    errors["logo"] = "";
    setErrors({ ...errors });
  };

  const handleRemoveImage = (key) => {
    if (masterForm[key]?.uuid) {
      API.deleteDocument(
        removeImageFromServerResponse,
        "",
        true,
        masterForm[key].uuid,
        Constant.DELETECATEGORYDOC
      );
    }

    setMasterForm({
      ...masterForm,
      [key]: { url: "", noPicture: false, obj: "" },
    });
  };

  const removeImageFromServerResponse = {
    cancel: () => {},
    success: (response) => {
      setIsLoading(false);
      if (response?.meta?.status) {
        if (response?.meta?.message) showSuccess(response.meta.message);
      }
    },
    error: (err) => {
      setIsLoading(false);
      if (err?.meta?.message) showError(error.meta.message);
    },
    complete: () => {},
  };

  const syncAccount = () => {
    setIsLoading(true);
    API.UpdateMasterData(accountSync, {}, true, id, Constant.ACCOUNT_SYNC);
  };

  // accountSync Response Data Method
  const accountSync = {
    cancel: (c) => {},
    success: (response) => {
      if (response.meta.status_code === 201) {
        showSuccess("Account Synced successfully!");
        setIsLoading(false);
      }
    },
    error: (error) => {
      setIsLoading(false);
    },
    complete: () => {},
  };

  const handleExpiryDate = (e) => {
    setExpiryDate(e.value);
    setErrors({ ...error, expiry_date: null });
  };

  const nameBodyTemplate = (rowData) => {
    return dynamicBodyTemplate(rowData, "account", "company_name");
  };

  const dynamicBodyTemplate = (rowData, ...keys) => {
    let value = rowData;

    for (const key of keys) {
      value = value?.[key] ?? "";
      if (!value) break;
    }

    return <>{!isEmpty(value) ? value : Constant.NO_VALUE}</>;
  };

  const addressLineBodyTemplate = (rowData) => {
    return <>{rowData?.address_line1 ?? Constant.NO_VALUE}</>;
  };

  const pincodeBodyTemplate = (rowData) => {
    return dynamicBodyTemplate(rowData, "pincode");
  };
  const stateBodyTemplate = (rowData) => {
    return dynamicBodyTemplate(rowData, "state", "name");
  };
  const cityBodyTemplate = (rowData) => {
    return dynamicBodyTemplate(rowData, "city", "name");
  };

  const countryBodyTemplate = (rowData) => {
    return dynamicBodyTemplate(rowData, "country", "name");
  };
  const editAddress = (rowData) => {
    return (
      <button
        className="btn btn-link"
        title="Default billing address"
        onClick={() => {
          setUpdateAddressModal(true);
          setEditAddress(rowData);
        }}
      >
        <CIcon icon={cilPencil} size="lg" />
      </button>
    );
  };
  const deleteAddress = (rowData) => {
    return (
      <button
        className="btn btn-link"
        title="Default billing address"
        onClick={() => {
          setDeleteId(rowData?._id);
          setDeleteAddressModal(true);
        }}
      >
        <CIcon icon={cilTrash} size="lg" />
      </button>
    );
  };

  return (
    <div>
      {isLoading && <Loader />}

      <form
        name="accountFrm"
        noValidate
        onSubmit={(e) => {
          onSubmit(e);
        }}
      >
        <div className="card">
          <div className="card-header">
            <h5 className="card-title">
              {id ? "Update" : "Add"} {CommonMaster.HCP}{" "}
            </h5>
          </div>
          <div className="card-body">
            <p className="col-sm-12 text-right">
              Fields marked with <span className="text-danger">*</span> are
              mandatory.
            </p>
            <TabView
              className="shadow"
              activeIndex={activeIndex1}
              onTabChange={(e) => setActiveIndex1(e.index)}
            >
              <TabPanel header="Basic">
                <div className="row">
                  <div className="col-md-12 col-lg-3 mb-3">
                    <span className="p-float-label custom-p-float-label">
                      <InputText
                        disabled
                        name="company_name"
                        className="form-control"
                        onChange={onHandleChange} // NOSONAR
                        value={masterForm.company_name}
                      />
                      <label>Company Name </label>
                    </span>
                    <p className="error">{error["company_name"] ?? ""}</p>
                  </div>

                  <div className="col-md-3 mb-3">
                    <div className="p-inputgroup custom-inputgroup">
                      <span className="p-float-label custom-p-float-label">
                        <InputText
                          disabled
                          name={"code"}
                          maxLength={14}
                          placeholder="Code"
                          value={masterForm.code}
                          className="form-control"
                        />
                        <label>Code</label>
                      </span>
                    </div>
                  </div>

                  <div className="col-md-6 col-lg-3 mb-3">
                    <span className="p-float-label custom-p-float-label">
                      <InputNumber
                        disabled
                        inputClassName="form-control"
                        name="est_year"
                        value={masterForm.est_year}
                        onValueChange={(e) => onHandleChange(e)}
                      />{" "}
                      {/* NOSONAR */}
                      <label>Company Est. Year </label>
                    </span>
                    <p className="error">{error["est_year"]}</p>
                  </div>

                  <div className="col-md-6 col-lg-3 mb-3">
                    <span className="p-float-label custom-p-float-label">
                      <InputText
                        disabled
                        className="form-control"
                        name="verification_date"
                        value={masterForm.verification_date}
                      />
                      <label>Verification Date </label>
                    </span>
                  </div>

                  <div className="col-md-3 mb-3">
                    <span className="p-float-label custom-p-float-label">
                      <InputText
                        disabled
                        name="license_number"
                        className="form-control"
                        onChange={onHandleChange} // NOSONAR
                        value={masterForm.license_number}
                      />
                      <label>License number</label>
                    </span>
                    <p className="error">{error["license_number"] ?? ""}</p>
                  </div>

                  <div className="col-md-3 mb-3">
                    <span className="p-float-label custom-p-float-label">
                      <InputText
                        disabled
                        name="license_state"
                        className="form-control"
                        onChange={onHandleChange} // NOSONAR
                        value={masterForm.license_state}
                      />
                      <label>License state</label>
                    </span>
                    <p className="error">{error["license_state"] ?? ""}</p>
                  </div>

                  <div className="col-md-3 mb-3">
                    <span className="p-float-label custom-p-float-label">
                      <Calendar
                        disabled
                        showIcon
                        readOnlyInput
                        dateFormat={PICKER_DISPLAY_DATE_FORMAT}
                        value={masterForm.license_expiration_date}
                        className="form-control border-0 px-0 py-0 custom-datepicker-input"
                        onChange={(e) => {
                          setErrors({ ...error, license_expiration_date: "" });
                          setMasterForm({
                            ...masterForm,
                            license_expiration_date: e.value,
                          });
                        }}
                      />
                      <label>License expiration date</label>
                    </span>
                    <p className="error">
                      {error["license_expiration_date"] ?? ""}
                    </p>
                  </div>

                  <div className="col-md-3 mb-3">
                    <span className="p-float-label custom-p-float-label">
                      <InputText
                        disabled
                        name="tax_exemption_number"
                        className="form-control"
                        onChange={onHandleChange} // NOSONAR
                        value={masterForm.tax_exemption_number}
                      />
                      <label>Tax exemption number</label>
                    </span>
                    <p className="error">
                      {error["tax_exemption_number"] ?? ""}
                    </p>
                  </div>

                  <div className="col-md-3 mb-3">
                    <span className="p-float-label custom-p-float-label">
                      <InputText
                        disabled
                        name="buy_group_member_number"
                        className="form-control"
                        onChange={onHandleChange} // NOSONAR
                        value={masterForm.buy_group_member_number}
                      />
                      <label>Buy group member number</label>
                    </span>
                    <p className="error">
                      {error["buy_group_member_number"] ?? ""}
                    </p>
                  </div>

                  <div className="col-md-3 mb-3">
                    <div className="p-inputgroup custom-inputgroup">
                      <span className="p-float-label custom-p-float-label">
                        <InputText
                          disabled
                          maxLength={14}
                          className="form-control"
                          name={"billing_address_code"}
                          placeholder="Billing Address Code"
                          value={masterForm.billing_address_code}
                        />
                        <label>Billing Address Code</label>
                      </span>
                    </div>
                  </div>

                  <div className="col-md-3 mb-3">
                    <span className="p-float-label custom-p-float-label">
                      <InputText
                        disabled
                        name={"email"}
                        value={masterForm.email}
                        className="form-control"
                        onChange={onHandleChange} // NOSONAR
                      />
                      <label>Email</label>
                    </span>
                    <p className="error">{error?.email ?? ""}</p>
                  </div>

                  <div className="col-md-3 mb-3">
                    <div className="p-inputgroup custom-inputgroup">
                      <span className="p-float-label custom-p-float-label">
                        <InputText
                          disabled
                          maxLength={14}
                          name={"mobile_number"}
                          className="form-control"
                          onChange={onHandleChange} // NOSONAR
                          placeholder="Phone Number"
                          value={masterForm.mobile_number}
                        />
                        <label>Phone Number</label>
                      </span>
                    </div>
                    <p className="error">{error?.mobile_number ?? ""}</p>
                  </div>

                  <div className="col-md-5 mb-3">
                    <div className="p-inputgroup">
                      <span
                        className="p-inputgroup-addon"
                        style={{ width: "30%" }}
                      >
                        {Constant.SITE_SCHEME}
                      </span>

                      <span className="p-float-label custom-p-float-label">
                        <InputText
                          name="url"
                          value={masterForm.url}
                          className="form-control"
                          onChange={onHandleChange} // NOSONAR
                        />
                        <label>
                          URL<span className="text-danger">*</span>
                        </label>
                      </span>

                      <span className="p-inputgroup-addon w-100">
                        {Constant.SITE_DOMAIN}
                      </span>
                    </div>
                    <p className="error">{error["url"]}</p>
                  </div>

                  <div className="col-md-2">
                    <span className="p-float-label custom-p-float-label">
                      <Dropdown
                        filter
                        optionValue="id"
                        optionLabel="name"
                        filterBy="name,code"
                        className="form-control"
                        value={expiryDate}
                        options={[
                          { id: "6", name: "6 Months" },
                          { id: "12", name: "12 Months" },
                          { id: "18", name: "18 Months" },
                          { id: "24", name: "24 Months" },
                        ]}
                        onChange={handleExpiryDate} // NOSONAR
                      />
                      <label>
                        RX Expiry <span className="text-danger">*</span>
                      </label>
                    </span>

                    <p className="error">{error?.expiry_date ?? ""}</p>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-3 mb-3">
                    <span className="p-float-label custom-p-float-label">
                      <Dropdown
                        filter
                        name="catalogue"
                        filterBy="title"
                        optionValue="_id"
                        optionLabel="title"
                        options={catalogueData}
                        className="form-control"
                        onChange={onHandleChange} // NOSONAR
                        value={masterForm.catalogue}
                      />
                      <label>Assigned Catalogue</label>
                    </span>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-3 mb-3" style={{ fontSize: "16px" }}>
                    <div className="row">
                      <div className="col-lg-7 fw-bold">Admin Approved</div>
                      <div className="col-lg-4 p-0 m-0">
                        <CBadge
                          className="ms-auto"
                          style={{ fontSize: "16px", float: "right" }}
                          color={
                            masterForm?.is_admin_approved ? "success" : "danger"
                          }
                        >
                          {masterForm?.is_admin_approved
                            ? "Active"
                            : "Inactive"}
                        </CBadge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-3 mb-3" style={{ fontSize: "16px" }}>
                    <div className="row">
                      <div className="col-lg-7 fw-bold">Status</div>
                      <div className="col-lg-4 p-0 m-0">
                        <CBadge
                          className="ms-auto"
                          style={{ fontSize: "16px", float: "right" }}
                          color={masterForm?.is_active ? "success" : "danger"}
                        >
                          {masterForm?.is_active ? "Active" : "Inactive"}
                        </CBadge>
                      </div>
                    </div>
                  </div>
                </div>

                <fieldset className="fieldset">
                  <legend className="legend">User details</legend>

                  <div className="row">
                    <div className="col-md-2 mb-3">
                      <label>Profile Image</label>
                      <FileHolder
                        fileType={"image"}
                        acceptType={"image/*"}
                        fileName={"profile_image"}
                        fileUploadFn={onHandleUpload} // NOSONAR
                        refObj={profileImageUploadRef}
                        inputChangeFn={onHandleChange} // NOSONAR
                        removeFileFn={handleRemoveImage} // NOSONAR
                        fileObj={masterForm.profile_image}
                      />
                    </div>

                    <div className="col-md-3 mb-3">
                      <span className="p-float-label custom-p-float-label display-count">
                        <InputText
                          disabled
                          name="designation"
                          className="form-control"
                          onChange={onHandleChange} // NOSONAR
                          value={masterForm.designation}
                        />

                        <label>Designation</label>
                      </span>
                      <p className="error">{error?.designation ?? ""}</p>
                    </div>

                    <div className="col-md-3 mb-3">
                      <span className="p-float-label custom-p-float-label display-count">
                        <InputText
                          disabled
                          name="first_name"
                          className="form-control"
                          onChange={onHandleChange} // NOSONAR
                          value={masterForm.first_name}
                          maxLength={Regex.FIRSTNAME_MAXLENGTH}
                        />

                        <span className="character-count">
                          {masterForm?.first_name?.length ?? 0}/
                          {Regex.FIRSTNAME_MAXLENGTH}
                        </span>

                        <label>First Name</label>
                      </span>
                      <p className="error">{error?.first_name ?? ""}</p>
                    </div>

                    <div className="col-md-3 mb-3">
                      <span className="p-float-label custom-p-float-label display-count">
                        <InputText
                          disabled
                          name="last_name"
                          className="form-control"
                          onChange={onHandleChange} // NOSONAR
                          value={masterForm.last_name}
                          maxLength={Regex.LASTNAME_MAXLENGTH}
                        />

                        <span className="character-count">
                          {masterForm?.last_name?.length}/
                          {Regex.LASTNAME_MAXLENGTH}
                        </span>

                        <label>Last Name</label>
                      </span>
                      <p className="error">{error?.last_name ?? ""}</p>
                    </div>
                  </div>
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="legend">General Configurations</legend>

                  <div className="col-md-6 mb-3">
                    <span className="p-float-label custom-p-float-label display-count">
                      <InputTextarea
                        required
                        name="announcement"
                        className="form-control"
                        onChange={onHandleChange} // NOSONAR
                        value={masterForm.announcement}
                      />
                      <label>Announcement</label>
                    </span>
                  </div>

                  <div className="col-md-6 mb-3">
                    <span className="p-float-label custom-p-float-label">
                      <InputText
                        name="link"
                        value={masterForm.link}
                        className="form-control"
                        onChange={onHandleChange}
                      />
                      <label>Link</label>
                    </span>
                  </div>

                  <div className="row">
                    <div className="col-md-3 mb-3">
                      <label>Logo</label>
                      <FileHolder
                        fileName={"logo"}
                        fileType={"image"}
                        acceptType={"image/*"}
                        fileObj={masterForm.logo}
                        refObj={logoImageUploadRef}
                        fileUploadFn={onHandleUpload} // NOSONAR
                        inputChangeFn={onHandleChange} // NOSONAR
                        removeFileFn={handleRemoveImage} // NOSONAR
                      />
                    </div>

                    <div className="col-md-3 mb-3">
                      <label>Favicon Image</label>

                      <div className="form-control upload-image-wrap multi-upload-image-wrap">
                        {masterForm?.favicon_image?.url ? (
                          <div className="profile mb-3">
                            <div className="profile-wrapper">
                              <CImage
                                alt="File"
                                className="profile-img"
                                src={masterForm.favicon_image.url}
                              />
                            </div>

                            {masterForm.favicon_image.noPicture && (
                              <img
                                src={Closeicon}
                                className="remove-profile"
                                onClick={() => {
                                  handleRemoveImage("favicon_image");
                                }}
                              />
                            )}

                            <input
                              type="file"
                              className="form-control"
                              id="favicon_image"
                            />
                          </div>
                        ) : (
                          <div className="p-fileupload">
                            <input
                              type="file"
                              accept="image/*"
                              className="d-none"
                              ref={faviconImageUploadRef}
                              onChange={(e) => {
                                onHandleUpload(e, "favicon_image");
                              }}
                            />

                            <button
                              type="button"
                              className="p-button p-fileupload-choose"
                              onClick={() =>
                                faviconImageUploadRef.current.click()
                              }
                            >
                              <span className="p-button-label p-clickable">
                                <CIcon size="xl" icon={cilCloudUpload} />
                                <p className="mb-0">Add Images</p>
                              </span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </fieldset>

                <div className="row">
                  <div className="col-md-12 col-lg-8 mb-3">
                    <span className="p-float-label custom-p-float-label">
                      <InputTextarea
                        className="form-control"
                        value={masterForm.other_detail}
                        rows={4}
                        name="other_detail"
                        onChange={(e) => onHandleChange(e)}
                      />
                      <label>Other Details</label>
                    </span>
                  </div>
                  <div className="col-md-6 col-lg-3 mb-3 d-flex align-items-center custom-checkbox">
                    {adminRole === "ADMIN" && (
                      <span>
                        <label className="ml-4">Sync</label>

                        <button
                          className="btn btn-link text-danger"
                          title="Sync"
                          onClick={() => syncAccount()}
                        >
                          <CIcon icon={cilReload} size="lg" />
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              </TabPanel>
              <TabPanel header="Addresses" disabled={!uuid && !id}>
                <div className="row">
                  <div className="col-md-12 d-flex justify-content-end">
                    <button
                      className="btn btn-primary mb-2 mr-2"
                      onClick={() => {
                        setAddAddressModal(true);
                      }}
                    >
                      <CIcon icon={cilCheck} />
                      &nbsp;Add Address
                    </button>
                  </div>
                  {addAddressModal && (
                    <AddAddress
                      close={() => {
                        setAddAddressModal(false);
                        setIsLoading(false);
                      }}
                      id={id}
                      completed={() => getAddressData()}
                    />
                  )}
                  {updateAddressModal && (
                    <UpdateAddress
                      close={() => {
                        setUpdateAddressModal(false);
                        setIsLoading(false);
                      }}
                      id={id}
                      address={_editAddress}
                      completed={() => getAddressData()}
                    />
                  )}
                  {deleteAddressModal && (
                    <DeleteAddress
                      close={() => {
                        setDeleteAddressModal(false);
                        setIsLoading(false);
                      }}
                      address={deleteId}
                      completed={() => getAddressData()}
                    />
                  )}
                </div>

                <DataTable
                  stripedRows
                  showGridlines
                  responsiveLayout="scroll"
                  value={addressData}
                  className="p-datatable-responsive-demo"
                >
                  {
                    <Column
                      field="account.company_name"
                      header="Name"
                      body={nameBodyTemplate}
                    /> /* NOSONAR */
                  }
                  {
                    <Column
                      field="address"
                      header="Address line"
                      body={addressLineBodyTemplate}
                    /> /* NOSONAR */
                  }
                  {
                    <Column
                      field="pincode"
                      header="Pincode"
                      body={pincodeBodyTemplate}
                    /> /* NOSONAR */
                  }
                  {
                    <Column
                      field="city.name"
                      header="City"
                      body={cityBodyTemplate}
                    /> /* NOSONAR */
                  }
                  {
                    <Column
                      field="state.name"
                      header="State"
                      body={stateBodyTemplate}
                    /> /* NOSONAR */
                  }

                  {
                    <Column
                      field="country.name"
                      header="Country"
                      body={countryBodyTemplate}
                    /> /* NOSONAR */
                  }

                  {<Column field="address" header="Edit" body={editAddress} />}
                  {
                    <Column
                      field="address"
                      header="Delete"
                      body={deleteAddress}
                    />
                  }
                </DataTable>
              </TabPanel>

              <TabPanel header="Sub Admin" disabled={isSubAdminTabDisabled}>
                <SubAdmin hcpId={id} />
              </TabPanel>
            </TabView>

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
            {activeIndex1 === 0 && (
              <>
                <button
                  type="submit"
                  className="btn btn-primary mb-2 mr-2"
                  onClick={(e) => {
                    onSubmit(e);
                  }}
                >
                  <CIcon icon={cilCheck} className="mr-1" />
                  {id ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  className="btn btn-danger mb-2"
                  onClick={(e) => onCancleForm(e)}
                >
                  <CIcon icon={cilXCircle} className="mr-1" />
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddEditAccount;
