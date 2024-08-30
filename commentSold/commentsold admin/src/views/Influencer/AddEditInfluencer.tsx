import React, { ChangeEvent, ReactElement, useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import Button from '@components/button/button';
import { useMutation, useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { GENDER, GENDER_DRP1, ROUTES } from '@config/constant';
import { CheckCircle, Cross } from '@components/icons/icons';
import RadioButton from '@components/radiobutton/radioButton';
import TextInput from '@components/textinput/TextInput';
import useValidation from '@src/hooks/validations';
import { whiteSpaceRemover } from '@utils/helpers';
import 'react-image-crop/dist/ReactCrop.css';
import { NUMERIC_VALUE } from '@config/regex';
import { Loader } from '@components/index';
import { InfluencerForm } from '@type/influencer';
import { CREATE_INFLUENCER, UPDATE_INFLUENCER } from '@framework/graphql/mutations/influencer';
import { GET_SINGLE_INFLUENCER } from '@framework/graphql/queries/influencer';
import DropDown from '@components/dropdown/dropDown';
import { GET_COUNTRIES } from '@framework/graphql/queries/country';
import { Country, ICountryData } from '@type/views';

const AddEditInfluencer = (): ReactElement => {
    const [influencerCountryData, setInfluencerCountryData] = useState<ICountryData[]>([]);
    const [influencerSelectedCountry, setInfluencerSelectedCountry] = useState<string>();

    const [CreateInfluencer, { loading: createLoader }] = useMutation(CREATE_INFLUENCER);
    const [UpdateInfluencer, { loading: updateLoader }] = useMutation(UPDATE_INFLUENCER);
    const { data } = useQuery(GET_COUNTRIES, {
        variables: { sortBy: 'name', sortOrder: 'ASC' }
    });
    const navigate = useNavigate();
    const params = useParams();
    const { influencerValidationSchema } = useValidation();
    const { data: influencerData, loading } = useQuery(GET_SINGLE_INFLUENCER, {
        variables: { uuid: params.id },
        skip: !params.id,
        fetchPolicy: 'network-only',
    });


    /**
     * Method that sets form data while edit
     */
    useEffect(() => {
        if (influencerData && params.id) {
            const InfluencerData = influencerData?.fetchInfluencer?.data;
            let influencerGender = '';

            switch (InfluencerData?.gender) {
                case '1':
                    influencerGender = GENDER.Male;
                    break;
                case '2':
                    influencerGender = GENDER.Female;
                    break;
                case '3':
                    influencerGender = GENDER.Other;
                    break;
                default : 
                    return;
            }

            formik.setValues({
                firstName: InfluencerData?.first_name,
                lastName: InfluencerData?.last_name,
                email: InfluencerData?.email,
                phoneNo: InfluencerData?.phone_number,
                gender: influencerGender,
                countryCodeId: InfluencerData?.country_code_id
            });
        }
    }, [influencerData]);

    const initialValues: InfluencerForm = {
        firstName: '',
        lastName: '',
        email: '',
        gender: '',
        countryCodeId: '',
        phoneNo: ''
    };
    /**
     * Handles update
     * @param values
     */
    const influencerUpdateFunction = (values: InfluencerForm) => {
        UpdateInfluencer({
            variables: {
                uuid: params.id,
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                gender: values.gender,
                phoneNumber: values.phoneNo,
                countryCodeId: values.countryCodeId
            },
        })
            .then((res) => {
                const data = res.data;
                if (data.updateInfluencer.meta.statusCode === 200 || data.updateInfluencer.meta.statusCode === 201) {
                    toast.success(data.updateInfluencer.meta.message);
                    formik.resetForm();
                    onInfluencerCancel();
                }
            })
            .catch(() => {
                return;
            });
    };
    const formik = useFormik({
        initialValues,
        validationSchema: params.id ? influencerValidationSchema({ params: params.id }) : influencerValidationSchema({ params: undefined }),
        onSubmit: async (values) => {
            if (params.id) {
                influencerUpdateFunction(values);
            } else {
                CreateInfluencer({
                    variables: {
                        firstName: values.firstName,
                        lastName: values.lastName,
                        email: values.email,
                        gender: values.gender,
                        phoneNumber: values.phoneNo,
                        countryCodeId: values.countryCodeId
                    },
                })
                    .then((res) => {
                        const data = res.data;
                        if (data.createInfluencer.meta.statusCode === 200 || data.createInfluencer.meta.statusCode === 201) {
                            toast.success(data.createInfluencer.meta.message);
                            formik.resetForm();
                            onInfluencerCancel();
                        }
                    })
                    .catch(() => {
                        return;
                    });
            }
        },
    });
    /**
     * Method that redirect to list page
     */
    const onInfluencerCancel = useCallback(() => {
        navigate(`/${ROUTES.app}/${ROUTES.influencer}/${ROUTES.list}`);
    }, []);


    /**
     * error message handler
     * @param fieldName
     * @returns
     */
    const getErrorInfluencer = (fieldName: keyof InfluencerForm) => {
        return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
    };
    /**
     * Method that chnages contact number
     */
    const handleInfluencerContactNumberChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const input = event.target.value;
        const numericValue = input.replace(NUMERIC_VALUE, '');
        const trimmedNumericValue = numericValue.slice(0, 12);
        formik.setFieldValue('phoneNo', trimmedNumericValue);
    }, []);
    /**
     * Handle blur that removes white space's
     */
    const OnBlur = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
        formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
    }, []);

    useEffect(() => {
        if (data?.fetchCountries) {
            const phoneCodes = data?.fetchCountries?.data?.CountryData?.map((country: Country) => country);
            setInfluencerCountryData(phoneCodes);
        }

    }, [data?.fetchCountries])

    const onInfluencerCountryChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
        formik.setFieldValue('countryCodeId', event.target.value);
        setInfluencerSelectedCountry(event.target.value);
    }, [influencerSelectedCountry]);

    return (
        <div className='card'>
            {(createLoader || updateLoader || loading) && <Loader />}
            <form onSubmit={formik.handleSubmit}>
                <div className='card-body'>
                    <div className='card-title-container'>
                        <p>
                            {('Fields marked with')} <span className='text-red-700'>*</span> {('are mandatory.')}
                        </p>
                    </div>

                    <div className='card-grid-addedit-page md:grid-cols-2'>
                        <div>
                            <TextInput id={'firstName'} onBlur={OnBlur} required={true} placeholder={('First Name')} name='firstName' onChange={formik.handleChange} label={('First Name')} value={formik.values.firstName} error={getErrorInfluencer('firstName')} />
                        </div>
                        <div>
                            <TextInput id={'lastName'} onBlur={OnBlur} required={true} placeholder={('Last Name')} name='lastName' onChange={formik.handleChange} label={('Last Name')} value={formik.values.lastName} error={getErrorInfluencer('lastName')} />
                        </div>
                        <div>
                            <TextInput id={'email'} onBlur={OnBlur} required={true} placeholder={('Email')} name='email' onChange={formik.handleChange} label={('Email')} value={formik.values.email} error={getErrorInfluencer('email')} disabled={!!params.id} />
                        </div>
                        <DropDown placeholder={('-- Select Phone Code --')} required={true} name='countryCodeId'
                            id='countryCodeId' label={('Phone Code')}
                            value={formik.values.countryCodeId}
                            onChange={onInfluencerCountryChange}
                            options={influencerCountryData.map(country => ({ key: country.phone_code, name: `+${country.phone_code + ' '} ${' ' + country.name}` }))}
                            error={formik.errors.countryCodeId && formik.touched.countryCodeId ? formik.errors.countryCodeId : ''} />
                        <div>
                            <TextInput id={'phoneNo'} onBlur={OnBlur} type='text' required={true} placeholder={('Mobile Number')} name='phoneNo' onChange={handleInfluencerContactNumberChange} label={('Mobile Number')} value={formik.values.phoneNo} error={getErrorInfluencer('phoneNo')} />
                        </div>

                        <RadioButton id={'gender'} required={true} checked={formik.values.gender} onChange={formik.handleChange} error={getErrorInfluencer('gender')} name={'gender'} radioOptions={GENDER_DRP1} label={('Gender')} />
                    </div>
                </div>
                <div className='btn-group card-footer'>
                    <Button className='btn-primary ' type='submit' label={('Save')}>
                        <span className='text-white mr-1 w-3.5 h-3.5 inline-block svg-icon'>
                            <CheckCircle />
                        </span>
                    </Button>
                    <Button className='btn-warning ' onClick={onInfluencerCancel} label={('Cancel')}>
                        <span className='mr-1 w-2.5 h-2.5 text-white inline-block svg-icon'>
                            <Cross />
                        </span>
                    </Button>
                </div>
            </form>
        </div>
    );
};
export default AddEditInfluencer;


