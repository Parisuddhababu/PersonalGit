import React, { useCallback, useEffect, useRef, useState } from 'react'
import UpdatedHeader from '@components/header/updatedHeader'
import { useTranslation } from 'react-i18next';
import Button from '@components/button/button';
import { DropdownArrowDown, FileUpload, Trash } from '@components/icons/icons';
import TextInput from '@components/textInput/TextInput';
import { ColArrType } from 'src/types/cms';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { API_MEDIA_END_POINT, AXIOS_HEADERS, DELETE_WARNING_TEXT, MAX_FILE_SIZE } from '@config/constant';
import axios from 'axios';
import DropDown from '@components/dropdown/dropDown';
import { DropdownOptionType } from '@types';
import { GET_USER_LOCATION } from '@framework/graphql/queries/createEmployeeLocation';
import { useMutation, useQuery } from '@apollo/client';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import CommonModel from '@components/common/commonModel';
import { CREATE_INVOICE } from '@framework/graphql/mutations/invoice';
import useValidation from '@framework/hooks/validations';
import { v4 as uuidv4 } from 'uuid';

interface ToggleData {
    basicDetails: boolean;
    uploadInvoice: boolean;
}

function Index() {
    const { t } = useTranslation();
    const [stateDrpData, setStateDrpData] = useState<DropdownOptionType[]>([]);
    const { createInvoiceSchema } = useValidation();
    const searchParams = new URLSearchParams(window.location.search);
    const companyUUID = searchParams.get('company_uuid');
    const { data: subscriberLocation } = useQuery(GET_USER_LOCATION, { variables: { companyId: companyUUID ?? '' } });
    const [createInvoice] = useMutation(CREATE_INVOICE)
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [toggleData, setToggleData] = useState<ToggleData>({ basicDetails: true, uploadInvoice: true });
    const [isDelete, setIsDelete] = useState<boolean>(false);
    const [loading,setLoading] = useState(false);
    const initialValues = {
        title: '',
        fileName: '',
        attachments: null,
        branchId: '',
        selectedDate: new Date(),
    }

    const formik = useFormik({
        initialValues,
        validationSchema: createInvoiceSchema,
        onSubmit: (values) => {
            setLoading(true);
            const formData = new FormData();
            // formik.setFieldValue('fileName', validFiles?.[0]?.name);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formData.append('file', values?.attachments as any);
            axios.post(`${API_MEDIA_END_POINT}/attachment/invoice`, formData, { headers: AXIOS_HEADERS })
            .then(async (response) => {
                await createInvoice({
                    variables: {
                        invoiceData: {
                            title: values?.title,
                            invoice: response?.data?.data?.key,
                            date: moment(values?.selectedDate).format('MM/YYYY'),
                            branch_id: values?.branchId,
                        }
                    }
                }).then((res) => {
                    const data = res.data.createInvoice
                    toast.success(data?.message);
                    setLoading(false);
                    formik.resetForm();
                })
                    .catch((err) => {
                        toast.error(err?.networkError?.result?.errors?.[0]?.message);
                        setLoading(false);
                    });
            })
            .catch((err) => {
                toast.error(err?.message);
                setLoading(false);
            });
            
        },
    })


    const COL_ARR_UPLOAD_INVOICE = [
        { name: t('File Name'), sortable: false, fieldName: t('file_name'), },
    ] as ColArrType[];

    const invoiceData = {
        fetchPages: {
            data: {
                count: 1,
                ContentData: [
                    {
                        fileName: formik.values.fileName,
                    },
                ]
            }
        }
    }

    useEffect(() => {
        if (subscriberLocation?.getUserLocation) {
            const tempDataArr = [] as DropdownOptionType[];
            tempDataArr.push({ name: subscriberLocation?.getUserLocation?.data?.branch?.location, key: subscriberLocation?.getUserLocation?.data?.branch?.uuid });
            setStateDrpData(tempDataArr);
        }
    }, [subscriberLocation]);

    const handleFileEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.currentTarget.files;
        if (files) {
            const allowedExtensions = ['pdf'];
            const maxFileSize = MAX_FILE_SIZE
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
                    toast.error('Please make sure your file is must be less than 5MB.');
                    return false;
                }
                return true;
            });
            if (validFiles.length > 0) {
                const formData = new FormData();
                formik.setFieldValue('fileName', validFiles?.[0]?.name);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formData.append('file', validFiles[0] as any);
                formik.setFieldValue('attachments', validFiles[0]);

            } else {
                formik.setFieldError('attachments', 'Invalid file type Please enter valid attachment');
            }
        }
    };

    const handleTextInputClick = () => {
        fileInputRef?.current?.click();
    };

    const onDelete = useCallback(() => {
        setIsDelete(true);
    }, []);

    const onClose = useCallback(() => {
        setIsDelete(false);
    }, [])

    const onRemove = useCallback(() => {
        const data = { fileName: formik.values.attachments };
        axios.delete(`${API_MEDIA_END_POINT}/remove`, { data })
            .then(() => {
                setIsDelete(false)
                formik.setFieldValue('attachments', '');
                formik.setFieldValue('fileName', '');
            })
            .catch((error) => {
                setIsDelete(false)
                toast.error(error?.response?.data?.message)
            });
    }, [formik.values.attachments])

    const onUpload = useCallback(() => {
        setToggleData({ basicDetails: true, uploadInvoice: true })
        formik.handleSubmit()
    }, [])

    const currentDate = new Date(); // Get the current date 

    return (
        <>
            <UpdatedHeader />
            <div>
                <div className='mb-5 overflow-hidden border border-solid border-border-primary rounded-xl md:mb-7'>
                    <button className='w-full flex flex-wrap justify-between gap-3 p-3 cursor-pointer md:p-5 bg-accents-2' onClick={() => setToggleData((prevState) => ({ ...prevState, basicDetails: !toggleData.basicDetails }))} title=''>
                        <h6 className='leading-[30px]'>{t('Basic Details')}</h6>
                        <span className={`flex items-center justify-center ${toggleData.basicDetails && 'rotate-180'}`}><DropdownArrowDown /></span>
                    </button>
                    <div className={`${!toggleData.basicDetails ? 'h-0' : 'flex flex-wrap gap-3 p-3 border-t border-solid lg:gap-5 md:p-5 border-border-primary'}`}>
                        <div className='inline-block w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-13px)]'>
                            <TextInput placeholder={t('Add Title')} required={true} label={t('Title')} name='title' id='title' onChange={formik.handleChange} value={formik?.values.title} error={formik.errors.title && formik.touched.title ? formik.errors.title : ''} type='text' />
                        </div>
                        <div className='inline-block w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-13px)]'>
                            <label htmlFor="select-date">
                                Select Date<span className='text-error'> *</span>
                            </label>
                            <DatePicker
                                id='select-date'
                                selected={formik.values.selectedDate}
                                onChange={(date: Date | null) => formik.setFieldValue('selectedDate', date)}
                                dateFormat="MM/yyyy"
                                showMonthYearPicker
                                placeholderText="MM/YYYY"
                                className='customInput'
                                maxDate={currentDate} // Set maxDate to current date to block future months
                            />
                            {formik.errors.selectedDate && formik.touched.selectedDate ? <p className='error'>{formik.errors.selectedDate as string}</p> : ''}
                        </div>
                        <div className='inline-block w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-13px)]'>
                            <DropDown placeholder={t('Select Location')} className='w-full' label={t('Location')} inputIcon={<span className='text-xs'><DropdownArrowDown className='fill-dark-grey' /></span>} onChange={formik.handleChange} value={formik.values.branchId} options={stateDrpData} name='branchId' id='branchId' error={formik.errors.branchId && formik.touched.branchId ? formik.errors.branchId : ''} required={true} />
                        </div>
                    </div>
                </div>
                <div className='mb-5 overflow-hidden border border-solid border-border-primary rounded-xl md:mb-7'>
                    <button className='w-full flex flex-wrap justify-between gap-3 p-3 cursor-pointer md:p-5 bg-accents-2' onClick={() => setToggleData((prevState) => ({ ...prevState, uploadInvoice: !toggleData.uploadInvoice }))} title=''>
                        <h6>{t('Upload Invoice')}</h6>
                        <span className={`flex items-center justify-center ${toggleData.uploadInvoice && 'rotate-180'}`}><DropdownArrowDown /></span>
                    </button>
                    <div className={`${!toggleData.uploadInvoice ? 'h-0' : 'border-t border-solid border-border-primary'}`}>
                        <div className="p-3 md:p-5">
                            <div className='flex flex-wrap gap-3 md:gap-5 pb-3 md:pb-5 md:pt-2.5  w-full'>
                                <div className='main-invoice inline-block w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-13px)]'>
                                    <label htmlFor="attachment" className='label-invoice'>
                                        <input
                                            id="attachments"
                                            type="file"
                                            name="attachments"
                                            multiple
                                            className="focus:bg-transparent hidden"
                                            accept=".pdf"
                                            onChange={(e) => handleFileEvent(e)}
                                            ref={fileInputRef}
                                            style={{ display: 'none' }}
                                            key={uuidv4()}
                                        />
                                        <button onClick={handleTextInputClick} className='w-full' type='button'>
                                            <TextInput
                                                className='pointer-events-none upload-invoice'
                                                placeholder={t(formik?.values?.fileName ? formik?.values?.fileName : 'Upload Invoice')}
                                                required={false}
                                                name="title"
                                                type="text"
                                                inputIcon={<FileUpload fontSize="22" />}
                                            />
                                        </button>
                                    </label>
                                </div>
                            </div>
                            <div className='w-full mb-3 overflow-auto bg-white border sm:w-auto rounded-t-xl custom-dataTable border-border-primary'>
                                <table>
                                    <thead>
                                        <tr>
                                            {COL_ARR_UPLOAD_INVOICE?.map((cmsVal: ColArrType) => {
                                                return (
                                                    <th scope='col' key={cmsVal.name} className={`${cmsVal.fieldName === 'file_name' ? 'min-w-[400px] xl:min-w-[778px]' : ''} ${cmsVal.fieldName === 'file_size' ? 'min-w-[150px] xl:min-w-[200px]' : ''} ${cmsVal.fieldName === 'status' ? 'min-w-[380px] xl:min-w-[400px]' : ''}`}>
                                                        <div className='flex items-center'>
                                                            {cmsVal.name}
                                                        </div>
                                                    </th>
                                                );
                                            })}
                                            {formik?.values?.fileName && <th scope='col'>
                                                <div className='flex items-center justify-center'>{t('Action')}</div>
                                            </th>}
                                        </tr>
                                    </thead>
                                    <tbody className='border border-solid border-border-primary text-baseColor'>
                                        {invoiceData?.fetchPages.data?.ContentData?.map((data: { fileName: string }, index: number) => {
                                            return (
                                                <tr key={`upload-invoice-page-${index + 1}`} className='h-[60px]'>
                                                    {formik?.values?.fileName ? <td className='text-left'>
                                                        {data.fileName}
                                                    </td> : <td className='text-left'>
                                                        Upload Invoice
                                                    </td>}
                                                    {formik?.values?.fileName && <td className='text-center'>
                                                        <div className="flex gap-10 justify-center">
                                                            {/* <div>
                                                                <div className=" w-[300px] xl:w-[400px] bg-gray-200 rounded-full h-1 dark:bg-gray-700">
                                                                    <div className="w-3/4 h-1 bg-blue-600 rounded-full"></div>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-sm leading-5">{data.fileSize}</span>
                                                                    <span className="text-sm font-bold leading-5">{data.status}</span>
                                                                </div>
                                                            </div> */}
                                                            <Button className='bg-transparent cursor-pointer btn-default' onClick={onDelete} label={''}  title={`${t('Delete')}`} >
                                                                <Trash className='fill-error' />
                                                            </Button>
                                                        </div>
                                                    </td>}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                {(invoiceData?.fetchPages?.data === undefined || invoiceData?.fetchPages?.data === null) && (
                                    <div className='flex justify-center'>
                                        <div>No Data</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-wrap justify-end max-md:space-y-3 md:space-x-7'>
                    <Button className='w-full btn btn-normal btn-secondary md:w-[120px] whitespace-nowrap' type='button' label={'Cancel'} 
                     title={`${t('Cancel')}`} />
                    <Button className='w-full btn btn-primary md:w-[120px] whitespace-nowrap' type='button' label={'Upload'} onClick={() => onUpload()} disabled={loading}  title={`${t('Upload')}`} />
                </div>
            </div>

            {isDelete && (
                <CommonModel
                    warningText={DELETE_WARNING_TEXT}
                    onClose={onClose}
                    action={onRemove}
                    show={isDelete}
                />
            )}
        </>
    )
}

export default Index
