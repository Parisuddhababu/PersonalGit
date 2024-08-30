import { JoinedPhoneNumbersWithCode } from '@config/constant';
import React from 'react'
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { GetCompanyTenantDetails } from 'src/types/common';

function TenantUserDetails() {
    const { t } = useTranslation();
    const { getCompanyTenantDetails } = useSelector((state: { tenantDetails: GetCompanyTenantDetails }) => state.tenantDetails);
    const getEmailData = getCompanyTenantDetails?.email?.length > 0 && getCompanyTenantDetails?.email?.join(', ')
    const authorizedPerson = getCompanyTenantDetails?.authorized_person?.length > 0 && getCompanyTenantDetails?.authorized_person?.join(', ')
    
    return (
        <div className='p-3 border border-border-primary rounded-xl bg-light-blue md:p-'>
            <h6 className='mb-3 leading-7 md:mb-5'>{getCompanyTenantDetails?.company_name}</h6>
            <div className="flex flex-wrap justify-between gap-y-3 md:gap-y-5">
                {/* <p className='w-full md:w-[calc(50%-10px)]'>{t('Industry: ')}<span className='block font-bold lg:inline-block'>{getCompanyTenantDetails?.industry_type}</span></p> */}
                <p className='w-full md:w-[calc(50%-10px)]'>{t('Type: ')}<span className='block font-bold lg:inline-block'>{getCompanyTenantDetails?.type == '1' ? 'Tenant' : 'Contractor'}</span></p>
                <p className='w-full md:w-[calc(50%-10px)]'>{t('Location: ')}<span className='block font-bold lg:inline-block'>{getCompanyTenantDetails?.location}</span></p>
                <p className='w-full md:w-[calc(50%-10px)]'>{t('Authorized Person: ')}<span className='block font-bold lg:inline-block'>{authorizedPerson}</span></p>
                <p className='w-full md:w-[calc(50%-10px)]'>{t('Contact Information: ')}<span className='block font-bold lg:inline-block'> {JoinedPhoneNumbersWithCode(getCompanyTenantDetails?.phone_number, getCompanyTenantDetails?.country_code)}</span></p>
                {getCompanyTenantDetails?.website && <p className='w-full md:w-[calc(50%-10px)]'>{t('Website: ')}<span className='block font-bold break-all lg:inline-block'>{getCompanyTenantDetails?.website}</span></p>}
                <p className='w-full md:w-[calc(50%-10px)]'>{t('Employees: ')}<span className='block font-bold lg:inline-block'>{getCompanyTenantDetails?.total_employees}</span></p>
                <p className='w-full md:w-[calc(50%-10px)]'>{t('Email ID: ')}<span className='block font-bold break-all lg:inline-block'>{getEmailData}</span></p>
           
            </div>
        </div>
    )
}

export default TenantUserDetails

