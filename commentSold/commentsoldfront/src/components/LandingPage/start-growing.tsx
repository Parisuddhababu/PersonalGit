import { Message } from "@/constant/errorMessage";
import { CREATE_BRAND_USER_REQUEST } from "@/framework/graphql/mutations/brandUserRequest";
import "@/styles/components/start-growing.scss";
import { BrandUserForm } from "@/types/components";
import { useLazyQuery, useMutation } from "@apollo/client";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import FormValidationError from "../FormValidationError/FormValidationError";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoadingState, setOpenLandingPageForm, setShowLandingPagePlans } from "@/framework/redux/reducers/commonSlice";
import Select from 'react-select';
import { Country, ICountryData, SelectedOption } from "@/types/pages";
import { GET_COUNTRIES } from "@/framework/graphql/queries/country";
import { handleGraphQLErrors } from "@/utils/helpers";
import InfluencerPlans from "./influencer-plans";
import { CommonSliceTypes } from "@/framework/redux/redux";
import useValidation from "@/framework/hooks/validations";

const StartGrowing = () => {
    const scrollToRef = useRef<HTMLDivElement>(null);
    const defaultValues = {
        brandName: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        countryCodeId: '',
        brandEmail: '',
        companyName: '',
        sessionCount: null,
        influencerCount: null,
    }
    const {
        register,
        reset,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm<BrandUserForm>({ defaultValues });
    const [getCountryData,{data}] = useLazyQuery(GET_COUNTRIES, {
        variables: { sortBy: 'name', sortOrder: 'ASC' }
    });
    const [createBrandUserRequest, { loading, error }] = useMutation(CREATE_BRAND_USER_REQUEST);
    const [formOpen, setFormOpen] = useState<boolean>(false);
    const dispatch = useDispatch();
    const [countryCodeSelected, setCountryCodeSelected] = useState<boolean>(false);
    const [selectedCountry, setSelectedCountry] = useState<string>();
    const [countryData, setCountryData] = useState<ICountryData[]>();
    const { showLandingPagePlans, openLandingPageForm } = useSelector((state: CommonSliceTypes) => state.common)
    const {startGrowingValidations} = useValidation()

    useEffect(() => {
        if (!showLandingPagePlans) {
            return
        }
        setFormOpen(false)
        scrollToRef?.current?.scrollIntoView({ behavior: 'smooth' });
        dispatch(setShowLandingPagePlans(false))
        setShowLandingPagePlans(false)
    }, [showLandingPagePlans])


    useEffect(() => {
        if (!openLandingPageForm) {
            return
        }
        setFormOpen(openLandingPageForm)
        scrollToRef?.current?.scrollIntoView({ behavior: 'smooth' });
        dispatch(setOpenLandingPageForm(false))
    }, [openLandingPageForm])

    //submit handler for add edit
    const onSubmit: SubmitHandler<BrandUserForm> = async (values: BrandUserForm) => {
        if (!countryCodeSelected) {
            toast.error(Message.COUNTRY_CODE_REQUIRED)
            return
        }
        createBrandUserRequest({
            variables: {
                brandName: values.brandName,
                companyName: values.companyName,
                firstName: values.firstName,
                lastName: values.lastName,
                phoneNumber: values.phoneNumber,
                countryCodeId: values.countryCodeId,
                brandEmail: values.brandEmail.toLowerCase(),
                influencerCount: +(values.influencerCount!),
                sessionCount: +(values.sessionCount!),
            },
        })
            .then((res) => {
                const data = res.data;
                if (data.createBrandUserRequest.meta.statusCode === 200 || data.createBrandUserRequest.meta.statusCode === 201) {
                    toast.success(data.createBrandUserRequest.meta.message);
                    setSelectedCountry('')
                    reset();
                }
            })
            .catch(() => {
                return;
            });

    };
    const onBrandFormHandler = (() => {
        setFormOpen(true);

    })
    const onBrandFormHideHandler = (() => {
        setFormOpen(false);

    })

    useEffect(() => {
        dispatch(setLoadingState(loading))
        if (error) {
            handleGraphQLErrors(error)
        }
    }, [loading, error])

    const onCountryChange = useCallback((selectedOption: SelectedOption) => {
        setValue("countryCodeId", selectedOption?.value!);
        setSelectedCountry(selectedOption?.value);
        setCountryCodeSelected(true);
    }, [selectedCountry]);

    useEffect(()=>{
        formOpen && getCountryData()
    },[formOpen])

    useEffect(() => {
        if (data && data?.fetchCountries) {
            setCountryData(data.fetchCountries.data.CountryData);
        }
    }, [data])

    return (
        <div>
            <div className="growing-wrapper" ref={scrollToRef}>
                <div className="container-md">
                    <div className="growing-inner">
                        <div className="card growing-card">
                            <h2 className="section-title h1 font-700 spacing-20 text-center">Drive Sales and Growth Now with [WHI]!</h2>
                            <p className="section-subtitle text-center spacing-40">Our platform is not just limited to influencers. Explore flexible plans for your business, too. Pay only for what you use and customize your model!</p>
                            <div className="tab-section">
                                <div className="nav spacing-40">
                                    <ul className="list-unstyled nav-center">
                                        <li onClick={onBrandFormHideHandler} className={!formOpen ? 'acitve' : ''}>Influencer</li>
                                        <li onClick={onBrandFormHandler} className={formOpen ? 'acitve' : ''}>Corporate</li>
                                    </ul>
                                </div>
                                {!formOpen && <InfluencerPlans/>}
                                {formOpen && <div className="tab-form">
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="row corporate-row">
                                            <div className="form-group">
                                                <label htmlFor="Brand Name">Domain Name*</label>
                                                <input   {...register("brandName", startGrowingValidations.brandName)}
                                                    type="text"
                                                    name="brandName"
                                                    id="brandName"
                                                    placeholder="Domain Name"
                                                    className="form-control" />
                                                <FormValidationError errors={errors} name="brandName" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="Company Name">Company Name*</label>
                                                <input   {...register("companyName", startGrowingValidations.companyName)}
                                                    type="text"
                                                    name="companyName"
                                                    id="companyName"
                                                    placeholder="Company Name"
                                                    className="form-control" />
                                                <FormValidationError errors={errors} name="companyName" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="Representative Name">First Name*</label>
                                                <input
                                                    {...register("firstName", startGrowingValidations.firstName)}
                                                    type="text"
                                                    name="firstName"
                                                    id="firstName"
                                                    placeholder="Enter First Name"
                                                    className="form-control" />
                                                <FormValidationError errors={errors} name="firstName" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="Representative Name">Last Name*</label>
                                                <input
                                                    {...register("lastName", startGrowingValidations.lastName)}
                                                    type="text"
                                                    name="lastName"
                                                    id="lastName"
                                                    placeholder="Enter Last Name"
                                                    className="form-control" />
                                                <FormValidationError errors={errors} name="lastName" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="Representative Email ID">Representative Email ID*</label>
                                                <input
                                                    {...register("brandEmail", startGrowingValidations.brandEmail)}
                                                    type="email"
                                                    name="brandEmail"
                                                    id="userMobile"
                                                    placeholder="Representative Email"
                                                    className="form-control" />
                                                <FormValidationError errors={errors} name="brandEmail" />
                                            </div>
                                            <div className="col col-3">
                                                <div className="form-group spacing-40">
                                                    <label htmlFor="mob-number">Mobile Number*</label>
                                                    <div className='phone-wrapper form-control'>
                                                        <Select
                                                            {...register("countryCodeId")}
                                                            placeholder="Country Code"
                                                            className='countryCode'
                                                            id="countryCodeId"
                                                            name="countryCodeId"
                                                            value={selectedCountry && { label: `+ ${selectedCountry}` }}
                                                            onChange={(e) => onCountryChange(e as SelectedOption)}
                                                            options={countryData?.map((country: Country) => ({
                                                                value: country?.phone_code,
                                                                label: `${country?.phone_code + "  "} ${"  " + country?.name}`
                                                            }))} />
                                                        <input
                                                            {...register("phoneNumber", startGrowingValidations.phoneNumber)}
                                                            type="text"
                                                            name="phoneNumber"
                                                            id="phoneNumber"
                                                            placeholder="Enter Mobile Number"
                                                            className="userMobile" />
                                                    </div>
                                                    <FormValidationError errors={errors} name="phoneNumber" />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="Add Required Session">Influencer Count*</label>
                                                <input
                                                    {...register("influencerCount", startGrowingValidations.influencerCount)}
                                                    type="text"
                                                    name="influencerCount"
                                                    id="influencerCount"
                                                    placeholder="Enter influencer count"
                                                    className="form-control" />
                                                <FormValidationError errors={errors} name="influencerCount" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="Message">Session Count*</label>
                                                <input
                                                    {...register("sessionCount", startGrowingValidations.sessionCount)}
                                                    type="text"
                                                    name="sessionCount"
                                                    id="sessionCount"
                                                    placeholder="Enter session count"
                                                    className="form-control" />
                                                <FormValidationError errors={errors} name="sessionCount" />
                                            </div>
                                        </div>
                                        <div>
                                            <button className="btn btn-primary">Submit</button>
                                        </div>
                                    </form>
                                </div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StartGrowing