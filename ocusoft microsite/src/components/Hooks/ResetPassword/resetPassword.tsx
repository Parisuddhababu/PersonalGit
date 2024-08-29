import { useState } from "react";
import pagesServices from "@services/pages.services";
import { IResetPasswordForm, IResetPasswordRes } from "@type/Pages/resetPassword";
import { useDispatch } from "react-redux";
import { setLoader } from "src/redux/loader/loaderAction";

const useResetPasswordHook = () => {

    const [resetPasswordData, setResetPasswordData] = useState<IResetPasswordRes>()
    const dispatch = useDispatch();

    const resetPassword = (
        postPageAPI: string,
        data: IResetPasswordForm
    ) => {
        dispatch(setLoader(true));
        pagesServices
            .postPage(postPageAPI, data)
            .then((result) => {
                dispatch(setLoader(false));
                setResetPasswordData(result);
            })
            .catch((err) => err);
    };

    const createResetPasswordFunc = async (
        postPageAPI: string,
        data: IResetPasswordForm
    ): Promise<void> => {
        resetPassword(postPageAPI, data);
    };

    return {
        createResetPasswordFunc,
        resetPasswordData
    };
};

export default useResetPasswordHook;
