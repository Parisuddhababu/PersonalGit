import { useState } from "react";
import pagesServices from "@services/pages.services";

const useContactUsHook = () => {

    const [contactUsData, setContactUsData] = useState<any>()

    const createContactUsForm = (
        postPageAPI: string,
        data: any
    ) => {
        pagesServices
            .postPage(postPageAPI, data)
            .then((result) => {
                setContactUsData(result);
            })
            .catch((err) => err);
    };



    const createContactUsFunc = async (
        postPageAPI: string,
        data: any
    ): Promise<void> => {
        createContactUsForm(postPageAPI, data);
    };
    return {
        createContactUsFunc,
        contactUsData
    };
};

export default useContactUsHook;
