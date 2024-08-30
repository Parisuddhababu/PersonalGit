/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react'
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useMutation, useQuery } from '@apollo/client';
import Button from '@components/button/button';
import TextInput from '@components/textInput/TextInput';
import useValidation from '@framework/hooks/validations';
import { LIST_TAG } from '@framework/graphql/queries/tag';
import { UPDATE_TAG } from '@framework/graphql/mutations/tag';
interface Type {
  title: string;
  description: string;
  type: string;
  uuid: string;
  image?: string | null;
  __typename?: string;
}

function Tag() {
  const { t } = useTranslation();
  const { data, refetch } = useQuery(LIST_TAG);
  const [changeServices] = useMutation(UPDATE_TAG);
  const { tagValidationSchema } = useValidation();
  const initialValues: { type: Type[] } = {
    type: [
      {
        title: '',
        description: '',
        type: '',
        uuid: '',
        image: ''
      },
    ],
  };

  useEffect(() => {
    if (data?.getTags?.data?.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const cleanedServices: Type[] = data?.getTags?.data.map(({ __typename, ...rest }: Type) => rest);
      formik.setFieldValue('type', cleanedServices);
    }
  }, [data]);

  const formik = useFormik({
    validationSchema: tagValidationSchema,
    initialValues,
    onSubmit: async (values) => {
      const apiPromises = values.type.map((service) => {
        service.image = 'null';
        return changeServices({
          variables: {
            tagData: {
              updateTags: service
            }
          },
        });
      });
      try {
        const responses = await Promise.all(apiPromises);
        toast.success(responses[0]?.data?.updateTag?.message);
        refetch();
      } catch (error: any) {
        toast.error(error?.networkError?.result?.errors[0]?.message);
      }
    },
  });


  const serviceErrors = formik?.errors?.type as any[];

  return (
    <div className='px-5 pt-2 pb-5'>
      {formik?.values?.type?.map((serviceData: { type: string, title: string, description: string, uuid: string }, index: number) => (
        <div key={serviceData?.uuid} className='mb-5'>
          <h4 className='mb-5'>{t(`Tag ${index + 1}`)}:</h4>
          <div className='flex flex-wrap gap-x-5 gap-y-3'>

            <div className='w-full 2lg:w-[calc(50%-10px)] 2xl:w-[calc(33.3%-13px)]'>
              <TextInput
                placeholder={t('Enter Title')}
                label={'Title'}
                required={true}
                name={`type[${index}].title`}
                id={`title-${index}`}
                onChange={formik.handleChange}
                value={serviceData.title}
                error={serviceErrors?.[index]?.title && formik.touched.type?.[index]?.title ? serviceErrors?.[index]?.title : ''}
              />
            </div>
            <div className='w-full 2xl:w-[calc(33.3%-13px)]'>
              <TextInput
                placeholder={t('Enter Description')}
                label={'Description'}
                required={true}
                name={`type[${index}].description`}
                id={`description-${index}`}
                onChange={formik.handleChange}
                value={serviceData.description}
                error={serviceErrors?.[index]?.description && formik.touched.type?.[index]?.description ? serviceErrors?.[index]?.description : ''}
              />
            </div>
            <div className='w-full 2xl:w-[calc(33.3%-13px)]'>
              <TextInput
                placeholder={t('Enter Type')}
                label={'Type'}
                required={true}
                name={`type[${index}].type`}
                id={`type-${index}`}
                onChange={formik.handleChange}
                value={serviceData.type}
                error={serviceErrors?.[index]?.type && formik.touched.type?.[index]?.type ? serviceErrors?.[index]?.type : ''}
              />
            </div>
          </div>
        </div>
      ))}

      <div className='flex'>
        <Button
          className='w-full ml-auto btn btn-primary whitespace-nowrap md:w-[140px]'
          type='button'
          label={t('Submit')}
          onClick={() => formik.handleSubmit()}
          title={`${t('Submit')}`}
        />
      </div>


    </div>
  );
}

export default Tag;
