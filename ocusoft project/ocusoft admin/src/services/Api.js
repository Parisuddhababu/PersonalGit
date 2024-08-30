import axios from 'axios';
import * as APPCONSTANTS from '../shared/constant/constant';

let CancelToken = axios.CancelToken;

export const API = {
    login: (onResponse, data, isHeaderRequired) => {
        request(onResponse, data, APPCONSTANTS.POST, 'JSON', isHeaderRequired, APPCONSTANTS.BASE_URL + APPCONSTANTS.LOGIN)
    },

    getMasterList: (onResponse, data, isHeaderRequired, url) => {
        request(onResponse, data, APPCONSTANTS.POST, 'JSON', isHeaderRequired, APPCONSTANTS.BASE_URL + url, buildHeaderWithToken())
    },

    forgotPassword: (onResponse, data, isHeaderRequired) => {
        request(onResponse, data, APPCONSTANTS.POST, 'JSON', isHeaderRequired, APPCONSTANTS.BASE_URL + APPCONSTANTS.FORGOT_PASSWORD)
    },

    addMaster: (onResponse, data, isHeaderRequired, url) => {
        request(onResponse, data, APPCONSTANTS.POST, 'JSON', isHeaderRequired, APPCONSTANTS.BASE_URL + url, buildHeaderWithToken())
    },

    deleteMaster: (onResponse, data, isHeaderRequired, id, url) => {
        request(onResponse, data, APPCONSTANTS.DELETE, 'JSON', isHeaderRequired, APPCONSTANTS.BASE_URL + url + id, buildHeaderWithToken())
    },

    getMasterDataById: (onResponse, data, isHeaderRequired, id, url) => {
        request(onResponse, data, APPCONSTANTS.GET, 'JSON', isHeaderRequired, APPCONSTANTS.BASE_URL + url + id, buildHeaderWithToken())
    },

    putData: (onResponse, data, isHeaderRequired, url) => {
        request(onResponse, data, APPCONSTANTS.PUT, "JSON", isHeaderRequired, APPCONSTANTS.BASE_URL + url, buildHeaderWithToken());
    },

    UpdateMasterData: (onResponse, data, isHeaderRequired, id, url) => {
        request(onResponse, data, APPCONSTANTS.POST, 'JSON', isHeaderRequired, APPCONSTANTS.BASE_URL + url + id, buildHeaderWithToken())
    },

    UpdateProfileData: (onResponse, data, isHeaderRequired, id, url) => {
        request(onResponse, data, APPCONSTANTS.POST, 'JSON', isHeaderRequired, APPCONSTANTS.BASE_URL + url, buildHeaderWithToken())
    },

    UpdateStatus: (onResponse, data, isHeaderRequired, id, url) => {
        request(onResponse, data, APPCONSTANTS.PUT, 'JSON', isHeaderRequired, APPCONSTANTS.BASE_URL + url, buildHeaderWithToken())
    },

    MoveData: (onResponse, data, isHeaderRequired, url) => {
        request(onResponse, data, APPCONSTANTS.POST, 'JSON', isHeaderRequired, APPCONSTANTS.BASE_URL + url, buildHeaderWithToken())
    },

    getWebsiteData: (onResponse, data, isHeaderRequired) => {
        request(onResponse, data, APPCONSTANTS.GET, 'JSON', isHeaderRequired, APPCONSTANTS.BASE_URL + APPCONSTANTS.GETWEBSITE, buildHeaderWithToken())
    },

    getBannerTypeData: (onResponse, data, isHeaderRequired) => {
        request(onResponse, data, APPCONSTANTS.GET, 'JSON', isHeaderRequired, APPCONSTANTS.BASE_URL + APPCONSTANTS.GETBANNERTYPE, buildHeaderWithToken())
    },

    getAccountDataByLoginId: (onResponse, data, isHeaderRequired) => {
        request(onResponse, data, APPCONSTANTS.GET, 'JSON', isHeaderRequired, APPCONSTANTS.BASE_URL + APPCONSTANTS.ACCOUNT_ACTIVE_LIST, buildHeaderWithToken())
    },

    getWebsiteDataByLoginId: (onResponse, data, isHeaderRequired) => {
        request(onResponse, data, APPCONSTANTS.GET, 'JSON', isHeaderRequired, APPCONSTANTS.BASE_URL + APPCONSTANTS.GETWEBSITE, buildHeaderWithToken())
    },

    deleteAllMaster: (onResponse, data, isHeaderRequired, url) => {
        request(onResponse, data, APPCONSTANTS.POST, 'JSON', isHeaderRequired, APPCONSTANTS.BASE_URL + url, buildHeaderWithToken())
    },

    deletedEventDocument: (onResponse, data, isHeaderRequired, id) => {
        request(onResponse, data, APPCONSTANTS.DELETE, 'JSON', isHeaderRequired, APPCONSTANTS.BASE_URL + APPCONSTANTS.DELETEDOCUMENT + id, buildHeaderWithToken())
    },

    deletedBlogDocument: (onResponse, data, isHeaderRequired, id) => {
        request(onResponse, data, APPCONSTANTS.DELETE, 'JSON', isHeaderRequired, APPCONSTANTS.BASE_URL + APPCONSTANTS.DELETEBLOGDOCUMENT + id, buildHeaderWithToken())
    },

    deletedBannerDocument: (onResponse, data, isHeaderRequired, id) => {
        request(onResponse, data, APPCONSTANTS.DELETE, 'JSON', isHeaderRequired, APPCONSTANTS.BASE_URL + APPCONSTANTS.DELETEBANNERDOCUMENT + id, buildHeaderWithToken())
    },

    sendMail: (onResponse, data, isHeaderRequired, url) => {
        request(onResponse, data, APPCONSTANTS.POST, 'JSON', isHeaderRequired, APPCONSTANTS.BASE_URL + url, buildHeaderWithToken())
    },

    UpdateCmsData: (onResponse, data, isHeaderRequired, id, url) => {
        request(onResponse, data, APPCONSTANTS.POST, 'JSON', isHeaderRequired, APPCONSTANTS.BASE_URL + url + id, buildHeaderWithToken())
    },

    deletedTestimonialDocument: (onResponse, data, isHeaderRequired, id) => {
        request(onResponse, data, APPCONSTANTS.DELETE, 'JSON', isHeaderRequired, APPCONSTANTS.BASE_URL + APPCONSTANTS.DELETETESTIMONIALSDOC + id, buildHeaderWithToken())
    },

    deleteDocument: (onResponse, data, isHeaderRequired, id, url) => {
        request(onResponse, data, APPCONSTANTS.DELETE, 'JSON', isHeaderRequired, APPCONSTANTS.BASE_URL + url + id, buildHeaderWithToken())
    },

    getCustomizationList: (onResponse, data, isHeaderRequired) => {
        request(onResponse, data, APPCONSTANTS.GET, 'JSON', isHeaderRequired, APPCONSTANTS.BASE_URL + APPCONSTANTS.GETCUSTOMIZATION, buildHeaderWithToken())
    },

    getFilterList: (onResponse, data, isHeaderRequired) => {
        request(onResponse, data, APPCONSTANTS.GET, 'JSON', isHeaderRequired, APPCONSTANTS.BASE_URL + APPCONSTANTS.GETFILTERLIST, buildHeaderWithToken())
    },

    getFilterSequence: (onResponse, data, isHeaderRequired) => {
        request(onResponse, data, APPCONSTANTS.POST, 'JSON', isHeaderRequired, APPCONSTANTS.BASE_URL + APPCONSTANTS.FILTERSEQUENCELIST, buildHeaderWithToken())
    },

    deleteCategoryDoc: (onResponse, data, isHeaderRequired, id) => {
        request(onResponse, data, APPCONSTANTS.DELETE, 'JSON', isHeaderRequired, APPCONSTANTS.BASE_URL + APPCONSTANTS.DELETECATEGORYDOC + id, buildHeaderWithToken())
    },

    getUserByEvent: (onResponse, data, isHeaderRequired, id) => {
        request(onResponse, data, APPCONSTANTS.GET, 'JSON', isHeaderRequired, APPCONSTANTS.BASE_URL + APPCONSTANTS.GETEVENTUSER + id, buildHeaderWithToken())
    },

    getActiveDataList: (URL, onResponse, data, isHeaderRequired) => {
        request(onResponse, data, APPCONSTANTS.GET, 'JSON', isHeaderRequired, APPCONSTANTS.BASE_URL + URL, buildHeaderWithToken())
    },

    getDrpData: (onResponse, data, isHeaderRequired, url) => {
        request(onResponse, data, APPCONSTANTS.GET, 'JSON', isHeaderRequired, APPCONSTANTS.BASE_URL + url, buildHeaderWithToken())
    },

    abortableRequest(onResponse, data, isHeaderRequired, url, controller) {
        request(
            onResponse,
            data,
            APPCONSTANTS.POST,
            "JSON",
            isHeaderRequired,
            APPCONSTANTS.BASE_URL + url,
            buildHeaderWithToken(),
            controller
        );
    },

    getCountryList: (onResponse, data, isHeaderRequired) => {
        request(onResponse, data, APPCONSTANTS.POST, 'JSON', isHeaderRequired, APPCONSTANTS.BASE_URL + APPCONSTANTS.GET_COUNTRY, buildHeaderWithToken())
    },
    getStateList: (onResponse, data, isHeaderRequired) => {
        request(onResponse, data, APPCONSTANTS.POST, 'JSON', isHeaderRequired, APPCONSTANTS.BASE_URL + APPCONSTANTS.GET_STATE, buildHeaderWithToken())
    },
    getCityList: (onResponse, data, isHeaderRequired) => {
        request(onResponse, data, APPCONSTANTS.POST, 'JSON', isHeaderRequired, APPCONSTANTS.BASE_URL + APPCONSTANTS.GET_CITY, buildHeaderWithToken())
    },
    addAddress: (onResponse, data, isHeaderRequired) => {
        request(onResponse, data, APPCONSTANTS.POST, 'JSON', isHeaderRequired, APPCONSTANTS.BASE_URL + APPCONSTANTS.ADDRESS_BOOK_CREATE, buildHeaderWithToken())
    },
    updateAddress: (onResponse, data, isHeaderRequired, id) => {
        request(onResponse, data, APPCONSTANTS.POST, 'JSON', isHeaderRequired, APPCONSTANTS.BASE_URL + APPCONSTANTS.ADDRESS_BOOK_UPDATE + id, buildHeaderWithToken())
    },
    deleteAddress: (onResponse, data, isHeaderRequired, id) => {
        request(onResponse, data, APPCONSTANTS.DELETE, 'JSON', isHeaderRequired, APPCONSTANTS.BASE_URL + APPCONSTANTS.ADDRESS_BOOK_DELETE + id, buildHeaderWithToken())
    },
    changeDefaultAddress: (onResponse, data, isHeaderRequired, id) => {
        request(onResponse, data, APPCONSTANTS.POST, 'JSON', isHeaderRequired, APPCONSTANTS.BASE_URL + APPCONSTANTS.ADDRESS_BOOK_DEFAULT + id, buildHeaderWithToken())
    },
    getHcpAdressData: (onResponse, data, isHeaderRequired, url) => {
        request(onResponse, data, APPCONSTANTS.GET, 'JSON', isHeaderRequired, APPCONSTANTS.BASE_URL + url, buildHeaderWithToken())
    },
    createTrailOrderAddress: (onResponse, data, isHeaderRequired) => {
        request(onResponse, data, APPCONSTANTS.POST, 'JSON', isHeaderRequired, APPCONSTANTS.BASE_URL + APPCONSTANTS.CREATE_TRAIL_ORDERS_ADRESS, buildHeaderWithToken())
    },
    TrailOrderAddress:(onResponse, data, isHeaderRequired)=>{
        request(onResponse, data, APPCONSTANTS.POST, 'JSON', isHeaderRequired, APPCONSTANTS.BASE_URL + APPCONSTANTS.TRAIL_ORDERS_ADRESS_LIST, buildHeaderWithToken())
    },
    deletehcpAddress: (onResponse, data, isHeaderRequired, id) => {
        request(onResponse, data, APPCONSTANTS.DELETE, 'JSON', isHeaderRequired, APPCONSTANTS.BASE_URL + APPCONSTANTS.HCP_ADDRESS_DELETE + id, buildHeaderWithToken())
    },
    updateHcpAddress: (onResponse, data, isHeaderRequired, id) => {
        request(onResponse, data, APPCONSTANTS.POST, 'JSON', isHeaderRequired, APPCONSTANTS.BASE_URL + APPCONSTANTS.HCP_ADDRESS_UPDATE + id, buildHeaderWithToken())
    }

}

