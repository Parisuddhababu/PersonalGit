import usePostFormDataHook from "@components/Hooks/postFormDataRegisterHook";
import APICONFIG from "@config/api.config";
import { IGiftForm } from "@templates/Checkout/components/GiftMessage";
import { useToast } from "@components/Toastr/Toastr";
import ErrorHandler from "@components/ErrorHandler";
import { IAPIError } from "@type/Common/Base";
import { setLoader } from "src/redux/loader/loaderAction";
import { useDispatch } from 'react-redux';

const useGiftMessage = () => {
    const { makeDynamicFormDataAndPostData, submitFormDataHook, getDataHook } = usePostFormDataHook();
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

    const submitGiftMessage = async (props: IGiftForm, _id: string) => {
        // @ts-ignore
        dispatch(setLoader(true))
        try {
            let gift_message = {
                gift_recipient: props?.gift_recipient,
                gift_sender: props?.gift_sender,
                gift_message: props?.gift_message
            }
            const responseData = await submitFormDataHook(
                { gift_message },
                `${APICONFIG.GIFT_PERSONALISATION}/${_id}`
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
        //  dispatch(setLoader(true))
        try {
            const responseData = await getDataHook(
                APICONFIG.GET_CART_CHECKOUT_LIST,
                {}
            );
            if (responseData?.meta?.message) {
                showSuccess(responseData?.meta?.message);
                // @ts-ignore
                // dispatch(setLoader(false))
            }
             // @ts-ignore
            //  dispatch(setLoader(false))
            return responseData
        }
        catch (err) {
            // @ts-ignore
            //  dispatch(setLoader(false))
            ErrorHandler(err as IAPIError, showError);
        }

    }

    return {
        removeGiftMessage,
        submitGiftMessage,
        getCheckoutUpdatedData
    }
}


export default useGiftMessage
