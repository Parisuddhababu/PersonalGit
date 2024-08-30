import Button from '@components/button/button';
import { Cross, UploadImage } from '@components/icons/icons';
import TextInput from '@components/textInput/TextInput';
import { API_MEDIA_END_POINT, DATA_URL_TO_FILE, MAX_FILE_SIZE, uploadImage } from '@config/constant';
import useValidation from '@framework/hooks/validations';
import axios from 'axios';
import { useFormik } from 'formik';
import { Dialog } from 'primereact/dialog';
import React, { createRef, useCallback, useEffect, useRef, useState } from 'react';
import { Cropper, ReactCropperElement } from 'react-cropper';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { YoutubefilterProps } from 'src/types/common';

const YoutubeComponent = ({ onAddChapter,editData,disabled }: YoutubefilterProps) => {
    const { t } = useTranslation();
    const { YoutubeBasedValidationSchema } = useValidation();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [cropperPlanYourCourse, setCropperPlanYourCourse] = useState<boolean>(false);
    const [imageLoader, setImageLoader] = useState<boolean>(false);
    const [imagePlanYourCourse, setImagePlanYourCourse] = useState('');
    const [courseImagePlanYourCourse, setCourseImagePlanYourCourse] = useState<boolean>(false);
    const cropperRef = createRef<ReactCropperElement>();

    useEffect(()=>{
        if(editData!==null){
            formik.setValues({
                uuid:editData?.youtube?.uuid??'',
                chapterImage:editData?.youtube?.image as string ,
                chapterName:editData?.title,
                youtubeUrl:editData?.youtube?.youtube_url as string        
            })
        }
    },[editData])

    const initialValues = {
        uuid:'',
        chapterName: '',
        chapterImage: '',
        youtubeUrl: ''
    }
    const formik = useFormik({
        initialValues,
        validationSchema: YoutubeBasedValidationSchema,
        onSubmit(values) {
            onAddChapter(values);
            onClearFormYouTube();
        }
    });

    const onClearFormYouTube = () => {
        formik.resetForm();
    };

    const onBlurYouTube = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        formik.setFieldValue(e.target.name, e.target.value.trim());
    }, []);

    const handleCourseImagePlanYourCourse = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setCourseImagePlanYourCourse(true);
        const files = e.target.files;
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

    const getCropDataPlanYourCourse = async (): Promise<void> => {
        if (typeof cropperRef.current?.cropper !== 'undefined') {
            setImageLoader(true);
            let fileName: string | null = null;
            if (courseImagePlanYourCourse) {
                const file = DATA_URL_TO_FILE(cropperRef.current?.cropper.getCroppedCanvas().toDataURL(), 'chapterImage.png');
                const formData = new FormData();
                formData.append('image', file);
                fileName = await uploadImage(formData, 'courseImage');

                if (fileName) {
                    formik.setFieldValue('chapterImage', fileName);
                }
            }
        }
        setCropperPlanYourCourse(false);
        setImageLoader(false);
    }

    const onDeleteImagePlanYourCourse = useCallback(
        async (): Promise<void> => {
            const data = { fileName: formik.values.chapterImage };
            // Attempt to Delete the Image
            axios
                .delete(`${API_MEDIA_END_POINT}/remove`, { data })
                .then(() => {
                    formik.setFieldValue('chapterImage', '');
                })
                .catch(error => {
                    toast.error(error?.response?.data?.message);
                });
        }, [formik]);

    return <div className='p-3 md:p-5 overflow-hidden border border-solid mb-5 md:mb-7.5 border-border-primary rounded-xl'>
        <form onSubmit={formik.handleSubmit}>
            <div className="w-full mb-3 md:mb-5">
                <TextInput
                    placeholder={t('Enter Chapter Name')}
                    id='chapterName'
                    name='chapterName'
                    type="text"
                    label={t('Chapter Name')}
                    onChange={formik.handleChange}
                    required={true}
                    onBlur={onBlurYouTube}
                    disabled={disabled}
                    value={formik?.values?.chapterName}
                    error={(formik?.errors?.chapterName && formik?.touched?.chapterName) ? formik?.errors?.chapterName : ''}
                />
            </div>
            <h5 className="mb-3 md:mb-5 text-base md:text-lg">Add Image and Youtube URL</h5>
            <div className="flex flex-wrap gap-3 md:gap-5 min-h-[330px] mb-3 md:mb-5">
                <div className="w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-10px)]">
                    <p className="mb-2 text-sm font-semibold">{t('Upload Image')}<span className='text-red-500'>&nbsp;*</span></p>
                    <label htmlFor='chapterImage' className="relative flex items-center justify-center overflow-hidden bg-white border border-solid cursor-pointer rounded-xl border-border-primary hover:bg-gray-100">
                        <input
                            id='chapterImage'
                            type="file"
                            className='hidden'
                            accept=".png, .jpeg"
                            ref={fileInputRef}
                            onChange={handleCourseImagePlanYourCourse}
                            tabIndex={0}
                            disabled={disabled}
                        />
                        <picture className="flex flex-col items-center h-[270px] justify-center w-full">
                            {!formik.values.chapterImage && (
                                <span className="text-xl-50">
                                    <UploadImage className="mb-2 fill-secondary" />
                                </span>
                            )}
                            {formik.values.chapterImage && (
                                <img
                                    src={`${process.env.REACT_APP_IMAGE_BASE_URL}/${formik.values.chapterImage}`}
                                    alt="Course"
                                    className="object-cover w-full h-full"
                                />
                            )}
                            {formik.values.chapterImage ?
                                <>
                                    <Button
                                        className="absolute p-[6px] rounded-full cursor-pointer top-4 right-4 md:top-4 md:right-4 bg-error"
                                        type="button"
                                        label=""
                                        onClick={() => onDeleteImagePlanYourCourse()}
                                        disabled={disabled}
                                    >
                                        <Cross className="fill-white" fontSize="12" />
                                    </Button>
                                </>
                                : <p className="text-xl text-light-grey">{t('Upload Image')}</p>
                            }
                        </picture>

                    </label>
                    {(formik?.errors?.chapterImage && formik?.touched?.chapterImage) && <p className='mt-2 error md:text-xs-15'>{formik?.errors?.chapterImage}</p>}
                    <p className="mt-2 text-sm"><span className='font-bold'>{t('Note: ')}</span>{t('Supported formats are .png and .jpeg Max size is 5MB')}</p>
                </div>
                <div className="w-full lg:w-[calc(50%-10px)] xl:w-[calc(66.6%-10px)]">
                    <div className="w-full">
                        <TextInput
                            placeholder={t('Add YouTube URL here')}
                            name='youtubeUrl'
                            type="text"
                            label={t('YouTube URL')}
                            onBlur={onBlurYouTube}
                            onChange={formik.handleChange}
                            required={true}
                            value={formik?.values?.youtubeUrl}
                            disabled={disabled}
                            error={(formik?.errors?.youtubeUrl && formik?.touched?.youtubeUrl) ? formik?.errors?.youtubeUrl : ''}
                        />

                    </div>
                </div>
            </div>
            <button className='btn btn-primary btn-normal w-full md:w-[160px] my-2 mx-3'  type='submit' title={`${editData!==null ?'update Chapter':'Add Chapter'}`} disabled={disabled} >
            {t(`${editData!==null ?'update Chapter':'Add Chapter'}`)}
            </button>
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
                    aspectRatio={courseImagePlanYourCourse ? 750 / 422 : 1}
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
    </div >
}

export default YoutubeComponent;