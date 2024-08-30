import React, { useCallback, useEffect } from 'react';
import TextInput from '@components/textInput/TextInput';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import useValidation from '@framework/hooks/validations';
import ReactQuill from 'react-quill';
import { TextBasedComponentProps } from 'src/types/common';

const TextBasedComponent = ({ onAddChapter, editData,disabled }: TextBasedComponentProps) => {
    const { t } = useTranslation();
    const { TextBasedValidationSchema } = useValidation();
    const modulesPlanYourCourse = {
        toolbar: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote','image'],
          [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
          ['link'],
          ['clean'],
        ],
      };
    
      const formatsPlanYourCourse = ['header', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'indent', 'link', 'image'];
    

    useEffect(() => {
        if (editData !== null) {
            formik.setValues({
                chapter_id:editData?.chapter_id??'',
                uuid: editData?.text?.uuid??'',
                chapterName: editData?.title,
                text: editData?.text?.description as string
            })
        }
    }, [editData])

    const initialValues = {
        chapter_id:'',
        uuid: '',
        chapterName: '',
        text: '',
    }

    const formik = useFormik({
        initialValues,
        validationSchema: TextBasedValidationSchema,
        onSubmit(values) {
            onAddChapter(values);
            formik.resetForm();
        }
    });

    const onBlurTextBased = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        formik.setFieldValue(e.target.name, e.target.value.trim());
    }, []);

    const setCkeditorValue = useCallback((e:ReactQuill.UnprivilegedEditor) => {
        const htmlValue = e.getContents()?.ops?.[0]?.insert || '';
        formik.setFieldTouched('text',true);
        if (htmlValue === '') {
          formik.setFieldValue('text','',true);
        } else {
          formik.setFieldValue('text',e.getHTML(),true);
        }
      },[formik.values.text]);

    const handleBlurtext = useCallback((e:ReactQuill.UnprivilegedEditor) => {
        const currentDescription = e.getContents().ops?.[0]?.insert;
        if (currentDescription === '') {
          formik.setFieldValue('text','',true);
        } else {
          formik.setFieldValue('text',e.getHTML(),true);
        }
      }, [formik.values.text]);

    return <div className='p-3 md:p-5 overflow-hidden border border-solid mb-5 md:mb-7.5 border-border-primary rounded-xl'>
        <form onSubmit={formik.handleSubmit}>
            <div className="w-full mb-3 md:mb-5">
                <TextInput
                    placeholder={t('Enter Chapter Name')}
                    name='chapterName'
                    type="text"
                    label={t('Chapter Name')}
                    onChange={formik.handleChange}
                    required={true}
                    value={formik?.values?.chapterName}
                    onBlur={onBlurTextBased}
                    disabled={disabled}
                    error={formik?.errors?.chapterName&&formik?.touched?.chapterName?formik?.errors?.chapterName:''}
                />
            </div>
            <h5 className="mb-3 md:mb-5 text-base md:text-lg">{editData !== null ? 'Update Media' : 'Add Media'}</h5>
            <div className='w-full 3xl:max-w-[991px]  mb-3 md:mb-5 course-editor'>

                  <div className="card">
                    <ReactQuill
                      value={formik.values.text}
                      modules={modulesPlanYourCourse}
                      formats={formatsPlanYourCourse}
                      onBlur={(_,_a,e:ReactQuill.UnprivilegedEditor)=>handleBlurtext(e)}
                      onChange={(_,_a,_b,e:ReactQuill.UnprivilegedEditor)=>setCkeditorValue(e)}
                    />
                  </div>
                               
                {(formik?.errors?.text&&formik?.touched?.text)&&<p className='error'>{formik?.errors?.text}</p>}
            </div>
            <button className='btn btn-primary btn-normal w-full md:w-[160px] my-2 mx-3'  type='submit' title={`${editData!==null ?'update Chapter':'Add Chapter'}`} disabled={disabled} >
            {t(`${editData!==null ?'update Chapter':'Add Chapter'}`)}
            </button>
        </form>

    </div>;

}

export default TextBasedComponent;