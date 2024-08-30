import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { STATUS_RADIO } from '@config/constant'
import Button from '@components/button/button'
import TextInput from '@components/textInput/TextInput'
import { Cross } from '@components/icons/icons'
import RadioButtonNew from '@components/radiobutton/radioButtonNew'
import { GET_CATEGORY_BY_ID } from '@framework/graphql/queries/category'
import { CREATE_CATEGORY, UPDATE_CATEGORY } from '@framework/graphql/mutations/category'
import useValidation from '@framework/hooks/validations'
import { whiteSpaceRemover } from '@utils/helpers'

import { useQuery, useMutation } from '@apollo/client'
import { useFormik } from 'formik'
import UpdatedHeader from '@components/header/updatedHeader'

const AddEditCategory = () => {
  const { t } = useTranslation()
  const params = useParams()
  const { data: categoryByIdData, refetch } = useQuery(GET_CATEGORY_BY_ID, { variables: { categoryId: params.id }, skip: !params.id })
  const [createCategory, loading] = useMutation(CREATE_CATEGORY)
  const [updateCategory, updateLoading] = useMutation(UPDATE_CATEGORY)
  const [isRoleModelShow, setIsRoleModelShow] = useState<boolean>(false)
  const [addClass, setAddClass] = useState<boolean>(false);
  const [isEditCategory, setIsEditCategory] = useState<boolean>(false);
  const navigate = useNavigate()
  const { addManageCategoryValidationSchema } = useValidation()

  const initialValues = {
    categoryName: '',
    description: '',
    status: '1',
  }

  useEffect(() => {
    setIsRoleModelShow(true);
    setAddClass(true);
    if (params.id) {
      setIsEditCategory(true);
    }
  }, [])

  /**
   * Method used for get faq api with id
   */
  useEffect(() => {
    if (params.id) {
      refetch({ categoryId: params.id }).catch((e) =>
        toast.error(e)
      )
    }
  }, [params.id])

  /**
   * Method used for set value from data by id
  */
  useEffect(() => {
    if (categoryByIdData && params.id) {
      const data = categoryByIdData?.getCategoryById?.data
      formik
        .setValues({
          categoryName: data?.name,
          description: data?.description,
          status: data?.status,
        })
        .catch((e) => toast.error(e))
    }
  }, [categoryByIdData])

  const formik = useFormik({
    initialValues,
    validationSchema: addManageCategoryValidationSchema,
    onSubmit: (values) => {
      const commonValues = {
        categoryName: values.categoryName,
        description: values.description,
        status: parseInt(values.status)
      }
      if (params.id) {
        updateCategory({
          variables: {
            categoryData: {
              id: params.id,
              description: commonValues.description,
              image_url: '',
              name: commonValues.categoryName,
              status: commonValues.status
            }
          },
        })
          .then((res) => {
            const data = res.data
            toast.success(data?.updateCategory?.message)
            formik.resetForm()
            onCancelCategory()
          })
          .catch((err) => {
            toast.error(err.networkError.result.errors[0].message)
          })
      } else {
        createCategory({
          variables: {
            categoryData: {
              description: commonValues.description,
              image_url: '',
              name: commonValues.categoryName,
              status: commonValues.status
            }
          },
        })
          .then((res) => {
            const data = res.data
            toast.success(data.createCategory.message)
            formik.resetForm()
            onCancelCategory()
          })
          .catch((err) => {
            toast.error(err.networkError.result.errors[0].message)
          })
      }
    },
  })

  const onCancelCategory = useCallback(() => {
    navigate(-1);
  }, [])

  const OnBlurCategory = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
  }, []);

  return (
    <>
      <UpdatedHeader headerTitle='Tag' />
      {isRoleModelShow && (
        <div id='defaultModal' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`fixed top-0 left-0 right-0 z-50 h-full bg-modal modal ${isRoleModelShow ? '' : 'hidden'}`}>
          <div id='changeUserStatusModel' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`py-5 flex items-center justify-center h-full ${addClass ? '' : 'opacity-0 transform -translate-y-full scale-150 '} transition-all duration-300 `}>
            <div className='w-full mx-5 sm:max-w-[780px]'>
              {/* <!-- Modal content --> */}
              <div className='relative bg-white rounded-xl'>
                {/* <!-- Modal header --> */}
                <div className='flex items-center justify-between px-5 py-4 border-b md:py-6 bg-accents-2 rounded-t-xl'>
                  <p className='text-lg font-bold md:text-xl text-baseColor'>{isEditCategory ? 'Update Tag' : 'Add Tag'}</p>
                  <Button onClick={onCancelCategory} label={t('')} title={`${t('Close')}`}  >
                    <span className='text-xl-22'><Cross className='text-error' /></span>
                  </Button>
                </div>
                {/* <!-- Modal body --> */}
                <div className='w-full'>
                  <form onSubmit={formik.handleSubmit}>
                    <div className='p-5 max-h-[calc(100vh-260px)] overflow-auto'>
                      <div className='mb-2 text-right'>
                        {t('Fields marked with')} <span className='text-red-500'>*</span> {t('are mandatory.')}
                      </div>
                      <div className='mb-4'>
                        <TextInput placeholder={t('Tag Name')} required={true} name='categoryName' onChange={formik.handleChange} label={t('Tag Name')} value={formik.values.categoryName} error={formik.errors.categoryName && formik.touched.categoryName ? formik.errors.categoryName : ''} onBlur={OnBlurCategory} />
                      </div>
                      <div className='mb-4'>
                        <TextInput placeholder={t('Tag Description')} required={true} name='description' onChange={formik.handleChange} label={t('Tag Description')} value={formik.values.description} error={formik.errors.description && formik.touched.description ? formik.errors.description : ''} />
                      </div>
                      <div>
                        <RadioButtonNew required={true} checked={formik.values.status} onChange={formik.handleChange} name={'status'} radioOptions={STATUS_RADIO} label={t('Status')} />
                      </div>
                    </div>
                    <div className='flex flex-col items-center justify-end p-5 border-t border-solid md:space-x-3 md:flex-row border-border-primary'>
                      <Button className='btn-primary btn-normal mb-2 md:mb-0 w-full md:w-auto min-w-[160px]' type='submit' label={params.id ? t('Update') : t('Save')} disabled={(loading?.loading) || (updateLoading?.loading)}  title={`${params.id ? t('Update') : t('Save')} disabled={(loading?.loading) || (updateLoading?.loading)}`} />
                      <Button className='btn-secondary btn-normal w-full md:w-auto min-w-[160px]' label={t('Cancel')} onClick={onCancelCategory}  title={`${t('Cancel')}`} />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AddEditCategory
