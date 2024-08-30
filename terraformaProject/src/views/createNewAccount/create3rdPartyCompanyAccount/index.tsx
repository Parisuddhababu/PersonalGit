import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { CompanyOrTenantDetailsType, Step } from 'src/types/common';
import Stepper from '@components/stepper/Stepper'
import AuthorizedPersonDetails from '@components/createNewAccount/create3rdPartyCompany/authorizedPersonDetails';
import CompanyOrTenantDetails from '@components/createNewAccount/create3rdPartyCompany/companyOrTenantDetails';
import ReviewDetails from '@components/createNewAccount/create3rdPartyCompany/reviewDetails';
import Select3rdPartyCompany from '@components/createNewAccount/create3rdPartyCompany/select3rdPartyCompany';
import Logo from '@assets/images/logo.png';
import TanantAccountImg from '@assets/images/tanant-account.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { setCreateNewCompany, setCreateNewContractor, setCreateTenantDetails, setResetAllUserData, userCompanyType } from 'src/redux/user-profile-slice';
import { setCustomCreateNewAccountStep, setResetAllCoursesData } from 'src/redux/courses-management-slice';
import Button from '@components/button/button';
import { Cross2 } from '@components/icons/icons';
import { setResetAllTenantData } from 'src/redux/tenant-management-slice';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@config/constant';

function Index() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [onHomePage, setOnHomePage] = useState<boolean>(false);
    const queryParams = new URLSearchParams(location.search);
    const editTenantCompany = queryParams.get('edit-tenant-company');
    const editContractorCompany = queryParams.get('edit-contractor-company');
    const createTenantCompany = queryParams.get('tenant-company-list');
    const createContractorCompany = queryParams.get('contractor-company-list');
    const { companyType, createNewCompany, createNewContractor } = useSelector((state: { userProfile: CompanyOrTenantDetailsType }) => state.userProfile);
    const pageTitle = companyType === 1 ? 'Tenant' : 'Contractor';
    const companyTitle = `Company/${pageTitle} Details`;

    useEffect(() => {
        if ((editTenantCompany || createTenantCompany) && (!companyType && !createNewCompany)) {
            dispatch(userCompanyType(1));
            dispatch(setCreateNewCompany(true))
            dispatch(setCustomCreateNewAccountStep(1))
        }
    }, [editTenantCompany, createTenantCompany, companyType, createNewCompany])

    useEffect(() => {
        if ((!!editContractorCompany || createContractorCompany) && (!companyType && !createNewContractor)) {
            dispatch(userCompanyType(2));
            dispatch(setCreateNewContractor(true))
            dispatch(setCustomCreateNewAccountStep(1))
        }
    }, [editContractorCompany, companyType, createNewCompany, createContractorCompany])

    const onHome = useCallback(() => {
        setOnHomePage(true);
    }, []);

    const onCancelBtn = useCallback(() => {
        setOnHomePage(false);
    }, [])

    const steps: Step[] = (editTenantCompany || editContractorCompany) ? [
        { title: `${t('Select a 3rd Party Company User')}`, content: <Select3rdPartyCompany /> },
        { title: `${t(companyTitle)}`, content: <CompanyOrTenantDetails /> },
        { title: `${t('Authorized Person Details')}`, content: <AuthorizedPersonDetails /> },
        { title: `${t('Review Details')}`, content: <ReviewDetails /> },
    ] : [
        { title: `${t('Select a 3rd Party Company User')}`, content: <Select3rdPartyCompany /> },
        { title: `${t(companyTitle)}`, content: <CompanyOrTenantDetails /> },
        { title: `${t('Review Details')}`, content: <ReviewDetails /> },
    ]

    const onHomeBtn = useCallback(() => {
        setOnHomePage(false);
        dispatch(setResetAllTenantData());
        dispatch(setResetAllCoursesData());
        dispatch(setCreateTenantDetails([]));
        dispatch(setResetAllUserData());
        navigate(`/${ROUTES.app}/${ROUTES.dashboard}`)
    }, []);

    useEffect(() => {
        return () => {
            dispatch(setResetAllTenantData());
            dispatch(setResetAllCoursesData());
            dispatch(setCreateTenantDetails([]));
            dispatch(setResetAllUserData());
        }
    }, [])

    return (
        <div className='flex w-full h-screen overflow-auto bg-white nm'>
            <img className='hidden object-cover md:block md:w-1/2' src={TanantAccountImg} alt='Create Account Img' />

            <div className='flex flex-col w-full overflow-auto py-7 lg:pt-12 px-7 md:w-1/2 xl:px-12'>
                <div className='flex flex-wrap items-center justify-between w-full mb-5 gap-y-2 gap-x-5'>
                    <img className='max-w-[226px] w-full' src={Logo} alt="logo" />
                    <Button className='btn-primary btn-normal w-[100px] whitespace-nowrap' type='button' onClick={() => onHome()} label={t('Home')} title={`${t('Home')}`} />
                </div>
                <h1 className='mb-5 text-center text-primary lg:mb-7'>{t(`Create ${pageTitle} Account`)}</h1>
                <Stepper steps={steps} createYourContent={false} dynamicWidth={(editTenantCompany || editContractorCompany) ? 'w-1/4' : 'w-1/3'} />
            </div>

            {onHomePage && (
                <div id='defaultModal' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`fixed top-0 left-0 right-0 z-50 h-full bg-modal modal ${onHomePage ? '' : 'hidden'}`}>
                    <div id='changeUserStatusModel' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`py-5 flex items-center justify-center h-full ${onHomePage ? '' : 'opacity-0 transform -translate-y-full scale-150 '}  transition-all duration-300 `}>
                        <div className='w-full mx-5 sm:max-w-[640px]'>
                            <div className='relative p-5 text-center bg-white shadow rounded-xl md:p-7'>
                                <div className='flex justify-center mb-5'><span className='p-[22px] md:p-[26px] rounded-full bg-error text-xl-35 md:text-5xl'><Cross2 className='stroke-2 fill-white' /></span></div>
                                <h6 className='mb-6 font-bold leading-normal text-center md:mb-10'>{t('Uh-oh! It looks like you might lose your data. Are you sure you want to proceed? Just hit the "Okay" button to confirm.')}</h6>
                                <div className='flex items-center justify-center space-x-5 md:flex-row'>
                                    <Button className='btn-primary btn-normal w-full md:w-auto md:min-w-[160px]' type='button' label={'Okay'} onClick={() => onHomeBtn()} title={`${t('Okay')}`}/>
                                    <Button className='btn-secondary btn-normal w-full md:w-auto md:min-w-[160px]' label={t('Cancel')} onClick={onCancelBtn} title={`${t('Cancel')}`}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Index