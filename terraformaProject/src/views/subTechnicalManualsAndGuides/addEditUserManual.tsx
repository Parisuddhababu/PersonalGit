import React, { ChangeEvent, createRef, useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useFormik } from 'formik';
import TextInput from '@components/textInput/TextInput';
import Button from '@components/button/button';
import Dropdown from '@components/dropdown/dropDown';
import { useMutation, useQuery } from '@apollo/client';
import { ApiAttachment, DATA_URL_TO_FILE, IMAGE_BASE_URL, MAX_FILE_SIZE, PAGE_LIMIT, PAGE_NUMBER, uploadImage } from '@config/constant';
import { whiteSpaceRemover } from '@utils/helpers';
import { CreateUserManual } from 'src/types/userManual';
import { CREATE_USER_MANUAL } from '@framework/graphql/mutations/userManual';
import { GET_CHILD_CATEGORIES_DROPDOWN } from '@framework/graphql/queries/userManual';
import { DropdownOptionType } from '@types';
import useValidation from '@framework/hooks/validations';
import UpdatedHeader from '@components/header/updatedHeader';
import logo from '@assets/images/sidebar-logo.png'
import { Cross } from '@components/icons/icons';
import { Dialog } from 'primereact/dialog';
import { Cropper, ReactCropperElement } from 'react-cropper';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // theme
import 'primereact/resources/primereact.css';
import 'cropperjs/dist/cropper.css';

