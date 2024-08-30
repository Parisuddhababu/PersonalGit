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
import { Loader } from '@components/index';
import { CREATE_BRAND_USER, UPDATE_BRAND_USER } from '@framework/graphql/mutations/brandUser';
import { FETCH_SINGLE_BRAND_USER } from '@framework/graphql/queries/brandUsers';
import { BrandUserForm } from '@type/influencer';
import { NUMERIC_VALUE } from '@config/regex';
import { Country, ICountryData } from '@type/views';
import { GET_COUNTRIES } from '@framework/graphql/queries/country';
import DropDown from '@components/dropdown/dropDown';

const AddEditBrandUser = (): ReactElement => {
    const params = useParams();
    const [createBrandUser, { loading: createLoader }] = useMutation(CREATE_BRAND_USER);
    const [updateBrandUser, { loading: updateLoader }] = useMutation(UPDATE_BRAND_USER);
    const navigate = useNavigate();
    const { brandUserManagementValidationSchema } = useValidation();
    const { data: brandUserData, loading } = useQuery(FETCH_SINGLE_BRAND_USER, {
        variables: { uuid: params.id },
        skip: !params.id,
        fetchPolicy: 'network-only',
    });
    const [countryData, setCountryData] = useState<ICountryData[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<string>();
    const { data } = useQuery(GET_COUNTRIES, {
        variables: { sortBy: 'name', sortOrder: 'ASC' }
    });

    /**
     * Method that sets form data while edit
     */
    useEffect(() => {
        if (brandUserData && params.id) {
            const data = brandUserData?.fetchBrandUser?.data;
            formik.setValues({
                domainName: data?.UserBrandDomainData?.domain_name,
                companyName: data?.UserBrandDomainData?.company_name,
                firstName: data?.first_name,
                lastName: data?.last_name,
                email: data?.email,
                influencerCount: +data?.UserBrandSettingData?.influencer_count,
                sessionCount: +data?.UserBrandSettingData?.session_count,
                phoneNo: data?.phone_number,
                countryCodeId: data?.country_code_id,
                availableSessions: data?.UserBrandSettingData?.available_sessions ?? '0',
                addSessions: '0'
            });
        }
    }, [brandUserData]);


    const initialValues: BrandUserForm = {
        domainName: '',
        companyName: '',
        firstName: '',
        lastName: '',
        email: '',
        sessionCount: '',
        influencerCount: '',
        phoneNo: '',
        countryCodeId: '',
        availableSessions: '',
        addSessions: '0'
    };


    const updateBrandRequestFunction = (values: BrandUserForm) => {
        updateBrandUser({
            variables: {
                uuid: params.id,
                firstName: values.firstName,
                lastName: values.lastName,
                companyName: values.companyName,
                email: values.email,
                phoneNumber: values.phoneNo,
                influencerCount: +(values.influencerCount),
                currentSessionCount: +(values.addSessions ?? 0),
                countryCodeId: values.countryCodeId
            },
        })
            .then((res) => {
                const data = res.data;
                if (data.updateBrandUser.meta.statusCode === 200 || data.updateBrandUser.meta.statusCode === 201) {
                    toast.success(data.updateBrandUser.meta.message);
                    formik.resetForm();
                    onCancelUser();
                }
            })
            .catch(() => {
                return;
            });
    };
    const formik = useFormik({
        initialValues,
        validationSchema: params.id ? brandUserManagementValidationSchema({ params: params.id }) : brandUserManagementValidationSchema({ params: undefined }),
        onSubmit: async (values) => {
            if (params.id) {
                updateBrandRequestFunction(values);
            } else {
                createBrandUser({
                    variables: {
                        domainName: values.domainName,
                        companyName: values.companyName,
                        firstName: values.firstName,
                        lastName: values.lastName,
                        email: values.email,
                        phoneNumber: values.phoneNo,
                        influencerCount: +(values.influencerCount),
                        sessionCount: +(values.sessionCount),
                        countryCodeId: values.countryCodeId
                    },
                })
                    .then((res) => {
                        const data = res.data;
                        if (data.createBrandUser?.meta.statusCode === 200 || data.createBrandUser?.meta.statusCode === 201) {
                            toast.success(data.createBrandUser?.meta.message);
                            formik.resetForm();
                            onCancelUser();
                        }
                    })
                    .catch(() => {
                        return;
                    });
            }
        }
    });
    /**
     * Method that redirect to list page
     */
    const onCancelUser = useCallback(() => {
        navigate(`/${ROUTES.app}/${ROUTES.ManageBrandUser}/${ROUTES.list}`);
    }, []);


    /**
     * error message handler
     * @param fieldName
     * @returns
     */
    const getErrorUserMng = (fieldName: keyof BrandUserForm) => {
        return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
    };


    /**
     * Handle blur that removes white space's
     */
    const OnBlur = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
        formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
    }, []);
    /**
     * Method that chnages influencer number
     */
    const handleInfluencerCountChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const input = event.target.value;
        const numericValue = input.replace(NUMERIC_VALUE, '');
        const trimmedNumericValue = numericValue.slice(0, 10);
        formik.setFieldValue('influencerCount', trimmedNumericValue);

    }, []);
    const handleSessionCountChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const input = event.target.value;
        const numericValue = input.replace(NUMERIC_VALUE, '');
        const trimmedNumericValue = numericValue.slice(0, 10);
        formik.setFieldValue('sessionCount', trimmedNumericValue);

    }, []);

    const handleAddCountChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const input = event.target.value;
        const numericValue = input.replace(NUMERIC_VALUE, '');
        const trimmedNumericValue = numericValue.slice(0, 5);
        formik.setFieldValue('addSessions', trimmedNumericValue);
    }, []);
    /**
 * Method that chnages contact number
 */
    const handleMobileNumberChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const input = event.target.value;
        const numericValue = input.replace(NUMERIC_VALUE, '');
        const trimmedNumericValue = numericValue.slice(0, 12);
        formik.setFieldValue('phoneNo', trimmedNumericValue);
    }, []);

    useEffect(() => {
        if (data?.fetchCountries) {
            const phoneCodes = data?.fetchCountries?.data?.CountryData?.map((country: Country) => country);
            setCountryData(phoneCodes);
        }

    }, [data?.fetchCountries])

    const brandCountryChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
        formik.setFieldValue('countryCodeId', event.target.value);
        setSelectedCountry(event.target.value);
    }, [selectedCountry]);

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
                            <TextInput id={'domainName'} onBlur={OnBlur} required={true} placeholder={('Domain Name')} name='domainName' onChange={formik.handleChange} label={('Domain Name')} value={formik.values.domainName} error={getErrorUserMng('domainName')} disabled={!!params.id} />
                        </div>
                        <div>
                            <TextInput id={'companyName'} onBlur={OnBlur} required={true} placeholder={('Company Name')} name='companyName' onChange={formik.handleChange} label={('Company Name')} value={formik.values.companyName} error={getErrorUserMng('companyName')} />
                        </div>
                        <div>
                            <TextInput id={'firstName'} onBlur={OnBlur} required={true} placeholder={('First Name')} name='firstName' onChange={formik.handleChange} label={('First Name')} value={formik.values.firstName} error={getErrorUserMng('firstName')} />
                        </div>
                        <div>
                            <TextInput id={'lastName'} onBlur={OnBlur} required={true} placeholder={('Last Name')} name='lastName' onChange={formik.handleChange} label={('Last Name')} value={formik.values.lastName} error={getErrorUserMng('lastName')} />
                        </div>
                        <div>
                            <TextInput id={'email'} onBlur={OnBlur} required={true} placeholder={('Email')} name='email' onChange={formik.handleChange} label={('Email')} value={formik.values.email} error={getErrorUserMng('email')} disabled={!!params.id} />
                        </div>
                        <DropDown placeholder={('-- Select Phone Code --')} required={true} name='countryCodeId'
                            id='countryCodeId' label={('Phone Code')}
                            value={formik.values.countryCodeId}
                            onChange={brandCountryChange}
                            options={countryData.map(country => ({ key: country.phone_code, name: `+${country.phone_code + ' '} ${' ' + country.name}` }))}
                            error={formik.errors.countryCodeId && formik.touched.countryCodeId ? formik.errors.countryCodeId : ''} />
                        <div>
                            <TextInput id={'phoneNo'} onBlur={OnBlur} type='text' required={true} placeholder={('Mobile Number')} name='phoneNo' onChange={handleMobileNumberChange} label={('Mobile Number')} value={formik.values.phoneNo} error={getErrorUserMng('phoneNo')} />
                        </div>
                        <div>
                            <TextInput id={'influencerCount'} onBlur={OnBlur} type='text' required={true} placeholder={('Influencer Count')} name='influencerCount' onChange={handleInfluencerCountChange} label={('Influencer Count')} value={formik.values.influencerCount} error={getErrorUserMng('influencerCount')} />
                        </div>
                        <div>
                            <TextInput id={'sessionCount'} onBlur={OnBlur} type='text' required={true} placeholder={('Session Count')} name='sessionCount' onChange={handleSessionCountChange} label={('Session Count')} value={formik.values.sessionCount} error={getErrorUserMng('sessionCount')}  disabled={!!params.id}/>
                        </div>
                        {!!params.id &&
                            <>
                                <div>
                                    <TextInput id={'availableSessions'} type='text' placeholder={('Available Sessions')} name='availableSessions' label={('Available Sessions')} value={formik.values.availableSessions} disabled={true} />
                                </div>
                                <div>
                                    <TextInput id={'addSessions'} onBlur={OnBlur} type='text' required={true} placeholder={('Add Sessions')} name='addSessions' onChange={handleAddCountChange} label={('Add Sessions')} value={formik.values.addSessions} />
                                </div>
                            </>
                        }
                    </div>
                </div>
                <div className='btn-group card-footer'>
                    <Button className='btn-primary ' type='submit' label={('Save')}>
                        <span className='text-white mr-1 w-3.5 h-3.5 inline-block svg-icon'>
                            <CheckCircle />
                        </span>
                    </Button>
                    <Button className='btn-warning ' onClick={onCancelUser} label={('Cancel')}>
                        <span className='mr-1 w-2.5 h-2.5 text-white inline-block svg-icon'>
                            <Cross />
                        </span>
                    </Button>
                </div>
            </form>
        </div>
    );
};
export default AddEditBrandUser;


