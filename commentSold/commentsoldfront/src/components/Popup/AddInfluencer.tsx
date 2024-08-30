'use client'
import React, { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AddInfluencerProps, IAddEditInfluencerForm } from "@/types/components";
import { Message } from "@/constant/errorMessage";
import FormValidationError from "../FormValidationError/FormValidationError";
import Select from 'react-select';
import { Country, ICountryData, IGenderChange, SelectedOption } from "@/types/pages";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_INFLUENCER, UPDATE_INFLUENCER } from "@/framework/graphql/mutations/influencer";
import { toast } from 'react-toastify';
import { GET_SINGLE_INFLUENCER } from "@/framework/graphql/queries/influencer";
import { useDispatch } from "react-redux";
import { setLoadingState } from "@/framework/redux/reducers/commonSlice";
import Modal from 'react-modal';
import "@/styles/pages/product-catalog-management.scss";
import { handleGraphQLErrors } from "@/utils/helpers";
import { GET_COUNTRIES } from "@/framework/graphql/queries/country";
import useValidation from "@/framework/hooks/validations";
import { GENDER } from "@/constant/enums";

const AddInfluencer = ({
    onClose,
    editMode,
    idOfInfluencer,
    refetchData,
    modal
}: AddInfluencerProps) => {
    const defaultValues = {
        firstName: '',
        lastName: '',
        email: '',
        gender: '',
        countryCodeId: '',
        phoneNo: ''
    }
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        reset,
        formState: { errors },
    } = useForm<IAddEditInfluencerForm>({ defaultValues });
    const [selectedGender, setSelectedGender] = useState<IGenderChange | null>();
    const dispatch = useDispatch();
    const {addInflueValiadtions} = useValidation()
    const [selectedCountry, setSelectedCountry] = useState<string>();
    const [countryData, setCountryData] = useState<ICountryData[]>();
    const { data: getCountryList } = useQuery(GET_COUNTRIES,{
        variables: { sortBy: 'name', sortOrder: 'ASC' }
    });
    const [createBrandInfluencer, { error: cError }] = useMutation(CREATE_INFLUENCER);
    const [updateFrontInfluencer, { error: uError }] = useMutation(UPDATE_INFLUENCER);
    const { refetch: getSingleInfluencer, data, error, loading } = useQuery(GET_SINGLE_INFLUENCER, {
        variables: { uuid: idOfInfluencer },
        skip: !editMode
    });

    useEffect(() => {
        dispatch(setLoadingState(loading))
        if (error?.message) {
            toast.error(error?.message)
        }
        if (cError) {
            handleGraphQLErrors(cError)
        }
        if (uError?.message) {
            toast.error(uError?.message)
        }
    }, [loading, error, cError, uError])

    useEffect(() => {
        dispatch(setLoadingState(loading))
        if (error?.message) {
            toast.error(error?.message)
        }
    }, [loading, error])

    //update influencer
    const updateInfluencerFunction = async (data: IAddEditInfluencerForm, idOfInfluencer: string) => {
        dispatch(setLoadingState(true))
        updateFrontInfluencer({
            variables: {
                uuid: idOfInfluencer,
                firstName: data.firstName,
                lastName: data.lastName,
                gender: data.gender,
                phoneNumber: data.phoneNo,
                countryCodeId: data.countryCodeId
            },
        })
            .then((res) => {
                dispatch(setLoadingState(false))
                const data = res.data;
                if (data?.updateFrontInfluencer?.meta.statusCode === 200 || data?.updateFrontInfluencer?.meta.statusCode === 201) {
                    toast.success(data?.updateFrontInfluencer?.meta.message);
                    refetchData();
                    toggleModal();
                }
            })
            .catch(() => {
                dispatch(setLoadingState(false))
                return;
            });
    };

    // create influencer
    const createInfluencerFunction = async (data: IAddEditInfluencerForm) => {
        dispatch(setLoadingState(true))
        createBrandInfluencer({
            variables: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email.toLowerCase(),
                gender: data.gender,
                phoneNumber: data.phoneNo,
                countryCodeId: data.countryCodeId
            },
        })
            .then((res) => {
                dispatch(setLoadingState(false))
                const data = res.data;
                if (data.createBrandInfluencer?.meta.statusCode === 200 || data.createBrandInfluencer?.meta.statusCode === 201) {
                    toast.success(data.createBrandInfluencer?.meta.message);
                    refetchData();
                    toggleModal();
                }
            })
            .catch(() => {
                dispatch(setLoadingState(false))
                return;
            });

    }

    //submit handler for add edit
    const onSubmit: SubmitHandler<IAddEditInfluencerForm> = async (data: IAddEditInfluencerForm) => {
        if (!selectedCountry) {
            toast.error(Message.COUNTRY_CODE_REQUIRED)
            return
        }
        if (editMode) {
            updateInfluencerFunction(data, idOfInfluencer)
        }
        else {
            createInfluencerFunction(data);
        }
    };

    const onGenderChange = useCallback((data: IGenderChange | null) => {
        if (data) {
            setValue("gender", data?.value!);
            setSelectedGender(data);
        }
    }, []);

    //initialise data for edit
    const initializeData = () => {
        setValue('firstName', data?.fetchFrontInfluencer?.data?.first_name || '');
        setValue('lastName', data?.fetchFrontInfluencer?.data?.last_name || '');
        setValue('email', data?.fetchFrontInfluencer?.data?.email || '');
        setValue('phoneNo', data?.fetchFrontInfluencer?.data?.phone_number || '');
        setValue('countryCodeId', data?.fetchFrontInfluencer?.data?.country_code_id || '');
        setSelectedCountry(data?.fetchFrontInfluencer?.data?.country_code_id || '');
        if (data?.fetchFrontInfluencer?.data?.gender) {
            const genderValue = data?.fetchFrontInfluencer?.data?.gender;
            let selectedGenderLabel = '';
            let selectedGenderValue = '';
            switch (genderValue) {
                case '1':
                    selectedGenderLabel = 'Male';
                    selectedGenderValue = GENDER.Male;
                    break;
                case '2':
                    selectedGenderLabel = 'Female';
                    selectedGenderValue = GENDER.Female;
                    break;
                case '3':
                    selectedGenderLabel = 'Other';
                    selectedGenderValue = GENDER.Other;
                    break;
            }
            setSelectedGender({ value: selectedGenderValue, label: selectedGenderLabel });
            setValue("gender", selectedGenderValue || '');
        } else {
            setSelectedGender(null);
            setValue("gender", '');
        }
    };
    
    useEffect(() => {
        if (editMode) {
            getSingleInfluencer();
        }
        initializeData();
    }, [editMode, data?.fetchFrontInfluencer, modal]);

    const toggleModal = () => {
        onClose();
        reset();
    };

    const onCountryChange = useCallback((selectedOption: SelectedOption | null) => {
        setValue("countryCodeId", selectedOption?.value!);
        setSelectedCountry(selectedOption?.value);
    }, [selectedCountry]);

    useEffect(() => {
        if (getCountryList && getCountryList?.fetchCountries) {
            setCountryData(getCountryList?.fetchCountries?.data?.CountryData);
        }
    }, [getCountryList])

    return (
        <Modal
            isOpen={modal}
            contentLabel="Example Modal"
        >
            <button onClick={() => {
                onClose()
                reset()
            }} className='modal-close'><i className='icon-close'></i></button>
            <div className='modal-body scrollbar-sm'>

                <p className='spacing-10 h3'>{editMode ? "Edit Influencer" : "Add Influencer"}</p>
                <p className='font-300 spacing-30 label-color'>{editMode ? 'Update' : 'Add'} Influencer for your live video.</p>
                <div className='divider spacing-30'></div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='add-user-row'>
                        <div className="form-group">
                            <label htmlFor="Enter Influencer Name">First Name *</label>
                            <input className="form-control" type="text" placeholder="Enter First Name"  {...register("firstName", addInflueValiadtions.firstName)} name="firstName" id="firstName" />
                            <FormValidationError errors={errors} name="firstName" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="Enter Influencer Name">Last  Name *</label>
                            <input className="form-control" type="text" placeholder="Enter Last Name"  {...register("lastName", addInflueValiadtions.lastName)} name="lastName" id="lastName" />
                            <FormValidationError errors={errors} name="lastName" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="Influencer Email ID">Email ID*</label>
                            <input className="form-control" type="email" placeholder="Email ID"  {...register("email", addInflueValiadtions.email)} name="email" id="email" disabled={editMode} />
                            <FormValidationError errors={errors} name="email" />
                        </div>
                        <div className="form-group">
                            <label className="Enter Influencer Name">Gender*</label>
                            <Select
                                {...register("gender", addInflueValiadtions.gender)}
                                placeholder="select"
                                className='react-select'
                                id="gender"
                                name="gender"
                                aria-label='gender'
                                value={selectedGender}
                                onChange={onGenderChange}
                                options={[
                                    { value: GENDER.Male, label: 'Male' },
                                    { value: GENDER.Female, label: 'Female' },
                                    { value: GENDER.Other, label: 'Other' },
                                ]} />
                            {
                                !getValues('gender') &&
                                <FormValidationError errors={errors} name="gender" />
                            }
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
                                        aria-label="country code"
                                        value={selectedCountry && { label: `+ ${selectedCountry}` }}
                                        onChange={(e) => onCountryChange(e as SelectedOption)}
                                        options={countryData?.map((country: Country) => ({
                                            value: country?.phone_code,
                                            label: `${country?.phone_code + "  "} ${"  " + country?.name}`
                                        }))} />
                                    <input
                                        {...register("phoneNo", addInflueValiadtions.phoneNo)}
                                        type="text"
                                        name="phoneNo" id="phoneNo"
                                        placeholder="Enter Mobile Number"
                                        className="userMobile" />
                                </div>
                                <FormValidationError errors={errors} name="phoneNo" />
                            </div>
                        </div>
                    </div>
                    <button className='btn btn-primary' type="submit">{editMode ? 'Update Account' : 'Create Account'}</button>
                </form>

            </div>
        </Modal>
    );
};
export default AddInfluencer;




