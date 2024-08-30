import { useMutation, useQuery } from '@apollo/client';
import Button from '@components/button/button';
import DropDown from '@components/dropdown/dropDown';
import { Cross, Minus, Plus } from '@components/icons/icons';
import { USER_TYPE } from '@config/constant';
import { CREATE_COURSE_CREATOR, UPDATE_COURSE_CREATOR } from '@framework/graphql/mutations/courseCreator';
import { DELETE_COURSE_CREATOR_LOCATIONS, GET_ALL_EMPLOYEES, GET_ALL_LOCATIONS, GET_COURSE_CREATOR_BY_ID } from '@framework/graphql/queries/courseCreator';
import useValidation from '@framework/hooks/validations';
import { DropdownOptionType } from '@types';
import { FormikErrors, useFormik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { CourseCreateProps, GetCourseCreatorByIdRes } from 'src/types/courseCreator';

const CreateAndUpdateCourseCreator = ({ onClose, isAdd, editId }: CourseCreateProps) => {
    const { refetch } = useQuery(GET_COURSE_CREATOR_BY_ID, { fetchPolicy: 'network-only', skip: true });
    const [createCourseCreator,{loading:createCourseCreatorLoading}] = useMutation(CREATE_COURSE_CREATOR);
    const [updateCourseCreator,{loading:updateCourseCreatorLoading}] = useMutation(UPDATE_COURSE_CREATOR);
    const [deleteCreators] = useMutation(DELETE_COURSE_CREATOR_LOCATIONS);
    const { data: locationsList } = useQuery(GET_ALL_LOCATIONS);
    const { data: employeeList } = useQuery(GET_ALL_EMPLOYEES, {
        fetchPolicy: 'network-only',
        variables: {
            userType: {
                user_type: USER_TYPE.SUBSCRIBER_ADMIN
            }
        }
    });
    const [locations, setLocations] = useState<DropdownOptionType[]>([]);
    const [employees, setEmployees] = useState<DropdownOptionType[]>([]);
    const { createOrUpdateCourseCreator } = useValidation();

    useEffect(() => {
        if (editId !== '') {
            refetch({
                userUuid: editId
            }).then((res) => {
                const data = res?.data?.getCourseCreatorById?.data as GetCourseCreatorByIdRes[];
                employees.push({name:data?.[0]?.user?.first_name+' '+data?.[0]?.user?.last_name ,uuid:data?.[0]?.user?.uuid})
                formik.setFieldValue('courseCreatorData.user_id', data?.[0]?.user?.uuid);
                formik.setFieldValue('courseCreatorData.locations', data?.map((course) => {
                    return { location_id: course?.location?.uuid, uuid: course?.uuid };
                }))
            }).catch((err) => {
                toast.error(err?.networkError?.result?.errors[0]?.message);
            })
        }
    }, [isAdd])

    useEffect(() => {
        if (employeeList?.getAllSubscriberUsers) {
            setEmployees((prev )=> [...prev,...employeeList?.getAllSubscriberUsers?.data?.map((user: { first_name: string; last_name: string; uuid: string; }) => {
                return { name: user?.first_name + ' ' + user?.last_name, key: user.uuid };
            })])
        }
    }, [employeeList?.getAllSubscriberUsers])

    useEffect(() => {
        if (locationsList?.getLocations) {
            setLocations(locationsList?.getLocations?.data?.map((locationDetails: { uuid: string; location: string; }) => {
                return { name: locationDetails?.location, key: locationDetails?.uuid };
            }))
        }
    }, [locationsList?.getLocations])

    const initialValues = {
        courseCreatorIds: [],
        courseCreatorData: {
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
     * Method used to update the course creator
     */
    const updateCreator = async () => {
        const response = await deleteCreators({ variables: { courseCreatorIds: formik?.values?.courseCreatorIds } });
        if (!response?.errors) {
         updateCourseCreator({
                variables: {
                    courseData: {
                        data: formik?.values?.courseCreatorData?.locations?.map((locationDetails) => {
                            return {
                                location_id: locationDetails?.location_id,
                                user_id: formik?.values?.courseCreatorData?.user_id,
                                uuid: locationDetails?.uuid
                            }
                        })
                    }
                }
            }).then((res)=>{
                const message = res?.data?.updateCourseCreator?.message
                toast.success(message);
                onCloseModal();
            }).catch((err) => {
                toast.error(err?.networkError?.result?.errors[0]?.message);
            })
        }else{
            toast.error('Something went wrong');
        }
    }

    const formik = useFormik({
        initialValues,
        validationSchema: createOrUpdateCourseCreator,
        onSubmit(values) {
            if (editId) {
                updateCreator();
            } else {
                createCourseCreator({
                    variables: {
                        courseCreatorData: {
                            location_id: values?.courseCreatorData?.locations.map((locationDetails) =>
                                locationDetails?.location_id),
                            user_id: values?.courseCreatorData?.user_id
                        }
                    }
                }).then((res) => {
                    toast.success(res?.data?.courseCreatorCreate?.message);
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
        formik.setFieldValue('courseCreatorData.locations', [...formik?.values?.courseCreatorData?.locations, { location_id: '', uuid: '' }])
    };

    /**
     * Method used to remove locations
     * locationId is index of location that we deleted
     * deleteUuid is the location uuid
     */
    const onRemoveLocation = useCallback((locationId: number, deleteUuid: string) => {
        if (deleteUuid !== '') {
            formik.setFieldValue('courseCreatorIds', [...formik?.values?.courseCreatorIds, deleteUuid]);
        }
        formik.values.courseCreatorData.locations.splice(locationId, 1);
        formik.setFieldValue('courseCreatorData.locations', formik.values.courseCreatorData.locations);
    }, [formik?.values]);

    /**
     * Method used to reset form and close the modal popup
     */
    const onCloseModal = useCallback(() => {
        formik.resetForm();
        onClose();
    }, []);

    const courseErrors= formik?.errors?.courseCreatorData as FormikErrors<{
        user_id: string;
        locations: {
            location_id: string;
            uuid: string;
        }[];
    }>;

    return <div key="addPopUp" id='defaultModal' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`fixed top-0 left-0 right-0 z-50 h-full bg-modal modal ${isAdd ? '' : 'hidden'}`}>
        <div id='changeUserStatusModel' tabIndex={-1} data-modal-show={true} aria-hidden='false' className="flex items-center justify-center h-full py-5 transition-all duration-300">
            <div className='w-full mx-5 sm:max-w-[780px]'>
                {/* <!-- Modal content --> */}
                <div className='relative bg-white rounded-xl'>
                    {/* <!-- Modal header --> */}
                    <div className='flex items-center justify-between px-5 py-4 border-b md:py-6 bg-accents-2 rounded-t-xl'>
                        <p className='text-lg font-bold md:text-xl text-baseColor'>{editId!==''?'Update Course Create':'Add New Course Creator'}</p>
                        <Button onClick={onCloseModal} title='Close' label={''}>
                            <span className='text-xl-22'><Cross className='text-error' /></span>
                        </Button>
                    </div>
                    {/* <!-- Modal body --> */}
                    <div className='w-full'>
                        <form onSubmit={formik.handleSubmit}>
                            <div className='p-5 max-h-[calc(100vh-260px)] overflow-auto'>
                                <div className='mb-3 first-letter:md:mb-5 sm:inline-block w-full sm:w-1/2'>
                                    <DropDown
                                        placeholder={'Select Employee'}
                                        name='courseCreatorData.user_id'
                                        onChange={formik.handleChange}
                                        value={formik.values.courseCreatorData.user_id}
                                        id='courseCreatorData.user_id'
                                        label={'Select Employee'}
                                        required={true}
                                        options={employees}
                                        disabled={editId!==''}
                                    error={(courseErrors?.user_id && formik?.touched?.courseCreatorData?.user_id) ? courseErrors?.user_id : ''}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="location1">Assign Locations <span className='text-error'> *</span></label>
                                    {formik?.values?.courseCreatorData?.locations?.map((locationDetails: { uuid: string; location_id: string; }, index: number) => {
                                        const displayKeyAdmin=index+locationDetails?.location_id;
                                      return <div key={displayKeyAdmin} className='w-full sm:w-1/2 flex items-center justify-start gap-3 mb-3'>
                                            {index + 1 === formik?.values?.courseCreatorData?.locations?.length && <button className='btn btn-primary btn-small' type='button' onClick={onAddNewLocation}><Plus fontSize='14' /></button>}
                                            <DropDown placeholder={'Location'}
                                                className='w-full -mt-2' label=''
                                                name={`courseCreatorData.locations.[${index}].location_id`}
                                                id='location2'
                                                value={formik?.values?.courseCreatorData?.locations?.[index]?.location_id}
                                                onChange={formik.handleChange}
                                                options={locations}
                                            error={((courseErrors?.locations as Array<{location_id:string}>)?.[index]?.location_id && (formik?.touched?.courseCreatorData?.locations as Array<{location_id:boolean}>)?.[index]?.location_id) ? (courseErrors?.locations as Array<{location_id:string}>)?.[index]?.location_id : ''}
                                            />
                                            <button type='button' className='btn btn-primary btn-small' onClick={() => onRemoveLocation(index, locationDetails?.uuid)} disabled={formik?.values?.courseCreatorData?.locations?.length === 1} ><Minus fontSize='14' /></button>
                                        </div>;
                                    })}
                                </div>
                            </div>
                            <div className='flex flex-col items-center justify-end p-5 border-t border-solid md:space-x-3 sm:flex-row border-border-primary'>
                                {<Button className={'btn-primary btn-normal w-full sm:w-auto min-w-[160px]'} type='submit'
                                    label={editId!==''?'Update': 'Add'} disabled={updateCourseCreatorLoading||createCourseCreatorLoading}
                                />}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default CreateAndUpdateCourseCreator;