import GiftMessage1 from "@templates/Checkout/components/GiftMessage/gift-message-1"
import { IGiftMessage } from "@type/Pages/cart"


export interface IGiftWrapMessage {
    onClose: () => any;
    isModal : boolean;
    _id: string;
    gift_message? : IGiftMessage
    updateData : () => void
}

export interface IGiftForm {
    gift_recipient: string;
    gift_sender: string;
    gift_message: string;
}
export default GiftMessage1