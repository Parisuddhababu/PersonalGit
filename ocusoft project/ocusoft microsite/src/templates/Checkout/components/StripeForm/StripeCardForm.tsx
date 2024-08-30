import APICONFIG from '@config/api.config';
import { EMAIL_REGEX } from '@constant/regex';
import pagesServices from '@services/pages.services';
import {
    useStripe,
    useElements,
    CardElement,
} from '@stripe/react-stripe-js';
import { ISignInReducerData } from '@type/Common/Base';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { setLoader } from 'src/redux/loader/loaderAction';

type StripeFormProps = {
    onPaymentCompleted: (transaction: any, method: string, status: number, id: string) => void
    placeOrderObj: any
    amount: number
}
const StripeCardForm = ({
    onPaymentCompleted,
    placeOrderObj,
    amount
}: StripeFormProps) => {
    const dispatch = useDispatch()
    const stripe = useStripe();
    const elements = useElements();
    const signedInUserdata = useSelector((state: ISignInReducerData) => state);
    const [email, setEmail] = useState(signedInUserdata?.signIn?.userData?.user_detail?.email ?? '')

    const handlePaymentMethodCreation = async (event: any) => {
        event.preventDefault();
        if (!email) {
            toast.error('Email id is required')
            return
        }
        if (!EMAIL_REGEX.test(email)) {
            toast.error('Email id is invalid')
            return
        }
        if (!stripe) {
            return;
        }
        dispatch(setLoader(true))
        try {
            /*@ts-ignore*/
            const { error } = await stripe.createPaymentMethod({
                type: 'card',
                /*@ts-ignore*/
                card: elements.getElement(CardElement),
            });
            dispatch(setLoader(false))

            if (error) {
                // Handle the error (e.g., display an error message to the user)
                toast.error(error.message);

            } else {
                // Payment method created successfully, proceed with placing the order
                handleSubmit();
            }
        } catch (error) {
            dispatch(setLoader(false))
            toast.error('Something went wrong')
        }
    };
    const handleSubmit = async () => {
        try {
            if (!stripe || !elements) {
                return;
            }
            dispatch(setLoader(true))
            const order = await pagesServices.postPage(APICONFIG.CHECKOUT_PLACE_ORDER, placeOrderObj)
            if (!order?.meta?.status) {
                toast.error(order?.meta?.message)
                dispatch(setLoader(false))
                return
            }
            const result = await pagesServices.postPage(APICONFIG.PAYMENT_INTENT, {
                currency: 'usd',
                amount: Number(amount) * 100,
                order_id: order?.data?.order_id,
                email
            })
            if (!result?.data?.clientSecret) {
                toast.error('Payment failed, try again after some time')
                dispatch(setLoader(false))
                onPaymentCompleted({}, 'Stripe', 0, order?.data?.order_id)
                return
            }
            const { paymentIntent, error } = await stripe.confirmCardPayment(result?.data?.clientSecret, {
                payment_method: {
                    /*@ts-ignore*/
                    card: elements.getElement(CardElement),
                },
            });
            dispatch(setLoader(false))
            if (error) {
                toast.error(error.message);
                onPaymentCompleted(paymentIntent, 'Stripe', 0, order?.data?.order_id)
                return
            } else if (paymentIntent.status === 'succeeded') {
                // Payment succeeded
                onPaymentCompleted(paymentIntent, 'Stripe', 1, order?.data?.order_id)
            } else {
                onPaymentCompleted(paymentIntent, 'Stripe', 0, order?.data?.order_id)
            }
        } catch (error) {
            dispatch(setLoader(false))
            toast.error('Payment failed, try again after some time')
        }
    };
    const cardElementOptions = {
        style: {
            base: {
                fontSize: '18px',
                color: '#32325d',
                '::placeholder': {
                    color: '#606060',
                },
            },
            invalid: {
                color: '#fa755a',
            },
        },
    };

    return (
        <form className="card-form-wrap row" onSubmit={handlePaymentMethodCreation}>
            <div className="form-group d-col">
                <label className="control-label">Email*</label>
                <input
                    type="text"
                    placeholder="Enter your email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="d-col form-group">
                <label className="control-label">Enter card details</label>
                <CardElement options={cardElementOptions} />
            </div>

            <div className="d-col">
                <button
                    type='submit'
                    className="btn btn-primary"
                    aria-label="place-order-btn"
                    disabled={!stripe || !elements}
                >
                    PLACE ORDER
                </button>
            </div>
            <br />
        </form>
    )
}

export default StripeCardForm