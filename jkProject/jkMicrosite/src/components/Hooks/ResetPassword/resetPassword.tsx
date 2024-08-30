import { useState } from "react";
import pagesServices from "@services/pages.services";
import { IResetPasswordRes } from "@type/Pages/resetPassword";

const useResetPasswordHook = () => {

    const [resetPasswordData, setResetPasswordData] = useState<IResetPasswordRes>()

    const resetPassword = (
        postPageAPI: string,
        data: any
    ) => {
        pagesServices
            .postPage(postPageAPI, data)
            .then((result) => {
                setResetPasswordData(result);
            })
            .catch((err) => err);
    };



    const createResetPasswordFunc = async (
        postPageAPI: string,
        data: any
    ): Promise<void> => {
        resetPassword(postPageAPI, data);
    };
    return {
        createResetPasswordFunc,
        resetPasswordData
    };
};

export default useResetPasswordHook;
