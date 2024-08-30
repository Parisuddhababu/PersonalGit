import { FileUpload } from '@components/icons/icons'
import TextInput from '@components/textInput/TextInput'
import { API_MEDIA_END_POINT, AXIOS_HEADERS, MAX_PDF_CHAPTER_SIZE } from '@config/constant'
import useValidation from '@framework/hooks/validations'
import axios from 'axios'
import { useFormik } from 'formik'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { PdfComponentProps } from 'src/types/common'

const PdfDocumentComponent = ({ onAddChapter, editData, disabled }: PdfComponentProps) => {
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { PDFTypeValidationSchema } = useValidation();
    const [fileLoading, setFileLoading] = useState<boolean>(false);
    useEffect(() => {
        if (editData !== null) {
            formik.setValues({
                uuid: editData?.pdf?.uuid ?? '',
                fileName: editData?.pdf?.url?.split('/')?.pop() as string,
                chapterName: editData?.title,
                attachments: editData?.pdf?.url as string
            })
        }
    }, [editData])

    const initialValues = {
        uuid: '',
        chapterName: '',
        fileName: '',
        attachments: ''
    }
    const formik = useFormik({
        initialValues,
        validationSchema: PDFTypeValidationSchema,
        onSubmit(values) {
            onAddChapter(values);
            formik.resetForm({
                values: {
                    uuid: '',
                    chapterName: '',
                    fileName: '',
                    attachments: ''
                }
            });
        }
    });
    const handleFileEvent = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setFileLoading(true);
        const files = event.currentTarget.files;
        if (files) {
            const allowedExtensions = ['pdf'];
            const maxFileSize = MAX_PDF_CHAPTER_SIZE
            const selectedFiles = Array.from(files);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const validFiles = selectedFiles.filter((file: any) => {
                const extension = file.name.split('.').pop()?.toLowerCase();
                const fileSize = file.size;
                if (!allowedExtensions.includes(extension)) {
                    toast.error(`Invalid file type: ${file.name}`);
                    return false;
                }
                if (fileSize > maxFileSize) {
                    toast.error('Please make sure your file is must be less than 25MB.');
                    return false;
                }
                return true;
            });
            if (validFiles.length > 0) {
                const formData = new FormData();
                formik.setFieldValue('fileName', validFiles?.[0]?.name);
                formData.append('file', validFiles[0]);
                // Attempt to upload the attachment
                axios.post(`${API_MEDIA_END_POINT}/attachment/course`, formData, { headers: AXIOS_HEADERS })
                    .then((response) => {
                        formik.setFieldValue('attachments', response?.data?.data?.key);
                        setFileLoading(false);
                    })
                    .catch((err) => {
                        toast.error(err?.message);
                        setFileLoading(false);
                    });

            } else {
                setFileLoading(false);
                formik.setFieldError('attachments', 'Invalid file type Please enter valid attachment');
            }
        }else{
            setFileLoading(false);
        }
    }, [formik]);
    const handleTextInputClick = () => {
        fileInputRef?.current?.click();
    };
    const onBlurPdfDoc = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        formik.setFieldValue(e.target.name, e.target.value.trim());
    }, []);

    return <>


        <div className='p-3 md:p-5 overflow-hidden border border-solid mb-5 md:mb-7.5 border-border-primary rounded-xl'>

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
                        onBlur={onBlurPdfDoc}
                        value={formik?.values?.chapterName}
                        disabled={disabled}
                        error={(formik?.errors?.chapterName && formik?.touched?.chapterName) ? formik?.errors?.chapterName : ''}
                    />
                </div>
                <h5 className="mb-3 md:mb-5 text-base md:text-lg">{editData !== null ? 'Update Document' : 'Add Document'}</h5>
                {fileLoading &&
                    <div className='relative flex w-full items-center'>

                        <div className='w-12 h-12 mx-auto rounded-[50%] border-solid border-4 border-[#E8E8EA] border-r-[#2575d6] animate-spin absolute left-[50%] z-[9999]'></div>

                    </div>
                }
                <div className='main-invoice w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-13px)]'>
                    <label htmlFor="attachment" className={'label-invoice'}>
                        <input
                            id="attachments"
                            type="file"
                            name="attachments"
                            multiple
                            className="focus:bg-transparent hidden"
                            accept=".pdf"
                            onChange={(e) => handleFileEvent(e)}
                            ref={fileInputRef}
                            disabled={disabled || fileLoading}
                        />
                        <button onClick={handleTextInputClick} className={`w-full ${fileLoading ? 'cursor-not-allowed' : ''}`} type='button'>
                            <TextInput
                                className='pointer-events-none upload-invoice'
                                placeholder={t(formik?.values?.fileName ? formik?.values?.fileName : 'Upload Document')}
                                required={false}
                                name="fileName"
                                type="text"
                                inputIcon={<FileUpload fontSize="22" />}
                                disabled={disabled}
                            />
                        </button>
                        <p className="mt-2 text-sm"><span className='font-bold'>{t('Note: ')}</span>{t('Supported formats are .pdf Max size is 25MB')}</p>
                        {(formik?.errors?.fileName && formik?.touched?.fileName) ? <p className='mt-1 md:text-xs-15 error'>{formik?.errors?.fileName}</p> : ''}

                    </label>
                </div>

                <button className='btn btn-primary btn-normal w-full md:w-[160px] my-2 mx-3' type='submit' title={`${editData !== null ? 'update Chapter' : 'Add Chapter'}`} disabled={disabled || fileLoading} >
                    {t(`${editData !== null ? 'update Chapter' : 'Add Chapter'}`)}
                </button>
            </form>

        </div>
    </>
}

export default PdfDocumentComponent;