export const buildHeader = (headerParams = {}) => {
    const header = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };

    Object.assign(header, headerParams);
    return header;
}


export const buildHeaderWithToken = (headerParams = {}) => {
    let token = localStorage.getItem("token")
    const header = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token
    };

    Object.assign(header, headerParams);
    return header;
}


async function request(onResponse, data, type, returnType, isHeaderRequired, featureURL, secureRequest, controller) { //NOSONAR
    let response = '';
    let responseJSON;
    if (navigator.onLine) {
        try {
            if (type === APPCONSTANTS.GET) {
                if (isHeaderRequired) {
                    axios.get(featureURL, {
                        headers: secureRequest,
                        cancelToken: new CancelToken(function executor(c) {
                            // An executor function receives a cancel function as a parameter
                            onResponse.cancel(c)
                        })
                    }).then(function (response) {
                        if (returnType === 'TEXT') {
                            responseJSON = response.text();
                        }
                        else {
                            responseJSON = response;
                        }

                        if (response.status === 200) {
                            onResponse.success(responseJSON.data);
                        } else {
                            onResponse.error(responseJSON.data);
                        }
                        if (onResponse.complete) {
                            onResponse.complete();
                        }
                    }).catch(function (error) {
                        if (error.message === APPCONSTANTS.NETWORK_ERROR_MESSAGE) {
                            let netError = {
                                networkError: true,
                            }
                            onResponse.error(netError);
                        } else if (error.response) {
                            if (error?.response?.data?.meta?.message_code === "UNAUTHORIZED") {
                                localStorage.removeItem("token")
                                window.location.replace('/');
                            }
                            onResponse.error(error.response.data);

                        } else if (
                            error.request && (
                                error.request._response !== null ||
                                error.request._timedOut ||
                                error.request._response !== ''
                            )
                        ) {
                            console.log(error);
                        }

                    });
                }
                else {

                    axios.get(featureURL, {
                        cancelToken: new CancelToken(function executor(c) {
                            // An executor function receives a cancel function as a parameter
                            onResponse.cancel(c)
                        })
                    }).then(function (res) {
                        response = res

                        if (returnType === 'TEXT') {
                            responseJSON = response.text();
                        }
                        else {
                            responseJSON = response;
                        }
                        if (response.status === 200) {
                            onResponse.success(responseJSON.data);
                        } else {
                            onResponse.error(responseJSON.data);
                        }
                        if (onResponse.complete) {
                            onResponse.complete();
                        }
                    }).catch(function (error) {
                        if (error.message === APPCONSTANTS.NETWORK_ERROR_MESSAGE) {
                            let netError = {
                                networkError: true
                            }
                            onResponse.error(netError);
                        } else if (error.response) {
                            if (error?.response?.data?.meta?.message_code === "UNAUTHORIZED") {
                                localStorage.removeItem("token")
                                window.location.replace('/')
                            }
                            onResponse.error(error.response.data);
                        } else if (
                            error.request && (
                                error.request._response !== null ||
                                error.request._timedOut ||
                                error.request._response !== ''
                            )
                        ) {
                            console.log(error);
                        }
                    });
                }
            }
            else if (type === APPCONSTANTS.POST) {
                axios.post(featureURL, data, {
                    headers: secureRequest,
                    cancelToken: new CancelToken(function executor(c) {
                        // An executor function receives a cancel function as a parameter
                        onResponse.cancel(c)
                    }),
                    signal: controller?.signal
                })
                    .then(function (res) {
                        response = res
                        if (returnType === 'TEXT') {
                            responseJSON = response.text();
                        }
                        else {
                            responseJSON = response;
                        }
                        if (response.status === 200 || response.status === 201) {
                            onResponse.success(responseJSON.data);
                        } else {
                            onResponse.error(responseJSON.data);
                        }
                        if (onResponse.complete) {
                            onResponse.complete();
                        }
                    })
                    .catch(function (error) {
                        if (error.message === APPCONSTANTS.NETWORK_ERROR_MESSAGE) {
                            let error = {
                                networkError: true
                            }
                            onResponse.error(error);
                        } else if (error.response) {
                            if (error?.response?.data?.meta?.message_code === "UNAUTHORIZED") {
                                localStorage.removeItem("token")
                                window.location.replace('/')
                            }

                            onResponse.error(error.response.data);
                        } else if (
                            error.request && (
                                error.request._response !== null ||
                                error.request._timedOut ||
                                error.request._response !== ''
                            )
                        ) {
                            console.log(error);
                        }
                    });
            }
            else if (type === APPCONSTANTS.PUT) {
                if (isHeaderRequired) {
                    axios.put(featureURL, data, {
                        headers: secureRequest,
                        cancelToken: new CancelToken(function executor(c) {
                            // An executor function receives a cancel function as a parameter
                            onResponse.cancel(c)
                        })
                    }).then(function (res) {
                        response = res
                        if (returnType === 'TEXT') {
                            responseJSON = response.text();
                        }
                        else {
                            responseJSON = response;
                        }
                        if (response.status === 200) {
                            onResponse.success(responseJSON.data);
                        } else {
                            onResponse.error(responseJSON.data);
                        }
                        if (onResponse.complete) {
                            onResponse.complete();
                        }
                    }).catch(function (error) {
                        if (error.message === APPCONSTANTS.NETWORK_ERROR_MESSAGE) {
                            let error = {
                                networkError: true
                            }
                            onResponse.error(error);
                        } else if (error.response) {
                            if (error?.response?.data?.meta?.message_code === "UNAUTHORIZED") {
                                localStorage.removeItem("token")
                                window.location.replace('/');
                            }
                            onResponse.error(error.response.data);
                        } else if (
                            error.request && (
                                error.request._response !== null ||
                                error.request._timedOut ||
                                error.request._response !== ''
                            )
                        ) {
                            console.log(error);
                        }
                    });
                }
                else {
                    axios.put(featureURL, data, {
                        cancelToken: new CancelToken(function executor(c) {
                            // An executor function receives a cancel function as a parameter
                            onResponse.cancel(c)
                        })
                    }).then(function (res) {
                        response = res
                        if (returnType === 'TEXT') {
                            responseJSON = response.text();
                        }
                        else {
                            responseJSON = response;
                        }
                        if (response.status === 200) {
                            onResponse.success(responseJSON.data);
                        } else {
                            onResponse.error(responseJSON.data);
                        }
                        if (onResponse.complete) {
                            onResponse.complete();
                        }
                    }).catch(function (error) {
                        if (error.message === APPCONSTANTS.NETWORK_ERROR_MESSAGE) {
                            let error = {
                                networkError: true
                            }
                            onResponse.error(error);
                        } else if (error.response) {
                            if (error?.response?.data?.meta?.message_code === "UNAUTHORIZED") {
                                localStorage.removeItem("token")
                                window.location.replace('/')
                            }
                            onResponse.error(error.response.data);
                        } else if (
                            error.request && (
                                error.request._response !== null ||
                                error.request._timedOut ||
                                error.request._response !== ''
                            )
                        ) {
                            console.log(error);
                        }
                    });
                }
            }
            else if (type === APPCONSTANTS.DELETE) {
                if (isHeaderRequired) {
                    axios.delete(featureURL, {
                        headers: secureRequest,
                        cancelToken: new CancelToken(function executor(c) {
                            // An executor function receives a cancel function as a parameter
                            onResponse.cancel(c)
                        })
                    }).then(function (res) {
                        response = res
                        if (returnType === 'TEXT') {
                            responseJSON = response.text();
                        }
                        else {
                            responseJSON = response;
                        }
                        if (response.status === 200) {
                            onResponse.success(responseJSON.data);
                        } else {
                            onResponse.error(responseJSON.data);
                        }
                        if (onResponse.complete) {
                            onResponse.complete();
                        }
                    }).catch(function (error) {
                        if (error.message === APPCONSTANTS.NETWORK_ERROR_MESSAGE) {
                            let error = {
                                networkError: true
                            }
                            onResponse.error(error);
                        } else if (error.response) {
                            if (error?.response?.data?.meta?.message_code === "UNAUTHORIZED") {
                                localStorage.removeItem("token")
                                window.location.replace('/')
                            }
                            onResponse.error(error.response.data);
                        } else if (
                            error.request && (
                                error.request._response !== null ||
                                error.request._timedOut ||
                                error.request._response !== ''
                            )
                        ) {
                            console.log(error);
                        }
                    });
                }
                else {
                    axios.delete(featureURL, {
                        cancelToken: new CancelToken(function executor(c) {
                            // An executor function receives a cancel function as a parameter
                            onResponse.cancel(c)
                        })
                    }).then(function (res) {
                        response = res
                        if (returnType === 'TEXT') {
                            responseJSON = response.text();
                        }
                        else {
                            responseJSON = response;
                        }
                        if (response.status === 200) {
                            onResponse.success(responseJSON.data);
                        } else {
                            onResponse.error(responseJSON.data);
                        }
                        if (onResponse.complete) {
                            onResponse.complete();
                        }
                    }).catch(function (error) {
                        if (error.message === APPCONSTANTS.NETWORK_ERROR_MESSAGE) {
                            error = {
                                networkError: true
                            }
                            onResponse.error(error);
                        } else if (error.response) {
                            if (error?.response?.data?.meta?.message_code === "UNAUTHORIZED") {
                                localStorage.removeItem("token")
                                window.location.replace('/')
                            }
                            onResponse.error(error.response.data);
                        } else if (
                            error.request && (
                                error.request._response !== null ||
                                error.request._timedOut ||
                                error.request._response !== ''
                            )
                        ) {
                            console.log(error);
                        }
                    });
                }
            }
        } catch (error) {
            if (onResponse.complete) {
                onResponse.complete();
            }

        }
    } else {
        let error = {
            networkError: true
        }
        onResponse.error(error)
    }
}