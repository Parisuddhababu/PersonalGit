import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next';
import Button from '@components/button/button';
import { Lender, Worker } from '@components/icons/icons';
import { useDispatch } from 'react-redux';
import { setCreateNewCompany, setCreateTenantDetails, setCreateTenantPersonalDetails, setEmployeeDetails, setSelectFromExitingCompany, userCompanyType, userCreateEmployeeUserDetailsReset } from 'src/redux/user-profile-slice';
import { setCreateNewAccountStep, setCreateNewAccountStepReset } from 'src/redux/courses-management-slice';
import { useNavigate } from 'react-router-dom';

function Select3rdPartyCompany() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onNextPage = (data: number) => {
        dispatch(setCreateNewAccountStep());
        dispatch(userCompanyType(data));
    }

    const onBack = useCallback(() => {
        dispatch(setCreateNewAccountStepReset());
        dispatch(userCreateEmployeeUserDetailsReset());
        dispatch(setEmployeeDetails([]));
        dispatch(userCompanyType(0));
        dispatch(setCreateNewCompany(false));
        dispatch(setSelectFromExitingCompany(false));
        dispatch(setCreateTenantDetails([]));
        dispatch(setCreateTenantPersonalDetails([]));
        navigate(-1)
    }, [])

    return (
        <>
            <div>
                <h6 className='mb-5 text-center md:mb-7'>{t('Create 3rd Party Company')}</h6>
                <div className='flex justify-center gap-5'>
                    <Button type='button' label={t('Tenant')} onClick={() => onNextPage(1)} className='flex flex-col items-center text-p-list-box-btn justify-center w-1/2 lg:w-1/3 max-w-[230px] p-5 border border-solid bg-p-list-box-btn-bg font-bold border-p-list-box-btn rounded-xl aspect-square'  title={`${t('Tenant')}`} >
                        <span className='mb-4 text-4xl text-p-list-box-btn xl:text-xl-44 xl:mb-7'><Lender /></span>
                    </Button>
                    <Button type='button' label={t('Contractor')} onClick={() => onNextPage(2)} className='flex flex-col items-center justify-center w-1/2 lg:w-1/3 max-w-[230px] p-5 border border-solid border-border-primary rounded-xl aspect-square' 
                    title={`${t('Contractor')}`}>
                        <span className='mb-4 text-4xl xl:text-xl-44 xl:mb-7'><Worker /></span>
                    </Button>
                </div>
            </div>
            <div className='flex justify-between gap-5 mt-10'>
                <Button className='btn-primary btn-normal w-full md:w-[160px] whitespace-nowrap' type='button' onClick={() => onBack()} label={t('Back')}  title={`${t('Back')}`} />
                <Button className='btn-primary btn-normal w-full md:w-[160px] whitespace-nowrap' type='button' onClick={() => onNextPage(1)} label={t('Next')}  title={`${t('Next')}`}  />
            </div>
        </>
    )
}

export default Select3rdPartyCompany
