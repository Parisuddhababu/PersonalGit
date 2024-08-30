import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setBackCreateNewAccountStep, setCreateNewAccountStep } from 'src/redux/courses-management-slice';
import { Step } from 'src/types/common';
import Button from '@components/button/button';
import Stepper from '@components/stepper/Stepper'
import AuthorizedPersonDetails from '@components/createNewAccount/create3rdPartyCompany/authorizedPersonDetails';
import ReviewDetails from '@components/createNewAccount/create3rdPartyCompany/reviewDetails';
import Logo from '@assets/images/logo.png';
import ContractorAccountImg from '@assets/images/contractor-account.jpg';
import ContractorAccount from '@components/createNewAccount/contractor/contractorAccount';
import CompanyOrContractorDetails from '@components/createNewAccount/contractor/companyOrContractorDetails';

function Index() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    
    const steps: Step[] = [
		{ title: `${t('Select a 3rd Party Company User')}`, content: <ContractorAccount /> },
		{ title: `${t('Company/Contractor Details')}`, content: <CompanyOrContractorDetails /> },
		{ title: `${t('Authorized Person Details')}`, content: <AuthorizedPersonDetails /> },
		{ title: `${t('Review Details')}`, content: <ReviewDetails /> },
	];

    const onNextPage = useCallback(() => {
        dispatch(setCreateNewAccountStep());
    }, [])

    const onBackPage = useCallback(() => {
        dispatch(setBackCreateNewAccountStep());
    }, [])

    return (
        <div className='flex w-full h-screen overflow-auto bg-white nm'>
            <img className='hidden object-cover md:block md:w-1/2' src={ContractorAccountImg} alt='Create Account Img' />

            <div className='flex flex-col w-full overflow-auto py-7 lg:pt-12 px-7 md:w-1/2 xl:px-12'>
                <img className='max-w-[226px] mb-5 w-full' src={Logo} alt="logo" />
                <h1 className='mb-5 text-center text-primary lg:mb-7'>{t('Create Contractor Account')}</h1>
                <Stepper steps={steps} createYourContent={false} dynamicWidth='w-1/4'/>

                <div className='flex justify-between gap-5 mt-10'>
                    <Button className='btn-secondary btn-normal w-full md:w-[160px] whitespace-nowrap' type='button' onClick={() => onBackPage()} label={t('Back')} title={`${t('Back')}`} />
                    <Button className='btn-primary btn-normal w-full md:w-[160px] whitespace-nowrap' type='button' onClick={() => onNextPage()} label={t('Next')} title={`${t('Next')}`}/>
                </div>
            </div>
        </div>
    )
}

export default Index