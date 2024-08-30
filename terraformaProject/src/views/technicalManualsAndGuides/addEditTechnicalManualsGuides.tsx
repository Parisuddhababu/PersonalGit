/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState, createRef, useRef } from 'react'
import Cropper, { ReactCropperElement } from 'react-cropper';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { t } from 'i18next';
import logo from '@assets/images/sidebar-logo.png';
import { Camera, Cross } from '@components/icons/icons';
import TextInput from '@components/textInput/TextInput'
import Button from '@components/button/button';
import { useMutation, useQuery } from '@apollo/client';
import { GET_PARENT_MANUAL_CATEGORIES_ID } from '@framework/graphql/queries/technicalManual';
import { CREATE_MANUAL_CATEGORY, UPDATE_MANUAL_CATEGORY } from '@framework/graphql/mutations/technicalManual';
import { DATA_URL_TO_FILE, uploadImage } from '@config/constant';
import useValidation from '@framework/hooks/validations';
import { CreateTechnical } from 'src/types/technicalManual';
import { useParams } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import { whiteSpaceRemover } from '@utils/helpers';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // theme
import 'primereact/resources/primereact.css'; // core css
import 'cropperjs/dist/cropper.css';


const AddEditTechnicalManualsGuides = (props: any) => {
  const params = useParams()
  const [createManual] = useMutation(CREATE_MANUAL_CATEGORY);
  const [updateManual] = useMutation(UPDATE_MANUAL_CATEGORY);
  const { refetch } = useQuery(GET_PARENT_MANUAL_CATEGORIES_ID, { variables: { manualCategoryId: params.id }, skip: !params.id })
  const { addTechnicalManualValidationSchema } = useValidation();
  const [isRoleModelShow, setIsRoleModelShow] = useState<boolean>(false)
  const [addClass, setAddClass] = useState<boolean>(false);
  const [isEditTechnicalManual, setIsEditTechnicalManual] = useState<boolean>(false);
  const [technicalManualImage, setTechnicalManualImage] = useState('');
  const cropperTechnicalManualRef = createRef<ReactCropperElement>();
  const [technicalManualCropper, setTechnicalManualCropper] = useState(false);
  const technicalManualFileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageTechnicalManualLoader,setTechnicalManualImageLoader] = useState(false);
  const initialTechnicalManualsValues = {
    name: '',
    description: '',
    image_url: '',
    parent_id: ''
  }

  const sendDataToParent = () => {
    props.onData(refetch);
  }
  const formik = useFormik({
    initialValues: initialTechnicalManualsValues,
    validationSchema: addTechnicalManualValidationSchema,
    onSubmit: async (values) => {
      if (props.onData.uuid) {
        const manualCategoryData = {
          name: values.name,
          description: values.description,
          parent_id: values.parent_id ? values.parent_id : '',
          image_url: values.image_url,
        };
        updateManual({
          variables: {
            manualCategoryData: manualCategoryData,
            categoryId: String(props.onData.uuid),
          },
        })
          .then((res) => {
            const data = res.data
            toast.success(data?.updateManualCategory?.message)
            formik.resetForm()
            props.dataRefetch()
            onCancelTechnicalManual()
            props.onCloseAddForm()

          })
          .catch((err) => {
            toast.error(err?.networkError?.result?.errors[0]?.message)
          })

      } else {
        createManual({
          variables: {
            manualCategoryData: {
              name: values.name,
              description: values.description,
              parent_id: values.parent_id === '' ? '' : values.parent_id,
              image_url: values.image_url,
            },
          },
        })
          .then((res) => {
            const data = res.data
            toast.success(data?.createManualCategory?.message)
            formik.resetForm()
            sendDataToParent()
            props.onCloseAddForm()
          })
          .catch((err) => {
            toast.error(err.networkError.result.errors[0].message)
          })
      }
    }
  })

  useEffect(() => {
    setIsRoleModelShow(true);
    setAddClass(true);
    if (props?.onData?.uuid) {
      setIsEditTechnicalManual(true);
    }
  }, [props])

  /**
 * Method used for get state api with id
 */
  useEffect(() => {
    if (params.id) {
      refetch({ manualCategoryId: (params.id) }).catch((e) => toast.error(e));
    }
  }, [params.id]);

  const handleTechnicalManualLogo = useCallback((e: any) => {
    e.preventDefault();
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error('Image size must be less than 5MB');
        } else {
          const reader = new FileReader();
          reader.onload = () => {
            setTechnicalManualImage(reader.result as any);
            setTechnicalManualCropper(true);
          };
          reader.readAsDataURL(file);
        }
      } else {
        toast.error('Please select a valid image file');
      }
    }
    if (technicalManualFileInputRef.current) {
      technicalManualFileInputRef.current.value = '';
    }
  }, []);

  /**
   * 
   * @param fieldName particular field name pass base on error show
   * @returns 
   */
  const getErrorTechnicalMessage = (fieldName: keyof CreateTechnical) => {
    return formik.errors[fieldName] && formik.touched[fieldName]
      ? formik.errors[fieldName]
      : ''
  }

  useEffect(() => {
    if (props?.onData?.uuid) {
      formik.setValues({
        name: props.onData.name,
        description: props.onData.description,
        parent_id: props.onData.parent_id,
        image_url: props.onData.image_url,
      });

    }
  }, [props]);

  const onCancelTechnicalManual = useCallback(() => {
    setIsRoleModelShow(false);
  }, [])

  /**
   *  not add empty space logic
   */
  const OnTechnicalManualBlur = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
  }, []);

  const getTechnicalManualCropData = async (): Promise<void> => {
    if (typeof cropperTechnicalManualRef.current?.cropper !== 'undefined') {
      await setTechnicalManualImageLoader(true);
      let fileName: string | null = null;
      const file = DATA_URL_TO_FILE(cropperTechnicalManualRef.current?.cropper.getCroppedCanvas().toDataURL(), 'image.png');
      const formData = new FormData();
      formData.append('image', file);
      fileName = await uploadImage(formData,'');
      if (fileName) {
        formik.setFieldValue('image_url', fileName);
        setTechnicalManualCropper(false);
      }
      await setTechnicalManualImageLoader(false);
    }
  };

  const dialogTechnicalManualActionConst = () => {
    return (
      <div className='flex justify-end gap-3 md:gap-5'>
        <Button className='btn-secondary btn-normal w-full md:w-[160px] whitespace-nowrap' type='button' label="Cancel" onClick={() => setTechnicalManualCropper(false)}  title={`${t('Cancel')}`} />
        {/* <Button className='btn-primary btn-normal w-full md:w-[160px] whitespace-nowrap' type='button' label="Save" onClick={() => getTechnicalManualCropData()} title={`${t('Save')}`}  /> */}
        <Button className="btn-primary btn-normal w-full md:w-[160px] whitespace-nowrap" type="button" disabled={imageTechnicalManualLoader} label={'Save'} onClick={() => getTechnicalManualCropData()} />						
      </div>
    )
  }

  return (
    <>
      {isRoleModelShow && (
        <div id='defaultModal' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`fixed top-0 left-0 right-0 z-50 h-full bg-modal modal ${isRoleModelShow ? '' : 'hidden'}`}>
          <div id='changeUserStatusModel' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`py-5 flex items-center justify-center h-full ${addClass ? '' : 'opacity-0 transform -translate-y-full scale-150 '} transition-all duration-300 `}>
            <div className='w-full mx-5 sm:max-w-[780px]'>
              {/* <!-- Modal content --> */}
              <div className='relative bg-white rounded-xl'>
                {/* <!-- Modal header --> */}
                <div className='flex items-center justify-between p-5 border-b md:py-6 bg-accents-2 rounded-t-xl'>
                  <h6>{isEditTechnicalManual ? 'Update Manual' : 'Add Manual'}</h6>
                  {isEditTechnicalManual ? <Button onClick={onCancelTechnicalManual} label={t('')}><span className='text-xl-22'><Cross className='text-error' /></span></Button> : <Button onClick={props.onCloseAddForm} label={t('')}><span className='text-xl-22'><Cross className='text-error' /></span></Button>}
                </div>
                {/* <!-- Modal body --> */}
                <div className='w-full '>
                  <form onSubmit={formik.handleSubmit}>
                    <div className='p-5 bg-white max-h-[calc(100vh-260px)] overflow-auto'>
                      <div className='mb-2 text-right'>
                        {t('Fields marked with')} <span className='text-red-500'>*</span> {t('are mandatory.')}
                      </div>
                      <div className='mb-3'>
                        <div className='box-border flex flex-col items-center justify-center p-5 mb-5 border border-solid border-border-primary rounded-xl'>
                          <label
                            htmlFor='image_url'
                            className='relative flex flex-col items-center justify-center'>
                            <div className='flex items-center justify-center w-32 h-32 overflow-hidden border border-gray-300 border-solid rounded-full cursor-pointer sm:w-44 sm:h-44'>
                              {formik?.values?.image_url ? <img src={`${process.env.REACT_APP_IMAGE_BASE_URL}/${formik.values.image_url}`} alt='image_url' className='object-contain w-full h-full bg-black' /> :
                                <img src={logo} alt='image_url' className='object-contain w-full h-full bg-black' />}
                            </div>
                            <input
                              type="file"
                              id="image_url"
                              name="image_url"
                              accept="image/*"
                              onChange={handleTechnicalManualLogo}
                              ref={technicalManualFileInputRef}
                              className="hidden"
                            />
                            <div className='absolute bottom-0 p-2 text-2xl font-bold text-white rounded-full right-1 sm:right-2 bg-primary'>{<Camera />}</div>
                          </label>
                          {formik.errors.image_url && formik.touched.image_url ? <span className='relative mt-2 md:text-xs-15 error'>{formik.errors.image_url}</span> : ''}
                        </div>
                      </div>
                      <div className='mb-3'>
                        <TextInput onBlur={OnTechnicalManualBlur} placeholder={t('Name')} required={true} name='name' onChange={formik.handleChange} label={t('Name')} value={formik.values.name} error={getErrorTechnicalMessage('name')} />
                      </div>
                      <div>
                        <TextInput onBlur={OnTechnicalManualBlur} placeholder={t('Description')} required={true} name='description' onChange={formik.handleChange} label={t('Description')} value={formik.values.description} error={getErrorTechnicalMessage('description')} />
                      </div>
                    </div>
                    <div className='flex flex-col items-center justify-end p-5 border-t border-solid md:space-x-5 md:flex-row border-border-primary'>
                      <Button className='btn-primary btn-normal mb-3 md:mb-0 w-full md:w-[160px]' type='submit' label={t('Save')} 
                      title={`${t('Save')}`} />
                      {isEditTechnicalManual ? <Button className='btn-secondary btn-normal w-full md:w-[160px]' label={t('Cancel')} onClick={onCancelTechnicalManual}  title={`${t('Cancel')}`} />
                        : <Button className='btn-secondary btn-normal w-full md:w-[160px]' label={t('Cancel')} onClick={props.onCloseAddForm}  title={`${t('Cancel')}`}  />
                      }
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Dialog className="custom-dialog" header="Crop Image" visible={technicalManualCropper} style={{ width: '50vw' }} onHide={() => setTechnicalManualCropper(false)} footer={() => dialogTechnicalManualActionConst()}>
        {
          technicalManualImage &&
          <Cropper
            ref={cropperTechnicalManualRef}
            style={{ height: 400, width: '100%' }}
            zoomTo={0.5}
            aspectRatio={1}
            preview=".img-preview"
            src={technicalManualImage}
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
    </>
  )
}

export default AddEditTechnicalManualsGuides