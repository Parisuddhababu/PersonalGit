import React, { createRef, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import {
  API_MEDIA_END_POINT,
  DATA_URL_TO_FILE,
  MAX_FILE_SIZE,
  ROUTES,
  USER_TYPE,
  uploadImage,
} from '@config/constant';
import DropDown from '@components/dropdown/dropDown';
import TextInput from '@components/textInput/TextInput';
import { Cross, UploadImage } from '@components/icons/icons';
import Button from '@components/button/button';
import { GET_ACTIVE_CATEGORY } from '@framework/graphql/queries/category';
import { GET_ACTIVE_ROLES_DATA } from '@framework/graphql/queries/role';
import { StateDataArr } from '@framework/graphql/graphql';
import useValidation from '@framework/hooks/validations';
import { DropdownOptionType } from 'src/types/component';
import {
  setCourseId,
  setActiveStep,
  setPlanYourCourseDetails,
  setPlaylistData,
  setSetpFourDetails,
  setIsPublished,
  setIsDraft,
} from 'src/redux/courses-management-slice';
import { conditionReturnFun, whiteSpaceRemover } from '@utils/helpers';
import { useFormik } from 'formik';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // theme
import 'primereact/resources/primereact.css'; // core css
import { useQuery, useMutation } from '@apollo/client';
import { Dialog } from 'primereact/dialog';
import Cropper, { ReactCropperElement } from 'react-cropper';
import { toast } from 'react-toastify';
import { GET_COURSES_DETAILS_BY_ID_NEW } from '@framework/graphql/queries/getCourses';
import { COURSE_CREATE } from '@framework/graphql/mutations/course';
import { CourseDetailsDataArray, DeleteImageData, PlanYourCourseDetails, UserProfileType } from 'src/types/common';
import axios from 'axios';
import LoadingIndicator from '@components/loadingIndicator/loaderIndicator';
import Textarea from '@components/textarea/textarea';

const PlanYourCourse: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [queryParams] = useSearchParams();
  const uuid = queryParams.get('uuid');
  const isViewAsLearner = queryParams.get('isViewAsLearner');
  const { planYourCourseValidationSchema, courseTitleValidationSchema } = useValidation();
  const { data: categoryData, refetch: refetchCategoryDataPlanYourCourse, loading: categoryDataLoader } = useQuery(GET_ACTIVE_CATEGORY, {
    variables: { limit: 10, page: 1, sortField: 'name', sortOrder: '', search: '' },
    fetchPolicy: 'network-only'
  });
  const { refetch: refetchRoleDataPlanYourCourse, loading: roleLoader } = useQuery(GET_ACTIVE_ROLES_DATA, {
    variables: { limit: 500, page: 1, search: '', sortOrder: 'descend', sortField: 'createdAt' },
    fetchPolicy: 'network-only'
  });
  const [categoryDrpDataPlanYourCourse, setCategoryDrpDataPlanYourCourse] = useState<DropdownOptionType[]>([]);
  const [selectCoursePlanYourCourse, setSelectCoursePlanYourCourse] = useState<DropdownOptionType[]>([]);
  const [cropperPlanYourCourse, setCropperPlanYourCourse] = useState(false);
  const [imagePlanYourCourse, setImagePlanYourCourse] = useState('');
  const [courseImagePlanYourCourse, setCourseImagePlanYourCourse] = useState(false);
  const [bannerImagePlanYourCourse, setbannerImagePlanYourCourse] = useState(false);
  const cropperRef = createRef<ReactCropperElement>();
  const { planYourCourseDetails, playlistData, course_id, is_published, template, is_draft } = useSelector(
    (state: { coursesManagement: { planYourCourseDetails: PlanYourCourseDetails, playlistData: { name: string; uuid: string }[], course_id: string, is_published: boolean, template: { name: string; key: string; }[], activeStep: number, is_draft: boolean } }) => state.coursesManagement,
  );
  const { userProfileData } = useSelector(((state: { userProfile: { userProfileData: UserProfileType } }) => state.userProfile));
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageLoader, setImageLoader] = useState(false);
  const [courseCreate, { loading: courseCreateLoader }] = useMutation(COURSE_CREATE);
  const { data: getCourseByIDData, loading, refetch: refetchCourseDeatils } = useQuery(GET_COURSES_DETAILS_BY_ID_NEW, {
    variables: {
      courseId: course_id !== '' ? course_id : uuid,
    },
    skip: !uuid,
    fetchPolicy: 'no-cache'
  });

  useEffect(() => {
    if (course_id !== '') {
      refetchCourseDeatils({
        courseId: course_id
      }).then((res) => {
        const data = res?.data?.getCourseDetailsById?.data;
        AssignCourse(data)
      }).catch((err) => {
        toast.error(err?.networkError?.result?.errors?.[0]?.message);
      })
    }
  }, [course_id])

  const initialValues: PlanYourCourseDetails = {
    selectCourse: '',
    highlights1_id: '',
    highlights2_id: '',
    highlights3_id: '',
    highlights4_id: '',
    highlights1: '',
    highlights2: '',
    highlights3: '',
    highlights4: '',
    courseTitle: '',
    qualification: '',
    prerequisite: '',
    instructorName: '',
    assessmentCertification: false,
    category: '',
    addPrerequisite: false,
    categoryName: '',
    courseImageUploadFileName: '',
    courseDescription: '',
    bannerImageUploadFileName: '',
    instructorImageUploadFileName: '',
  };

  const formik = useFormik({
    initialValues,
    validationSchema: planYourCourseValidationSchema,
    onSubmit: (values) => {
      handleCourseCreation(values, false);
    },
  });

  useEffect(() => {
    if (location.pathname.includes(`/${ROUTES.app}/${ROUTES.updateEducationAndEngagement}`) && uuid) {
      dispatch(setCourseId(uuid));
    }
  }, [uuid])

  const AssignCourse = (courseData: CourseDetailsDataArray) => {
    const playlist = courseData?.playlists?.map((data: { name: string; uuid: string }) => {
      return { name: data?.name, code: data?.uuid }
    })
    if (location.pathname.includes(`/${ROUTES.app}/${ROUTES.updateEducationAndEngagement}`)) {
      dispatch(setIsPublished(courseData?.is_published));
    }
    dispatch(setIsDraft(courseData?.is_template))
    dispatch(setSetpFourDetails({
      is_certification: courseData?.is_certification,
      estimate_time: courseData?.estimate_time,
      availability: courseData?.availability,
      playlist_ids: playlist,
      is_editable: courseData?.is_editable,
    }));
    if (location.pathname.includes(`/${ROUTES.app}/${ROUTES.educationAndEngagement}`) && isViewAsLearner !== 'true' && course_id === '') {
      formik.setValues({
        selectCourse: courseData?.template_uuid ?? uuid,
        highlights1_id: '',
        highlights2_id: '',
        highlights3_id: '',
        highlights4_id: '',
        highlights1: conditionReturnFun(courseData?.highlights?.[0]?.name),
        highlights2: conditionReturnFun(courseData?.highlights?.[1]?.name),
        highlights3: conditionReturnFun(courseData?.highlights?.[2]?.name),
        highlights4: conditionReturnFun(courseData?.highlights?.[3]?.name),
        courseTitle: courseData?.title,
        prerequisite: courseData?.prerequisite,
        instructorName: courseData?.instructor_name,
        qualification: courseData?.instructor_qualification,
        category: courseData?.category?.uuid,
        assessmentCertification: courseData?.is_certification,
        courseImageUploadFileName: courseData?.course_image,
        addPrerequisite: !!courseData?.prerequisite,
        instructorImageUploadFileName: courseData?.instructor_profile,
        categoryName: courseData?.category?.name,
        courseDescription: courseData?.description,
        bannerImageUploadFileName: courseData?.banner_image,
        templateId: courseData?.template_uuid
      });

    } else {
      formik.setValues({
        selectCourse: courseData?.template_uuid ?? uuid,
        highlights1_id: conditionReturnFun(courseData?.highlights?.[0]?.uuid),
        highlights2_id: conditionReturnFun(courseData?.highlights?.[1]?.uuid),
        highlights3_id: conditionReturnFun(courseData?.highlights?.[2]?.uuid),
        highlights4_id: conditionReturnFun(courseData?.highlights?.[3]?.uuid),
        highlights1: conditionReturnFun(courseData?.highlights?.[0]?.name),
        highlights2: conditionReturnFun(courseData?.highlights?.[1]?.name),
        highlights3: conditionReturnFun(courseData?.highlights?.[2]?.name),
        highlights4: conditionReturnFun(courseData?.highlights?.[3]?.name),
        courseTitle: courseData?.title,
        prerequisite: courseData?.prerequisite,
        qualification: courseData?.instructor_qualification,
        category: courseData?.category?.uuid,
        instructorName: courseData?.instructor_name,
        assessmentCertification: courseData?.is_certification,
        courseImageUploadFileName: courseData?.course_image,
        addPrerequisite: !!courseData?.prerequisite,
        instructorImageUploadFileName: courseData?.instructor_profile,
        courseDescription: courseData?.description,
        categoryName: courseData?.category?.name,
        bannerImageUploadFileName: courseData?.banner_image,
        templateId: courseData?.template_uuid
      }
      );

    }

  }
  useEffect(() => {
    if (getCourseByIDData && uuid) {
      const courseData = getCourseByIDData?.getCourseDetailsById?.data;
      AssignCourse(courseData);
    }

  }, [getCourseByIDData, planYourCourseDetails]);

  useEffect(() => {
    if (template.length) {
      setSelectCoursePlanYourCourse(template);
    }
  }, [template])

  const valueReturnFunction = (condition: boolean, values: string | boolean | number, error: string | number | boolean) => {
    return condition ? values : error;
  }
  const
    handleCourseCreation = async (values: PlanYourCourseDetails, isDraft: boolean, learner?: boolean) => {
      try {
        const res = await courseCreate({
          variables: {
            courseData: {
              course_id: isViewAsLearner !== 'true' ? course_id : uuid,
              highlights: [
                { id: values?.highlights1_id ?? '', highlight: values?.highlights1 ?? '' },
                { id: values?.highlights2_id ?? '', highlight: values?.highlights2 ?? '' },
                { id: values?.highlights3_id ?? '', highlight: values?.highlights3 ?? '', },
                { id: values?.highlights4_id ?? '', highlight: values?.highlights4 ?? '', },
              ],
              title: values.courseTitle,
              description: values.courseDescription,
              prerequisite: valueReturnFunction(values?.addPrerequisite, values?.prerequisite, ''),
              category_uuid: conditionReturnFun(values.category),
              course_image: values.courseImageUploadFileName,
              banner_image: values.bannerImageUploadFileName,
              instructor_profile: values.instructorImageUploadFileName,
              instructor_name: values.instructorName,
              instructor_qualification: values.qualification,
              is_draft: isDraft,
              template_uuid: values?.templateId ?? uuid
            },
          },
        });
        if (!isDraft) {
          dispatch(setActiveStep());
        }
        if (isDraft && !learner) {
          toast.success('Draft has been saved succefully.');
        }
        if (learner) {
          navigate(`/${ROUTES.app}/${ROUTES.tfsCoursesTemplates}/${ROUTES.courseDetails}/?uuid=${res?.data?.courseCreateStepOne?.data?.uuid}&isViewAsLearner=true&step=0`)
        }
        dispatch(setPlanYourCourseDetails({
          ...values,
          id: course_id,
          highlights1_id: res?.data?.courseCreateStepOne?.data?.highlights?.[0]?.uuid,
          highlights2_id: res?.data?.courseCreateStepOne?.data?.highlights?.[1]?.uuid,
          highlights3_id: res?.data?.courseCreateStepOne?.data?.highlights?.[2]?.uuid,
          highlights4_id: res?.data?.courseCreateStepOne?.data?.highlights?.[3]?.uuid,
        }));
        dispatch(setCourseId(res?.data?.courseCreateStepOne?.data?.uuid));
        formik?.setFieldValue('highlights1_id', res?.data?.courseCreateStepOne?.data?.highlights?.[0]?.uuid);
        formik?.setFieldValue('highlights2_id', res?.data?.courseCreateStepOne?.data?.highlights?.[1]?.uuid);
        formik?.setFieldValue('highlights3_id', res?.data?.courseCreateStepOne?.data?.highlights?.[2]?.uuid);
        formik?.setFieldValue('highlights4_id', res?.data?.courseCreateStepOne?.data?.highlights?.[3]?.uuid);
      } catch (err) {
        toast.error((err as { networkError: { result: { errors: { message: string }[] } } })?.networkError?.result?.errors?.[0]?.message);
      }
    };

  const onSaveDraft = async () => {
    try {
      await courseTitleValidationSchema.validate({
        courseTitle: formik.values.courseTitle
      });
      handleCourseCreation(formik.values, true);
    } catch (validationError) {

      toast.error(formik.errors.courseTitle);
    }
  };

  const onViewAsLearner = async () => {
    try {
      await courseTitleValidationSchema.validate({
        courseTitle: formik.values.courseTitle
      });
      handleCourseCreation(formik.values, true, true);
    } catch (validationError) {
      toast.error(formik.errors.courseTitle);
    }
  }

  useEffect(() => {
    // Refetch the data when the component becomes active
    refetchRoleDataPlanYourCourse();
    refetchCategoryDataPlanYourCourse();
  }, [refetchCategoryDataPlanYourCourse]);


  useEffect(() => {
    if (playlistData?.length === 0 && getCourseByIDData && uuid) {
      if (getCourseByIDData?.getCourseDetailsById?.data?.course_playlists?.length > 0) {
        const transformedData = getCourseByIDData?.getCourseDetailsById?.data?.course_playlists?.map(
          (item: { playlist: { name: string; uuid: string } }) => ({
            name: item?.playlist?.name,
            code: item?.playlist?.uuid,
          }),
        );
        dispatch(setPlaylistData(transformedData));
      }
    }
  }, [playlistData, getCourseByIDData]);

  useEffect(() => {
    const tempDataArr = [] as DropdownOptionType[];
    categoryData?.getActiveCategories?.data?.categories?.map((data: StateDataArr) => {
      tempDataArr.push({ name: data?.name, key: data?.uuid });
    });
    setCategoryDrpDataPlanYourCourse(tempDataArr);
  }, [categoryData]);

  const handleCourseImagePlanYourCourse = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setCourseImagePlanYourCourse(true);
    setbannerImagePlanYourCourse(false);
    let files;
    if (e.target) {
      files = e.target.files;
    }
    if (files && files?.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        if (file.size > MAX_FILE_SIZE) {
          toast.error('Image size must be less than 5MB');
        } else {
          const reader = new FileReader();
          reader.onload = () => {
            setImagePlanYourCourse(reader.result as string);

            setCropperPlanYourCourse(true);
          };
          reader.readAsDataURL(file);
        }
      } else {
        toast.error('Please select a valid image file');
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);
  const handleBannerImagePlanYourCourse = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setCourseImagePlanYourCourse(false);
    setbannerImagePlanYourCourse(true);
    let files;
    if (e.target) {
      files = e.target.files;
    }
    if (files && files?.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        if (file.size > MAX_FILE_SIZE) {
          toast.error('Image size must be less than 5MB');
        } else {
          const reader = new FileReader();
          reader.onload = () => {
            setImagePlanYourCourse(reader.result as string);
            setCropperPlanYourCourse(true);
          };
          reader.readAsDataURL(file);
        }
      } else {
        toast.error('Please select a valid image file');
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleInstructorProfileImagePlanYourCourse = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setCourseImagePlanYourCourse(false);
    setbannerImagePlanYourCourse(false);
    let files;
    if (e.target) {
      files = e.target.files;
    }
    if (files && files?.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        if (file.size > MAX_FILE_SIZE) {
          toast.error('Image size must be less than 5MB');
        } else {
          const reader = new FileReader();
          reader.onload = () => {
            setImagePlanYourCourse(reader.result as string);
            setCropperPlanYourCourse(true);
          };
          reader.readAsDataURL(file);
        }
      } else {
        toast.error('Please select a valid image file');
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // This clears the input field
    }
  }, []);


  const getCropDataPlanYourCourse = async (): Promise<void> => {
    const cropper = cropperRef.current?.cropper;

    if (!cropper) {
      return;
    }

    setImageLoader(true);
    let fileName: string | null = null;
    let file: File;

    if (courseImagePlanYourCourse) {
      file = DATA_URL_TO_FILE(cropper.getCroppedCanvas().toDataURL(), 'courseImagePreview.png');
    } else if (bannerImagePlanYourCourse) {
      file = DATA_URL_TO_FILE(cropper.getCroppedCanvas().toDataURL(), 'BannerImagePreview.png');
    } else {
      file = DATA_URL_TO_FILE(cropper.getCroppedCanvas().toDataURL(), 'instructorProfilePreview.png');
    }

    const formData = new FormData();
    formData.append('image', file);

    let uploadType = bannerImagePlanYourCourse ? 'bannerImage' : 'courseImage';
    if (!courseImagePlanYourCourse && !bannerImagePlanYourCourse) {
      uploadType = 'instructorProfile';
    }
    fileName = await uploadImage(formData, uploadType);

    if (fileName) {
      if (!courseImagePlanYourCourse && bannerImagePlanYourCourse) {
        formik.setFieldValue('bannerImageUploadFileName', fileName);
      } else if (courseImagePlanYourCourse && !bannerImagePlanYourCourse) {
        formik.setFieldValue('courseImageUploadFileName', fileName);
      } else {
        formik.setFieldValue('instructorImageUploadFileName', fileName);
      }
    }

    setCropperPlanYourCourse(false);
    setImageLoader(false);
  };

  const onDeleteImagePlanYourCourse = useCallback(
    async (data: DeleteImageData): Promise<void> => {
      const { courseImagePlanYourCourse, bannerImagePlanYourCourse } = data;
      if (courseImagePlanYourCourse && !bannerImagePlanYourCourse) {
        const data = { fileName: formik.values.courseImageUploadFileName };
        // Attempt to Delete the Image
        axios
          .delete(`${API_MEDIA_END_POINT}/remove`, { data })
          .then(() => {
            formik.setFieldValue('courseImageUploadFileName', '');
          })
          .catch(error => {
            toast.error(error?.response?.data?.message);
          });
      } else if (!courseImagePlanYourCourse && bannerImagePlanYourCourse) {
        const data = { fileName: formik.values.bannerImageUploadFileName };
        // Attempt to Delete the Image
        axios
          .delete(`${API_MEDIA_END_POINT}/remove`, { data })
          .then(() => {
            formik.setFieldValue('bannerImageUploadFileName', '');
          })
          .catch(error => {
            toast.error(error?.response?.data?.message);
          });
      } else {
        const data = { fileName: formik.values.instructorImageUploadFileName };
        // Attempt to Delete the Image
        axios
          .delete(`${API_MEDIA_END_POINT}/remove`, { data })
          .then(() => {
            formik.setFieldValue('instructorImageUploadFileName', '');
          })
          .catch(error => {
            toast.error(error?.response?.data?.message);
          });
      }
    },
    [formik],
  );

  const seeAllTFSCoursesTemplatesPlanYourCourse = useCallback(() => {
    navigate(`/${ROUTES.app}/${ROUTES.tfsCoursesTemplates}/?IsSelectCourseTemplate=true`);
    dispatch(setCourseId(''));
  }, []);

  const OnBlurBannerPlanYourCourse = useCallback(
    (e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
      formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
    },
    [],
  );

  const dialogActionConstPlanYourCourse = () => {
    return (
      <div className="flex justify-end gap-3 md:gap-5">
        <Button
          className="btn-secondary btn-normal w-full md:w-[160px] whitespace-nowrap"
          type="button"
          label="Cancel"
          onClick={() => setCropperPlanYourCourse(false)}
          title="Cancel"
        />
        <Button
          className="btn-primary btn-normal w-full md:w-[160px] whitespace-nowrap"
          type="button"
          label="Save"
          disabled={imageLoader}
          onClick={() => getCropDataPlanYourCourse()}
          title="Save"
        />
      </div>
    );
  };

  const onChangePlanYourCourse = () => {
    navigate(`/${ROUTES.app}/${ROUTES.tfsCoursesTemplates}/?IsSelectCourseTemplate=true`);
  };

  const getError = (filedName: keyof PlanYourCourseDetails) => {
    return formik?.errors?.[filedName] && formik?.touched?.[filedName] ? formik?.errors?.[filedName] : ''
  }
  const returnErrorMeassageTag = (filedName: keyof PlanYourCourseDetails) => {
    return formik?.errors?.[filedName] && formik?.touched?.[filedName] ? (
      <span className="-mt-1 md:text-xs-15 error">{formik?.errors?.[filedName]}</span>
    ) : (
      null
    )
  }

  const returnAspectRatio = ()=>{
    if(courseImagePlanYourCourse){
      return 1.8 / 1
    }
    if(bannerImagePlanYourCourse){
    return   3.67/1
    }
    return 1;

  }

  return (
    <div>
      {(loading || roleLoader || categoryDataLoader) ? (
        <LoadingIndicator />
      ) : (
        <>
          <form className="border border-solid border-border-primary rounded-xl" onSubmit={formik.handleSubmit}>
            {(!location.pathname.includes(`/${ROUTES.app}/${ROUTES.updateEducationAndEngagement}`) && USER_TYPE?.SUPER_ADMIN !== userProfileData?.getProfile?.data?.user_type) &&
              <div className="p-3 pb-5 border-b border-solid md:p-5 md:pb-7 border-border-primary">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-3 md:gap-5 select-template">
                  <h6>{t('Select From Template')}</h6>
                  <Button
                    className="btn btn-normal bg-primary text-white text-xs w-full md:w-[100px] h-[36px]"
                    type="button"
                    onClick={seeAllTFSCoursesTemplatesPlanYourCourse}
                    label={t('See All')}
                    title="See All"
                  />
                </div>
                <p className="mb-3 md:mb-5">
                  These courses are created by TFS. You can select any of them to prefill all the details including course details and structure. You
                  can edit/update it afterwards.
                </p>
                <div className="w-full cursor-pointer lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-14px)]" onClick={() => onChangePlanYourCourse()}>
                  <DropDown
                    className="pointer-events-none"
                    placeholder={t('Select Type')}
                    label={t('Select Course')}
                    onChange={onChangePlanYourCourse}
                    value={formik.values.selectCourse as string}
                    options={selectCoursePlanYourCourse}
                    name="selectCourse"
                    id="selectCourse"
                    error={getError('selectCourse')}
                  />
                </div>
              </div>}
              <div className="px-3 py-5 border-b border-solid md:px-5 md:py-7 border-border-primary last:border-none">
              <h6 className="mb-3 md:mb-5">{t('Add Course Details')}</h6>
              <div className="flex flex-col gap-3 md:gap-5">
                <div className="w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-14px)]">
                  <TextInput
                    placeholder={t('Insert your course title')}
                    type="text"
                    id="courseTitle"
                    name="courseTitle"
                    label={t('Course Title')}
                    value={formik.values.courseTitle}
                    onChange={formik.handleChange}
                    required={true}
                    error={getError('courseTitle')}
                    onBlur={OnBlurBannerPlanYourCourse}
                  />
                </div>
                
                <div className="w-full 3xl:w-[66%]">
                  <Textarea
                    label={t('Course Description')}
                    rows={7}
                    value={formik.values.courseDescription}
                    name='courseDescription'
                    required={true}
                    onChange={formik.handleChange}
                    onBlur={OnBlurBannerPlanYourCourse}
                    placeholder='Insert your course description'
                    error={getError('courseDescription')} />
                </div>
              </div>
            </div>
            <div className="px-3 py-5 border-b border-solid md:px-5 md:py-7 border-border-primary last:border-none">
              <h6 className="mb-3 md:mb-5">{t('Highlights of Course')}</h6>
              <div className="flex flex-wrap gap-3 md:gap-5">
                <div className="w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-14px)]">
                  <TextInput
                    placeholder={t('Enter')}
                    type="text"
                    id="highlights1"
                    name="highlights1"
                    label={t('Highlights 1')}
                    value={formik.values.highlights1}
                    onChange={formik.handleChange}
                    error={getError('highlights1')}
                    onBlur={OnBlurBannerPlanYourCourse}
                  />
                </div>
                <div className="w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-14px)]">
                  <TextInput
                    placeholder={t('Enter')}
                    type="text"
                    id="highlights2"
                    name="highlights2"
                    label={t('Highlights 2')}
                    value={formik.values.highlights2}
                    onChange={formik.handleChange}
                    error={getError('highlights2')}
                    onBlur={OnBlurBannerPlanYourCourse}
                  />
                </div>
                <div className="w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-14px)]">
                  <TextInput
                    placeholder={t('Enter')}
                    type="text"
                    id="highlights3"
                    name="highlights3"
                    label={t('Highlights 3')}
                    value={formik.values.highlights3}
                    onChange={formik.handleChange}
                    error={getError('highlights3')}
                    onBlur={OnBlurBannerPlanYourCourse}
                  />
                </div>
                <div className="w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-14px)]">
                  <TextInput
                    placeholder={t('Enter')}
                    type="text"
                    id="highlights4"
                    name="highlights4"
                    label={t('Highlights 4')}
                    value={formik.values.highlights4}
                    onChange={formik.handleChange}
                    error={getError('highlights4')}
                    onBlur={OnBlurBannerPlanYourCourse}
                  />
                </div>
              </div>
            </div>
            <div className="px-3 py-5 border-b border-solid md:px-5 md:py-7 border-border-primary last:border-none">
              <h6 className="mb-3 md:mb-5">{t('Add Tag')}</h6>
              <div className="flex flex-wrap gap-3 md:gap-5">
                <div className="w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-14px)]">
                  <DropDown
                    placeholder={t('Select Tag')}
                    name="category"
                    onChange={formik.handleChange}
                    value={formik.values.category}
                    options={categoryDrpDataPlanYourCourse}
                    id="category"
                    error={getError('category')}
                    required={false}
                    label={t('')}
                    className="-mt-2"
                  />
                </div>
              </div>
            </div>

            <div className="px-3 py-5 border-b border-solid md:px-5 md:py-7 border-border-primary last:border-none">
              <h6 className="mb-3 md:mb-5">{t('Prerequisite')}</h6>
              <div className="mb-3 md:mb-5">
                <label className="flex">
                  <input
                    className="mr-2"
                    type="checkbox"
                    value={formik.values.addPrerequisite ? 1 : 0}
                    name="addPrerequisite"
                    checked={formik.values.addPrerequisite}
                    onChange={e => formik.handleChange(e)}
                  />
                  <span className="font-normal">Add Prerequisite</span>
                </label>
                {formik.errors.addPrerequisite && <p className="mt-2 error">{t(formik.errors.addPrerequisite)}</p>}
              </div>
              {formik.values.addPrerequisite && (
                <div className="w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-14px)]">
                  <TextInput
                    placeholder={t('Add Prerequisite')}
                    type="text"
                    id="prerequisite"
                    name="prerequisite"
                    label={t('Add Prerequisite')}
                    onChange={formik.handleChange}
                    value={formik.values.prerequisite}
                    required={true}
                    error={getError('prerequisite')}
                    onBlur={OnBlurBannerPlanYourCourse}
                  />
                </div>
              )}
            </div>

            <div className="px-3 py-5 border-b border-solid md:px-5 md:py-7 border-border-primary last:border-none">
              <h6 className="mb-3 md:mb-5">
                {t('Course Image')}
                <span className="text-error"> *</span>
              </h6>
              <div>
                <label>{t('Upload Image')}</label>
                <div className="flex flex-wrap gap-1 lg:gap-5">
                  <div className="w-full min-h-[176px] flex flex-col lg:w-[calc(50%-10px)] xl:min-w-[480px] xl:w-[calc(33.3%-14px)]">
                    <label
                      htmlFor="Course Image"
                      className="relative flex items-center justify-center h-full overflow-hidden bg-white border border-solid cursor-pointer rounded-xl border-border-primary hover:bg-gray-100"
                    >
                      <div className="flex flex-col items-center justify-center w-full h-full rounded-xl">
                        {!formik.values.courseImageUploadFileName && (
                          <span className="text-xl-50">
                            <UploadImage className="mb-2 fill-secondary" />
                          </span>
                        )}
                        {formik.values.courseImageUploadFileName && (
                          <img
                            src={`${process.env.REACT_APP_IMAGE_BASE_URL}/${formik.values.courseImageUploadFileName}`}
                            alt="Course"
                            className="object-fill w-full h-full"
                          />
                        )}
                        {!formik.values.courseImageUploadFileName && <p className="text-xl text-light-grey">{t('Upload Image')}</p>}
                      </div>
                      {formik.values.courseImageUploadFileName && (
                        <Button
                          className="absolute p-[6px] rounded-full cursor-pointer top-4 right-4 md:top-5 md:right-5 bg-error"
                          type="button"
                          label=""
                          onClick={() => onDeleteImagePlanYourCourse({ courseImagePlanYourCourse: true, bannerImagePlanYourCourse: false })}
                        >
                          <Cross className="fill-white" fontSize="12" />
                        </Button>
                      )}
                      <input
                        id="Course Image"
                        type="file"
                        accept=".png, .jpeg"
                        ref={fileInputRef} // Assign the ref to the input element
                        onChange={handleCourseImagePlanYourCourse}
                        className="hidden"
                        key={uuidv4()}
                      />
                    </label>
                    {returnErrorMeassageTag('courseImageUploadFileName')}

                  </div>
                  <p className="w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-14px)]">
                    {t(
                      'Upload your course image here. It must meet our course image quality standards to be accepted. Important guidelines: 750x422 pixels; .jpg, .jpeg, or .png. no text on the image Max size is 5MB.',
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* course banner image add */}
            <div className="px-3 py-5 border-b border-solid md:px-5 md:py-7 border-border-primary last:border-none">
              <h6 className="mb-3 md:mb-5">
                {t('Banner Image')}
                <span className="text-error"> *</span>
              </h6>
              <div>
                <label>{t('Upload Image')}</label>
                <div className="flex flex-wrap gap-1 lg:gap-5">
                  <div className="w-full min-h-[176px] flex flex-col lg:w-[calc(50%-10px)] xl:min-w-[480px] xl:w-[calc(33.3%-14px)]">
                    <label
                      htmlFor="Banner Image"
                      className="relative flex items-center justify-center h-full overflow-hidden bg-white border border-solid cursor-pointer rounded-xl border-border-primary hover:bg-gray-100"
                    >
                      <div className="flex flex-col items-center justify-center w-full h-full rounded-xl">
                        {!formik.values.bannerImageUploadFileName && (
                          <span className="text-xl-50">
                            <UploadImage className="mb-2 fill-secondary" />
                          </span>
                        )}
                        {formik.values.bannerImageUploadFileName && (
                          <img
                            src={`${process.env.REACT_APP_IMAGE_BASE_URL}/${formik.values.bannerImageUploadFileName}`}
                            alt="Course"
                            className="object-fill w-full h-full"
                          />
                        )}
                        {!formik.values.bannerImageUploadFileName && <p className="text-xl text-light-grey">{t('Upload Image')}</p>}
                      </div>
                      {formik.values.bannerImageUploadFileName && (
                        <Button
                          className="absolute p-[6px] rounded-full cursor-pointer top-4 right-4 md:top-5 md:right-5 bg-error"
                          type="button"
                          label=""
                          onClick={() => onDeleteImagePlanYourCourse({ courseImagePlanYourCourse: false, bannerImagePlanYourCourse: true })}
                        >
                          <Cross className="fill-white" fontSize="12" />
                        </Button>
                      )}
                      <input
                        id="bannerImage"
                        type="file"
                        accept=".png, .jpeg"
                        ref={fileInputRef} // Assign the ref to the input element
                        onChange={handleBannerImagePlanYourCourse}
                        // className="hidden"
                        key={uuidv4()}
                      />
                    </label>
                    {returnErrorMeassageTag('bannerImageUploadFileName')}
                  </div>
                  <p className="w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-14px)]">
                    {t(
                      'Upload your banner image here. It must meet our banner image quality standards to be accepted. Important guidelines: 750x422 pixels; .jpg, .jpeg, or .png. no text on the image Max size is 5MB.',
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-3 py-5 border-b border-solid md:px-5 md:py-7 border-border-primary last:border-none">
              <h6 className="mb-3 md:mb-5">
                {t('Instructor Profile')}
                <span className="text-red-500"> *</span>
              </h6>
              <div>
                <label>{t('Upload Image')}</label>
                <div className="flex flex-wrap gap-2 lg:gap-5">
                  <div className="w-full flex flex-col h-[176px] lg:w-[calc(50%-10px)] xl:min-w-[480px] xl:w-[calc(33.3%-14px)]">
                    <label
                      htmlFor="Instructor Profile Image"
                      className="relative flex items-center justify-center h-full p-5 overflow-hidden bg-white border border-solid cursor-pointer rounded-xl border-border-primary hover:bg-gray-100"
                    >
                      <div className="flex flex-col items-center justify-center h-full overflow-hidden rounded-xl">
                        {!formik.values.instructorImageUploadFileName && (
                          <span className="text-xl-50">
                            <UploadImage className="mb-2 fill-secondary" />
                          </span>
                        )}
                        {formik.values.instructorImageUploadFileName && (
                          <img
                            src={`${process.env.REACT_APP_IMAGE_BASE_URL}/${formik.values.instructorImageUploadFileName}`}
                            alt="Instructor Profile"
                            className="object-fill w-full h-full"
                          />
                        )}
                        {!formik.values.instructorImageUploadFileName && <p className="text-xl text-light-grey">{t('Upload Image')}</p>}
                      </div>
                      {formik.values.instructorImageUploadFileName && (
                        <Button
                          className="absolute p-[6px] rounded-full cursor-pointer top-4 right-4 md:top-5 md:right-5 bg-error"
                          type="button"
                          label=""
                          onClick={() => onDeleteImagePlanYourCourse({ courseImagePlanYourCourse: false, bannerImagePlanYourCourse: false })}
                        >
                          <Cross className="fill-white" fontSize="12" />
                        </Button>
                      )}
                      <input
                        id="InstructorProfileImage"
                        type="file"
                        accept=".png, .jpeg"
                        ref={fileInputRef}
                        onChange={handleInstructorProfileImagePlanYourCourse}
                        key={uuidv4()}
                      />
                    </label>
                    {returnErrorMeassageTag('instructorImageUploadFileName')}
                  </div>
                  <div className="w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-14px)]">
                    <div className="w-full mb-3 md:mb-5">
                      <TextInput
                        placeholder={t('Add Name here')}
                        type="text"
                        id="instructorName"
                        name="instructorName"
                        label={t('Instructor Name')}
                        onChange={formik.handleChange}
                        value={formik.values.instructorName}
                        required={true}
                        error={getError('instructorName')}
                        onBlur={OnBlurBannerPlanYourCourse}
                      />
                    </div>
                    <div className="w-full">
                      <TextInput
                        placeholder={t('Add Qualification here')}
                        type="text"
                        id="qualification"
                        name="qualification"
                        label={t('Qualification')}
                        onChange={formik.handleChange}
                        value={formik.values.qualification}
                        error={getError('qualification')}
                        onBlur={OnBlurBannerPlanYourCourse}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
          <Dialog
            className="custom-dialog"
            header="Crop Image"
            visible={cropperPlanYourCourse}
            style={{ width: '50vw', borderRadius: '12px' }}
            onHide={() => setCropperPlanYourCourse(false)}
            footer={() => dialogActionConstPlanYourCourse()}
          >
            {imagePlanYourCourse && (
              <Cropper
                ref={cropperRef}
                style={{ height: 400, width: '100%' }}
                zoomTo={0.5}
                aspectRatio={returnAspectRatio()}
                preview=".img-preview"
                src={imagePlanYourCourse}
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
            )}
          </Dialog>
          <div className="flex flex-wrap justify-between gap-2 mt-5 md:gap-7.5">
            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3 md:gap-5">
              <Button
                className="btn-secondary btn-normal w-full md:w-[180px] whitespace-nowrap"
                type="button"
                label={t('View as a Learner')}
                title="View as a Learner"
                onClick={onViewAsLearner}
              />
              {(!is_published || is_draft) && <Button
                className="btn-secondary btn-normal w-full md:w-[160px] whitespace-nowrap"
                type="button"
                label={t('Save as Draft')}
                title="Save as Draft"
                onClick={onSaveDraft}
                disabled={courseCreateLoader}
              />}
            </div>
            <Button
              className="btn-primary btn-normal w-full md:w-[160px] whitespace-nowrap"
              type="button"
              onClick={formik.handleSubmit}
              label={t('Save & Next')}
              title="Next"
              disabled={courseCreateLoader}
            />
          </div>
        </>
      )}
    </div>
  );
};
export default PlanYourCourse;
