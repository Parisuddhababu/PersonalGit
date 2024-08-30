import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import Button from '@components/button/button';
import { Clock, Grade, Question2 } from '@components/icons/icons';
import QuizResultComponent from '@components/quiz/quizResultComponent';
import { useSelector } from 'react-redux';
import { API_DOWNLOAD_CERTIFICATE_END_POINT, ConvertMinutesToHours, ROUTES, USER_TYPE } from '@config/constant';
import axios from 'axios';
import { toast } from 'react-toastify';
import DecryptionFunction from 'src/services/decryption';
import { useNavigate } from 'react-router-dom';
import UpdatedHeader from '@components/header/updatedHeader';
import { UserProfileType } from 'src/types/common';

type QuizResultData = {
    quizResultData: {
        data: {
            passing_mark: number;
            total_questions: number;
            user_percentage: number;
            time_taken: number;
            is_pass: boolean
            certification_generate: number;
            is_show_correct_ans: number;
        };
    },
};

function Index() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const uuid = queryParams.get('uuid');
    const encryptedToken = localStorage.getItem('authToken') as string;
    const token = encryptedToken && DecryptionFunction(encryptedToken);
    const [loading, setLoading] = useState<boolean>(false);
    const { quizResultData } = useSelector(((state: { coursesManagement: QuizResultData }) => state.coursesManagement));

    const onDownloadCertificate = useCallback(() => {
        setLoading(true);
        axios.get(`${API_DOWNLOAD_CERTIFICATE_END_POINT}/${uuid ?? ''}`, { headers: { authorization: token ? `Bearer ${token}` : '' }, responseType: 'blob' })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'certificate.pdf');
                document.body.appendChild(link);
                link.click();
                setLoading(false);
                toast.success(response?.data?.message);
            })
            .catch((error) => {
                setLoading(false);
                toast.error(error?.message);
            });
    }, []);

    const { userProfileData } = useSelector(((state: { userProfile: { userProfileData: UserProfileType } }) => state.userProfile));

    const onContinue = () => {
        const userType = userProfileData?.getProfile?.data?.user_type ?? ''
        if (userType === USER_TYPE.SUPER_ADMIN) {
            return(navigate(`/${ROUTES.app}/${ROUTES.tfsCoursesTemplates}`))
        } else {
            return (navigate(`/${ROUTES.app}/${ROUTES.dashboard}`));
        }
    };

    useEffect(() => {
        return () => {
            if (Object.keys(quizResultData)?.length === 0) {
                window.location.href = `/${ROUTES.app}/${ROUTES.allCourses}`
            }
        };
    }, [])

    const userPercentage = quizResultData?.data?.user_percentage;
    const formattedResult = typeof userPercentage === 'number' ? userPercentage.toFixed(2) : userPercentage;

    return (
        <>
            <UpdatedHeader headerTitle='Quiz Result' />
            <div className='flex flex-wrap xl:flex-nowrap h-[calc(100%-141px)] gap-7'>
                <div className='flex flex-col overflow-hidden border border-solid rounded-lg border-border-primary w-full xl:w-[76%]'>
                    <div className='h-full my-2 overflow-auto'>
                        <QuizResultComponent />
                    </div>
                </div>
                <div className='md:py-3 overflow-hidden md:border md:border-solid md:rounded-lg md:border-border-primary md:bg-accents-2 xl:min-w-[300px] w-full xl:w-[24%]'>
                    <div className='flex flex-col h-full md:px-5 md:my-2 md:overflow-auto'>
                        <div className='flex flex-wrap gap-3 mb-5 xl xl:flex-col md:gap-5'>
                            <div className='flex items-center p-5 bg-accents-3 rounded-xl h-[80px] md:h-[95px] w-full lg:w-[calc(50%-10px)] xl:w-full'>
                                <span className='mr-5 text-xl-35 md:text-xl-40'><Grade className='fill-white' /></span>
                                <div className='pl-5 text-white border-l border-solid border-border-primary'>
                                    <span className='font-bold'>Score</span>
                                    <p className='font-bold leading-7 text-xl-28 md:text-3xl'>{formattedResult}</p>
                                </div>
                            </div>
                            <div className='flex items-center p-5 bg-orange rounded-xl h-[80px] md:h-[95px] w-full lg:w-[calc(50%-10px)] xl:w-full'>
                                <span className='mr-5 text-xl-35 md:text-xl-40'><Question2 className='fill-white' /></span>
                                <div className='pl-5 text-white border-l border-solid border-border-primary'>
                                    <span className='font-bold'>Total Questions</span>
                                    <p className='font-bold leading-7 text-xl-28 md:text-3xl'>{quizResultData?.data?.total_questions}</p>
                                </div>
                            </div>
                            <div className='flex items-center p-5 bg-p-list-box-btn rounded-xl w-full lg:w-[calc(50%-10px)] xl:w-full'>
                                <span className='mr-5 text-xl-35 md:text-xl-40'><Clock className='fill-white' /></span>
                                <div className='pl-5 text-white border-l border-solid border-border-primary'>
                                    <span className='font-bold'>Time Taken</span>
                                    <p className='font-bold leading-7 text-xl-28 md:text-3xl'>{ConvertMinutesToHours(quizResultData?.data?.time_taken)}</p>
                                </div>
                            </div>
                        </div>
                        <div className='flex gap-3 mt-auto mb-3 xl:flex-col xd:flex-col md:gap-5'>
                            {(quizResultData?.data?.is_pass && quizResultData?.data && !!quizResultData?.data?.certification_generate) && <Button className='w-full btn-primary btn-normal whitespace-nowrap' label={t('Download Certificate')} type='button' onClick={() => onDownloadCertificate()} disabled={loading} title={`${t('Download')}`} />}
                            <Button className='w-full btn-secondary btn-normal whitespace-nowrap' label={t('Continue')} type='button' onClick={() => onContinue()}  title={`${t('Continue')}`} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Index
