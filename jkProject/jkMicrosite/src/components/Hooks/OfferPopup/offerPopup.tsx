import usePostFormDataHook from "@components/Hooks/postFormDataRegisterHook";
import APICONFIG from '@config/api.config';
import { IOfferForm } from "@components/Hooks/OfferPopup";
import { useToast } from "@components/Toastr/Toastr";
import ErrorHandler from "@components/ErrorHandler";
import { IAPIError } from "@type/Common/Base";

export const useOfferPopup = () => {
    const { makeDynamicFormDataAndPostData } = usePostFormDataHook();
    const { showError, showSuccess } = useToast();

    const submitOfferPopup = async (props: IOfferForm) => {
        try {
            const responseData = await makeDynamicFormDataAndPostData(
                { ...props },
                APICONFIG.POPUP_API
            );
            if (responseData?.meta) {
                showSuccess(responseData?.message);
            }
            return responseData
        } catch (err) {
            ErrorHandler(err as IAPIError, showError);
        }
    }
    const getOfferData = async () => {
        try {
            const responseData = await makeDynamicFormDataAndPostData(
                {},
                APICONFIG.OFFER_POPUP
            );
            if (responseData?.meta) {
                // showSuccess(responseData?.message);
            }
            return responseData
        } catch (err) {
            ErrorHandler(err as IAPIError, showError);
        }
    }
    return {
        submitOfferPopup,
        getOfferData
    }

}

export default useOfferPopup
