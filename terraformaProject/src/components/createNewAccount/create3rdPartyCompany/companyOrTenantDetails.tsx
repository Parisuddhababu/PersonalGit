import React from 'react'
import { ImportDoc, NewDocument } from '@components/icons/icons';
import { useTranslation } from 'react-i18next';
import Button from '@components/button/button';
import { useDispatch, useSelector } from 'react-redux';
import { setCreateNewCompany, setCreateNewContractor, setSelectFromExitingCompany, setSelectFromExitingContractor } from 'src/redux/user-profile-slice';
import { CompanyOrTenantDetailsType } from 'src/types/common';
import Create3rdPartyCompanyForm from './create3rdPartyCompanyForm';
import Create3rdPartyCompanyList from './create3rdPartyCompanyList';
import { setBackCreateNewAccountStep } from 'src/redux/courses-management-slice';
import CompanyOrContractorDetails from '../contractor/companyOrContractorDetails';

function CompanyOrTenantDetails() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { createNewCompany, selectFromExitingCompany, companyType, createNewContractor, selectFromExitingContractor } = useSelector((state: { userProfile: CompanyOrTenantDetailsType }) => state.userProfile);

    const onBackPage = () => {
        if (createNewCompany) {
            return dispatch(setCreateNewCompany(false));
        }
        if (selectFromExitingCompany) {
            return dispatch(setSelectFromExitingCompany(false));
        } else {
            return dispatch(setBackCreateNewAccountStep());
        }
    }

    const onNextPage = () => {
        if (!createNewCompany && !selectFromExitingCompany) {
            dispatch(setCreateNewCompany(true));
        }
    }

    const onContractorBackPage = () => {
        if (createNewContractor) {
            return dispatch(setCreateNewContractor(false));
        }
        if (selectFromExitingContractor) {
            return dispatch(setSelectFromExitingContractor(false));
        } else {
            return dispatch(setBackCreateNewAccountStep());
        }
    }

    const onContractorNextPage = () => {
        if (!createNewContractor && !selectFromExitingContractor) {
            dispatch(setCreateNewContractor(true));
        }
    }

    return (
        <>
            {companyType === 1 &&<>
                {(!createNewCompany && !selectFromExitingCompany) && <h6 className='mb-5 text-center md:mb-7'>{t('Select a 3rd Party Company')}</h6>}
                {(!createNewCompany && !selectFromExitingCompany) && <div className='flex justify-center gap-5'>
                    <Button type='button' label={t('Create a New Company')} onClick={() => dispatch(setCreateNewCompany(true))} className='flex flex-col items-center text-p-list-box-btn justify-center w-1/2 lg:w-1/3 max-w-[230px] p-5 border border-solid bg-p-list-box-btn-bg font-bold border-p-list-box-btn rounded-xl aspect-square' title={`${t('Create a New Company')}`} >
                        <span className='mb-4 text-4xl text-p-list-box-btn xl:text-xl-44 xl:mb-7'><NewDocument /></span>
                    </Button>
                    <Button type='button' label={t('Select from Exiting')} onClick={() => dispatch(setSelectFromExitingCompany(true))} className='flex flex-col items-center justify-center w-1/2 lg:w-1/3 max-w-[230px] p-5 border border-solid border-border-primary rounded-xl aspect-square' title={`${t('Select from Exiting')}`} >
                        <span className='mb-4 text-4xl xl:text-xl-44 xl:mb-7'><ImportDoc /></span>
                    </Button>
                </div>}
                {createNewCompany && <Create3rdPartyCompanyForm />}
                {selectFromExitingCompany && <Create3rdPartyCompanyList />}
                {(!createNewCompany && !selectFromExitingCompany) && <div className='flex justify-between gap-5 mt-10'>
                    <Button className='btn-secondary btn-normal w-full md:w-[160px] whitespace-nowrap' type='button' onClick={() => onBackPage()} label={t('Back')} title={`${t('Back')}`} />
                    <Button className='btn-primary btn-normal w-full md:w-[160px] whitespace-nowrap' type='button' onClick={() => onNextPage()} label={t('Next')}  title={`${t('Next')}`} />
                </div>}
            </>}
            {companyType === 2 && <>
                {(!createNewContractor && !selectFromExitingContractor) && <h6 className='mb-5 text-center md:mb-7'>{t('Select a 3rd Party Company')}</h6>}
                {(!createNewContractor && !selectFromExitingContractor) && <div className='flex justify-center gap-5'>
                    <Button type='button' label={t('Create a New Company')} onClick={() => dispatch(setCreateNewContractor(true))} className='flex flex-col items-center text-p-list-box-btn justify-center w-1/2 lg:w-1/3 max-w-[230px] p-5 border border-solid bg-p-list-box-btn-bg font-bold border-p-list-box-btn rounded-xl aspect-square'  title={`${t('Create a New Company')}`} >
                        <span className='mb-4 text-4xl text-p-list-box-btn xl:text-xl-44 xl:mb-7'><NewDocument /></span>
                    </Button>
                    <Button type='button' label={t('Select from Exiting')} onClick={() => dispatch(setSelectFromExitingContractor(true))} className='flex flex-col items-center justify-center w-1/2 lg:w-1/3 max-w-[230px] p-5 border border-solid border-border-primary rounded-xl aspect-square' title={`${t('Select from Exiting')}`} >
                        <span className='mb-4 text-4xl xl:text-xl-44 xl:mb-7'><ImportDoc /></span>
                    </Button>
                </div>}
                {createNewContractor && <CompanyOrContractorDetails />}
                {selectFromExitingContractor && <Create3rdPartyCompanyList />}
                {(!createNewContractor && !selectFromExitingContractor) && <div className='flex justify-between gap-5 mt-10'>
                    <Button className='btn-secondary btn-normal w-full md:w-[160px] whitespace-nowrap' type='button' onClick={() => onContractorBackPage()} label={t('Back')} title={`${t('Back')}`}  />
                    <Button className='btn-primary btn-normal w-full md:w-[160px] whitespace-nowrap' type='button' onClick={() => onContractorNextPage()} label={t('Next')} title={`${t('Next')}`}  />
                </div>}
            </>}
        </>
    )
}

export default CompanyOrTenantDetails