const AddEditUserManual = () => {
    const { t } = useTranslation();
    const Navigate = useNavigate();
    const [createUserManual] = useMutation(CREATE_USER_MANUAL);
	const [cropper, setCropper] = useState(false);
	const [image, setImage] = useState(logo);
    const { addUserManualValidationSchema } = useValidation();
    const { data } = useQuery(GET_CHILD_CATEGORIES_DROPDOWN, {
        variables: {
            limit: PAGE_LIMIT,
            page: PAGE_NUMBER,
            sortField: 'createdAt',
            sortOrder: 'descend',
            search: '',
        },
    });
    const [stateDrpData, setStateDrpData] = useState<DropdownOptionType[]>([]);
    const [filteredCategoryOptions, setFilteredCategoryOptions] = useState<DropdownOptionType[]>([]);
    const [selectedParentCategory, setSelectedParentCategory] = useState<string>('');
    const [isSubCategoryDropdownDisabled, setIsSubCategoryDropdownDisabled] = useState<boolean>(true);
    const [imageLoader,setImageLoader] = useState(false);
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const cropperRef = createRef<ReactCropperElement>();


    useEffect(() => {
        if (data?.getManualCategories) {
            const tempDataArr: DropdownOptionType[] = data.getManualCategories.data.manualCategories.map((category: { name: string; uuid: string }) => ({
                name: category.name,
                key: category.uuid,
            }));
            setStateDrpData(tempDataArr);
        }
    }, [data]);

    const initialValues = {
        category_id: '',
        name: '',
        url: '',
        category_main_id:'',
        file_foreground_image: ''
    };

    const handleLogo = useCallback((e: any) => {
		e.preventDefault();
		let files;
		if (e.dataTransfer) {
			files = e.dataTransfer.files;
		} else if (e.target) {
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
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						setImage(reader.result as any);
						setCropper(true);
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

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type === 'application/pdf') {
                if (file.size <= 5 * 1024 * 1024) {
                    formik.setFieldValue('url', file);
                    formik.setFieldError('url', '');
                } else {
                    formik.setFieldError('url', 'File size should be less than 5 MB');
                }
            } else {
                formik.setFieldError('url', 'Only PDF files are allowed');
            }
        }
    };


    const formik = useFormik({
        initialValues,
        validationSchema: addUserManualValidationSchema,
        onSubmit: async (values) => {
            await setImageLoader(true);
            const formData = new FormData();
            formData.append('file', values.url);

            try {
                const response = await axios.post(
                    ApiAttachment,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );

                const imageUrl = response.data.data.key;
                createUserManual({
                    variables: {
                        itemCategoryData: {
                            category_id: values.category_id,
                            name: values.name,
                            url: imageUrl,
                            image: values.file_foreground_image
                        },
                    },
                })
                    .then((res) => {
                        const data = res.data;
                        toast.success(data?.createItemByCategory?.message);
                        formik.resetForm();
                        onCancelSubscribe();
                    })
                    .catch((err) => {
                        toast.error(err.networkError.result.errors[0].message);
                    });
            } catch (error) {
                toast.error('Error uploading image');
            }
            await setImageLoader(false);
        }
    });

    useEffect(() => {
        if (data?.getManualCategories) {
            const filteredCategories = data.getManualCategories.data.manualCategories
                .filter((category: { uuid: string }) => category.uuid === selectedParentCategory)
                .flatMap((category: { children: string }) => category.children)
                .map((child: { name: string; uuid: string }) => ({
                    name: child.name,
                    key: child.uuid,
                }));

            setFilteredCategoryOptions(filteredCategories);
            setIsSubCategoryDropdownDisabled(filteredCategories.length === 0);
        }
    }, [data, selectedParentCategory]);
    const onCancelSubscribe = useCallback(() => {
        Navigate(-1);
    }, []);

    const onCancelClick = useCallback(() => {
        Navigate(-1);
    }, []);

    const OnBlur = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
        formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
    }, []);

    const getErrorUserMng = (fieldName: keyof CreateUserManual) => {
        return formik.errors[fieldName] && formik.touched[fieldName]
            ? formik.errors[fieldName]
            : '';
    };

    useEffect(() => {
        if (data?.getManualCategories) {
            const filteredCategories = data.getManualCategories.data.manualCategories
                .filter((category: { uuid: string; }) => category.uuid === selectedParentCategory)
                .flatMap((category: { children: string }) => category.children)
                .map((child: { name: string; uuid: string; }) => ({
                    name: child.name,
                    key: child.uuid,
                }));
            setFilteredCategoryOptions(filteredCategories);
        }
    }, [data, selectedParentCategory]);

    const dialogActionConst = () => {
		return (
			<div className='flex justify-end gap-3 md:gap-5'>
				<Button className='btn-secondary btn-normal w-full md:w-[160px] whitespace-nowrap' type='button' label="Cancel" onClick={() => setCropper(false)}  title={`${t('Cancel')}`} />
				<Button className='btn-primary btn-normal w-full md:w-[160px] whitespace-nowrap' type='button' label="Save" disabled={imageLoader} onClick={() => getCropData()}  title={`${t('Save')}`} />
			</div>
		)
	}

    const getCropData = async (): Promise<void> => {
		if (typeof cropperRef.current?.cropper !== 'undefined') {
			await setImageLoader(true);
			let fileName: string | null = null;
			const file = DATA_URL_TO_FILE(cropperRef.current?.cropper.getCroppedCanvas().toDataURL(), 'image.png');
			const formData = new FormData();
			formData.append('image', file);
			fileName = await uploadImage(formData, 'technicalManual');
			if (fileName) {
				formik.setFieldValue('file_foreground_image', fileName);
				setCropper(false);
			}
			await setImageLoader(false);
		}
	};

    const onDeleteImage = useCallback(async (): Promise<void> => {
		formik.setFieldValue('file_foreground_image', '');
	}, [formik]);

    return (
        <>

            <UpdatedHeader headerTitle='Add a Document' />
            <div>
                <form>
                    <div className='flex flex-wrap items-start justify-center p-3 mb-5 border border-solid md:p-5 sm:justify-start lg:flex-nowrap md:mb-7 border-border-primary rounded-xl'>
                        <div className='flex flex-wrap w-full gap-3 md:gap-5'>
                            <div className='inline-block w-full xl:w-[calc(50%-10px)]'>
                                <TextInput error={getErrorUserMng('name')} onBlur={OnBlur} placeholder={t('Name')} name='name' required={true} label={t('Name')} type='text' onChange={formik.handleChange} value={formik.values.name} />
                            </div>
                            <div className='inline-block w-full xl:w-[calc(50%-10px)]'>
                                <Dropdown
                                    placeholder={t('Select Parent Category')}
                                    name='category_main_id'
                                    onChange={(e) => {
                                        const selectedParentCategoryUUID = e.target.value;
                                        setSelectedParentCategory(selectedParentCategoryUUID);
                                        formik.handleChange(e);
                                    }}
                                    options={stateDrpData}
                                    id='category_main_id'
                                    label={t('Select Parent Category')}
                                    required={true}
                                    value={selectedParentCategory}
                                />
                               <p className='error'>{formik?.errors?.category_main_id}</p>
                            </div>

                            {selectedParentCategory && <div className='inline-block w-full xl:w-[calc(50%-10px)]'>                  
                                <Dropdown
                                    placeholder={t('Select Sub-Category')}
                                    name='category_id'
                                    onChange={formik.handleChange}
                                    id='category_id'
                                    label={t('Select Sub-Category')}
                                    required={true}
                                    options={filteredCategoryOptions}
                                    disabled={isSubCategoryDropdownDisabled}
                                    value={formik.values.category_id}
                                    error={getErrorUserMng('category_id')}
                                />
                            </div>}
                            <div className='inline-block w-full xl:w-[calc(50%-10px)]'>
                                <label>Attachment <span className='text-red-500 '>*</span></label>
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileUpload}
                                    name='file'
                                />
                                {formik.errors.url ? <p className='mt-2 error'>{t(formik.errors.url)}</p> : null}
                            </div> 

                            <div className='inline-block w-full xl:w-[calc(50%-10px)]'>
							<label
								htmlFor='logo'
								className='relative flex flex-col items-center justify-center'>
								<div className='flex items-center justify-center overflow-hidden border border-solid rounded-full cursor-pointer border-border-primary w-44 h-44'>
									<img src={formik?.values?.file_foreground_image ? IMAGE_BASE_URL + formik.values.file_foreground_image : logo} alt='file_foreground_image' className='object-contain w-full h-full bg-black' />
								</div>
								<input
									type="file"
									id="logo"
									name="file_foreground_image"
									accept="image/*"
									ref={fileInputRef}
									onChange={handleLogo}
									className="hidden"
								/>
							</label>
							{formik?.values?.file_foreground_image &&
								<Button className='absolute p-[6px] rounded-full cursor-pointer top-4 right-4 md:top-3 md:right-4 bg-error text-lg md:text-xl' type='button' label='' onClick={() => onDeleteImage()} title={`${t('Close')}`} >
									<Cross className='fill-white' />
								</Button>
							}
							{formik.errors.file_foreground_image && formik.touched.file_foreground_image ? <span className='relative mt-2 md:text-xs-15 error'>{formik.errors.file_foreground_image}</span> : ''}
						</div>

                        </div>
                    </div>
                    <Button className='mr-5 btn-primary btn-normal mb-3 md:mb-0 w-full md:w-[160px]'type='button' disabled={imageLoader} onClick={() => formik.handleSubmit()}  label={t('Save')}  title={`${t('Save')}`} />
                    <Button className='btn-secondary btn-normal w-full md:w-[160px]' label={t('Cancel')}  onClick={onCancelClick} 
                     title={`${t('Cancel')}`} />
                </form>


                <Dialog className="custom-dialog" header="Crop Image" visible={cropper} style={{ width: '50vw', borderRadius: '12px' }} onHide={() => setCropper(false)} footer={() => dialogActionConst()}>
				{
					image &&
					<Cropper
						ref={cropperRef}
						style={{ height: 400, width: '100%' }}
						zoomTo={0.5}
						aspectRatio={1}
						preview=".img-preview"
						src={image}
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
            </div>
        </>
    );
};

export default AddEditUserManual;
