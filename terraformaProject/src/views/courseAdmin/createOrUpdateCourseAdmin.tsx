import { useMutation, useQuery } from '@apollo/client';
import Button from '@components/button/button';
import DropDown from '@components/dropdown/dropDown';
import { Cross, Minus, Plus } from '@components/icons/icons';
import { USER_TYPE } from '@config/constant';
import { CREATE_COURSE_ADMIN, DELETE_COURSE_ADMIN, UPDATE_COURSE_ADMIN } from '@framework/graphql/mutations/courseAdmin';
import { GET_COURSE_ADMIN_BY_ID } from '@framework/graphql/queries/courseAdmin';
import { GET_ALL_EMPLOYEES, GET_ALL_LOCATIONS } from '@framework/graphql/queries/courseCreator';
import useValidation from '@framework/hooks/validations';
import { DropdownOptionType } from '@types';
import { FormikErrors, useFormik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { CourseCreateProps, GetCourseCreatorByIdRes } from 'src/types/courseCreator';

const CreateAndUpdateCourseAdmin = ({ onClose, isAdd, editId }: CourseCreateProps) => {
    const { refetch } = useQuery(GET_COURSE_ADMIN_BY_ID, { fetchPolicy: 'network-only', skip: true });
    const [updateCourseAdmin, { loading: updateAdminLoader }] = useMutation(UPDATE_COURSE_ADMIN);
    const [createCourseAdmin, { loading: createAdminLoader }] = useMutation(CREATE_COURSE_ADMIN);
    const [deleteCourseAdmin] = useMutation(DELETE_COURSE_ADMIN);
    const { data: employeeList } = useQuery(GET_ALL_EMPLOYEES, {
        fetchPolicy: 'network-only',
        variables: {
            userType: {
                user_type: USER_TYPE.SUPER_ADMIN
            }
        }
    });
    const { data: locationsList } = useQuery(GET_ALL_LOCATIONS);
    const [adminLocations, setAdminLocations] = useState<DropdownOptionType[]>([]);
    const { createOrUpdateCourseAdmin } = useValidation();
    const [adminEmployees, setAdminEmployees] = useState<DropdownOptionType[]>([]);

    useEffect(() => {
        if (editId !== '') {
            refetch({
                userUuid: editId
            }).then((res) => {
                const data = res?.data?.getCourseAdministratorById?.data as GetCourseCreatorByIdRes[];
                adminEmployees.push({name:data?.[0]?.user?.first_name+' '+data?.[0]?.user?.last_name ,uuid:data?.[0]?.user?.uuid})
                formik.setFieldValue('courseAdminData.user_id', data?.[0]?.user?.uuid);
                formik.setFieldValue('courseAdminData.locations', data?.map((course) => {
                    return { location_id: course?.location?.uuid, uuid: course?.uuid };
                }))
            }).catch((err) => {
                toast.error(err?.networkError?.result?.errors[0]?.message);
            })
        }
    }, [isAdd])

    useEffect(() => {
        if (locationsList?.getLocations) {
            setAdminLocations(locationsList?.getLocations?.data?.map((locationDetails: { uuid: string; location: string; }) => {
                return { name: locationDetails?.location, key: locationDetails?.uuid };
            }))
        }
    }, [locationsList?.getLocations])

    useEffect(() => {
        if (employeeList?.getAllSubscriberUsers) {
            setAdminEmployees(employeeList?.getAllSubscriberUsers?.data?.map((user: { first_name: string; last_name: string; uuid: string; }) => {
                return { name: user?.first_name + ' ' + user?.last_name, key: user.uuid };
            }))
        }
    }, [employeeList?.getAllSubscriberUsers])

 

    const AdminInitialValues = {
        courseAdminIds: [],
        courseAdminData: {
            user_id: '',
            locations: [
                {
                    location_id: '',
                    uuid: ''
                }
            ]
        }
    }

    /**
     * Method used to update the course Admin
     */
    const updateAdmin = async () => {
        const response = await deleteCourseAdmin({ variables: { courseAdministratorIds: formik?.values?.courseAdminIds } });
        if (!response?.errors) {
            updateCourseAdmin({
                variables: {
                    courseData: {
                        data: formik?.values?.courseAdminData?.locations?.map((locationDetails) => {
                            return {
                                location_id: locationDetails?.location_id,
                                user_id: formik?.values?.courseAdminData?.user_id,
                                uuid: locationDetails?.uuid
                            }
                        })
                    }
                }
            }).then((res) => {
                const message = res?.data?.updateCourseAdministrator?.message
                toast.success(message);
                onCloseModal();
            }).catch((err) => {
                toast.error(err?.networkError?.result?.errors[0]?.message);
            })

        } else {
            toast.error('Something went wrong');
        }
    }

    const formik = useFormik({
        initialValues:AdminInitialValues,
        validationSchema: createOrUpdateCourseAdmin,
        onSubmit(values) {
            if (editId) {
                updateAdmin();
            } else {
                createCourseAdmin({
                    variables: {
                        courseAdministratorData: {
                            location_id: values?.courseAdminData?.locations.map((locationDetails) =>
                                locationDetails?.location_id),
                            user_id: values?.courseAdminData?.user_id
                        }
                    }
                }).then((res) => {
                    toast.success(res?.data?.createCourseAdministrator?.message);
                    onCloseModal();
                }).catch((err) => {
                    toast.error(err?.networkError?.result?.errors[0]?.message);
                })
            }
        }
    })

    /**
     * Method used to add new location
     */
    const onAddNewLocation = () => {
        formik.setFieldValue('courseAdminData.locations', [...formik?.values?.courseAdminData?.locations, { location_id: '', uuid: '' }])
    };

    /**
     * Method used to remove locations
     * locationId is index of location that we deleted
     * deleteUuid is the location uuid
     */
    const onRemoveLocation = useCallback((locationId: number, deleteUuid: string) => {
        if (deleteUuid !== '') {
            formik.setFieldValue('courseAdminIds', [...formik?.values?.courseAdminIds, deleteUuid]);
        }
        formik.values.courseAdminData.locations.splice(locationId, 1);
        formik.setFieldValue('courseAdminData.locations', formik.values.courseAdminData.locations);
    }, [formik?.values]);

    /**
     * Method used to reset form and close the modal popup
     */
    const onCloseModal = useCallback(() => {
        formik.resetForm();
        onClose();
    }, []);

    const courseErrors = formik?.errors?.courseAdminData as FormikErrors<{
        user_id: string;
        locations: {
            location_id: string;
            uuid: string;
        }[];
    }>;
    return <div key="addPopUp" id='defaultModal' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`fixed top-0 right-0 left-0 z-50 h-full bg-modal modal ${isAdd ? '' : 'hidden'}`}>
        <div id='AdminUpdateModal' tabIndex={-1} data-modal-show={true} aria-hidden='false' className="flex items-center justify-center h-full py-5 transition-all duration-300">
            <div className='w-full mx-5 sm:max-w-[780px]'>
                <div className='relative bg-white rounded-xl'>
                    <div className='flex  justify-between items-center px-5 py-4 border-b md:py-6 bg-accents-2 rounded-t-xl'>
                        <p className='text-lg font-bold md:text-xl text-baseColor'>{editId !== '' ? 'Update Course Admin' : 'Add New Course Admin'}</p>
                        <Button onClick={onCloseModal} title='Close' label={''}>
                            <span className='text-xl-22'><Cross className='text-error' /></span>
                        </Button>
                    </div>
                    <div className='w-full'>
                        <form onSubmit={formik.handleSubmit}>
                            <div className='p-5 max-h-[calc(100vh-260px)] overflow-auto'>
                                <div className='mb-3 first-letter:md:mb-5 sm:inline-block w-full sm:w-1/2'>
                                    <DropDown
                                        placeholder={'Select Employee'}
                                        name='courseAdminData.user_id'
                                        onChange={formik.handleChange}
                                        value={formik.values.courseAdminData.user_id}
                                        id='courseAdminData.user_id'
                                        label={'Select Employee'}
                                        required={true}
                                        options={adminEmployees}
                                        disabled={editId !== ''}
                                        error={(courseErrors?.user_id && formik?.touched?.courseAdminData?.user_id) ? courseErrors?.user_id : ''}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="location1">Assign Locations <span className='text-error'> *</span></label>
                                    {formik?.values?.courseAdminData?.locations?.map((locationDetails: { uuid: string; location_id: string; }, index: number) => {
                                        const displayKeyAdmin = index + locationDetails?.location_id;
                                        return <div key={displayKeyAdmin} className='w-full  flex items-center sm:w-1/2 justify-start gap-3 mb-3'>
                                            {index + 1 === formik?.values?.courseAdminData?.locations?.length && <button className='btn btn-primary btn-small' type='button' onClick={onAddNewLocation}><Plus fontSize='14' /></button>}
                                            <DropDown placeholder={'Location'}
                                                className='w-full -mt-2' label=''
                                                name={`courseAdminData.locations.[${index}].location_id`}
                                                id='location2'
                                                value={formik?.values?.courseAdminData?.locations?.[index]?.location_id}
                                                onChange={formik.handleChange}
                                                options={adminLocations}
                                                error={((courseErrors?.locations as Array<{ location_id: string }>)?.[index]?.location_id && (formik?.touched?.courseAdminData?.locations as Array<{ location_id: boolean }>)?.[index]?.location_id) ? (courseErrors?.locations as Array<{ location_id: string }>)?.[index]?.location_id : ''}
                                            />
                                            <button type='button' className='btn btn-primary btn-small' onClick={() => onRemoveLocation(index, locationDetails?.uuid)} disabled={formik?.values?.courseAdminData?.locations?.length === 1} ><Minus fontSize='14' /></button>
                                        </div>;
                                    })}
                                </div>
                            </div>
                            <div className='flex flex-col items-center justify-end p-5 border-t border-solid md:space-x-3 sm:flex-row border-border-primary'>
                                {<Button className={'btn-primary btn-normal w-full sm:w-auto min-w-[160px]'} type='submit'
                                    label={editId !== '' ? 'Update' : 'Add'} disabled={updateAdminLoader || createAdminLoader}
                                />}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default CreateAndUpdateCourseAdmin;
