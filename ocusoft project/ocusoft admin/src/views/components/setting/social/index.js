import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";

import React, { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import CIcon from "@coreui/icons-react";
import { cilCheck } from "@coreui/icons";

import { API } from "src/services/Api";
import { useToast } from "src/shared/toaster/Toaster";
import * as Constant from "src/shared/constant/constant";
import Loader from "src/views/components/common/loader/loader";
import TwitterIcon from "src/assets/images/color-twitter.svg";
import FacebookIcon from "src/assets/images/color-facebook.svg";
import InstagramIcon from "src/assets/images/color-instagram.svg";
import LinkedinIcon from "src/assets/images/color-linkedin.svg";
import { camelCaseToLabel } from "src/shared/handler/common-handler";

const Social = () => {
    const adminRole = JSON.parse(localStorage.getItem("user_details"))?.role?.code;
    const primaryAccountId = localStorage.getItem("account_id");
    const { showError, showSuccess } = useToast();
    const defaultSocialLinks = {
        twitterLink: '',
        linkedinLink: '',
        facebookLink: '',
        instagramLink: '',
    };
    const socialLinkIcons = {
        twitterLink: TwitterIcon,
        linkedinLink: LinkedinIcon,
        facebookLink: FacebookIcon,
        instagramLink: InstagramIcon,
    };

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [accountData, setAccountData] = useState([]);
    const [socialLinks, setSocialLinks] = useState(defaultSocialLinks);
    const [selectedAccount, setSelectedAccount] = useState(adminRole !== "SUPER_ADMIN" ? primaryAccountId : '');

    useEffect(() => {
        if (adminRole === "SUPER_ADMIN") getAccountData();
    }, []);

    useEffect(() => {
        if (selectedAccount) getSocialLinks(selectedAccount);
    }, [selectedAccount]);

    const getAccountData = () => {
        API.getAccountDataByLoginId(getAccountDataResponse, null, true)
    }

    const getAccountDataResponse = {
        cancel: () => { },
        success: response => {
            let _accountData = [];
            if (response?.meta?.status && response?.data?.length > 0) {
                _accountData = response.data;
            }

            setAccountData(_accountData);
        },
        error: err => {
            console.log(err);
        },
        complete: () => { },
    }

    const getSocialLinks = accountId => {
        setIsLoading(true);
        API.getMasterDataById(getSocialLinksResponse, null, true, accountId, Constant.SHOWSOCIAL);
    }

    const getSocialLinksResponse = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            if (response?.meta?.status && response?.data) {
                const responseData = response.data;
                const _socialLinks = {
                    linkedinLink: responseData?.social_linkedin ?? defaultSocialLinks.linkedinLink,
                    twitterLink: responseData?.social_twitter ?? defaultSocialLinks.twitterLink,
                    instagramLink: responseData?.social_instagram ?? defaultSocialLinks.instagramLink,
                    facebookLink: responseData?.social_facebook ?? defaultSocialLinks.facebookLink,
                };

                setSocialLinks({ ..._socialLinks });
            }
        },
        error: err => {
            console.log(err);
            setIsLoading(false);
        },
        complete: () => { },
    }

    const handleSocialLinkChange = (key, value) => {
        setSocialLinks({ ...socialLinks, [key]: value });
        setErrors({ ...errors, [key]: '' });
    }

    const handleSubmit = e => {
        e.preventDefault();

        const _accountId = (adminRole === 'SUPER_ADMIN') ? selectedAccount : localStorage.getItem("account_id");
        const data = { account_id: _accountId };

        Object.assign(data,
            { social_twitter: socialLinks.twitterLink },
            { social_linkedin: socialLinks.linkedinLink },
            { social_instagram: socialLinks.instagramLink },
            { social_facebook: socialLinks.facebookLink },
        );

        setIsLoading(true);
        API.addMaster(handleSubmitResponse, data, true, Constant.ADDSOCIAL);
    }

    const handleSubmitResponse = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            if (response?.meta?.status) showSuccess(response.meta.message);
        },
        error: err => {
            setIsLoading(false);
            if (err?.meta?.message) showError(err.meta.message);
            console.log(err);
        },
        complete: () => { }
    }

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
                    <div className="card-header"><h5 className="card-title">Add Social URLs </h5></div>

                    <div className="card-body">
                        <p className="col-sm-12 text-right">
                            Fields marked with <span className="text-danger">*</span> are mandatory.
                        </p>

                        <div className="row">
                            {
                                adminRole === "SUPER_ADMIN" && (
                                    <div className="col-md-4 mb-3">
                                        <span className="p-float-label custom-p-float-label">
                                            <Dropdown
                                                value={selectedAccount}
                                                className="form-control"
                                                options={accountData}
                                                onChange={e => setSelectedAccount(e.target.value)}
                                                itemTemplate={accountDataTemplate}
                                                valueTemplate={accountDataTemplate}
                                                optionLabel="company_name"
                                                optionValue="_id"
                                                disabled={adminRole !== 'SUPER_ADMIN'}
                                                filter
                                                filterBy="company_name,code"
                                            />

                                            <label>HCP <span className="text-danger">*</span></label>
                                        </span>
                                    </div>
                                )
                            }

                            <div className="row">
                                {
                                    Object.entries(socialLinks)?.map((socialLinkEntry, index) => {
                                        const [key, value] = socialLinkEntry;
                                        const label = camelCaseToLabel(key);

                                        return (
                                            <div className="col-md-4 mt-4" key={key}>
                                                <div className="p-inputgroup">
                                                    <span className="p-inputgroup-addon">
                                                        <img src={socialLinkIcons[key]} alt={key} />
                                                    </span>

                                                    <span className="p-float-label custom-p-float-label">
                                                        <InputText
                                                            name={key}
                                                            value={value}
                                                            className={"form-control"}
                                                            onChange={e => handleSocialLinkChange(key, e.target.value)}
                                                        />

                                                        <label>{label}</label>
                                                    </span>
                                                </div>

                                                {errors[key] && (<p className="error">{errors[key]}</p>)}
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    </div>

                    {
                        selectedAccount && (
                            <div className="card-footer">
                                <button className="btn btn-primary mb-2 mr-2" onClick={handleSubmit}>
                                    <CIcon icon={cilCheck} />Save
                                </button>
                            </div>
                        )
                    }
                </div>
            </form>
        </div>
    )
}

export default Social;
