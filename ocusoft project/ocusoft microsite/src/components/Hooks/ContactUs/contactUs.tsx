import { useState } from "react";
import pagesServices from "@services/pages.services";
import { useDispatch } from "react-redux";
import { setLoader } from "src/redux/loader/loaderAction";
import { IContactAddress, IContactData } from "@type/Pages/contactUsAddress";

const useContactUsHook = () => {
    const dispatch = useDispatch();
    const [contactUsData, setContactUsData] = useState<IContactData>()

    const createContactUsForm = (
        postPageAPI: string,
        data:IContactAddress
    ) => {
        dispatch(setLoader(true));
        pagesServices
            .postPage(postPageAPI, data)
            .then((result) => {
                dispatch(setLoader(false));
                setContactUsData(result);
            })
            .catch((err) => err);
    };

    const createContactUsFunc = async (
        postPageAPI: string,
        data:IContactAddress
    ): Promise<void> => {
        createContactUsForm(postPageAPI, data);
    };
    return {
        createContactUsFunc,
        contactUsData
    };
};

export default useContactUsHook;
