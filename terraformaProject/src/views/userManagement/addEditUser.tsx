/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import Button from '@components/button/button'
import { useMutation, useQuery } from '@apollo/client'
import { CreateUser, UpdateUser } from '@framework/graphql/graphql'
import { useNavigate, useParams } from 'react-router-dom'
import { GENDER_DRP1, ROUTES } from '@config/constant'
import { UserForm } from 'src/types/user'
import { CREATE_USER, UPDATE_USER } from '@framework/graphql/mutations/user'
import { GET_USER_BY_ID } from '@framework/graphql/queries/user'
import {
  CheckCircle,
  Cross,
  CrossCircle,
  Eye,
  EyeCrossed,
} from '@components/icons/icons'
import profile from '@assets/images/default-user-image.png'
import RadioButtonNew from '@components/radiobutton/radioButtonNew'
import TextInput from '@components/textInput/TextInput'
import uploadFile from '@components/common/uploadFile'
import useValidation from '@framework/hooks/validations'
import { whiteSpaceRemover } from '@utils/helpers'
import 'react-image-crop/dist/ReactCrop.css'
import ReactCrop, { Crop } from 'react-image-crop'

const AddEditUser = () => {
  const { t } = useTranslation()
  const { data: userData, refetch } = useQuery(GET_USER_BY_ID)
  const [createUser] = useMutation(CREATE_USER)
  const [updateUserData] = useMutation(UPDATE_USER)
  const navigate = useNavigate()
  const params = useParams()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showChangeProfileText, setShowChangeProfileText] = useState(false) // Add state to control the visibility of the "Change Profile" text
  const [isHovering, setIsHovering] = useState(false)
  const { usermValidationSchema } = useValidation()
  const [src, setSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState<Crop>({
    unit: 'px',
    aspect: 16 / 9,
    width: 300,
    height: 500,
    x: 250,
    y: 0

  })

  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null)

  const imageRef = useRef<HTMLImageElement | null>(null)

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] as File
    if (
      file &&
      file.size <= 2000000 &&
      (file.type === 'image/jpeg' || file.type === 'image/png')
    ) {
      const reader = new FileReader()
      reader.addEventListener('load', () => setSrc(reader.result as string))

      reader.readAsDataURL(file)
    } else {
      if (file?.size > 2000000) {
        toast.error('File size should be not be greater than 2mb')
      } else {
        toast.error('please select jpg/png file')
      }
    }
  }
  const onImageLoaded = useCallback((image: HTMLImageElement) => {
    imageRef.current = image
  }, [])

  const onCropComplete = useCallback((crop: Crop) => {
    makeClientCrop(crop)
  }, [])

  const onCropChange = useCallback((newCrop: Crop) => {
    setCrop(newCrop)
  }, [])

  const makeClientCrop = async (crop: Crop) => {
    if (imageRef.current && crop.width && crop.height) {
      const croppedImageUrl = await getCroppedImg(
        imageRef.current,
        crop
      )
      formik.setFieldValue('profileImg', croppedImageUrl)
      setCroppedImageUrl(croppedImageUrl)
    }
  }

  const getCroppedImg = (
    image: HTMLImageElement,
    crop: Crop,
  ): Promise<string> => {
    const canvas = document.createElement('canvas')
    const pixelRatio = window.devicePixelRatio
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    const ctx = canvas.getContext('2d')

    canvas.width = crop.width * pixelRatio * scaleX
    canvas.height = crop.height * pixelRatio * scaleY

    ctx!.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    ctx!.imageSmoothingQuality = 'high'

    ctx!.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    )

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob: Blob | null) => {
          if (!blob) {
            toast.error('Canvas is empty')
            return
          }

          window.URL.revokeObjectURL(croppedImageUrl as string)
          const croppedUrl = window.URL.createObjectURL(blob)
          resolve(croppedUrl)
        },
        'image/jpeg',
        1
      )
    })
  }



  useEffect(() => {
    if (params.id) {
      refetch({ getUserId: parseInt(params.id) }).catch((err) => {
        toast.error(err)
      })
    }
  }, [params.id])

  useEffect(() => {
    if (userData && params.id) {
      const data = userData?.getUser?.data
      if (params.id) {
        setCroppedImageUrl(data?.profile_img)
      }
      formik.setValues({
        profileImg: data?.profile_img,
        firstName: data?.first_name,
        lastName: data?.last_name,
        userName: data?.user_name,
        email: data?.email,
        password: '',
        confirmPassword: '',
        dateOfBirth: data?.date_of_birth.split('T')[0],
        phoneNo: data?.phone_no,
        gender: data?.gender,
      })
    }
  }, [userData])

  const initialValues: UserForm = {
    profileImg: '',
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    phoneNo: '',
    gender: '',
  }

  const formik = useFormik({
    initialValues,
    validationSchema: params.id
      ? usermValidationSchema({ params: params.id })
      : usermValidationSchema({ params: undefined }),
    onSubmit: async (values) => {
      try {
        let imageUrl = formik.values.profileImg

        if (typeof values.profileImg !== 'string') {
          imageUrl = await uploadFile(values.profileImg)
        }

        if (params.id) {
          updateUserData({
            variables: {
              updateUserId: +params.id,
              firstName: values.firstName,
              lastName: values.lastName,
              email: values.email,
              gender: +values.gender,
              userName: values.userName,
              phoneNo: values.phoneNo,
              dateOfBirth: values.dateOfBirth,
              profileImg: imageUrl,
            },
          })
            .then((res) => {
              const data = res.data as UpdateUser
              if (
                data.updateUser.meta.statusCode === 200 ||
                data.updateUser.meta.statusCode === 201
              ) {
                toast.success(data.updateUser.meta.message)
                formik.resetForm()
                onCancelUser()
              } else {
                toast.error(data.updateUser.meta.message)
              }
            })
            .catch(() => {
              toast.error(t('Failed to update'))
            })
        } else {
          createUser({
            variables: {
              firstName: values.firstName,
              lastName: values.lastName,
              role: 0,
              email: values.email,
              gender: +values.gender,
              userName: values.userName,
              password: values.password,
              phoneNo: values.phoneNo,
              dateOfBirth: values.dateOfBirth,
              profileImg: imageUrl,
            },
          })
            .then((res) => {
              const data = res.data as CreateUser
              if (
                data.createUser.meta.statusCode === 200 ||
                data.createUser.meta.statusCode === 201
              ) {
                toast.success(data.createUser.meta.message)
                formik.resetForm()
                onCancelUser()
              } else {
                toast.error(data.createUser.meta.message)
              }
            })
            .catch(() => {
              toast.error(t('Failed to create'))
            })
        }
      } catch (error) {
        toast.error(t('Failed to submit'))
      }
    },
  })
  const onCancelUser = useCallback(() => {
    navigate(`/${ROUTES.app}/${ROUTES.user}/list`)
  }, [])

  const handleMouseEnter = () => {
    setShowChangeProfileText(true)
    setIsHovering(true)
  }

  const handleMouseLeave = () => {
    setShowChangeProfileText(false)
    setIsHovering(false)
  }
  const removeHandler = useCallback(() => {
    setCroppedImageUrl('')
    setSrc(null)
    imageRef.current = null;
    formik.setFieldValue('profileImg', null)
  }, [croppedImageUrl])

  const getErrorUserMng = (fieldName: keyof UserForm) => {
    return formik.errors[fieldName] && formik.touched[fieldName]
      ? formik.errors[fieldName]
      : ''
  }
  const selectedDate: string = formik.values.dateOfBirth
  const currentDate: string = new Date().toISOString().split('T')[0]
  const isFutureDate: boolean = selectedDate > currentDate

  const handleContactNumberChange =useCallback( (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = event.target.value
    const numericValue = input.replace(/\D/g, '')

    const trimmedNumericValue = numericValue.slice(0, 10)

    formik.setValues({
      ...formik.values,
      phoneNo: trimmedNumericValue,
    })
  },[])
  const OnBlur = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
  }, []);
  return (
    <div className='w-full'>
      <form
        className='bg-white shadow-md rounded pt-6  mb-4 border border-[#c8ced3]'
        onSubmit={formik.handleSubmit}
      >
        <div className='flex justify-end pr-8 pb-2'>
          <p>
            {t('Fields marked with')} <span className='text-red-700'>*</span> {t('are mandatory.')}
          </p>
        </div>
        <label className='ml-6'>
          {t('Profile Photo')} <span className='text-red-700'>*</span>
        </label>
        <div className='flex justify-between'>
          <div className='mb-4 '>
            <div
              className='flex items-center justify-center w-48 m-2'
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <label
                htmlFor='dropzone-file'
                className='flex flex-col items-center justify-center w-48 h-48 box-border border-2 border-gray-300 border-dashed rounded-sm cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 relative' // Added 'relative' class here
              >
                <div className={'w-full flex flex-col items-center justify-center h-full transition-all'}>
                  {croppedImageUrl && (
                    <img src={croppedImageUrl} className='object-cover w-full h-full' />
                  )}
                  {!croppedImageUrl && (
                    <>
                      <div className='w-full'>
                        <img src={profile} alt='image' style={{ maxWidth: '100%', maxHeight: '100%' }} />
                      </div>
                    </>
                  )}
                </div>

                <input
                  id='dropzone-file'
                  type='file'
                  onChange={onSelectFile}
                  className='hidden'
                />
                {isHovering && (
                  <div className='absolute text-white cursor-pointer'>
                    <button
                      onClick={(event) => {
                        event.preventDefault()
                        removeHandler()
                      }}
                      title=''
                    >
                      {formik.values.profileImg ? (
                        <CrossCircle
                          className='bg-red-400 ml-8'
                          fontSize='20px'
                          marginbottom='182px'
                          marginleft='182px'
                        />
                      ) : (
                        ''
                      )}
                    </button>
                  </div>
                )}

                {showChangeProfileText && (
                  <div className='absolute bottom-0 left-0 w-full bg-primary  text-center p-2 text-white'>
                    {('Change Profile Photo')}
                  </div>
                )}
              </label>
            </div>
            <p className='text-primary'>{formik.errors.profileImg && formik.touched.profileImg ? formik.errors.profileImg : ''}</p>
          </div>

          <div>
            {src && (
              <div className='flex flex-col'>
                <label className='ml-6 mb-4'>{t('Crop Image')} </label>
                <ReactCrop
                  src={src}
                  crop={crop}
                  ruleOfThirds
                  onImageLoaded={onImageLoaded}
                  onComplete={onCropComplete}
                  onChange={onCropChange}
                  className='h-[500px] w-[800px]'

                />
              </div>
            )}
          </div>
        </div>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-2 p-4'>
          <div>
            <TextInput
              onBlur={OnBlur}
              required={true}
              placeholder={t('First Name')}
              name='firstName'
              onChange={formik.handleChange}
              label={t('First Name')}
              value={formik.values.firstName}
              error={getErrorUserMng('firstName')}
            />
          </div>
          <div>
            <TextInput
              onBlur={OnBlur}
              required={true}
              placeholder={t('Last Name')}
              name='lastName'
              onChange={formik.handleChange}
              label={t('Last Name')}
              value={formik.values.lastName}
              error={getErrorUserMng('lastName')}
            />
          </div>
          <div>
            <TextInput
              onBlur={OnBlur}
              required={true}
              placeholder={t('Username')}
              name='userName'
              onChange={formik.handleChange}
              label={t('Username')}
              value={formik.values.userName}
              error={getErrorUserMng('userName')}
            />
          </div>
          <div>
            <TextInput
              onBlur={OnBlur}
              required={true}
              placeholder={t('Email')}
              name='email'
              onChange={formik.handleChange}
              label={t('Email')}
              value={formik.values.email}
              error={getErrorUserMng('email')}
            />
          </div>

          {!params.id && (
            <>
              <div className=' relative'>
                <TextInput
                  onBlur={OnBlur}
                  required={true}
                  placeholder={t('Password')}
                  name='password'
                  onChange={formik.handleChange}
                  label={t('Password')}
                  value={formik.values.password}
                  error={getErrorUserMng('password')}
                  type={showPassword ? 'text' : 'password'}
                />
                <button
                  type='button'
                  className='absolute right-2 top-2.5 mt-7'
                  onClick={() => setShowPassword(!showPassword)}
                  title=''
                >
                  <div className='mt-1'>
                    {showPassword ? <Eye /> : <EyeCrossed />}
                  </div>
                </button>
              </div>
              <div className=' relative'>
                <TextInput
                  onBlur={OnBlur}
                  required={true}
                  placeholder={t('Confirm Password')}
                  name='confirmPassword'
                  onChange={formik.handleChange}
                  label={t('Confirm Password')}
                  value={formik.values.confirmPassword}
                  error={getErrorUserMng('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                />
                <button
                  type='button'
                  className='absolute right-2 top-2.5 mt-7'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  title=''
                >
                  <div className='mt-1'>
                    {showConfirmPassword ? <Eye /> : <EyeCrossed />}
                  </div>
                </button>
              </div>
            </>
          )}

          <div>
            <TextInput
              max={currentDate}
              disabled={isFutureDate}
              required={true}
              placeholder={t('Date Of Birth')}
              name='dateOfBirth'
              onChange={formik.handleChange}
              label={t('Date Of Birth')}
              value={formik.values.dateOfBirth}
              error={getErrorUserMng('dateOfBirth')}
              type='date'
            />
          </div>
          <div>
            <TextInput
              onBlur={OnBlur}
              type='text'
              required={true}
              placeholder={t('Phone Number')}
              name='phoneNo'
              onChange={handleContactNumberChange}
              label={t('Phone Number')}
              value={formik.values.phoneNo}
              error={getErrorUserMng('phoneNo')}
            />
          </div>

          <div className='mb-4'>
            <RadioButtonNew
              required={true}
              checked={formik.values.gender}
              onChange={formik.handleChange}
              error={getErrorUserMng('gender')}
              name={'gender'}
              radioOptions={GENDER_DRP1}
              label={t('Gender')}
            />
          </div>
        </div>

        <div className='btn-group col-span-3 flex items-center py-2 px-5  justify-start bg-slate-100   border-t border-[#c8ced3]'>
          <div className='flex items-start justify-start col-span-3 btn-group  '>
            <Button
              className='btn-primary btn-normal'
              type='submit'
              label={t('Save')}
              title={`${t('Save')}`} 
            >
              <div className='mr-1'>
                <CheckCircle />
              </div>
            </Button>
            <Button
              className='btn-warning btn-normal'
              onClick={onCancelUser}
              label={t('Cancel')}
              title={`${t('Cancel')}`} 
            >
              <div className='mr-1'>
                <Cross />
              </div>
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
export default AddEditUser
