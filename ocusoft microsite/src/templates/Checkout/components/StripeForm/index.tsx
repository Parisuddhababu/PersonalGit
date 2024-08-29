import FormValidationError from "@components/FormValidationError";
import { Message } from "@constant/errorMessage";
import { CARD_CODE, CARD_MONTH, CARD_NUMBER, CARD_YEAR, EMAIL_REGEX, FULL_NAME, PINCODE_REGEX } from "@constant/regex";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import pagesServices from "@services/pages.services";
import APICONFIG from "@config/api.config";

export type StripeFormValues = {
    number: string
    cardNumber: string
    exp_month: string
    exp_year: string
    mobile_number: string
    cvc: string
    zipCode: string
    email: string
}
type StripeFormProps = {
    onFormSubmit: (data: StripeFormValues) => void
}
const StripeForm = ({
    onFormSubmit
}: StripeFormProps) => {

    const defaultValues = {
        number: "",
        cardNumber: "",
        exp_month: "",
        exp_year: "",
        cvc: "",
        zipCode: "",
        email: ""
    };
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<StripeFormValues>({ defaultValues });

    const Validations = {
        number: {
            required: Message.CARD_HOLDER_NAME_REQUIRED,
            pattern: {
                value: FULL_NAME,
                message: Message.ALLOW_ONLY_CHARACTERS,
            },
        },
        cardNumber: {
            required: Message.CARD_NUMBER_REQUIRED,
            pattern: {
                value: CARD_NUMBER,
                message: Message.INVALID_CARD_NUMBER,
            },
        },
        exp_month: {
            required: Message.EXPIRY_MONTH_REQUIRED,
            pattern: {
                value: CARD_MONTH,
                message: Message.INVALID_EXPIRY_MONTH,
            },
        },
        exp_year: {
            required: Message.EXPIRY_YEAR_REQUIRED,
            pattern: {
                value: CARD_YEAR,
                message: Message.INVALID_EXPIRY_YEAR,
            },
        },
        cvc: {
            required: Message.CARD_CODE_REQUIRED,
            pattern: {
                value: CARD_CODE,
                message: Message.INVALID_CARD_CODE,
            },
        },
        zipCode: {
            required: Message.ZIP_CODE_REQUIRED,
            pattern: {
                value: PINCODE_REGEX,
                message: Message.INVALID_ZIP_CODE,
            },
        },
        email: {
            required: Message.EMAIL_REQUIRED,
            pattern: {
                value: EMAIL_REGEX,
                message: Message.EMAIL_PATTERN,
            },
        },
    };

    const onSubmit: SubmitHandler<StripeFormValues> = async (data) => {
        try {
            const date = new Date()
            if (Number(data?.exp_year) < date.getFullYear()) {
                toast.error('You have provided invalid expiry year')
                return
            }
            pagesServices.postPage(APICONFIG.PAYMENT_INTENT, {
                amount: 100,
                currency: 'usd'
            }).then((res) => {
                onFormSubmit(res)
            })
        } catch (error) {
        }

    };

    return (
        <form className="card-form-wrap row" onSubmit={handleSubmit(onSubmit)}>
            <div className="d-col form-group">
                <label className="control-label">Cardholder Name*</label>
                <input
                    {...register('number', Validations.number)}
                    type="text"
                    name="number"
                    id="number"
                    placeholder="Enter card holder name"
                    className="form-control" />
                <FormValidationError errors={errors} name='number' />
            </div>
            <div className="d-col form-group">
                <label className="control-label">Card Number*</label>
                <input
                    {...register('cardNumber', Validations.cardNumber)}
                    type="text"
                    name="cardNumber"
                    id="cardNumber"
                    placeholder="Enter you card number"
                    className="form-control" />
                <FormValidationError errors={errors} name='cardNumber' />
            </div>
            <div className="form-group d-col">
                <label className="control-label">Expiration Date*</label>
                <div className="expiry-month-year">
                    <input
                        {...register('exp_month', Validations.exp_month)}
                        type="text"
                        placeholder="Month(01)"
                        name="exp_month"
                        id="exp_month"
                        className="form-control width-small"
                    />
                    <input
                        {...register('exp_year', Validations.exp_year)}
                        type="text"
                        placeholder="Year(2023)"
                        name="exp_year"
                        id="exp_year"
                        className="form-control width-small"
                    />
                </div>
                <FormValidationError errors={errors} name='exp_month' />
                <FormValidationError errors={errors} name='exp_year' />
            </div>
            <div className="form-group d-col">
                <label className="control-label">Card Code*</label>
                <input
                    {...register('cvc', Validations.cvc)}
                    type="text"
                    placeholder="123"
                    name="cvc"
                    id="cvc"
                    className="form-control width-small"
                />
                <FormValidationError errors={errors} name='cvc' />
            </div>
            <div className="form-group d-col">
                <label className="control-label">Zip Code*</label>
                <input
                    {...register('zipCode', Validations.zipCode)}
                    type="text"
                    placeholder="123456"
                    name="zipCode"
                    id="zipCode"
                    className="form-control width-small"
                />
                <FormValidationError errors={errors} name='zipCode' />
            </div>
            <div className="form-group d-col">
                <label className="control-label">Email*</label>
                <input
                    {...register('email', Validations.email)}
                    type="text"
                    name="email"
                    id="email"
                    placeholder="Enter your email"
                    className="form-control"
                />
                <FormValidationError errors={errors} name='email' />
            </div>
            <div className="d-col">
                <button
                    type='submit'
                    className="btn btn-primary"
                    aria-label="place-order-btn"
                >
                    PLACE ORDER
                </button>
            </div>
        </form>
    )
}

export default StripeForm