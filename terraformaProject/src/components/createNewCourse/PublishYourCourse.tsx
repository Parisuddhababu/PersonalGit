import React, { createRef, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { Cropper, ReactCropperElement } from 'react-cropper';
import { ListBox } from 'primereact/listbox';
import { Dialog } from 'primereact/dialog';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Edit, Cross, UploadImage, Check, } from '@components/icons/icons';
import Button from '@components/button/button';
import { DropdownOptionType } from '@types';
import { StateDataArr } from '@framework/graphql/graphql';
import { GET_COURSES_DETAILS_BY_ID_NEW, GET_PLAYLIST_DATA } from '@framework/graphql/queries/getCourses';
import { useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import { CREATE_NEW_COURSE } from '@framework/graphql/mutations/course';
import { setAddYourFAQDetails, setSetpFourDetails, setBackActiveStep, setCreateQuizDetails, setCreateYourContentDetails, setCustomStep, setPlanYourCourseDetails, setResetStep } from 'src/redux/courses-management-slice';
import { API_MEDIA_END_POINT, DATA_URL_TO_FILE, MAX_FILE_SIZE, PUBLISH_COURSE_TYPES, ROUTES, USER_TYPE, convertMinutesToHoursAndMinutes, uploadImage } from '@config/constant';
import { CourseDetailsDataArray, DeletePublishImageData, PlanYourCourseDetails, UserProfileType } from 'src/types/common';
import CreateNewPlaylist from '@components/playlists/createNewPlaylist';
import Loader from '@components/common/loader';
import RadioButton from '@components/radiobutton/radioButtonNew';
import TextInput from '@components/textInput/TextInput';
import useValidation from '@framework/hooks/validations';
import { useNavigate, useSearchParams } from 'react-router-dom';


const PublishYourCourse = () => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { PublishCourseSchema } = useValidation();
	const [queryParams] = useSearchParams();
	const uuid = queryParams.get('uuid');
	const isViewAsLearner = queryParams.get('isViewAsLearner');
	const [playListPublishYourCourse, setPlayListPublishYourCourse] = useState<boolean>(false);
	const [coursePublishedPublishYourCourse, setCoursePublishedPublishYourCourse] = useState<boolean>(false);
	const { data: getAllPlaylistDataPublishYourCourse, refetch, loading: playlistLoader } = useQuery(GET_PLAYLIST_DATA, { variables: { limit: 500, page: 1, sortField: 'createdAt', sortOrder: 'descend', search: '' }, fetchPolicy: 'network-only' });
	const [createNewCourse, courseLoadingPublishYourCourse] = useMutation(CREATE_NEW_COURSE);
	const { planYourCourseDetails, course_id, stepFourData, is_published, is_draft } = useSelector(((state: {
		coursesManagement: {
			planYourCourseDetails: PlanYourCourseDetails, course_id: string, stepFourData: {
				is_certification: boolean,
				estimate_time: number,
				availability: number,
				playlist_ids: {
					uuid: string,
					name: string,
					image: string
				}[],
				is_editable: boolean,
			}, is_published: boolean,
			is_draft: boolean
		},
	}) => state.coursesManagement));
	const { loading, refetch: refetchCourseDeatils } = useQuery(GET_COURSES_DETAILS_BY_ID_NEW, {
		skip: true,
		fetchPolicy: 'no-cache'
	});
	const { userProfileData } = useSelector(((state: { userProfile: { userProfileData: UserProfileType } }) => state.userProfile));
	const userType= userProfileData?.getProfile?.data?.user_type;
	const [allPlaylistDataPublishYourCourse, setAllPlaylistDataPublishYourCourse] = useState<DropdownOptionType[]>([]);
	const [cropperPublishYourCourse, setCropperPublishYourCourse] = useState(false);
	const [imagePublishYourCourse, setImagePublishYourCourse] = useState('');
	const [courseImagePublishYourCourse, setCourseImagePublishYourCourse] = useState(false);
	const cropperRef = createRef<ReactCropperElement>();
	const [planYourCourseDataPublishYourCourse, setPlanYourCourseDataPublishYourCourse] = useState<PlanYourCourseDetails | { [key: string]: string }>({});
	const [courseImageErrorPublishYourCourse, setCourseImageErrorPublishYourCourse] = useState<boolean>(false);
	const [bannerImageErrorPublishYourCourse, setbannerImageErrorPublishYourCourse] = useState<boolean>(false);
	const [instructorImageErrorPublishYourCourse, setInstructorImageErrorPublishYourCourse] = useState<boolean>(false);
	const [bannerImagePublishYourCourse, setBannerImagePublishYourCourse] = useState<boolean>(false);
	const [imageLoader, setImageLoader] = useState(false);
	const initialValues: {
		selectedPlayList: { name: string; code: string; }[],
		playlistName: string;
		minutes: number;
		hours: number;
		assessmentCertification: boolean;
		availability: number;
		is_editable: number;
	} = {
		selectedPlayList: [],
		playlistName: '',
		minutes: 0,
		hours: 0,
		assessmentCertification: false,
		availability: PUBLISH_COURSE_TYPES.AVAILABLE_FOR_ALL,
		is_editable: PUBLISH_COURSE_TYPES.RESTRICTED
	}
	const publishCourse = (values: {
		selectedPlayList: { name: string; code: string; }[];
		playlistName: string;
		minutes: number;
		hours: number;
		assessmentCertification: boolean;
		availability: number;
		is_editable: number;
	}) => {
		if ((planYourCourseDataPublishYourCourse.instructorImageUploadFileName && planYourCourseDataPublishYourCourse.courseImageUploadFileName && planYourCourseDataPublishYourCourse.bannerImageUploadFileName)) {
			const courseData = {
				course_id: isViewAsLearner === 'true' ? uuid : course_id,
				estimate_time: (values?.hours * 60) + Number(values.minutes),
				course_image: planYourCourseDataPublishYourCourse.courseImageUploadFileName,
				banner_image: planYourCourseDataPublishYourCourse.bannerImageUploadFileName,
				is_certification: values?.assessmentCertification,
				availability:+values?.is_editable === PUBLISH_COURSE_TYPES?.AVAILABLE_FOR_ALL ? 1 : +values?.availability,
				playlist_ids: values?.selectedPlayList?.map((data: { code: string }) => data?.code) ?? [],
				is_editable: +values?.is_editable === PUBLISH_COURSE_TYPES?.AVAILABLE_FOR_ALL ? true : false,
				is_draft: false
			}
			createNewCourse({
				variables: {
					courseData: courseData
				},
			}).then((res) => {
				const data = res.data.courseCreateStepFour
				toast.success(data?.message);
				setPlayListPublishYourCourse(false);
				setCoursePublishedPublishYourCourse(true);
			}).catch((err) => {
				toast.error(err?.networkError?.result?.errors?.[0]?.message);
			});
		}
		dispatch(setSetpFourDetails({
			is_certification: values.assessmentCertification,
			estimate_time: (values?.hours * 60) + Number(values.minutes),
			availability: values?.availability,
			playlist_ids: values?.selectedPlayList,
			is_editable: +values?.is_editable === PUBLISH_COURSE_TYPES?.AVAILABLE_FOR_ALL ? true : false,
		}))
		if (!planYourCourseDataPublishYourCourse.courseImageUploadFileName && !planYourCourseDataPublishYourCourse.instructorImageUploadFileName && !planYourCourseDataPublishYourCourse.bannerImageUploadFileName) {
			setCourseImageErrorPublishYourCourse(true);
			setInstructorImageErrorPublishYourCourse(true);
			setbannerImageErrorPublishYourCourse(true);
		} else if (!planYourCourseDataPublishYourCourse.bannerImageUploadFileName) {
			setbannerImageErrorPublishYourCourse(true);
		}
		else if (!planYourCourseDataPublishYourCourse.courseImageUploadFileName) {
			setCourseImageErrorPublishYourCourse(true);
		} else if (!planYourCourseDataPublishYourCourse.instructorImageUploadFileName) {
			setInstructorImageErrorPublishYourCourse(true);
		}
	}
	const formik = useFormik({
		initialValues,
		validationSchema: PublishCourseSchema,
		onSubmit: (values) => {
			const estimate_time = (values?.hours * 60) + Number(values.minutes);
			if (estimate_time) {
				publishCourse(values)
			} else {
				toast.error('Hours and minutes cannot be empty or zero.')
			}

		},
	});
	useEffect(() => {
		if (stepFourData) {
			const hoursMins = convertMinutesToHoursAndMinutes(stepFourData?.estimate_time);
			formik.setFieldValue('selectedPlayList', stepFourData?.playlist_ids);
			formik.setFieldValue('availability', stepFourData?.availability);
			formik.setFieldValue('is_editable', stepFourData?.is_editable&&userType===USER_TYPE?.SUPER_ADMIN ? 1 : 2);
			formik.setFieldValue('assessmentCertification', stepFourData?.is_certification);
			formik.setFieldValue('minutes', hoursMins?.minutes);
			formik.setFieldValue('hours', hoursMins?.hours);
		}
	}, [stepFourData])

	useEffect(() => {
		const tempDataArr = [] as DropdownOptionType[];
		getAllPlaylistDataPublishYourCourse?.getPlayLists?.data?.playlists?.map((data: StateDataArr) => {
			tempDataArr.push({ name: data?.name, code: data?.uuid });
		});
		setAllPlaylistDataPublishYourCourse(tempDataArr);
	}, [getAllPlaylistDataPublishYourCourse])
	useEffect(() => {
		if (course_id === '') {
			refetchCourseDeatils({
				courseId: uuid
			}).then((res) => {
				const courseData = res?.data?.getCourseDetailsById?.data as CourseDetailsDataArray;
				setPlanYourCourseDataPublishYourCourse({
					selectCourse: courseData?.uuid,
					highlights1_id: courseData?.highlights?.[0]?.uuid,
					highlights2_id: courseData?.highlights?.[1]?.uuid,
					highlights3_id: courseData?.highlights?.[2]?.uuid,
					highlights4_id: courseData?.highlights?.[3]?.uuid,
					highlights1: courseData?.highlights?.[0]?.name,
					highlights2: courseData?.highlights?.[1]?.name,
					highlights3: courseData?.highlights?.[2]?.name,
					highlights4: courseData?.highlights?.[3]?.name,
					courseTitle: courseData?.title,
					prerequisite: courseData?.prerequisite,
					qualification: courseData?.instructor_qualification,
					instructorName: courseData?.instructor_name,
					category: courseData?.category?.uuid,
					assessmentCertification: courseData?.is_certification,
					addPrerequisite: !!courseData?.prerequisite,
					courseImageUploadFileName: courseData?.course_image,
					instructorImageUploadFileName: courseData?.instructor_profile,
					categoryName: courseData?.category?.name,
					courseDescription: courseData?.description,
					bannerImageUploadFileName: courseData?.banner_image,
					templateId: courseData?.template_uuid
				})
				if (courseData?.template_uuid && +courseData?.estimate_time === 0) {
					refetchCourseDeatils({
						courseId: courseData?.template_uuid
					}).then((res) => {
						const template = res?.data?.getCourseDetailsById?.data as CourseDetailsDataArray;
						formik.setValues({
							selectedPlayList: template?.playlists?.map((data) => { return { name: data?.name, code: data?.uuid } }),
							playlistName: '',
							minutes: convertMinutesToHoursAndMinutes(template?.estimate_time)?.minutes,
							hours: convertMinutesToHoursAndMinutes(template?.estimate_time)?.hours,
							assessmentCertification: template?.is_certification,
							availability: template?.availability,
							is_editable: template?.is_editable ? PUBLISH_COURSE_TYPES?.AVAILABLE_FOR_ALL : PUBLISH_COURSE_TYPES?.RESTRICTED
						})
					})
				}
				formik.setValues({
					selectedPlayList: courseData?.playlists?.map((data) => { return { name: data?.name, code: data?.uuid } }),
					playlistName: '',
					minutes: convertMinutesToHoursAndMinutes(courseData?.estimate_time)?.minutes,
					hours: convertMinutesToHoursAndMinutes(courseData?.estimate_time)?.hours,
					assessmentCertification: courseData?.is_certification,
					availability: courseData?.availability,
					is_editable: courseData?.is_editable ? PUBLISH_COURSE_TYPES?.AVAILABLE_FOR_ALL : PUBLISH_COURSE_TYPES?.RESTRICTED
				})
			})
		}
	}, [course_id])

	useEffect(() => {
		if (planYourCourseDetails) {
			setPlanYourCourseDataPublishYourCourse(planYourCourseDetails);
		}
	}, [planYourCourseDetails])

	const onAddNewPublishYourCourse = () => {
		setPlayListPublishYourCourse(true);
		setCoursePublishedPublishYourCourse(false);
	};

	const handleInstructorProfileImagePublishYourCourse = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		setInstructorImageErrorPublishYourCourse(false);
		setCourseImagePublishYourCourse(false);
		setBannerImagePublishYourCourse(false);
		let files;
		if (e.target) {
			files = e.target.files;
		}
		if (files && files.length > 0) {
			const file = files[0];
			if (file.type.startsWith('image/')) {
				if (file.size > MAX_FILE_SIZE) {
					toast.error('Image size must be less than 5MB');
				} else {
					const reader = new FileReader();
					reader.onload = () => {
						setImagePublishYourCourse(reader.result as string);
						setCropperPublishYourCourse(true);
					};
					reader.readAsDataURL(file);
				}
			} else {
				toast.error('Please select a valid image file');
			}
		}
	}, []);

	const handleCourseImagePublishYourCourse = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		setCourseImageErrorPublishYourCourse(false);
		setCourseImagePublishYourCourse(true);
		setBannerImagePublishYourCourse(false);
		let files;
		if (e.target) {
			files = e.target.files;
		}
		if (files && files.length > 0) {
			const file = files[0];
			if (file.type.startsWith('image/')) {
				if (file.size > MAX_FILE_SIZE) {
					toast.error('Image size must be less than 5MB');
				} else {
					const reader = new FileReader();
					reader.onload = () => {
						setImagePublishYourCourse(reader.result as string);
						setCropperPublishYourCourse(true);
					};
					reader.readAsDataURL(file);
				}
			} else {
				toast.error('Please select a valid image file');
			}
		}
	}, []);

	const handleBannerImagePublishYourCourse = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		setbannerImageErrorPublishYourCourse(false);
		setCourseImagePublishYourCourse(false);
		setBannerImagePublishYourCourse(true);
		let files;
		if (e.target) {
			files = e.target.files;
		}
		if (files && files.length > 0) {
			const file = files[0];
			if (file.type.startsWith('image/')) {
				if (file.size > MAX_FILE_SIZE) {
					toast.error('Image size must be less than 5MB');
				} else {
					const reader = new FileReader();
					reader.onload = () => {
						setImagePublishYourCourse(reader.result as string);
						setCropperPublishYourCourse(true);
					};
					reader.readAsDataURL(file);
				}
			} else {
				toast.error('Please select a valid image file');
			}
		}
	}, []);

	const getCropDataPublishYourCourse = async (): Promise<void> => {
		const cropper = cropperRef.current?.cropper;
		if (!cropper) {
			return;
		}
		setImageLoader(true);
		let fileName: string | null = null;
		let file: File;

		if (courseImagePublishYourCourse) {
			file = DATA_URL_TO_FILE(cropper.getCroppedCanvas().toDataURL(), 'courseImagePreview.png');
		} 
		else if(bannerImagePublishYourCourse){
			file = DATA_URL_TO_FILE(cropper.getCroppedCanvas().toDataURL(), 'BannerImagePreview.png');
		}
		else {
			file = DATA_URL_TO_FILE(cropper.getCroppedCanvas().toDataURL(), 'instructorProfilePreview.png');
		}

		const formData = new FormData();
		formData.append('image', file);

		let uploadType = bannerImagePublishYourCourse ? 'bannerImage' : 'courseImage';
		if (!courseImagePublishYourCourse && !bannerImagePublishYourCourse) {
			uploadType = 'instructorProfile';
		}
		fileName = await uploadImage(formData, uploadType);

		if (fileName) {
			if (!courseImagePublishYourCourse && bannerImagePublishYourCourse) {
				setPlanYourCourseDataPublishYourCourse({
					...planYourCourseDataPublishYourCourse, // Copy the existing data
					bannerImageUploadFileName: fileName,
				});
				setPlanYourCourseDetails({
					...planYourCourseDetails, // Copy the existing data
					bannerImageUploadFileName: fileName,
				})
			} else if (courseImagePublishYourCourse && !bannerImagePublishYourCourse) {
				setPlanYourCourseDataPublishYourCourse({
					...planYourCourseDataPublishYourCourse, // Copy the existing data
					courseImageUploadFileName: fileName,
				});
				setPlanYourCourseDetails({
					...planYourCourseDetails, // Copy the existing data
					bannerImageUploadFileName: fileName,
				})
			} else {
				setPlanYourCourseDataPublishYourCourse({
					...planYourCourseDataPublishYourCourse, // Copy the existing data
					instructorImageUploadFileName: fileName,
				});
				setPlanYourCourseDetails({
					...planYourCourseDetails, // Copy the existing data
					instructorImageUploadFileName: fileName,
				})
			}
		}

		setCropperPublishYourCourse(false);
		setImageLoader(false);
	};

	const dialogActionConstPublishYourCourse = () => {
		return (
			<div className='flex justify-end gap-5'>
				<Button className='btn-secondary btn-normal w-full md:w-[160px] whitespace-nowrap' type='button' label="Cancel" onClick={() => setCropperPublishYourCourse(false)} />
				<Button className='btn-primary btn-normal w-full md:w-[160px] whitespace-nowrap' type='button' label="Save" disabled={imageLoader} onClick={() => getCropDataPublishYourCourse()} />
			</div>
		)
	}

	const onEditFormPublishYourCourse = useCallback(() => {
		if (Object.keys(planYourCourseDataPublishYourCourse).length !== 0) {
			dispatch(setPlanYourCourseDetails(planYourCourseDataPublishYourCourse))
			dispatch(setResetStep());
		}
	}, [planYourCourseDataPublishYourCourse])

	const onBackPublishYourCourse = useCallback(() => {
		dispatch(setBackActiveStep());
	}, []);

	const reviewCurriculumPublishYourCourse = useCallback(() => {
		dispatch(setSetpFourDetails({
			is_certification: formik.values.assessmentCertification,
			estimate_time: (formik.values?.hours * 60) + Number(formik.values.minutes),
			availability: formik.values?.availability,
			playlist_ids: formik.values?.selectedPlayList,
			is_editable: +formik.values?.is_editable === PUBLISH_COURSE_TYPES?.AVAILABLE_FOR_ALL ? true : false,
		}))
		dispatch(setCustomStep(1));
	}, [formik])


	const onDeleteImagePublishYourCourse = useCallback(async (data: DeletePublishImageData): Promise<void> => {
		const { courseImagePublishYourCourse, bannerImagePublishYourCourse } = data;
		if (courseImagePublishYourCourse && !bannerImagePublishYourCourse) {
			const data = { fileName: planYourCourseDataPublishYourCourse?.courseImageUploadFileName };
			// Attempt to Delete the Image
			axios.delete(`${API_MEDIA_END_POINT}/remove`, { data })
				.then(() => {
					setPlanYourCourseDataPublishYourCourse({
						...planYourCourseDataPublishYourCourse, // Copy the existing data
						courseImageUploadFileName: '',
					});
				})
				.catch((error) => {
					toast.error(error?.response?.data?.message)
				});

		} else if (!courseImagePublishYourCourse && bannerImagePublishYourCourse) {
			const data = { fileName: planYourCourseDataPublishYourCourse?.bannerImageUploadFileName };
			// Attempt to Delete the Image
			axios.delete(`${API_MEDIA_END_POINT}/remove`, { data })
				.then(() => {
					setPlanYourCourseDataPublishYourCourse({
						...planYourCourseDataPublishYourCourse, // Copy the existing data
						bannerImageUploadFileName: '',
					});
				})
				.catch((error) => {
					toast.error(error?.response?.data?.message)
				});
		} else {
			const data = { fileName: planYourCourseDataPublishYourCourse?.instructorImageUploadFileName };
			// Attempt to Delete the Image
			axios.delete(`${API_MEDIA_END_POINT}/remove`, { data })
				.then(() => {
					setPlanYourCourseDataPublishYourCourse({
						...planYourCourseDataPublishYourCourse, // Copy the existing data
						instructorImageUploadFileName: '',
					});
				})
				.catch((error) => {
					toast.error(error?.response?.data?.message)
				});
		}
	}, [planYourCourseDataPublishYourCourse]);

	const conditionReturnFun = (condition: boolean, value1: string | null | number | boolean, value2: string | null | number | boolean) => {
		return condition ? value1 : value2;
	}
	const validateHoursAndMinutes = async (fieldName: keyof ({
		selectedPlayList: { name: string; code: string; }[];
		playlistName: string;
		minutes: number;
		hours: number;
		assessmentCertification: boolean;
		availability: number;
		is_editable: number;
	})) => {
		try {
			await PublishCourseSchema.validate({
				hours: formik?.values?.[fieldName]
			});
			return false;
		} catch (validationError) {
			const message = formik?.errors?.[fieldName] ?? '';
			if (message !== '') {
				toast.error(message as string);
				return true;
			}
		}
	}
	const addNewCoursePublishYourCourse = useCallback(async (learner?: boolean): Promise<void> => {
		const hours = await validateHoursAndMinutes('hours');
		const minutes = await validateHoursAndMinutes('minutes');
		if ((planYourCourseDataPublishYourCourse.instructorImageUploadFileName && planYourCourseDataPublishYourCourse.courseImageUploadFileName && planYourCourseDataPublishYourCourse.bannerImageUploadFileName && !minutes && !hours)) {

			const courseData = {
				course_id: conditionReturnFun(isViewAsLearner === 'true', uuid, course_id),
				estimate_time: (formik?.values?.hours * 60) + Number(formik.values.minutes),
				course_image: planYourCourseDataPublishYourCourse.courseImageUploadFileName,
				banner_image: planYourCourseDataPublishYourCourse.bannerImageUploadFileName,
				is_certification: formik?.values?.assessmentCertification,
				availability: +formik?.values?.availability,
				playlist_ids: formik?.values?.selectedPlayList?.map((data: { code: string }) => data?.code) ?? [],
				is_editable: conditionReturnFun(+formik?.values?.is_editable === PUBLISH_COURSE_TYPES?.AVAILABLE_FOR_ALL, true, false),
				is_draft: true
			}
			createNewCourse({
				variables: {
					courseData: courseData
				},
			}).then(() => {
				setPlayListPublishYourCourse(false);
				if (learner) {
					navigate(`/${ROUTES.app}/${ROUTES.tfsCoursesTemplates}/${ROUTES.courseDetails}/?uuid=${conditionReturnFun(isViewAsLearner === 'true', uuid, course_id)}&isViewAsLearner=true&step=3`);
				} else {
					toast.success('Draft has been saved succefully.');
				}
			}).catch((err) => {
				toast.error(err?.networkError?.result?.errors?.[0]?.message);
			});
		}
		dispatch(setSetpFourDetails({
			is_certification: formik.values.assessmentCertification,
			estimate_time: (formik.values?.hours * 60) + Number(formik.values.minutes),
			availability: formik.values?.availability,
			playlist_ids: formik.values?.selectedPlayList,
			is_editable: conditionReturnFun(+formik.values?.is_editable === PUBLISH_COURSE_TYPES?.AVAILABLE_FOR_ALL, true, false),
		}))
		if (!planYourCourseDataPublishYourCourse.courseImageUploadFileName && !planYourCourseDataPublishYourCourse.instructorImageUploadFileName && !planYourCourseDataPublishYourCourse.bannerImageUploadFileName) {
			setCourseImageErrorPublishYourCourse(true);
			setInstructorImageErrorPublishYourCourse(true);
			setbannerImageErrorPublishYourCourse(true);
		} else if (!planYourCourseDataPublishYourCourse.bannerImageUploadFileName) {
			setbannerImageErrorPublishYourCourse(true);
		}
		else if (!planYourCourseDataPublishYourCourse.courseImageUploadFileName) {
			setCourseImageErrorPublishYourCourse(true);
		} else if (!planYourCourseDataPublishYourCourse.instructorImageUploadFileName) {
			setInstructorImageErrorPublishYourCourse(true);
		}
	}, [uuid, planYourCourseDataPublishYourCourse, formik]);


	const onOpenCoursePublishYourCourse = useCallback(() => {
		formik.resetForm();
		dispatch(setPlanYourCourseDetails([]));
		dispatch(setAddYourFAQDetails([]));
		dispatch(setCreateQuizDetails([]));
		dispatch(setCreateYourContentDetails({
			chapters: [],
		}))
		dispatch(setResetStep());
		navigate(`/${ROUTES.app}/${ROUTES.allCourses}`);
	}, [])

	const onAddNewCoursePublishYourCourse = useCallback(() => {
		formik.resetForm();
		window.location.href = `/${ROUTES.app}/${ROUTES.educationAndEngagement}`
	}, [])

	const playListCallBackPublishYourCourse = useCallback((data: boolean, getRefetchData: { refetch: boolean }) => {
		setPlayListPublishYourCourse(data);
		if (getRefetchData?.refetch) {
			refetch();
		}
	}, []);

	const getErrorPublish = (filedName: keyof ({
		selectedPlayList: { name: string; code: string; }[];
		playlistName: string;
		minutes: number;
		hours: number;
		assessmentCertification: boolean;
		availability: number;
		is_editable: number;
	})) => {
		return formik?.errors?.[filedName] && formik?.touched?.[filedName] ? formik?.errors?.[filedName] : ''
	}
	const returnAspectRatio = ()=>{
		if(courseImagePublishYourCourse){
		  return 1.8 / 1
		}
		if(bannerImagePublishYourCourse){
		return   3.67/1
		}
		return 1;
	
	  }
	return (
		<>
			{(courseLoadingPublishYourCourse?.loading || playlistLoader || loading) && <Loader />}
			<form onSubmit={formik.handleSubmit}>

				<div className={`border border-solid border-border-primary rounded-xl ${courseLoadingPublishYourCourse?.loading && 'pointer-events-none'}`}>
					<div className='p-3 pb-5 border-b border-solid md:p-5 md:pb-7 border-border-primary'>
						<div className='flex flex-wrap items-center justify-between gap-3 mb-4 md:gap-5'>
							<h6 className='break-all'>{t('Review the Course')}</h6>
							<div>
								<Button onClick={onEditFormPublishYourCourse} label={t('')} type='button'>
									<Edit className='cursor-pointer fill-primary' />
								</Button>
							</div>
						</div>
						<div className='flex flex-wrap justify-between gap-4 mb-4'>
							<p className='w-full lg:w-[calc(50%-10px)] break-all'>{t('Course Title')}: <span className='font-bold break-all'>{planYourCourseDataPublishYourCourse?.courseTitle}</span></p>
						</div>
						<div className='mb-4'>
							<p className='mb-1'>{t('Course Description')}:</p>
							<p className="font-bold break-all" dangerouslySetInnerHTML={{ __html: planYourCourseDataPublishYourCourse?.courseDescription as string }}></p>
						</div>
						<div className='flex flex-wrap justify-between gap-4'>
							<p className='w-full lg:w-[calc(50%-10px)]'>{t('Category')}: <span className='font-bold'>{planYourCourseDataPublishYourCourse.categoryName}</span></p>
						</div>
					</div>


					<div className='px-3 py-5 border-b border-solid md:px-5 md:py-7 border-border-primary'>
						<h6 className='mb-3 md:mb-5'>{t('Add estimated time to complete the course')}</h6>
						<div className="flex gap-3 md:gap-5">
							<div className='w-full max-w-[220px] form-group'>
								<TextInput
									placeholder={t('Enter Hours')}
									type='text'
									id='hours'
									name='hours'
									label='Hours'
									value={formik?.values?.hours}
									onChange={formik.handleChange}
									// required={false}
									className='-mt-2'
									error={getErrorPublish('hours')}
								/>
							</div>
							<div className='w-full max-w-[220px] form-group'>
								<TextInput
									placeholder={t('Enter Minutes')}
									type='text'
									id='minutes'
									name='minutes'
									label='Minutes'
									value={formik?.values?.minutes}
									onChange={formik.handleChange}
									// required={false}
									className='-mt-2'
									error={getErrorPublish('minutes')}
								/>
							</div>
						</div>
					</div>

					<div className='px-3 py-5 border-b border-solid md:px-5 md:py-7 border-border-primary last:border-none'>
						<h6 className='mb-3 md:mb-5'>{t('Assessment and Certification')}</h6>
						<label className='flex'>
							<input className='mr-2 min-w-[18px] cursor-pointer disabled:cursor-not-allowed' type="checkbox" name='assessmentCertification' onChange={(e: React.ChangeEvent<HTMLInputElement>) => formik.setFieldValue('assessmentCertification', e.target.checked)} checked={formik?.values?.assessmentCertification} disabled={is_published && !is_draft} />
							<span className='font-normal break-all'>{t('Upon successful completion of the course requirements, participants will receive a certificate of completion.')}</span>
						</label>
					</div>

					<div className='px-3 py-5 border-b border-solid md:px-5 md:py-7 border-border-primary'>
						<h6 className='mb-3 md:mb-5'>{t('Course Image')}</h6>
						<div className='flex flex-wrap gap-1 lg:gap-5'>
							<div className='flex flex-col w-full lg:w-[calc(50%-10px)] xl:min-w-[480px] xl:w-[calc(33.3%-14px)]'>
								<label
									htmlFor='Course Image'
									className='relative flex items-center justify-center bg-white overflow-hidden border border-solid cursor-pointer rounded-xl border-border-primary hover:bg-gray-100 w-full min-h-[176px] xl:h-[270px]'
								>
									<div className='flex flex-col items-center justify-center w-full h-full'>
										{!planYourCourseDataPublishYourCourse.courseImageUploadFileName && <span className='text-xl-50'><UploadImage className='mb-2 fill-secondary' /></span>}
										{planYourCourseDataPublishYourCourse.courseImageUploadFileName && <img src={`${process.env.REACT_APP_IMAGE_BASE_URL}/${planYourCourseDataPublishYourCourse.courseImageUploadFileName}`} alt='Course' className='object-fill w-full h-full' />}
										{!planYourCourseDataPublishYourCourse.courseImageUploadFileName && <p className='text-xl text-light-grey'>{t('Upload Image')}</p>}
									</div>
									{planYourCourseDataPublishYourCourse.courseImageUploadFileName && <Button className='absolute p-[6px] rounded-full cursor-pointer top-4 right-4 md:top-5 md:right-5 bg-error' type='button' label='' onClick={() => onDeleteImagePublishYourCourse({ courseImagePublishYourCourse: true, bannerImagePublishYourCourse: false })} >
										<Cross className='fill-white' fontSize='12' />
									</Button>}
									<input id='Course Image' type='file' accept=".png, .jpeg" onChange={handleCourseImagePublishYourCourse} key={uuidv4()} className='hidden' />
								</label>
								{courseImageErrorPublishYourCourse && <span className='-mt-1 md:text-xs-15 error'>Please upload course image</span>}
							</div>
							<p className='w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-14px)]'>{t('Upload your course image here. It must meet our course image quality standards to be accepted. Important guidelines: 750x422 pixels; .jpg, .jpeg,. gif, or .png. no text on the image.')}</p>
						</div>
					</div>

					<div className='px-3 py-5 border-b border-solid md:px-5 md:py-7 border-border-primary'>
						<h6 className='mb-3 md:mb-5'>{t('Banner Image')}</h6>
						<div className='flex flex-wrap gap-1 lg:gap-5'>
							<div className='flex flex-col w-full lg:w-[calc(50%-10px)] xl:min-w-[480px] xl:w-[calc(33.3%-14px)]'>
								<label
									htmlFor='Banner Image'
									className='relative flex items-center justify-center bg-white overflow-hidden border border-solid cursor-pointer rounded-xl border-border-primary hover:bg-gray-100 w-full min-h-[176px] xl:h-[270px]'
								>
									<div className='flex flex-col items-center justify-center w-full h-full'>
										{!planYourCourseDataPublishYourCourse.bannerImageUploadFileName && <span className='text-xl-50'><UploadImage className='mb-2 fill-secondary' /></span>}
										{planYourCourseDataPublishYourCourse.bannerImageUploadFileName && <img src={`${process.env.REACT_APP_IMAGE_BASE_URL}/${planYourCourseDataPublishYourCourse.bannerImageUploadFileName}`} alt='Course' className='object-fill w-full h-full' />}
										{!planYourCourseDataPublishYourCourse.bannerImageUploadFileName && <p className='text-xl text-light-grey'>{t('Upload Image')}</p>}
									</div>
									{planYourCourseDataPublishYourCourse.bannerImageUploadFileName && <Button className='absolute p-[6px] rounded-full cursor-pointer top-4 right-4 md:top-5 md:right-5 bg-error' type='button' label='' onClick={() => onDeleteImagePublishYourCourse({ courseImagePublishYourCourse: false, bannerImagePublishYourCourse: true })} >
										<Cross className='fill-white' fontSize='12' />
									</Button>}
									<input id='Banner Image' type='file' accept=".png, .jpeg" onChange={handleBannerImagePublishYourCourse} key={uuidv4()} className='hidden' />
								</label>
								{bannerImageErrorPublishYourCourse && <span className='-mt-1 md:text-xs-15 error'>Please upload Banner image</span>}
							</div>
							<p className='w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-14px)]'>{t('Upload your banner image here. It must meet our banner image quality standards to be accepted. Important guidelines: 750x422 pixels; .jpg, .jpeg,. gif, or .png. no text on the image.')}</p>
						</div>
					</div>

					<div className='px-3 py-5 border-b border-solid md:px-5 md:py-7 border-border-primary'>
						<div className='flex flex-wrap items-center justify-between gap-3 mb-4 md:gap-5'>
							<h6>{t('Instructor Profile')}</h6>
							<div>
								<Button onClick={onEditFormPublishYourCourse} label={t('')} type='button'>
									<Edit className='cursor-pointer fill-primary' />
								</Button>
							</div>
						</div>
						<div className='flex flex-wrap gap-3 lg:gap-5'>
							<div className='w-full min-h-[176px] lg:w-[calc(50%-10px)] flex flex-col xl:min-w-[480px] xl:w-[calc(33.3%-14px)] max-h-[176px]'>
								<label
									htmlFor='Instructor Profile Image'
									className='relative flex items-center justify-center h-full p-5 overflow-hidden bg-white border border-solid cursor-pointer rounded-xl border-border-primary hover:bg-gray-100'
								>
									<div className='flex flex-col items-center justify-center h-full overflow-hidden rounded-xl'>
										{!planYourCourseDataPublishYourCourse.instructorImageUploadFileName && <span className='text-xl-50'><UploadImage className='mb-2 fill-secondary' /></span>}
										{planYourCourseDataPublishYourCourse.instructorImageUploadFileName && <img src={`${process.env.REACT_APP_IMAGE_BASE_URL}/${planYourCourseDataPublishYourCourse.instructorImageUploadFileName}`} alt='Instructor Profile' className='object-fill w-full' />}
										{!planYourCourseDataPublishYourCourse.instructorImageUploadFileName && <p className='text-xl text-light-grey'>{t('Upload Image')}</p>}
									</div>
									{planYourCourseDataPublishYourCourse.instructorImageUploadFileName && <Button className='absolute p-[6px] rounded-full cursor-pointer top-4 right-4 md:top-5 md:right-5 bg-error' type='button' label='' onClick={() => onDeleteImagePublishYourCourse({ courseImagePublishYourCourse: false, bannerImagePublishYourCourse: false })} disabled={true} >
										<Cross className='fill-white' fontSize='12' />
									</Button>}
									<input id='Instructor Profile Image' type="file" accept=".png, .jpeg" onChange={handleInstructorProfileImagePublishYourCourse} key={uuidv4()} className="hidden" disabled={true} />
								</label>
								{instructorImageErrorPublishYourCourse && <span className='-mt-1 md:text-xs-15 error'>Please upload instructor profile</span>}
							</div>
							<div className='w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-14px)]'>
								<p className='mb-4 last:mb-0'>{t('Instructor Name')}: <span className='font-bold'>{planYourCourseDataPublishYourCourse.instructorName}</span></p>
								<p className='mb-4 last:mb-0'>{t('Qualification')}: <span className='font-bold'>{planYourCourseDataPublishYourCourse.qualification}</span></p>
							</div>
						</div>
					</div>

					<div className='px-3 py-5 border-b border-solid md:px-5 md:py-7 border-border-primary'>
						<div className='flex flex-wrap items-center justify-between mb-3 gap-x-5 gap-y-3 md:mb-1'>
							<h6>{t('Add to Playlist')}</h6>
							<Button className='btn btn-normal bg-primary text-white text-xs w-full md:w-[100px] h-[36px]' label={t('Add New')} onClick={onAddNewPublishYourCourse} />
						</div>
						<p className='mb-4 font-semibold'>Select from Existing</p>
						<div className='max-h-[206px] overflow-auto pb-3'>
							<ListBox multiple value={formik.values.selectedPlayList} onChange={(e) => { formik.setFieldValue('selectedPlayList', e.value) }} options={allPlaylistDataPublishYourCourse} optionLabel="name" className="w-full md:w-14rem" />
						</div>
					</div>

					{userProfileData?.getProfile?.data?.user_type === USER_TYPE.SUPER_ADMIN && <div className='px-3 py-5 border-b border-solid md:px-5 md:py-7 border-border-primary'>
						<h6 className='mb-3 md:mb-5'>{t('Select Course Type')}</h6>
						<div className="inline-block w-full">
							<RadioButton
								required={false}
								name='is_editable'
								radioOptions={[{ name: 'Editable course', key: 1, info: 'The course can be used as a template by other course creators.', disabled: is_published && !is_draft }, { name: 'Non-editable course', key: 2, info: 'The course cannot be used as a template.', disabled: is_published && !is_draft }]}
								label={t('')}
								onChange={formik.handleChange}
								checked={formik?.values?.is_editable}
							/>
						</div>

					</div>}
					{(+formik?.values?.is_editable === PUBLISH_COURSE_TYPES.RESTRICTED || userProfileData?.getProfile?.data?.user_type === USER_TYPE?.SUBSCRIBER_ADMIN || userProfileData?.getProfile?.data?.is_course_creator) && <div className='px-3 py-5 border-b border-solid md:px-5 md:py-7 border-border-primary'>
						<h6 className='mb-3 md:mb-5'>{t('Course Availability Settings')}</h6>
						<div className="inline-block w-full">
							<RadioButton
								required={false}
								name='availability'
								radioOptions={[{ name: 'Available for All', key: 1, info: 'The course will be accessible in all learners\' course libraries upon publication.', disabled: is_published && !is_draft }, { name: 'Restricted', key: 2, info: 'The course will only be available to course administrators for assignment to learners.', disabled: is_published && !is_draft }]}
								label={t('')}
								onChange={formik.handleChange}
								checked={formik?.values?.availability}
							/>
						</div>
					</div>}

					<div className='px-3 py-5 md:px-5 md:py-7'>
						<Button className='btn btn-primary btn-normal w-full md:w-auto min-w-[220px]' label={t('Review Curriculum')} onClick={reviewCurriculumPublishYourCourse} />
					</div>

					<CreateNewPlaylist playListCallBack={playListCallBackPublishYourCourse} playList={playListPublishYourCourse} />
					<Dialog className="custom-dialog" header="Crop Image" visible={cropperPublishYourCourse} style={{ width: '50vw', borderRadius: '12px' }} onHide={() => setCropperPublishYourCourse(false)} footer={() => dialogActionConstPublishYourCourse()}>
						{
							imagePublishYourCourse &&
							<Cropper
								ref={cropperRef}
								style={{ height: 400, width: '100%' }}
								zoomTo={0.5}
								aspectRatio={returnAspectRatio()}
								preview=".img-preview"
								src={imagePublishYourCourse}
								viewMode={1}
								minCropBoxHeight={10}
								minCropBoxWidth={10}
								background={false}
								responsive={true}
								autoCropArea={1}
								checkOrientation={false}
								guides={true}
								cropBoxResizable={false}
							/>
						}
					</Dialog>
					{coursePublishedPublishYourCourse && (
						<div id='defaultModal' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`fixed top-0 left-0 right-0 z-50 h-full bg-modal modal ${coursePublishedPublishYourCourse ? '' : 'hidden'}`}>
							<div id='changeUserStatusModel' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`py-5 flex items-center justify-center h-full ${coursePublishedPublishYourCourse ? '' : 'opacity-0 transform -translate-y-full scale-150 '} transition-all duration-300 `}>
								<div className='w-full mx-5 max-w-[500px]'>
									<div className='relative p-10 overflow-hidden bg-white rounded-xl'>
										<Button onClick={() => onOpenCoursePublishYourCourse()} className='absolute right-5 top-5' label={t('')}>
											<span className='text-xl-22'><Cross className='text-error' /></span>
										</Button>
										<div className='mb-5 -mx-5 text-center bg-white md:mx-0 max-h-[calc(100vh-260px)] overflow-auto'>
											<div className='mb-1 text-center'>
												<div className='inline-block p-[23px] rounded-full bg-success'>
													<Check className='text-white' fontSize='34' />
												</div>
												<p className='h1 text-primary'>Awesome!</p>
											</div>
											<p className='text-lg font-bold md:text-xl'>Your Course has been published</p>
										</div>
										<div className='flex flex-col items-center justify-center gap-3 -mx-5 md:mx-0 md:gap-7 md:flex-row'>
											<Button className='btn-primary btn-normal w-full md:w-[130px] whitespace-nowrap' label={t('Open Course')} onClick={() => onOpenCoursePublishYourCourse()} title={`${t('Open Course')}`} />
											<Button className='btn-secondary btn-normal w-full md:w-[130px] whitespace-nowrap' label={t('Add New')} onClick={() => onAddNewCoursePublishYourCourse()} title={`${t('Add New')}`} />
										</div>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
				<div className='flex flex-wrap justify-between gap-5 mt-3 md:mt-7.5 md:flex-nowrap md:gap-5'>
					<div className="flex flex-col sm:flex-row w-full gap-3 md:gap-5">
						<Button className='btn-secondary btn-normal w-full md:w-[180px] whitespace-nowrap' type='button' label={t('View as a Learner')} title='View as a Learner' disabled={courseLoadingPublishYourCourse?.loading} onClick={() => addNewCoursePublishYourCourse(true)} />

						{(!is_published || is_draft) && <Button className='btn-primary btn-normal w-full md:w-40 whitespace-nowrap' type='button' label={t('Save as Draft')} disabled={courseLoadingPublishYourCourse?.loading} onClick={() => addNewCoursePublishYourCourse()} title='Save as Draft' />}
					</div>
					<div className='flex flex-col sm:flex-row justify-end w-full gap-3 md:gap-5'>
						<Button className='btn bg-default btn-secondary btn-normal w-full md:w-[160px] whitespace-nowrap ' type='button' label={t('Back')} title='Back' onClick={onBackPublishYourCourse} />
						<Button className='btn-primary btn-normal w-full md:w-[160px] whitespace-nowrap' type='submit' label={t('Publish')} disabled={courseLoadingPublishYourCourse?.loading} title='Publish' />
					</div>
				</div>
			</form>

		</>
	);
};
export default PublishYourCourse;
