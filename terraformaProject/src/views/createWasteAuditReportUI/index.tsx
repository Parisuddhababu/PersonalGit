import React, { useCallback, useEffect, useRef, useState } from 'react'
import UpdatedHeader from '@components/header/updatedHeader'
import { useTranslation } from 'react-i18next';
import { DropdownArrowDown, FileUpload, Trash } from '@components/icons/icons';
import TextInput from '@components/textInput/TextInput';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useFormik } from 'formik';
import DropDown from '@components/dropdown/dropDown';
import { DropdownOptionType } from '@types';
import { useMutation, useQuery } from '@apollo/client';
import { GET_USER_LOCATION } from '@framework/graphql/queries/createEmployeeLocation';
import { API_MEDIA_END_POINT, AXIOS_HEADERS, DELETE_WARNING_TEXT, MAX_FILE_SIZE } from '@config/constant';
import { toast } from 'react-toastify';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Button from '@components/button/button';
import CommonModel from '@components/common/commonModel';
import { CREATE_WASTE_AUDIT_REPORT } from '@framework/graphql/mutations/wasteAuditReport';
import moment from 'moment';
import useValidation from '@framework/hooks/validations';

interface ToggleData {
    addHighlights: boolean;
    uploadWasteAuditReport: boolean;
    basicDetails: boolean;
}

