import { Toast } from "primereact/toast";
import React, { useState, useEffect, useRef } from "react";

import { API } from "src/services/Api";
import { CommonMaster } from "src/shared/enum/enum";
import PageConfiguration from "./page-configuration";
import { useToast } from "src/shared/toaster/Toaster";
import ConfirmationDialog from "./confirmation-dialog";
import * as Constant from "src/shared/constant/constant";
import { uuid } from "src/shared/handler/common-handler";
import GeneralConfiguration from "./general-configuration";
import Loader from "src/views/components/common/loader/loader";
import SiteStyleConfiguration from "./site-style-configuration";
import UseDefaultMicrositeConfigurations from "./default-configurations";

const MicrositeConfig = () => {
    const adminRole = JSON.parse(localStorage.getItem("user_details"))?.role?.code;
    let primaryAccountId = adminRole !== "SUPER_ADMIN" ? localStorage.getItem("account_id") : '';
    const { getDefaultGeneralDetails, getDefaultSiteStyleDetails } = UseDefaultMicrositeConfigurations();

    const toast = useRef(null);
    const { showError, showSuccess } = useToast();
    let pageConfigRef = useRef(null), styleConfigRef = useRef(null);

    const defaultGeneralDetails = getDefaultGeneralDetails();
    const defaultSiteStyleDetails = getDefaultSiteStyleDetails();

    const [isLoading, setIsLoading] = useState(false);
    const [accountData, setAccountData] = useState([]);
    const [previewFlag, setPreviewFlag] = useState('');
    const [defaultFonts, setDefaultFonts] = useState([]);
    const [websiteSettings, setWebsiteSettings] = useState([]);
    const [defaultTemplates, setDefaultTemplates] = useState([]);
    const [submittedFormData, setSubmittedFormData] = useState(null);
    const [selectedWebsiteSettings, setSelectedWebsiteSettings] = useState([]);
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const [generalDetails, setGeneralDetails] = useState({ ...defaultGeneralDetails });
    const [siteStyleDetails, setSiteStyleDetails] = useState({ ...defaultSiteStyleDetails });

    useEffect(() => {
        if (adminRole !== "SUPER_ADMIN") showMicrositeConfigDetails(primaryAccountId);
        getAccountList();
        getDefaultFonts();
        getBaseTemplates();
        getWebsiteSettings();
    }, []);

    useEffect(() => {
        if (submittedFormData && previewFlag !== '') {
            if (previewFlag) createMicrositeConfig(submittedFormData);
            else setShowConfirmationDialog(true);
        }
    }, [submittedFormData, previewFlag]);

    const showMicrositeConfigDetails = accountId => {
        setIsLoading(true);
        API.getDrpData(onShowMicrositeConfigDetailsResponse, null, true, `${Constant.SHOW_MICROSITE}/${accountId}`);
    }

    const onShowMicrositeConfigDetailsResponse = {
        cancel: () => { },
        success: response => { // NOSONAR
            setIsLoading(false);
            if (response?.data) {
                setSiteStyleDetails({
                    primaryFont: response.data.data_site_font_primary_url ?? '',
                    borderRadius: response.data.data_site_border_radius ?? 25,
                    coverImage: {
                        id: response.data?.loader_image?._id ?? null,
                        url: response.data?.loader_image?.path ?? "",
                        noPicture: Boolean(response.data?.loader_image?.path),
                        obj: null,
                    },
                    colorConfigurations: {
                        sitePrimaryColor: {
                            color: response.data.data_site_primary_color ?? "1a428a",
                            text: response.data.data_site_primary_color
                                ? `#${response.data.data_site_primary_color.toUpperCase()}`
                                : "#1A428A"
                        },
                        siteSecondaryColor: {
                            color: response.data.data_site_secondary_color ?? "5fb2e4",
                            text: response.data.data_site_secondary_color
                                ? `#${response.data.data_site_secondary_color.toUpperCase()}`
                                : "#5FB2E4"
                        },
                        buttonPrimaryColor: {
                            color: response.data.data_button_primary_color ?? "1a428a",
                            text: response.data.data_button_primary_color
                                ? `#${response.data.data_button_primary_color.toUpperCase()}`
                                : "#1A428A"
                        },
                        buttonSecondaryColor: {
                            color: response.data.data_button_secondary_color ?? "5fb2e4",
                            text: response.data.data_button_secondary_color
                                ? `#${response.data.data_button_secondary_color.toUpperCase()}`
                                : "#5FB2E4"
                        },
                        footerBackColor: {
                            color: response.data.data_site_footer_bg_color ?? "1a428a",
                            text: response.data.data_site_footer_bg_color
                                ? `#${response.data.data_site_footer_bg_color.toUpperCase()}`
                                : "#1A428A"
                        },
                        footerTextColor: {
                            color: response.data.data_site_footer_text_color ?? "ffffff",
                            text: response.data.data_site_footer_text_color
                                ? `#${response.data.data_site_footer_text_color.toUpperCase()}`
                                : "#FFFFFF"
                        },
                    }
                });

                setGeneralDetails({
                    theme: response?.data?.theme === "Light" ? 1 : 0,
                    account: response.data?.account?.account_id ?? primaryAccountId,
                    template: response?.data?.base_template ?? generalDetails.template,
                });

                getSelectedWebsiteSettings(response?.data?.website_settings);
            }
        },
        error: err => {
            setIsLoading(false);
            if (err?.meta?.message) showError(err.meta.message);
            console.log(err);
        },
        complete: () => { }
    }

    const getDefaultFonts = () => {
        API.getMasterList(getDefaultFontsResponseObj, null, true, Constant.GET_DEFAULT_FONTS);
    }

    const getDefaultFontsResponseObj = {
        cancel: () => { },
        success: response => {
            if (response?.data?.length) setDefaultFonts(response.data);
        },
        error: err => {
            console.log(err);
        },
        complete: () => { }
    }

    const getAccountList = () => {
        API.getMasterList(accountListResponseObj, null, true, Constant.ACTIVE_ACCOUNT_LIST);
    }

    const accountListResponseObj = {
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

    const getBaseTemplates = () => {
        API.getDrpData(getBaseTemplatesResponseObj, null, true, Constant.GET_ACTIVE_DEFAULT_TEMPLATES);
    }

    const getBaseTemplatesResponseObj = {
        cancel: () => { },
        success: response => {
            let _defaultTemplates = [];
            if (response?.meta?.status && response?.data?.defaultTemplate?.length) {
                _defaultTemplates = response.data.defaultTemplate.map(templateObj => {
                    return {
                        key: uuid(),
                        id: templateObj?._id ?? '',
                        code: templateObj?.template_code ?? '',
                        redirectionUrl: templateObj?.url ?? '',
                        title: templateObj?.template_title ?? '',
                        isActive: Boolean(templateObj?.is_active),
                        imageUrl: templateObj?.theme_image?.path ?? '',
                    };
                });
            }

            const templateId = _defaultTemplates?.[0]?.id ?? '';
            if (templateId) setGeneralDetails({ ...generalDetails, template: templateId });
            setDefaultTemplates([..._defaultTemplates]);
        },
        error: err => {
            console.log(err);
        },
        complete: () => { }
    }

    const getWebsiteSettings = () => {
        API.getDrpData(getWebsiteSettingsResponseObj, null, true, Constant.GET_ALL_WEBSITE_SETTINGS);
    }

    const getWebsiteSettingsResponseObj = {
        cancel: () => { },
        success: response => {
            if (response?.meta?.status) {
                if (response?.data?.defaultPage?.length > 0) {
                    setPageAndSectionData(response.data.defaultPage);
                }
            }
        },
        error: err => {
            console.log(err);
        },
        complete: () => { }
    }

    const setPageAndSectionData = responseData => {
        let _websiteSettings = [];

        _websiteSettings = responseData.map(pageData => {
            return {
                id: pageData?._id,
                title: pageData?.page_title,
                pageCode: pageData?.page_code,
                isCompulsory: pageData?.is_compulsory,
                components: pageData?.default_page_component?.map(componentData => {
                    return {
                        id: componentData?._id,
                        title: componentData?.component_title,
                        isCompulsory: componentData?.is_compulsory,
                        templates: componentData?.default_component_template?.map(templateData => {
                            return {
                                id: templateData?._id,
                                templateTypeId: templateData?.template_type_id,
                                templateImage: templateData?.template_images?.[0],
                                title: templateData?.default_templates?.template_title,
                            };
                        })
                    };
                })
            };
        });

        setWebsiteSettings([..._websiteSettings]);
    }

    const getSelectedWebsiteSettings = responseData => {
        let _selectedWebsiteSettings = [];

        if (responseData?.length > 0) {
            _selectedWebsiteSettings = responseData.map(pageData => {
                return {
                    id: pageData?.page_id,
                    title: pageData?.page_name,
                    components: pageData?.components?.map(componentData => {
                        return {
                            id: componentData?.component,
                            title: componentData?.component_name,
                            template: {
                                id: componentData?.selected_template,
                                title: componentData?.selected_template_name,
                                componentTemplateId: componentData?.component_template_id,
                            }
                        };
                    })
                };
            });
        }

        setSelectedWebsiteSettings([..._selectedWebsiteSettings]);
    }

    const handleGeneralConfigChange = (key, value) => {
        if (key === "account") {
            primaryAccountId = value;
            showMicrositeConfigDetails(value);
        } else {
            setGeneralDetails({ ...generalDetails, [key]: value });
        }
    }

    const handleSubmit = (e, isTemporary = true) => { // NOSONAR
        e.preventDefault();

        if (!generalDetails.template) {
            showError("Please select the base template");
            return;
        }

        if (generalDetails.account) {
            const baseTemplate = generalDetails.template;
            const _siteStyleSettings = styleConfigRef.current.getSiteStyleDetails();
            const _selectedWebsiteSettings = pageConfigRef.current.getSelectedWebsiteSettings();

            const data = {
                theme: "Light",
                website_settings: [],
                base_template: baseTemplate,
                account_id: generalDetails.account,
                is_temporary_config: isTemporary ? 1 : 0,
                data_site_border_radius: _siteStyleSettings.borderRadius ?? 0,
                data_button_primary_color: _siteStyleSettings.colorConfigurations.buttonPrimaryColor.color,
                data_button_secondary_color: _siteStyleSettings.colorConfigurations.buttonSecondaryColor.color,
                data_site_primary_color: _siteStyleSettings.colorConfigurations.sitePrimaryColor.color,
                data_site_secondary_color: _siteStyleSettings.colorConfigurations.siteSecondaryColor.color,
                data_site_footer_bg_color: _siteStyleSettings.colorConfigurations.footerBackColor.color,
                data_site_footer_text_color: _siteStyleSettings.colorConfigurations.footerTextColor.color,
            };

            if (_siteStyleSettings.primaryFont) {
                const font = defaultFonts.find(font => font.fonts_url === _siteStyleSettings.primaryFont);
                data["data_site_font_primary_url"] = _siteStyleSettings.primaryFont;
                data["data_site_font_primary"] = font?.family;
            }

            for (let i = 0; i < _selectedWebsiteSettings.length; i++) {
                data["website_settings"][i] = {};
                data["website_settings"][i]["page_id"] = _selectedWebsiteSettings[i].id;
                data["website_settings"][i]["page_name"] = _selectedWebsiteSettings[i].title;

                const pageId = _selectedWebsiteSettings[i].id;
                const pageObj = websiteSettings.find(page => page.id === pageId);
                const pageComponents = pageObj?.components ?? [];
                data["website_settings"][i]["page_code"] = pageObj?.pageCode;

                data["website_settings"][i]["components"] = [];
                for (let j = 0; j < pageComponents.length; j++) {
                    let selectedComponent = pageComponents[j];
                    data["website_settings"][i]["components"][j] = {};
                    data["website_settings"][i]["components"][j]["component"] = selectedComponent.id;
                    data["website_settings"][i]["components"][j]["component_name"] = selectedComponent.title;

                    let templateList = selectedComponent?.templates ?? [];
                    const selectedTemplate = templateList.find(template => template.templateTypeId === baseTemplate);

                    data["website_settings"][i]["components"][j]["component_template_id"] = selectedTemplate?.id ?? '';
                    data["website_settings"][i]["components"][j]["selected_template_name"] = selectedTemplate?.title ?? '';
                    data["website_settings"][i]["components"][j]["selected_template"] = selectedTemplate?.templateTypeId ?? '';
                }
            }

            let formData = new FormData();
            formData.append("data", JSON.stringify(data));

            setSiteStyleDetails({ ..._siteStyleSettings });

            if (_siteStyleSettings.coverImage.url.length > 0) {
                formData.append("loader_image", _siteStyleSettings.coverImage.obj);
            }

            setPreviewFlag(isTemporary);
            setSubmittedFormData(formData);
        }
    };

    const createMicrositeConfig = data => {
        setIsLoading(true);
        API.addMaster(createMicrositeConfigResponseObj, data, true, Constant.CREATE_MICROSITE);
    }

    const createMicrositeConfigResponseObj = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            setSubmittedFormData(null);

            if (response?.meta?.status) {
                if (response?.meta?.message) showSuccess(response.meta.message);
                const accountId = generalDetails?.account ?? primaryAccountId;
                const { url: accountURL, subdomain_url: subDomainURL } = response?.data?.account ?? {};

                const url = previewFlag ? subDomainURL : accountURL;
                if (url) window.open(url, "_blank");
                if (!previewFlag) showMicrositeConfigDetails(accountId);
                setPreviewFlag('');
            }
        },
        error: err => {
            setPreviewFlag('');
            setIsLoading(false);
            setSubmittedFormData(null);

            if (err?.meta?.message) showError(err.meta.message);
            console.log(err);
        },
        complete: () => { }
    }

    const resetChanges = e => {
        e.preventDefault();
        setSiteStyleDetails({ ...defaultSiteStyleDetails });
    }

    const handleCloseDialog = e => {
        e.preventDefault();
        setShowConfirmationDialog(false);
    }

    const handleLaunchAction = e => {
        e.preventDefault();
        setShowConfirmationDialog(false);
        if (submittedFormData) createMicrositeConfig(submittedFormData);
    }

    return (
        <div className="card micro-site">
            <Toast ref={toast} />
            {isLoading && <Loader />}

            <div className="card-header">
                <h5 className="card-title">{CommonMaster.MICROSITE_CONFIGURATION}</h5>
            </div>

            <div className="card-body">
                <GeneralConfiguration
                    accountData={accountData}
                    generalDetails={generalDetails}
                    defaultTemplates={defaultTemplates}
                    handleGeneralConfigChange={(key, value) => { handleGeneralConfigChange(key, value); }} // NOSONAR
                />

                {
                    generalDetails.account && (
                        <>
                            <PageConfiguration
                                ref={pageConfigRef}
                                websiteSettings={websiteSettings}
                                selectedWebsiteSettings={selectedWebsiteSettings}
                            />

                            <SiteStyleConfiguration
                                ref={styleConfigRef}
                                defaultFonts={defaultFonts}
                                siteStyleDetails={siteStyleDetails}
                            />
                        </>
                    )
                }
            </div>

            <div className="card-footer row">
                <button onClick={handleSubmit} disabled={!generalDetails.account} className="col-md-1 btn btn-primary">
                    Preview
                </button>

                <button
                    disabled={!generalDetails.account}
                    className="col-md-1 btn btn-danger"
                    onClick={e => { handleSubmit(e, false); }}
                >
                    Save & Launch
                </button>

                <button className="col-md-1 btn btn-primary" onClick={resetChanges}>Reset</button>
            </div>

            {
                showConfirmationDialog && (
                    <ConfirmationDialog
                        handleCloseDialog={handleCloseDialog} // NOSONAR
                        handleLaunchAction={handleLaunchAction} // NOSONAR
                    />
                )
            }
        </div>
    );
}

export default MicrositeConfig;
