import React, { useState, useEffect, useRef } from 'react'
import { IPurityListType, ICustomise, ICustomiseForm, IDiamondQuality, IMetalType, IOtherValueType } from "@type/Pages/customiseDesign";
import Head from "next/head";
import { getCurrentSelectedCountry, getTypeBasedCSSPath } from "@util/common";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { EMAIL_REGEX, NAME_MAXLENGTH, NAME_MINLENGTH, PHONENUMBER_REGEX, SPECIAL_CHARCATER } from "@constant/regex";
import FormValidationError from "@components/FormValidationError";
import { useForm, Controller } from "react-hook-form";
import { Message } from "@constant/errorMessage";
import usePostFormDataHook from "@components/Hooks/postFormDataRegisterHook";
import APICONFIG from '@config/api.config';
import { useToast } from "@components/Toastr/Toastr";
import ErrorHandler from "@components/ErrorHandler";
import APPCONFIG from "@config/app.config";
import CustomRangeSlider from "@components/customRangeSlider/customRangeSlider";
import Loader from "@components/customLoader/Loader";
import CountrySelect from '@components/countrySelect';
import pagesServices from '@services/pages.services';
import CONFIG from "@config/api.config";
import { IContactList } from '@type/Pages/contactUsAddress';


const CustomiseForm1 = (props: ICustomise) => {
    const [diamondQuality] = useState<IDiamondQuality[]>(props?.diamond_quality_data)
    const [MetalQuality] = useState<IMetalType[]>(props?.metal_type)
    const [purityList, setPurityList] = useState([]);
    const [colorList, setColorList] = useState([]);
    const { makeDynamicFormDataAndPostData } = usePostFormDataHook();
    const { showError, showSuccess } = useToast();
    const [minMaxPriceRange, setMinMaxPriceRange] = useState<{ min: number; max: number }>();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [otherValue, setOtherValue] = useState<IOtherValueType>({
        price_range: [APPCONFIG.priceRange.min, APPCONFIG.priceRange.max],
        custom_image: null
    })
    const [imagePlaceHolder, setImagePlaceHolder] = useState<string>()
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [countryData, setCountryData] = useState<IContactList[]>([]);

    const {
        control,
        formState: { errors },
        handleSubmit,
        watch,
        resetField,
        setValue,
        reset
    } = useForm<ICustomiseForm>({
        defaultValues: {
            name: '',
            email: '',
            number: '',
            address: '',
            description: '',
            diamond_quality_id: '',
            metal_type_id: '',
            metal_purity_id: '',
            type: '',
            country_code: ''
        },
    });
    const watchFields = watch("metal_type_id");

    useEffect(() => {
        if (watchFields.length) getDepedencyData() // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watchFields])

    useEffect(() => {
        getCountry();
        // eslint-disable-next-line
    }, []);

    const submitForm = async (data: ICustomiseForm) => {
        setIsLoading(true)
        let formData = new FormData();
        const obj = {
            metal_type_id: data?.type,
            type: data?.metal_type_id
        }
        formData.append('data', JSON.stringify({
            ...data,
            ...obj,
            price_range: otherValue?.price_range
        }))
        otherValue?.custom_image != null && formData.append('custom_image', otherValue?.custom_image);
        await pagesServices.postPage(APICONFIG.CUSTOMISE_CREATE, formData).then((resp) => {
            if (resp.meta && resp.meta.status_code == 201) {
                showSuccess(resp?.meta?.message);
                setIsLoading(false)
                reset()
                setOtherValue({
                    price_range: [APPCONFIG.priceRange.min, APPCONFIG.priceRange.max],
                    custom_image: null
                })
                document.getElementById("resetFilter")?.click()
            } else {
                setIsLoading(false)
                ErrorHandler(resp, showError);
            }
        })
            .catch((err) => {
                setIsLoading(false)
                ErrorHandler(err, showError);
            });
    }

    const getCountry = async () => {
        setIsLoading(true);
        await pagesServices
            .postPage(CONFIG.GET_COUNTRY, {})
            .then((result) => {
                setCountryData(result?.data?.country_list);
                setCountryId(result?.data?.country_list?.[0]?._id);
                setIsLoading(false);
            })
            .catch((error) => {
                setIsLoading(false);
                ErrorHandler(error, showError);
            });
    };

    const getDepedencyData = async () => {
        setIsLoading(true)
        resetField("type");
        resetField("metal_purity_id");
        // const metalName = MetalQuality.find(ele => ele?.code == watchFields)
        let obj = {
            type: watchFields
        }
        const responceData = makeDynamicFormDataAndPostData(
            obj,
            APICONFIG.GET_PURITY_COLOR_LIST
        );
        responceData
            ?.then((resp) => {
                if (resp.meta && resp.meta.status_code == '200') {
                    setPurityList(resp?.data?.metalPurity)
                    setColorList(resp?.data?.metalType)
                    showSuccess(resp?.meta?.message);
                    setIsLoading(false)
                } else {
                    setIsLoading(false)
                    ErrorHandler(resp, showError);
                }
            })
            .catch((err) => {
                ErrorHandler(err, showError);
            });
    }


    const onChangePriceFilter = (value: { min: number; max: number }) => {
        if (minMaxPriceRange?.min !== value.min || minMaxPriceRange?.max !== value.max) {
            setMinMaxPriceRange(value);
            setOtherValue({ ...otherValue, ['price_range']: [value.min, value.max] })
        }
    };


    // const uploadImage = async (event: ChangeEvent<HTMLFormElement>) => {
    const uploadImage = async (event: any) => {
        let files: FileList = event.target.files;
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
        const file: File = files[0]; // file
        setImagePlaceHolder(URL.createObjectURL(file));


        // return if file upload has cancel from file explore
        if (!file) return;

        if (allowedTypes.includes(file.type) === false) {
            // file is not valid then return function
            showError("Allow only png, jpg and jpeg");
            return;
        }

        if (file.size / 1000 / 1024 > APPCONFIG.maxFileSize) {
            showError("Maximum " + APPCONFIG.maxFileSize + "MB allowed to upload.");
            // clear image cache
            if (fileInputRef && fileInputRef?.current?.value) {
                fileInputRef.current.value = "";
            }
            return;
        }
        setOtherValue({ ...otherValue, ['custom_image']: file })
    };

    const removeSelectImage = () => {
        setOtherValue({ ...otherValue, ['custom_image']: null })
        setImagePlaceHolder('');
        if (fileInputRef && fileInputRef?.current?.value) {
            fileInputRef.current.value = "";
        }
    }


    const setCountryId = (data: any) => {
        setValue("country_code", data?.countryCode);
        setValue("number", data?.phone);
    };

    return (
        <>
            {
                isLoading ?
                    <Loader /> :
                    <section className="upload-design-sec">
                        <div className="container">
                            <div className="upload-design-wrap">
                                <form noValidate={true} onSubmit={handleSubmit(submitForm)}>
                                    <h3 className="upload-design-title">Upload Your Design</h3>
                                    <div className="upload-design-content design-content">
                                        <div className="d-row">
                                            <div className="d-col d-col-33">
                                                <div className="form-group">
                                                    <label htmlFor="uploadFile">Upload</label>
                                                    <div className="file-upload">
                                                        {/* <input type="file" name="Upload-file" id="uploadFile" required /> */}
                                                        {(otherValue.custom_image && imagePlaceHolder) ?
                                                            <>
                                                                <img
                                                                    src={imagePlaceHolder}
                                                                    alt=""
                                                                />
                                                                <i className="jkm-close" onClick={() => removeSelectImage()}></i>
                                                            </>
                                                            :
                                                            <>
                                                                <input
                                                                    type="file"
                                                                    ref={fileInputRef}
                                                                    title=" "
                                                                    name="image"
                                                                    onChange={uploadImage}
                                                                    // onChange={(event: React.ChangeEvent<HTMLFormElement>): Promise<void> => uploadImage(event)}
                                                                    accept={APPCONFIG.acceptProfileImage}
                                                                />
                                                                <i className="jkm-file-upload file-upload-icon"></i>
                                                            </>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-col d-col-66">
                                                <div className="d-row">
                                                    <div className="d-col d-col-2">
                                                        <div className="form-group">
                                                            <Controller
                                                                name="diamond_quality_id"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <>
                                                                        <label>
                                                                            Diamond Quality
                                                                        </label>
                                                                        <select className="custom-select"
                                                                            {...field}
                                                                            id={field.name}
                                                                        >
                                                                            <option selected>Select Diamond Quality </option>
                                                                            {diamondQuality?.map((ele, eInd) => (
                                                                                <option key={eInd} value={ele?._id}>
                                                                                    {ele?.name}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                    </>
                                                                )}
                                                            />
                                                            <FormValidationError errors={errors} name="diamond_quality_id" />
                                                        </div>
                                                    </div>

                                                    <div className="d-col d-col-2">
                                                        <div className="form-group">

                                                            <Controller
                                                                name="metal_type_id"
                                                                control={control}
                                                                rules={{
                                                                    required: Message.METAL_PURITY_REQUIRED,
                                                                }}
                                                                render={({ field }) => (
                                                                    <>
                                                                        <label>
                                                                            Metal Type<span className="asterisk"> *</span>
                                                                        </label>
                                                                        <select className="custom-select"
                                                                            {...field}
                                                                            id={field.name}
                                                                        >
                                                                            <option value={""} selected>Select Metal Type</option>
                                                                            {MetalQuality?.map((ele, eInd) => (
                                                                                <option key={eInd} value={ele?.code}>
                                                                                    {ele?.code}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                    </>
                                                                )}
                                                            />
                                                            <FormValidationError errors={errors} name="metal_type_id" />
                                                        </div>
                                                    </div>
                                                    <div className="d-col d-col-2">
                                                        <div className="form-group">

                                                            <Controller
                                                                name="type"
                                                                control={control}
                                                                rules={{
                                                                    required: Message.METAL_COLOR_REQUIRED,
                                                                }}
                                                                render={({ field }) => (
                                                                    <>
                                                                        <label>
                                                                            Metal Color<span className="asterisk"> *</span>
                                                                        </label>
                                                                        <select className="custom-select"
                                                                            {...field}
                                                                            id={field.name}
                                                                            autoFocus={true}

                                                                        >
                                                                            <option value={""} selected>Select Metal Color</option>
                                                                            {colorList && colorList?.map((ele: IPurityListType, eInd: number) => (
                                                                                <option key={eInd} value={ele?._id}>
                                                                                    {ele?.name}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                    </>
                                                                )}
                                                            />
                                                            <FormValidationError errors={errors} name="type" />
                                                        </div>
                                                    </div>
                                                    <div className="d-col d-col-2">
                                                        <div className="form-group">

                                                            <Controller
                                                                name="metal_purity_id"
                                                                control={control}
                                                                rules={{
                                                                    required: Message.METAL_COLOR_REQUIRED,
                                                                }}
                                                                render={({ field }) => (
                                                                    <>
                                                                        <label>
                                                                            Metal Purity<span className="asterisk"> *</span>
                                                                        </label>
                                                                        <select className="custom-select"
                                                                            {...field}
                                                                            id={field.name}
                                                                        >
                                                                            <option selected>Select Metal Color</option>
                                                                            {purityList && purityList?.map((ele: IPurityListType, eInd: number) => (
                                                                                <option key={eInd} value={ele?._id}>
                                                                                    {ele?.name}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                    </>
                                                                )}
                                                            />
                                                            <FormValidationError errors={errors} name="metal_purity_id" />
                                                        </div>
                                                    </div>
                                                    <div className="d-col d-col-2">
                                                        <div className="form-group">
                                                            <label>Price</label>
                                                            <CustomRangeSlider
                                                                // @ts-ignore
                                                                min={APPCONFIG.customise_price_range.min}
                                                                // @ts-ignore
                                                                max={APPCONFIG.customise_price_range.max}
                                                                // @ts-ignore
                                                                currentApplyRange={
                                                                    minMaxPriceRange
                                                                        ? minMaxPriceRange
                                                                        : // @ts-ignore
                                                                        { min: APPCONFIG.customise_price_range.min, max: APPCONFIG.customise_price_range.max }
                                                                }
                                                                onChange={({ min, max }) => onChangePriceFilter({ min: min, max: max })}
                                                                setApplyClick={() => console.log('Here')}
                                                                isDisplayApplyBtn={false}
                                                                resetFilterButton={() => console.log("reset")}
                                                            />
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-col">
                                                <div className="form-group">
                                                    <Controller
                                                        name="description"
                                                        control={control}
                                                        rules={{
                                                            required: Message.DESCRIPTION_REQUIRED,
                                                        }}
                                                        render={({ field }) => (
                                                            <>
                                                                <label>
                                                                    Description<span className="asterisk"> *</span>
                                                                </label>
                                                                <textarea
                                                                    placeholder="Enter Description"
                                                                    rows={3}
                                                                    cols={30}
                                                                    id={field.name}
                                                                    {...field}
                                                                    // autoFocus={true}
                                                                    className="form-control"
                                                                />
                                                            </>
                                                        )}
                                                    />
                                                    <FormValidationError errors={errors} name="description" />
                                                </div>
                                                {/* rows="4" */}
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="upload-design-title">Your Contact Details</h3>
                                    <div className="upload-contact-content design-content">
                                        <div className="d-row">
                                            <div className="d-col d-col-3">
                                                <div className="form-group">
                                                    <div className="form-group">
                                                        <Controller
                                                            name="name"
                                                            control={control}
                                                            rules={{
                                                                required: Message.NAME_REQUIRED,
                                                                pattern: { value: SPECIAL_CHARCATER, message: Message.SPECIAL_CHARACTERS_NOW_ALLOW },
                                                            }}
                                                            render={({ field }) => (
                                                                <>
                                                                    <label>Name<span className='asterisk'>*</span></label>
                                                                    <input placeholder="Enter name" id={field.name} {...field}
                                                                        minLength={NAME_MINLENGTH}
                                                                        maxLength={NAME_MAXLENGTH}
                                                                        className="form-control"
                                                                    />
                                                                </>
                                                            )}
                                                        />
                                                        <FormValidationError errors={errors} name="name" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-col d-col-3">
                                                <div className="form-group">
                                                    <Controller
                                                        name="email"
                                                        control={control}
                                                        rules={{
                                                            required: Message.EMAIL_REQUIRED,
                                                            pattern: { value: EMAIL_REGEX, message: Message.EMAIL_PATTERN },
                                                        }}
                                                        render={({ field }) => (
                                                            <>
                                                                <label>
                                                                    Email<span className="asterisk">*</span>
                                                                </label>
                                                                <input
                                                                    placeholder="Enter your email"
                                                                    id={field.name}
                                                                    {...field}
                                                                    className="form-control"
                                                                />
                                                            </>
                                                        )}
                                                    />
                                                    <FormValidationError errors={errors} name="email" />
                                                </div>
                                            </div>
                                            <div className="d-col d-col-3">
                                                <div className="form-group">

                                                    <Controller
                                                        name="number"
                                                        control={control}
                                                        rules={{
                                                            required: Message.MOBILENUMBER_REQUIRED,
                                                            pattern: { value: PHONENUMBER_REGEX, message: Message.MOBILE_PATTERN },
                                                        }}
                                                        render={({ field }) => (
                                                            <>
                                                                <label>
                                                                    Mobile Number<span className="asterisk">*</span>
                                                                </label>
                                                                <CountrySelect
                                                                    setCountryContact={(d) => setCountryId(d)}
                                                                    placeholder="Phone"
                                                                    page="customise"
                                                                    inputId={field?.name}
                                                                    country={countryData.filter(a => a._id === getCurrentSelectedCountry())[0]}

                                                                />

                                                                {/* <input
                                                                    placeholder="Phone"
                                                                    id={field.name}
                                                                    {...field}
                                                                    className="form-control"
                                                                /> */}
                                                            </>
                                                        )}
                                                    />
                                                    <FormValidationError errors={errors} name="number" />
                                                </div>
                                            </div>
                                            <div className="d-col d-col-1">
                                                <div className="form-group">
                                                    <Controller
                                                        name="address"
                                                        control={control}
                                                        rules={{
                                                            required: Message.ADDRESS_REQUIRED,
                                                        }}
                                                        render={({ field }) => (
                                                            <>
                                                                <label>Address<span className='asterisk'>*</span></label>
                                                                <input placeholder="Enter address" className="form-control" id={field.name} {...field}
                                                                />
                                                            </>
                                                        )}
                                                    />
                                                    <FormValidationError errors={errors} name="address" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-col">
                                            <button className="btn btn-primary btn-upload-design" type="submit">submit</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </section>
            }
            <Head>
                <link
                    rel="stylesheet"
                    href={getTypeBasedCSSPath(null, CSS_NAME_PATH.customiseFileUpload)}
                />
                <link
                    rel="stylesheet"
                    href={getTypeBasedCSSPath(null, CSS_NAME_PATH.customiseFileContact)}
                />
                <link
                    rel="stylesheet"
                    href={
                        APPCONFIG.STYLE_BASE_PATH_COMPONENT +
                        CSS_NAME_PATH.toasterDesign +
                        ".css"
                    }
                />
            </Head>
        </>
    )
}

export default CustomiseForm1