import Button from '@components/button/button';
import { Architecture, Manager } from '@components/icons/icons';
import { ROUTES } from '@config/constant';
import React, { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCreateNewAccountStep, setCreateNewAccountStepReset, setCustomCreateNewAccountStep } from 'src/redux/courses-management-slice';
import { setEmployeeDetails, userCreateEmployeeUserDetailsReset } from 'src/redux/user-profile-slice';

function SelectTypeOfUser() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(window.location.search);
    const employeesUserListPage = searchParams.get('employees-user-list');

    const redirectToCompanyPage = () => {
        dispatch(setCreateNewAccountStepReset());
        dispatch(userCreateEmployeeUserDetailsReset());
        dispatch(setEmployeeDetails([]));
        navigate(`/${ROUTES.app}/${ROUTES.create3rdPartyCompanyAccount}`)
    };

    const onNextPage = useCallback(() => {
        dispatch(setCreateNewAccountStep());
    }, [])

    const onBack = useCallback(() => {
        dispatch(setCreateNewAccountStepReset());
        dispatch(userCreateEmployeeUserDetailsReset());
        dispatch(setEmployeeDetails([]));
        navigate(-1);
    }, [])

    useEffect(() => {
        if (employeesUserListPage) {
            dispatch(setCustomCreateNewAccountStep(1));
        }
    }, [])

    return (
        <>
            <div>
                <h6 className='mb-5 text-center md:mb-7'>{t('Select Type Of User')}</h6>
                <div className='flex justify-center gap-5'>
                    <Button type='button' label={t('Your Employee')} onClick={() => onNextPage()} className='flex flex-col items-center text-p-list-box-btn justify-center w-1/2 lg:w-1/3 max-w-[230px] p-5 border border-solid bg-p-list-box-btn-bg font-bold border-p-list-box-btn rounded-xl aspect-square'  title={`${t('Your Employee')}`} >
                        <span className='mb-4 text-4xl text-p-list-box-btn xl:text-xl-44 xl:mb-7'><Manager /></span>
                    </Button>
                    <Button type='button' onClick={() => redirectToCompanyPage()} label={t('3rd Party Company')} className='flex flex-col items-center justify-center w-1/2 lg:w-1/3 max-w-[230px] p-5 border border-solid border-border-primary rounded-xl aspect-square'  title={`${t('3rd Party Company')}`} >
                        <span className='mb-4 text-4xl xl:text-xl-44 xl:mb-7'><Architecture /></span>
                    </Button>
                </div>
            </div>
            <div className='flex justify-between gap-5 mt-10'>
                <Button className='btn-primary btn-normal w-full md:w-[160px] whitespace-nowrap' type='button' onClick={() => onBack()} label={t('Back')}  title={`${t('Back')}`} />
                <Button className='btn-primary btn-normal w-full md:w-[160px] whitespace-nowrap' type='button' onClick={() => onNextPage()} label={t('Next')}  title={`${t('Next')}`} />
            </div>
        </>
    )
}

export default SelectTypeOfUser
