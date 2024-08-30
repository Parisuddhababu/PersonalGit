import React, { ChangeEvent, ReactElement, useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import Button from '@components/button/button';
import { useMutation, useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '@config/constant';
import { CheckCircle, Cross } from '@components/icons/icons';
import TextInput from '@components/textinput/TextInput';
import useValidation from '@src/hooks/validations';
import { whiteSpaceRemover } from '@utils/helpers';
import 'react-image-crop/dist/ReactCrop.css';
import { NUMERIC_VALUE } from '@config/regex';
import { Loader } from '@components/index';
import { BrandUserForm } from '@type/brandUserRequest';
import { APPROVE_BRAND_USER_REQUEST } from '@framework/graphql/mutations/brandManagement';
import { GET_SINGLE_BRAND_USER_REQUEST } from '@framework/graphql/queries/brandManagement';
import { Country, ICountryData } from '@type/views';
import { GET_COUNTRIES } from '@framework/graphql/queries/country';
import DropDown from '@components/dropdown/dropDown';

const AddEditBrandUserRequest = (): ReactElement => {
    const params = useParams();
    const [approveBrandUserRequest, { loading: updateLoader }] = useMutation(APPROVE_BRAND_USER_REQUEST);
    const navigate = useNavigate();
    const { brandUserValidationSchema } = useValidation();
    const { data: fetchBrandUserRequest, loading } = useQuery(GET_SINGLE_BRAND_USER_REQUEST, {
        variables: { uuid: params.id },
        skip: !params.id,
        fetchPolicy: 'network-only',
    });
    const [requestBrandCountryData, setBrandRequestCountryData] = useState<ICountryData[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<string>();
    const { data } = useQuery(GET_COUNTRIES, {
        variables: { sortBy: 'name', sortOrder: 'ASC' }
    });

    /**
     * Method that sets form data while edit
     */
    useEffect(() => {
        if (fetchBrandUserRequest && params.id) {
            const data = fetchBrandUserRequest?.fetchBrandUserRequest?.data;
            formik.setValues({
                domainName: data?.brand_name,
                companyName: data?.company_name,
                email: data?.brand_email,
                influencerCount: +data.influencer_count,
                sessionCount: +data?.session_count,
                firstName: data?.first_name,
                lastName: data?.last_name,
                phoneNo: data?.phone_number,
                countryCodeId: data?.country_code_id

            });
        }
    }, [fetchBrandUserRequest]);

    const initialValues: BrandUserForm = {
        domainName: '',
        firstName: '',
        companyName: '',
        lastName: '',
        sessionCount: '',
        influencerCount: '',
        email: '',
        phoneNo: '',
        countryCodeId: '',


    };
    const approveBrandRequestFunction = (values: BrandUserForm) => {
        approveBrandUserRequest({
            variables: {
                uuid: params.id,
                domainName: values.domainName,
                companyName: values.companyName,
                firstName: values.firstName,
                lastName: values.lastName,
                influencerCount: +(values.influencerCount),
                sessionCount: +(values.sessionCount),
                email: values.email,
                phoneNumber: values.phoneNo,
                countryCodeId: values.countryCodeId
            },
        })
            .then((res) => {
                const data = res.data;
                if (data.approveBrandUserRequest.meta.statusCode === 200 || data.approveBrandUserRequest.meta.statusCode === 201) {
                    toast.success(data.approveBrandUserRequest.meta.message);
                    formik.resetForm();
                    onCancelBrandRequest();
                }
            })
            .catch(() => {
                return;
            });
    };

    const formik = useFormik({
        initialValues,
        validationSchema: params.id ? brandUserValidationSchema({ params: params.id }) : brandUserValidationSchema({ params: undefined }),
        onSubmit: async (values) => {
            if (params.id) {
                approveBrandRequestFunction(values);
            }
        }
    });
    /**
     * Method that redirect to list page
     */
    const onCancelBrandRequest = useCallback(() => {
        navigate(`/${ROUTES.app}/${ROUTES.brandUserRequest}/${ROUTES.list}`);
    }, []);


    /**
     * error message handler
     * @param fieldName
     * @returns
     */
    const getErrorBrandRequest = (fieldName: keyof BrandUserForm) => {
        return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
    };
    /**
     * Method that chnages contact number
     */
    const handleRequestContactNumberChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
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
            setBrandRequestCountryData(phoneCodes);
        }

    }, [data?.fetchCountries])

    const onBrandRequestCountryChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
        formik.setFieldValue('countryCodeId', event.target.value);
        setSelectedCountry(event.target.value);
    }, [selectedCountry]);

    return (
        <div className='card'>
            {(updateLoader || loading) && <Loader />}
            <form onSubmit={formik.handleSubmit}>
                <div className='card-body'>
                    <div className='card-title-container'>
                        <p>
                            {('Fields marked with')} <span className='text-red-700'>*</span> {('are mandatory.')}
                        </p>
                    </div>

                    <div className='card-grid-addedit-page md:grid-cols-2'>
                        <div>
                            <TextInput id={'domainName'} onBlur={OnBlur} required={true} placeholder={('Domain Name')} name='domainName' onChange={formik.handleChange} label={('Domain Name')} value={formik.values.domainName} error={getErrorBrandRequest('domainName')} />
                        </div>
                        <div>
                            <TextInput id={'companyName'} onBlur={OnBlur} required={true} placeholder={('Company Name')} name='companyName' onChange={formik.handleChange} label={('Company Name')} value={formik.values.companyName} error={getErrorBrandRequest('companyName')} />
                        </div>
                        <div>
                            <TextInput id={'firstName'} onBlur={OnBlur} required={true} placeholder={('First Name')} name='firstName' onChange={formik.handleChange} label={('First Name')} value={formik.values.firstName} error={getErrorBrandRequest('firstName')} />
                        </div>
                        <div>
                            <TextInput id={'lastName'} onBlur={OnBlur} required={true} placeholder={('Last Name')} name='lastName' onChange={formik.handleChange} label={('Last Name')} value={formik.values.lastName} error={getErrorBrandRequest('lastName')} />
                        </div>
                        <div>
                            <TextInput id={'email'} onBlur={OnBlur} required={true} placeholder={('Email')} name='email' onChange={formik.handleChange} label={('Email')} value={formik.values.email} error={getErrorBrandRequest('email')} />
                        </div>
                        <DropDown placeholder={('-- Select Phone Code --')} required={true} name='countryCodeId'
                            id='countryCodeId' label={('Phone Code')}
                            value={formik.values.countryCodeId}
                            onChange={onBrandRequestCountryChange}
                            options={requestBrandCountryData.map(country => ({ key: country.phone_code, name: `+${country.phone_code + ' '} ${' ' + country.name}` }))}
                            error={formik.errors.countryCodeId && formik.touched.countryCodeId ? formik.errors.countryCodeId : ''} />
                        <div>
                            <TextInput id={'phoneNo'} onBlur={OnBlur} type='text' required={true} placeholder={('Mobile Number')} name='phoneNo' onChange={handleRequestContactNumberChange} label={('Mobile Number')} value={formik.values.phoneNo} error={getErrorBrandRequest('phoneNo')} />
                        </div>
                        <div>
                            <TextInput id={'influencerCount'} onBlur={OnBlur} type='text' required={true} placeholder={('Influencer Count')} name='influencerCount' onChange={formik.handleChange} label={('Influencer Count')} value={formik.values.influencerCount} error={getErrorBrandRequest('influencerCount')} />
                        </div>
                        <div>
                            <TextInput id={'sessionCount'} onBlur={OnBlur} type='text' required={true} placeholder={('Session Count')} name='sessionCount' onChange={formik.handleChange} label={('Session Count')} value={formik.values.sessionCount} error={getErrorBrandRequest('sessionCount')} />
                        </div>
                    </div>
                </div>
                <div className='btn-group card-footer'>
                    <Button className='btn-primary ' type='submit' label={('Approve')}>
                        <span className='text-white mr-1 w-3.5 h-3.5 inline-block svg-icon'>
                            <CheckCircle />
                        </span>
                    </Button>
                    <Button className='btn-warning ' onClick={onCancelBrandRequest} label={('Cancel')}>
                        <span className='mr-1 w-2.5 h-2.5 text-white inline-block svg-icon'>
                            <Cross />
                        </span>
                    </Button>
                </div>
            </form>
        </div>
    );
};
export default AddEditBrandUserRequest;


