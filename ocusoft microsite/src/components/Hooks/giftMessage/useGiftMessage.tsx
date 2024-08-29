import usePostFormDataHook from "@components/Hooks/postFormDataRegisterHook";
import APICONFIG from "@config/api.config";
import { useToast } from "@components/Toastr/Toastr";
import ErrorHandler from "@components/ErrorHandler";
import { IAPIError } from "@type/Common/Base";
import { setLoader } from "src/redux/loader/loaderAction";
import { useDispatch } from 'react-redux';

const useGiftMessage = () => {
    const { makeDynamicFormDataAndPostData, getDataHook } = usePostFormDataHook();
    const { showError, showSuccess } = useToast();
    const dispatch = useDispatch();

    const removeGiftMessage = async (id: string) => {
        // @ts-ignore
        dispatch(setLoader(true))
        try {
            const responseData = await makeDynamicFormDataAndPostData(
                {},
                `${APICONFIG.DELETE_GIFT_WRAP}${id}`
            );
            if (responseData?.meta?.message) {
                showSuccess(responseData?.meta?.message);
                // @ts-ignore
                dispatch(setLoader(false))
            }
            return responseData
        }
        catch (err) {
            // @ts-ignore
            dispatch(setLoader(false))
            ErrorHandler(err as IAPIError, showError);
        }
    }

    const getCheckoutUpdatedData = async () => {
        // @ts-ignore
        try {
            const responseData = await getDataHook(
                APICONFIG.GET_CART_CHECKOUT_LIST,
                {}
            );
            if (responseData?.meta?.message) {
                showSuccess(responseData?.meta?.message);
                // @ts-ignore
            }
             // @ts-ignore
            return responseData
        }
        catch (err) {
            // @ts-ignore
            ErrorHandler(err as IAPIError, showError);
        }

    }

    return {
        removeGiftMessage,
        getCheckoutUpdatedData
    }
}


export default useGiftMessage
