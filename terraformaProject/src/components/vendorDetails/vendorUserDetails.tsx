import { JoinedPhoneNumbersWithCode } from '@config/constant';
import React from 'react'
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

interface VendorDetailsData {
    getCompanyContractorDetails: {
        data: {
            address: string
            authorized_person: string[]
            company_name: string
            email: string[]
            industry: string
            location: string
            phone_number: string[]
            total_employees: number
            type: string
            website: string
            industry_type: string
            country_code: string[]
        }
    }
}

function VendorUserDetails() {
    const { t } = useTranslation();
    const { getCompanyContractorDetails } = useSelector((state: { tenantDetails: VendorDetailsData }) => state.tenantDetails);
    return (
        <div className='p-5 mb-5 border border-border-primary rounded-xl bg-light-blue md:mb-7'>
            {(typeof getCompanyContractorDetails === 'object' && Object.keys(getCompanyContractorDetails)?.length !== 0) && <h6 className='mb-5 leading-7'>{t(getCompanyContractorDetails?.data?.company_name)}</h6>}

            {(typeof getCompanyContractorDetails === 'object' && Object.keys(getCompanyContractorDetails)?.length !== 0) &&<div className="flex flex-wrap justify-between gap-3 lg:gap-5">
                {/* <p className='break-words w-full md:w-[calc(50%-10px)]'>{t('Industry: ')}<span className='block font-bold lg:inline-block'>{getCompanyContractorDetails?.data?.industry_type}</span></p> */}
                <p className='break-words w-full md:w-[calc(50%-10px)]'>{t('Type: ')}<span className='block font-bold lg:inline-block'>{t(getCompanyContractorDetails?.data?.type === '1' ? 'Tenant' : 'Contractor')}</span></p>
                <p className='break-words w-full md:w-[calc(50%-10px)]'>{t('Location: ')}<span className='block font-bold lg:inline-block'>{t(getCompanyContractorDetails?.data?.location)}</span></p>
                <p className='break-words w-full md:w-[calc(50%-10px)]'>{t('Contact Information: ')}<span className='block font-bold lg:inline-block'>{JoinedPhoneNumbersWithCode(getCompanyContractorDetails?.data?.phone_number, getCompanyContractorDetails?.data?.country_code)}</span></p>
                <p className='break-words w-full md:w-[calc(50%-10px)]'>{t('Authorized Person: ')}<span className='block font-bold lg:inline-block'>{t(getCompanyContractorDetails?.data?.authorized_person?.join(', '))}</span></p>
                <p className='break-words w-full md:w-[calc(50%-10px)]'>{t('Website: ')}<span className='block font-bold break-all lg:inline-block'>{t(getCompanyContractorDetails?.data?.website)}</span></p>
                <p className='break-words w-full md:w-[calc(50%-10px)]'>{t('Employees: ')}<span className='block font-bold lg:inline-block'>{getCompanyContractorDetails?.data?.total_employees}</span></p>
                <p className='break-words w-full md:w-[calc(50%-10px)]'>{t('Email ID: ')}<span className='block font-bold lg:inline-block'>{t(getCompanyContractorDetails?.data?.email?.join(', '))}</span></p>
            </div>}
        
        </div>
    )
}

export default VendorUserDetails

