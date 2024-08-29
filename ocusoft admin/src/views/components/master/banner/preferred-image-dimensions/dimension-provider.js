import liveSet from "./live";
import templateOneSet from "./template-1";

const superAdminId = "625d2c2c92f66237892f35cc";

const dimensionKeyObjProvider = dimensionSet => {
    return {
        home_page_1: dimensionSet.HOME,
        home_page_2: dimensionSet.HOME,
        sign_up: dimensionSet.SIGN_UP,
        sign_in: dimensionSet.SIGN_IN,
        forgot_password: dimensionSet.FORGOT_PASSWORD,
        about_us: dimensionSet.ABOUT_US,
        event: dimensionSet.EVENT_LISTING,
        blog: dimensionSet.BLOG_LIST,
        career: dimensionSet.CAREERS
    }
}

const dimensionProvider = (page, account) => {
    const dimensionSet = (account === superAdminId) ? liveSet : templateOneSet;
    const dimensionKeyObj = dimensionKeyObjProvider(dimensionSet);
    const dimensionKey = dimensionKeyObj[page];
    return dimensionKey;
}

export default dimensionProvider;