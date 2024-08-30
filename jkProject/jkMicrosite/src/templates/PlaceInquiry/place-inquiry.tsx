import Head from "next/head";
import { useForm } from "react-hook-form";
import { useState } from "react";
import pagesServices from "@services/pages.services";
import ErrorHandler from "@components/ErrorHandler";
import { useToast } from "@components/Toastr/Toastr";
import FormValidationError from "@components/FormValidationError";
import { Message } from "@constant/errorMessage";
import { EMAIL_REGEX } from "@constant/regex";
import APICONFIG from "@config/api.config";
import Loader from "@components/customLoader/Loader";
import APPCONFIG from "@config/app.config";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import Modal from "@components/Modal";
import { IPlaceInquiryProps } from ".";
import Cookies from "js-cookie";

const PlaceInquiry = ({ viewModal, handleCloseModal }: any) => {
    const { showError, showSuccess } = useToast();
    const authDetails = localStorage.getItem("auth");
    const b2bCompanyName = Cookies.get("b2bCompanyName") ?? '';
    const termsConditionsLink = Cookies.get("termsConditionsLink") ?? '';
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const userDetails = JSON.parse(authDetails ? authDetails : '{}')?.user_detail ?? {};

    const [defaultValues] = useState<IPlaceInquiryProps>({
        address: '',
        termsAndConditions: termsConditionsLink ? false : true,
        companyName: b2bCompanyName,
        email: userDetails?.email ?? '',
        lastName: userDetails?.last_name ?? '',
        firstName: userDetails?.first_name ?? '',
    });

    const { formState: { errors }, handleSubmit, register } = useForm({ defaultValues });

    const handleInquirySubmit = async (data: IPlaceInquiryProps) => {
        const formData = new FormData();
        formData.append("email", data.email);
        formData.append("address", data.address);
        formData.append("last_name", data.lastName);
        formData.append("first_name", data.firstName);
        formData.append("company_name", data.companyName);
        formData.append("terms_condition", data.termsAndConditions ? '1' : '0');

        setIsLoading(true);
        await pagesServices
            .postPage(APICONFIG.PRODUCT_INQUIRY, formData)
            .then(
                res => {
                    setIsLoading(false);
                    if (res?.meta?.status && res?.meta?.message) showSuccess(res?.meta?.message);
                    handleCloseModal();
                },
                err => {
                    setIsLoading(false);
                    ErrorHandler(err, showError);
                    handleCloseModal();
                },
            );
    };

    const Validations = {
        companyName: {
            required: Message.COMPANYNAME_REQUIRED,
        },
        firstName: {
            required: Message.FIRSTNAME_REQUIRED,
        },
        lastName: {
            required: Message.LASTNAME_REQUIRED,
        },
        address: {
            required: Message.ADDRESS_REQUIRED,
        },
        termsAndConditions: {
            required: Message.TERMS_AND_CONDITIONS_REQUIRED,
        },
        email: {
            required: Message.EMAIL_REQUIRED,
            pattern: {
                value: EMAIL_REGEX,
                message: Message.EMAIL_PATTERN,
            },
        },
    };

    return (
        <>
            <Head>
                <title>Place Inquiry</title>
                <link
                    rel="stylesheet"
                    href={
                        APPCONFIG.STYLE_BASE_PATH_COMPONENT +
                        CSS_NAME_PATH.productInquiry +
                        ".min.css"
                    }
                />
            </Head>

            {isLoading && <Loader />}

            <Modal
                dimmer={false}
                open={viewModal}
                onClose={handleCloseModal}
                headerName="Place Inquiry"
                className="view-price-breakup-modal"
            >
                <div className="product-inquiry-wrapper">
                    <div className="container">
                        <div className="inquiry-section">
                            <div>
                                <form
                                    noValidate
                                    className="inquiry-form"
                                    onSubmit={handleSubmit(handleInquirySubmit)}
                                >
                                    <div className="row">
                                        <div className="form-group">
                                            <label>Company Name*</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder={defaultValues.companyName}
                                                {...register("companyName", Validations.companyName)}
                                            />
                                            <FormValidationError errors={errors} name="companyName" />
                                        </div>

                                        <div className="form-group" style={{ marginTop: "1rem" }}>
                                            <label>First Name*</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder={defaultValues.firstName}
                                                {...register("firstName", Validations.firstName)}
                                            />
                                            <FormValidationError errors={errors} name="firstName" />
                                        </div>

                                        <div className="form-group" style={{ marginTop: "1rem" }}>
                                            <label>Last Name*</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder={defaultValues.lastName}
                                                {...register("lastName", Validations.lastName)}
                                            />
                                            <FormValidationError errors={errors} name="lastName" />
                                        </div>

                                        <div className="form-group" style={{ marginTop: "1rem" }}>
                                            <label>Email*</label>
                                            <input
                                                type="email"
                                                id="userEmail"
                                                className="form-control"
                                                placeholder={defaultValues.email}
                                                {...register("email", Validations.email)}
                                            />
                                            <FormValidationError errors={errors} name="email" />
                                        </div>

                                        <div className="form-group" style={{ marginTop: "1rem" }}>
                                            <label>Address*</label>
                                            <textarea
                                                className="form-control"
                                                {...register("address", Validations.address)}
                                            ></textarea>
                                            <FormValidationError errors={errors} name="address" />
                                        </div>

                                        {
                                            termsConditionsLink && (
                                                <a href={termsConditionsLink}>See Terms & Conditions</a>
                                            )
                                        }

                                        {
                                            termsConditionsLink && (
                                                <div className="form-group">
                                                    <div className="cmn-checkbox">
                                                        <input
                                                            type="checkbox"
                                                            {...register("termsAndConditions", Validations.termsAndConditions)}
                                                        />
                                                        <span></span>
                                                        <label style={{ marginLeft: "0.5rem" }}>
                                                            I agree to all the terms & conditions
                                                        </label>
                                                    </div>
                                                    <FormValidationError errors={errors} name="termsAndConditions" />
                                                </div>
                                            )
                                        }

                                        <div className="form-group" style={{ marginTop: "1.5rem" }}>
                                            <button className="btn btn-primary">Send</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default PlaceInquiry;
