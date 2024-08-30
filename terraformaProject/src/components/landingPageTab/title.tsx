import React, { useEffect } from 'react'
import Button from '@components/button/button';
import { useTranslation } from 'react-i18next';
import TextInput from '@components/textInput/TextInput';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_SUBTITLE, UPDATE_TITLE } from '@framework/graphql/mutations/titlePage';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { GET_SUBTITLE_WEBSITE, GET_TITLE_WEBSITE } from '@framework/graphql/queries/titlePage';
import useValidation from '@framework/hooks/validations';

function TitlePage() {
    const { t } = useTranslation();
	const [changeTitle] = useMutation(UPDATE_TITLE);
    const [changeSubTitle] = useMutation(UPDATE_SUBTITLE);
    const { data , refetch } = useQuery(GET_TITLE_WEBSITE);
    const { data:subtitleData , refetch:subtitleRefetch } = useQuery(GET_SUBTITLE_WEBSITE)
    const { changeTitleSubTitle } = useValidation();
    const initialValues = {
		title: '',
        subtitle:''
	};
    const formik = useFormik({
        validationSchema: changeTitleSubTitle,
		initialValues,
		onSubmit: async (values) => {
			if(data?.getTitleForWebsite?.data){
                changeTitle({
                    variables: {
                        inputData: {
                            title: values?.title,
                        }
                    },
                })
                    .then((response) => {
                        toast.success(response?.data?.updateTitleForWebsite?.message);
                        formik.resetForm()
                        refetch()
                    })
                    .catch((error) => {
                        toast.error(error.networkError.result.errors[0].message);
                    });
            }
            if(subtitleData?.getSubtitleForWebsite?.data)
            {
                changeSubTitle({
                    variables: {
                        inputData: {
                            title: values?.subtitle,
                        }
                    },
                })
                    .then((response) => {
                        toast.success(response?.data?.updateTitleForWebsite?.message);
                        formik.resetForm()
                        subtitleRefetch()
                    })
                    .catch((error) => {
                        toast.error(error.networkError.result.errors[0].message);
                    });
            }
      
		},
	});

    useEffect(() => {
		if (data?.getTitleForWebsite?.data && subtitleData?.getSubtitleForWebsite?.data) {
			const userTitle = data?.getTitleForWebsite?.data;
            const userSubTitle = subtitleData?.getSubtitleForWebsite?.data
 			formik.resetForm({
				values: {
					title: userTitle?.title,
                    subtitle:userSubTitle?.title
				}
			});
		}
	}, [data]);


    return (
        <div className='flex flex-col h-full px-5 py-2'>
            <div className='flex flex-wrap mb-5 gap-x-5 gap-y-3'>
                <div className='w-full 2lg:w-[calc(50%-10px)] 2xl:w-[calc(33.3%-13px)]'>
                    <TextInput placeholder={t('Enter Title')} label={'Title'} required={true} id='title' name='title' value={formik.values.title} onChange={formik.handleChange} error={formik.errors.title}/>
                </div>
                <div className='w-full 2lg:w-[calc(50%-10px)] 2xl:w-[calc(33.3%-13px)]'>
                    <TextInput placeholder={t('Enter Sub Title')} label={'Sub Title'} required={true} id='subtitle' name='subtitle' value={formik.values.subtitle} onChange={formik.handleChange} error={formik.errors.subtitle} />
                </div>
            </div>
            <div className='flex py-5 mt-auto'>
                <Button
                    className='w-full ml-auto btn btn-primary whitespace-nowrap md:w-[140px]'
                    type='button'
                    label={t('Submit')}
                    onClick={formik.handleSubmit}
                    title={`${t('Submit')}`}
                />
            </div>
        </div>
    )
}

export default TitlePage;
