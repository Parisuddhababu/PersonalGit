import { IAddressListData } from "@templates/MyAddress/components/Address";
import { ICart } from "@type/Pages/cart";

export interface IPaymentGateway {
    _id: string;
    payment_gateway: string;
}

interface IAddressData{
    data : IAddressListData[]
}

export interface ICheckout {
    list:{
        cart_details: ICart
        payment_gateway: IPaymentGateway;
        user_address_list: IAddressData;
        current_payment_methods?: string;
    }
    onUpdate : (shippingAddress?: string, billingAddress?: string, paymentMethods?: string,businessName?: string,gstNumber?: string,isGst?: number) => void
    userAddress: {
      shippingAddress?: string;
      billingAddress?: string;
    }
    current_payment_methods?: string;
    businessName?: string;
    gstNumber?: string;
    isGst?: number
}