import React, { useCallback, useEffect, useState } from 'react'
import Button from '@components/button/button'
import TextInput from '@components/textInput/TextInput'
import { t } from 'i18next'
import { useMutation, useQuery } from '@apollo/client'
import { CREATE_LOCATION, DELETE_LOCATION } from '@framework/graphql/mutations/location'
import { toast } from 'react-toastify';
import { useFormik } from 'formik'
import { ListBox, ListBoxChangeEvent } from 'primereact/listbox';
import { DropdownOptionType } from 'src/types/component';
import { DELETE_WARNING_TEXT, PAGE_LIMIT, PAGE_NUMBER, ROUTES } from '@config/constant'
import { GET_LOCATION } from '@framework/graphql/queries/location'
import CommonModel from '@components/common/commonModel'
import FinalImage from '@assets/images/introductory/final-image.png';
import { useSelector } from 'react-redux'
import { UserProfileType } from 'src/types/common'
import { INTRODUCTORY_PAGE_STATUS } from '@framework/graphql/queries/changeStatusWelcomePage'
import { useNavigate } from 'react-router-dom'

interface FinalStepProps {
    previous: () => void;
}

const FinalStep = ({ previous }: FinalStepProps) => {
    const [createLocation] = useMutation(CREATE_LOCATION);
    const navigate = useNavigate();
    const [leanerTypes, setLeanerTypes] = useState<DropdownOptionType[]>([]);
    const [manualCategoryId, deleteLoading] = useMutation(DELETE_LOCATION)
    const [isDeleteCategory, setIsDeleteCategory] = useState<boolean>(false)
    const [selectedIntendedLearners, setSelectedIntendedLearners] = useState<DropdownOptionType[]>([]);
    const { userProfileData } = useSelector(((state: { userProfile: { userProfileData: UserProfileType } }) => state.userProfile));
    const subscriberUUID = userProfileData?.getProfile?.data?.uuid;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data: _, refetch: refetchList } = useQuery(INTRODUCTORY_PAGE_STATUS
        , {
            variables: {
                userId: subscriberUUID,
            }, skip: true
        })

    const initialValues = {
        uuid: '',
        location: '',
        city: '',
        selectedLocation: []
    };
    const { data: getLocations, refetch } = useQuery(GET_LOCATION, {
        variables: {
            limit: PAGE_LIMIT,
            page: PAGE_NUMBER,
            sortField: 'createdAt',
            sortOrder: 'descend',
            citySearch: '',
            locationSearch: '',
        },
    });
    const formik = useFormik({
        initialValues,
        onSubmit: async (values) => {
            if (formik.values.location && formik.values.city) {
                createLocation({
                    variables: {
                        locationData: {
                            location: values.location,
                            city: values.city,
                        },
                    },
                })
                    .then((res) => {
                        const data = res.data
                        toast.success(data?.createLocation?.message);
                        refetch()
                        formik.resetForm();
                    })
                    .catch((err) => {
                        toast.error(err?.networkError?.result?.errors[0]?.message)
                    })
            }
        }
    })
    useEffect(() => {
        if (getLocations) {
            const tempDataArr = [] as DropdownOptionType[];
            getLocations?.getLocationsWithPagination?.data?.location?.map((data: { location: string; uuid: string }) => {
                tempDataArr.push({ name: data?.location, code: data?.uuid });
            });
            setLeanerTypes(tempDataArr);
            setSelectedIntendedLearners(tempDataArr);
            if (formik.values.selectedLocation.length === 0) {
                formik.setFieldValue('selectedLocation', tempDataArr);
            }
        }
    }, [getLocations]);

    const handleDelete = (e: ListBoxChangeEvent) => {
        setSelectedIntendedLearners(e.value)
        setIsDeleteCategory(true)
    };

    const deleteList = useCallback(() => {
        const uncheckedValues = leanerTypes.filter(
            (leanerTypeItem) =>
                !selectedIntendedLearners.find(
                    (selectedItem) => selectedItem.code === leanerTypeItem.code
                )
        ).map((item) => item.code);

        manualCategoryId({
            variables: {
                locationId: uncheckedValues[0],
            },
        })
            .then((res) => {
                const data = res.data;
                toast.success(data.deleteLocation.message);
                refetch();
                setIsDeleteCategory(false);
            })
            .catch((err) => {
                if (err.networkError.statusCode === 400) {
                    toast.error(err.networkError.result.errors[0].message);
                    setIsDeleteCategory(false);
                } else {
                    toast.error(err.networkError.result.errors[0].message);
                }
            });

    }, [leanerTypes, selectedIntendedLearners])

    const onClose = useCallback(() => {
        formik.setFieldValue('selectedLocation', leanerTypes)
        setIsDeleteCategory(false)
    }, []);

    const onBegin = useCallback(() => {
        refetchList().then((res) => {
            if (res?.data?.changeStatusOfIntroductoryPage?.message) {
                navigate(`/${ROUTES.app}/${ROUTES.dashboard}`);
            }
        })
    }, []);

    return (
        <div className='-mx-2.5 relative p-10 bg-white lg:py-20 lg:pl-20 lg:pr-12 rounded-xl' key={'slider-list'}>
            <h2 className='mb-2 text-xl md:text-2xl lg:text-xl-30 md:mb-6 lg:leading-normal'>{t('Add Your Location')}</h2>
            <div className='flex max-sm:flex-wrap'>
                <div className='w-full sm:w-[56%] mb-2.5 sm:max-w-[460px]'>
                    <div className='mb-5 last:mb-0'>
                        <div className='w-[calc(100%-110px)]'>
                            <TextInput placeholder={t('Enter Location')} label={t('Enter Location')} name='location' id='location' type='text' onChange={formik.handleChange} value={formik.values.location} />
                        </div>
                    </div>
                    <div className='flex mb-5 last:mb-0'>
                        <div className='w-[calc(100%-110px)]'>
                            <TextInput placeholder={t('Enter City')} label={t('Enter City')} name='city' id='city' type='text' onChange={formik.handleChange} value={formik.values.city} />
                        </div>
                        <Button label={t('Add Location')} onClick={formik.handleSubmit} className='whitespace-nowrap underline text-primary mt-5 ml-2.5' title={`${t('Add Location')}`}/>
                    </div>
                </div>
                <picture className='sm:pl-5 mx-2 mb-2 lg:-mt-20 max-sm:mx-auto w-[80%] max-sm:max-w-[350px] sm:w-[44%] ml-auto'>
                    <img src={FinalImage} alt="Introductory Image" className='w-full' height='363' width='417' />
                </picture>
            </div>

            <div className='max-h-[206px] overflow-hidden my-5'>
                <ListBox multiple value={leanerTypes} onChange={(e) => handleDelete(e)} options={leanerTypes} id="selectedLocation" name="selectedLocation" optionLabel="name" className="w-full md:w-14rem p-cross" />
            </div>
            <Button className='w-full sm:w-[140px] btn-normal btn-secondary btn-normal btn-login' type='submit' label={t('Back')} onClick={previous} title={`${t('Back')}`}/>
            <Button className='w-full sm:ml-5 max-sm:mt-2.5 lg:ml-7 sm:w-[140px] btn-primary btn-normal btn-login' type='submit' label={t('Begin')} onClick={onBegin} title={`${t('Begin')}`} />

            {isDeleteCategory && (
                <CommonModel
                    warningText={DELETE_WARNING_TEXT}
                    onClose={onClose}
                    action={deleteList}
                    show={isDeleteCategory}
                    disabled={deleteLoading?.loading} />
            )}
        </div>
    )
}

export default FinalStep