import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import "../../../../scss/microsite.scss";

import { CImage } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilCloudUpload } from "@coreui/icons";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { ColorPicker } from "primereact/colorpicker";
import { InputNumber } from "primereact/inputnumber";
import { TabView, TabPanel } from "primereact/tabview";
import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react";

import { API } from "src/services/Api";
import Closeicon from "src/assets/images/close.svg";
import { useToast } from "src/shared/toaster/Toaster";
import * as Constant from "src/shared/constant/constant";
import UseDefaultMicrositeConfigurations from "./default-configurations";

const SiteStyleConfiguration = forwardRef((props, ref) => { // NOSONAR
    const fileUploadRef = useRef(null);
    const { showError, showSuccess } = useToast();
    const { getDefaultSiteStyleDetails } = UseDefaultMicrositeConfigurations();
    const defaultSiteStyleDetails = getDefaultSiteStyleDetails();

    const [styleConfigActiveIndex, setStyleConfigActiveIndex] = useState(0);
    const [siteStyleDetails, setSiteStyleDetails] = useState({ ...defaultSiteStyleDetails });

    useEffect(() => {
        setSiteStyleDetails({ ...props.siteStyleDetails });
    }, [props]);

    useImperativeHandle(ref, () => {
        return {
            getSiteStyleDetails() {
                return siteStyleDetails;
            }
        }
    }, [siteStyleDetails]);

    const removeImageFromServer = imageId => {
        API.deleteMaster(onRemoveImageFromServerResponse, null, true, imageId, Constant.DELETE_LOADER_IMAGE);
    }

    const onRemoveImageFromServerResponse = {
        cancel: () => { },
        success: response => {
            if (response?.meta?.status) {
                console.log(response);
                if (response?.meta?.message) showSuccess(response.meta.message);
                setSiteStyleDetails({ ...siteStyleDetails, coverImage: { url: '', noPicture: false, obj: {} } });
            }
        },
        error: err => {
            console.log(err);
            if (err?.meta?.message) showError(err.meta.message);
        },
        complete: () => { }
    }

    const setColorData = (data, inputName, inputType) => {
        let _colorConfigurations = siteStyleDetails.colorConfigurations;
        let colorData = data;
        let textData = data;
        const maliciousRegex = /[^a-z0-9]/ig;

        if (maliciousRegex.test(data)) {
            textData = data.replaceAll(maliciousRegex, '');
            colorData = data.replaceAll(maliciousRegex, '');
        }

        switch (inputType) {
            case "colorInput":
                _colorConfigurations[inputName]["color"] = data;
                _colorConfigurations[inputName]["text"] = `#${data.toUpperCase()}`;
                break;
            case "textInput":
                textData = `#${textData}`;
                _colorConfigurations[inputName]["color"] = colorData.toLowerCase();
                _colorConfigurations[inputName]["text"] = textData.toUpperCase();
                break;
            default:
                break;
        }

        setSiteStyleDetails({ ...siteStyleDetails, colorConfigurations: _colorConfigurations });
    }

    const onHandleChange = (key, value) => {
        setSiteStyleDetails({ ...siteStyleDetails, [key]: value });
    };

    const onRemoveImage = () => {
        if (siteStyleDetails?.coverImage?.id) {
            removeImageFromServer(siteStyleDetails.coverImage.id);
        } else {
            setSiteStyleDetails({ ...siteStyleDetails, coverImage: { url: '', noPicture: false, obj: {} } });
        }
    };

    const onHandleUpload = event => {
        const targetImg = event.target.files[0];

        if (targetImg) {
            const imgSize = Constant.IMAGE_SIZE;
            const fileTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

            if (!fileTypes.includes(targetImg.type)) {
                showError("Allow only png, jpg, jpeg and gif");
                resetFileCache();
            } else if (targetImg.size / 1000 / 1024 < imgSize) {
                const reader = new FileReader();

                reader.onload = e => {
                    setSiteStyleDetails({
                        ...siteStyleDetails,
                        coverImage: { obj: targetImg, noPicture: true, url: e.target.result },
                    });
                };

                reader.readAsDataURL(targetImg);
            } else {
                showError(Constant.IMAGE_MAX_SIZE);
                resetFileCache();
            }
        }
    };

    const resetFileCache = () => {
        fileUploadRef.current.value = '';
    };

    return (
        <fieldset className="fieldset">
            <legend className="legend">Site Style Configuration</legend>

            <TabView activeIndex={styleConfigActiveIndex} onTabChange={e => setStyleConfigActiveIndex(e.index)}>
                <TabPanel header="Color Combination">
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <span className="p-float-label custom-p-float-label color-picker-wrapper">
                                <InputText
                                    className="form-control text-color-pic"
                                    onChange={e => setColorData(e.target.value, "sitePrimaryColor", "textInput")}
                                    value={siteStyleDetails.colorConfigurations["sitePrimaryColor"]["text"]}
                                />

                                <ColorPicker
                                    name="sitePrimaryColor"
                                    value={siteStyleDetails.colorConfigurations["sitePrimaryColor"]["color"]}
                                    onChange={e => setColorData(e.value, "sitePrimaryColor", "colorInput")}
                                />

                                <label>Primary Color</label>
                            </span>
                        </div>

                        <div className="col-md-6 mb-3">
                            <span className="p-float-label custom-p-float-label color-picker-wrapper">
                                <InputText
                                    className="form-control"
                                    onChange={e => setColorData(e.target.value, "siteSecondaryColor", "textInput")}
                                    value={siteStyleDetails.colorConfigurations["siteSecondaryColor"]["text"]}
                                />

                                <ColorPicker
                                    name="site"
                                    value={siteStyleDetails.colorConfigurations["siteSecondaryColor"]["color"]}
                                    onChange={e => setColorData(e.value, "siteSecondaryColor", "colorInput")}
                                />

                                <label>Secondary Color</label>
                            </span>
                        </div>
                    </div>
                </TabPanel>

                <TabPanel header="Button Configuration">
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <span className="p-float-label custom-p-float-label color-picker-wrapper">
                                <InputText
                                    className="form-control"
                                    onChange={e => setColorData(e.target.value, "buttonPrimaryColor", "textInput")}
                                    value={siteStyleDetails.colorConfigurations["buttonPrimaryColor"]["text"]}
                                />

                                <ColorPicker
                                    name="buttonPrimaryColor"
                                    value={siteStyleDetails.colorConfigurations["buttonPrimaryColor"]["color"]}
                                    onChange={e => setColorData(e.value, "buttonPrimaryColor", "colorInput")}
                                />

                                <label>Primary Color</label>
                            </span>
                        </div>

                        <div className="col-md-6 mb-3">
                            <span className="p-float-label custom-p-float-label color-picker-wrapper">
                                <InputText
                                    className="form-control"
                                    onChange={e => setColorData(e.target.value, "buttonSecondaryColor", "textInput")}
                                    value={siteStyleDetails.colorConfigurations["buttonSecondaryColor"]["text"]}
                                />

                                <ColorPicker
                                    name="buttonSecondaryColor"
                                    value={siteStyleDetails.colorConfigurations["buttonSecondaryColor"]["color"]}
                                    onChange={e => setColorData(e.value, "buttonSecondaryColor", "colorInput")}
                                />

                                <label>Secondary Color</label>
                            </span>
                        </div>
                    </div>
                </TabPanel>

                <TabPanel header="Font Configuration">
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <span className="p-float-label custom-p-float-label color-picker-wrapper">
                                <Dropdown
                                    filter
                                    filterBy="family"
                                    name="primaryFont"
                                    optionLabel="family"
                                    optionValue="fonts_url"
                                    className="form-control"
                                    options={props.defaultFonts}
                                    value={siteStyleDetails.primaryFont}
                                    onChange={e => { onHandleChange("primaryFont", e.target.value); }} // NOSONAR
                                />

                                <label>Primary Font Name</label>
                            </span>
                        </div>
                    </div>
                </TabPanel>

                <TabPanel header="Border Configuration">
                    <div className="row">
                        <div className="col-md-6 md:col-4">
                            <div className="p-inputgroup custom-inputgroup">
                                <span className="p-float-label custom-p-float-label">
                                    <InputNumber
                                        min={0}
                                        max={25}
                                        name="borderRadius"
                                        value={siteStyleDetails.borderRadius}
                                        onValueChange={e => { onHandleChange("borderRadius", e.target.value); }} // NOSONAR
                                    />

                                    <label style={{ marginLeft: "10px" }}>Border Radius</label>
                                </span>

                                <span className="p-inputgroup-addon">px</span>
                            </div>
                            <p>(The radius value cannot exceed 25px.)</p>
                        </div>

                        <div className="col-md-4">
                            <button
                                className="btn btn-primary"
                                type="button"
                                style={{
                                    marginTop: "11px",
                                    borderRadius: `${siteStyleDetails.borderRadius}px`
                                }}
                            >
                                Sample Button
                            </button>
                        </div>
                    </div>
                </TabPanel>

                <TabPanel header="Footer Configuration">
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <span className="p-float-label custom-p-float-label color-picker-wrapper">
                                <InputText
                                    className="form-control"
                                    onChange={e => setColorData(e.target.value, "footerBackColor", "textInput")}
                                    value={siteStyleDetails.colorConfigurations['footerBackColor']['text']}
                                />

                                <ColorPicker
                                    name="footerBackColor"
                                    value={siteStyleDetails.colorConfigurations['footerBackColor']['color']}
                                    onChange={e => setColorData(e.value, "footerBackColor", "colorInput")}
                                />

                                <label>Footer Background Color</label>
                            </span>
                        </div>

                        <div className="col-md-6 mb-3">
                            <span className="p-float-label custom-p-float-label color-picker-wrapper">
                                <InputText
                                    className="form-control"
                                    onChange={e => setColorData(e.target.value, "footerTextColor", "textInput")}
                                    value={siteStyleDetails.colorConfigurations['footerTextColor']['text']}
                                />

                                <ColorPicker
                                    name="footerTextColor"
                                    value={siteStyleDetails.colorConfigurations['footerTextColor']['color']}
                                    onChange={e => setColorData(e.value, "footerTextColor", "colorInput")}
                                />

                                <label>Footer Text Color</label>
                            </span>
                        </div>
                    </div>
                </TabPanel>

                <TabPanel header="Loader Image">
                    <div className="row">
                        <div className="col-md-12">
                            <label>Upload Loader (Max file size is 5 MB)</label>
                            <div className="form-control upload-image-wrap multi-upload-image-wrap">
                                {
                                    siteStyleDetails.coverImage.url ? (
                                        <div className="profile">
                                            <div className="profile-wrapper">
                                                <CImage
                                                    src={siteStyleDetails.coverImage.url}
                                                    alt="File"
                                                    className="profile-img"
                                                />
                                            </div>

                                            {
                                                siteStyleDetails.coverImage.noPicture && (
                                                    <img
                                                        src={Closeicon}
                                                        onClick={onRemoveImage}
                                                        className="remove-profile"
                                                    />
                                                )
                                            }

                                            <input type="file" className="form-control" id="profile_picture" />
                                        </div>
                                    ) : (
                                        <div className="p-fileupload">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                ref={fileUploadRef}
                                                onChange={onHandleUpload}
                                                style={{ display: "none" }}
                                            />

                                            <button
                                                type="button"
                                                className="p-button p-fileupload-choose"
                                                onClick={() => { fileUploadRef.current.click(); }}
                                            >
                                                <span className="p-button-label p-clickable">
                                                    <CIcon size="xl" icon={cilCloudUpload} />{" "}
                                                    <p className="mb-0">Add Image</p>
                                                </span>
                                            </button>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </TabPanel>
            </TabView>
        </fieldset>
    )
})

export default SiteStyleConfiguration;
