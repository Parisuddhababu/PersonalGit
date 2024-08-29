const UseDefaultMicrositeConfigurations = () => {
    const adminRole = JSON.parse(localStorage.getItem("user_details"))?.role?.code;
    let primaryAccountId = adminRole !== "SUPER_ADMIN" ? localStorage.getItem("account_id") : '';

    const getDefaultGeneralDetails = () => {
        return { account: primaryAccountId, theme: '', template: '' };
    }

    const getDefaultSiteStyleDetails = () => {
        return {
            primaryFont: '',
            borderRadius: 25,
            coverImage: { url: '', noPicture: '', obj: '', uuid: '' },
            colorConfigurations: {
                footerBackColor: { color: "1a428a", text: "#1A428A" },
                footerTextColor: { color: "ffffff", text: "#FFFFFF" },
                sitePrimaryColor: { color: "1a428a", text: "#1A428A" },
                siteSecondaryColor: { color: "5fb2e4", text: "#5FB2E4" },
                buttonPrimaryColor: { color: "1a428a", text: "#1A428A" },
                buttonSecondaryColor: { color: "5fb2e4", text: "#5FB2E4" },
            },
        };
    }

    return {
        getDefaultGeneralDetails,
        getDefaultSiteStyleDetails,
    };
};

export default UseDefaultMicrositeConfigurations;
