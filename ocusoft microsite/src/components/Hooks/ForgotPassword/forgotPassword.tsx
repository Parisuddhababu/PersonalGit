import { useState } from "react";
import pagesServices from "@services/pages.services";
import { IForgotPasswordForm } from "@type/Pages/forgotPassword";
import { useDispatch } from "react-redux";
import { setLoader } from "src/redux/loader/loaderAction";

const useForgotPasswordHook = () => {

    const [forgotPasswordData, setForgotPasswordData] = useState();
    const dispatch = useDispatch();
    const forgotPassword = (
        postPageAPI: string,
        data: IForgotPasswordForm
    ) => {
        dispatch(setLoader(true));
        pagesServices
            .postPage(postPageAPI, data)
            .then((result) => {
                dispatch(setLoader(false));
                setForgotPasswordData(result);
            })
            .catch(() => {
                dispatch(setLoader(true));
            });
    };



    const createForgotPasswordFunc = async (
        postPageAPI: string,
        data: IForgotPasswordForm
    ): Promise<void> => {
        forgotPassword(postPageAPI, data);
    };
    return {
        createForgotPasswordFunc,
        forgotPasswordData
    };
};

export default useForgotPasswordHook;
