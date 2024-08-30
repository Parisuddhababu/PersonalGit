import { useState } from "react";
import pagesServices from "@services/pages.services";

const useForgotPasswordHook = () => {

    const [forgotPasswordData, setForgotPasswordData] = useState<any>()

    const forgotPassword = (
        postPageAPI: string,
        data: any
    ) => {
        pagesServices
            .postPage(postPageAPI, data)
            .then((result) => {
                setForgotPasswordData(result);
            })
            .catch((err) => err);
    };



    const createForgotPasswordFunc = async (
        postPageAPI: string,
        data: any
    ): Promise<void> => {
        forgotPassword(postPageAPI, data);
    };
    return {
        createForgotPasswordFunc,
        forgotPasswordData
    };
};

export default useForgotPasswordHook;