function Index() {
    const { t } = useTranslation();
	const { createWasteAuditSchema } = useValidation();
    const [stateDrpData, setStateDrpData] = useState<DropdownOptionType[]>([]);
    const [isDelete, setIsDelete] = useState<boolean>(false);
    const searchParams = new URLSearchParams(window.location.search);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const companyUUID = searchParams.get('company_uuid');
    const [createWasteAuditReport] = useMutation(CREATE_WASTE_AUDIT_REPORT)
    const { data: subscriberLocation } = useQuery(GET_USER_LOCATION, { variables: { companyId: companyUUID ?? '' } });
    const [loading,setLoading] = useState(false);
    const initialValues = {
        attachment: null,
        branch_id: '',
        date: new Date(),
        highlight_1: '',
        highlight_2: '',
        highlight_3: '',
        performance_capture_rate: '',
        performance_current: '',
        performance_potential: '',
        title: '',
        fileName: '',
    }

    const formik = useFormik({
        initialValues,
        validationSchema: createWasteAuditSchema,
        onSubmit: async (values) => {
            setLoading(true);
            const formData = new FormData();
                
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formData.append('file', values?.attachment as any);

            // Attempt to upload the attachment
            await axios.post(`${API_MEDIA_END_POINT}/attachment/wastAuditReport`, formData, { headers: AXIOS_HEADERS })
                .then(async (response) => {                    
                    await createWasteAuditReport({
                        variables: {
                            wasteAuditData: {
                                attachment: response?.data?.data?.key,
                                branch_id: values?.branch_id,
                                date: moment(values?.date).format('MM/YYYY'),
                                highlight_1: values?.highlight_1,
                                highlight_2: values?.highlight_2,
                                highlight_3: values?.highlight_3,
                                performance_capture_rate: values?.performance_capture_rate?.toString(),
                                performance_current: values?.performance_current?.toString(),
                                performance_potential: values?.performance_potential?.toString(),
                                title: values?.title
                            }
                        }
                    }).then((res) => {
                        const data = res.data.createWasteAuditReport
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
                    setLoading(false);
                    toast.error(err?.message);
                });            
        },
    })

    useEffect(() => {
        if (subscriberLocation?.getUserLocation) {
            const tempDataArr = [] as DropdownOptionType[];
            tempDataArr.push({ name: subscriberLocation?.getUserLocation?.data?.branch?.location, key: subscriberLocation?.getUserLocation?.data?.branch?.uuid });
            setStateDrpData(tempDataArr);
        }
    }, [subscriberLocation]);

    const [toggleData, setToggleData] = useState<ToggleData>({
        addHighlights: true,
        uploadWasteAuditReport: true,
        basicDetails: true,
    });

    const handleTextInputClick = () => {
        fileInputRef?.current?.click();
    };

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
                formik.setFieldValue('fileName', validFiles?.[0]?.name);
                formik.setFieldValue('attachment', validFiles?.[0]);
            } else {
                formik.setFieldError('attachments', 'Invalid file type Please enter valid attachment');
            }
        }
    };

    const onDelete = useCallback(() => {
        setIsDelete(true);
    }, []);

    const onClose = useCallback(() => {
        setIsDelete(false);
    }, [])

    const onRemove = useCallback(() => {
        const data = { fileName: formik.values.attachment };
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
    }, [formik.values.attachment])

    const onUpload = useCallback(() => {
        setToggleData({
            addHighlights: true,
            uploadWasteAuditReport: true,
            basicDetails: true,
        })
        formik.handleSubmit()
    }, [])

    const currentDate = new Date(); // Get the current date 

    return (
        <>
            <UpdatedHeader headerTitle='Create Waste Audit Reports' />
            <div>
                <div className='mb-5 overflow-hidden border border-solid border-border-primary rounded-xl md:mb-7'>
                    <button className='flex flex-wrap justify-between gap-3 p-3 cursor-pointer md:p-5 w-full bg-accents-2' onClick={() => setToggleData((prevState) => ({ ...prevState, basicDetails: !toggleData.basicDetails }))}>
                        <h6 className='leading-[30px]'>{t('Basic Details')}</h6>
                        <span className={`flex items-center justify-center ${toggleData.basicDetails && 'rotate-180'}`}><DropdownArrowDown /></span>
                    </button>
                    <div className={`${!toggleData.basicDetails ? 'h-0' : 'flex flex-wrap gap-3 p-3 border-t border-solid lg:gap-5 md:p-5 border-border-primary'}`}>
                        <div className='inline-block w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-13px)]'>
                            <TextInput placeholder={t('Add Title')} required={true} label={t('Title')} name='title' id='title' onChange={formik.handleChange} value={formik?.values.title} error={formik.errors.title && formik.touched.title ? formik.errors.title : ''} type='text' />
                        </div>
                        <div className='inline-block w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-13px)]'>
                            <label>
                                Select Date<span className='text-error'> *</span>
                            </label>
                            <DatePicker
                                selected={formik.values.date}
                                onChange={(date: Date | null) => formik.setFieldValue('date', date)}
                                dateFormat="MM/yyyy"
                                showMonthYearPicker
                                placeholderText="MM/YYYY"
                                className='customInput'
                                maxDate={currentDate} // Set maxDate to current date to block future months
                            />
                            {formik.errors.date && formik.touched.date ? <p className='error'>{formik.errors.date as string}</p> : ''}
                        </div>
                        <div className='inline-block w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-13px)]'>
                            <DropDown placeholder={t('Select Location')} className='w-full' label={t('Location')} inputIcon={<span className='text-xs'><DropdownArrowDown className='fill-dark-grey' /></span>} onChange={formik.handleChange} value={formik.values.branch_id} options={stateDrpData} name='branch_id' id='branch_id' error={formik.errors.branch_id && formik.touched.branch_id ? formik.errors.branch_id : ''} required={true} />
                        </div>
                    </div>
                </div>
                <div className='mb-5 overflow-hidden border border-solid border-border-primary rounded-xl md:mb-7'>
                    <button className='flex flex-wrap justify-between gap-3 p-3 w-full cursor-pointer md:p-5 bg-accents-2' onClick={() => setToggleData((prevState) => ({ ...prevState, addHighlights: !toggleData.addHighlights }))}>
                        <h6 className='leading-[30px]'>{t('Add Highlights')}</h6>
                        <span className={`flex items-center justify-center ${toggleData.addHighlights && 'rotate-180'}`}><DropdownArrowDown /></span>
                    </button>
                    <div className={`${!toggleData.addHighlights ? 'h-0' : 'border-t border-solid border-border-primary'}`}>
                        <div className="p-3 md:p-5">
                            <strong className='leading-5'>Top Three Recyclable Materials in the Garbage</strong>

                            <div className='flex flex-wrap gap-3 lg:gap-5 pt-3 md:pt-5 pb-2.5  w-full lg:w-2/3'>
                                <div className='inline-block w-full'>
                                    <TextInput placeholder={t('Add Highlight No.1')} required={true} label={t('Highlight No.1')} name='highlight_1' id='highlight_1' onChange={formik.handleChange} value={formik?.values.highlight_1} error={formik.errors.highlight_1 && formik.touched.highlight_1 && formik.errors.highlight_1} type='text' />
                                </div>

                                <div className='inline-block w-full'>
                                    <TextInput placeholder={t('Add Highlight No.2')} required={true} label={t('Highlight No.2')} name='highlight_2' id='highlight_2' onChange={formik.handleChange} value={formik?.values.highlight_2} error={formik.errors.highlight_2 && formik.touched.highlight_2 && formik.errors.highlight_2} type='text' />
                                </div>

                                <div className='inline-block w-full'>
                                    <TextInput placeholder={t('Add Highlight No.3')} required={true} label={t('Highlight No.3')} name='highlight_3' id='highlight_3' onChange={formik.handleChange} value={formik?.values.highlight_3} error={formik.errors.highlight_3 && formik.touched.highlight_3 && formik.errors.highlight_3} type='text' />
                                </div>
                            </div>
                        </div>

                        <div className="pt-5 md:pt-[30px] px-3 md:px-5 pb-3 md:pb-5 border-t border-solid border-border-primary">
                            <strong>Waste Diversion Performance</strong>

                            <div className='flex flex-wrap gap-3 lg:gap-5 pt-3 md:pt-5 md:pb-2.5'>
                                <div className='inline-block w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-13px)]'>
                                    <TextInput placeholder={t('Add Current')} required={true} label={t('Current')} inputIcon={'%'} name='performance_current' id='performance_current' onChange={formik.handleChange} value={formik?.values.performance_current} error={formik.errors.performance_current && formik.touched.performance_current && formik.errors.performance_current} type='number' />
                                </div>

                                <div className='inline-block w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-13px)]'>
                                    <TextInput placeholder={t('Add Potential')} required={true} label={t('Potential')} inputIcon={'%'} name='performance_potential' id='performance_potential' onChange={formik.handleChange} value={formik?.values.performance_potential} error={formik.errors.performance_potential && formik.touched.performance_potential && formik.errors.performance_potential} type='number' />
                                </div>

                                <div className='inline-block w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-13px)]'>
                                    <TextInput placeholder={t('Add Capture Rate')} required={true} label={t('Capture Rate')} inputIcon={'%'} name='performance_capture_rate' id='performance_capture_rate' onChange={formik.handleChange} value={formik?.values.performance_capture_rate} error={formik.errors.performance_capture_rate && formik.touched.performance_capture_rate && formik.errors.performance_capture_rate} type='number' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='mb-5 overflow-hidden border border-solid border-border-primary rounded-xl md:mb-7'>
                    <button className='flex w-full flex-wrap justify-between gap-3 p-3 cursor-pointer md:p-5 bg-accents-2' onClick={() => setToggleData((prevState) => ({ ...prevState, uploadWasteAuditReport: !toggleData.uploadWasteAuditReport }))}>
                        <h6>{t('Add Highlights')}</h6>
                        <span className={`flex items-center justify-center ${toggleData.uploadWasteAuditReport && 'rotate-180'}`}><DropdownArrowDown /></span>
                    </button>
                    <div className={`${!toggleData.uploadWasteAuditReport ? 'h-0' : 'border-t border-solid border-border-primary'}`}>
                        <div className="p-3 md:p-5">
                            <div className='flex flex-wrap gap-3 md:gap-5 pb-3 md:pb-5 md:pt-2.5  w-full'>
                                <div className='inline-block w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-13px)]'>
                                    <p className='mb-1'>Upload Attachment</p>
                                    <label htmlFor="attachment">
                                        <button onClick={handleTextInputClick} className='w-full' type='button'>
                                            <input
                                                id="attachment"
                                                type="file"
                                                name="attachment"
                                                multiple
                                                className="focus:bg-transparent hidden"
                                                accept=".pdf"
                                                onChange={(e) => handleFileEvent(e)}
                                                ref={fileInputRef}
                                                style={{ display: 'none' }}
                                                key={uuidv4()}
                                            />                                        
                                            <TextInput
                                                className='pointer-events-none'
                                                placeholder={t(formik?.values?.fileName ? formik?.values?.fileName : 'Upload Waste Audit Report')}
                                                required={true}
                                                name="fileName"
                                                id="fileName"
                                                type="text"
                                                inputIcon={<FileUpload fontSize="22" />}
                                                value={formik?.values.fileName} 
                                                error={formik.errors.attachment && formik.touched.attachment && formik.errors.attachment} 
                                            />
                                        </button>
                                    </label>
                                </div>
                            </div>
                            <div className='w-full mb-3 overflow-auto bg-white border sm:w-auto rounded-t-xl custom-dataTable border-border-primary'>
                                <table>
                                    <thead>
                                        <tr>
                                            <th scope='col' className='min-w-[400px] xl:min-w-[778px]'>
                                                <div className='flex items-center'>{t('File Name')}</div>
                                            </th>
                                            {formik?.values?.fileName && <th scope='col' className='min-w-[150px] xl:min-w-[200px]'>
                                                <div className='flex items-center justify-center'>{t('Action')}</div>
                                            </th>}
                                        </tr>
                                    </thead>
                                    <tbody className='border border-solid border-border-primary text-baseColor'>
                                        <tr className='h-[60px]'>
                                            {formik?.values?.fileName ? <td className='text-left'>
                                                {formik?.values?.fileName}
                                            </td> : <td className='text-left'>
                                                Upload Waste Audit Report
                                            </td>}
                                            {formik?.values?.fileName && <td className='text-center'>
                                                <div className="flex gap-10 justify-center">
                                                    <Button className='bg-transparent cursor-pointer btn-default' onClick={onDelete} label={''}>
                                                        <Trash className='fill-error' />
                                                    </Button>
                                                </div>
                                            </td>}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-wrap justify-end max-md:space-y-3 md:space-x-7'>
                {/* !formik?.values?.fileName || */}
                    <Button className='w-full btn btn-primary md:w-[120px] whitespace-nowrap' type='button' label={'Upload'} onClick={() => onUpload()} disabled={loading} title={`${t('Upload')}`}/>
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
