import React from 'react'
import { useTranslation } from 'react-i18next';
import Button from '@components/button/button';
import { ImportDoc, NewDocument } from '@components/icons/icons';

function ContractorAccount() {
    const { t } = useTranslation();

    return (
        <div>
            <h6 className='mb-5 text-center md:mb-7'>{t('Select a 3rd Party Company')}</h6>
            <div className='flex justify-center gap-5'>
                <Button type='button' label={t('Create a New Company')} className='flex flex-col items-center text-p-list-box-btn justify-center w-1/2 lg:w-1/3 max-w-[230px] p-5 border border-solid bg-p-list-box-btn-bg font-bold border-p-list-box-btn rounded-xl aspect-square' title={`${t('Create a New Company')}`} >
                    <span className='mb-4 text-4xl text-p-list-box-btn xl:text-xl-44 xl:mb-7'><NewDocument /></span>
                </Button>
                <Button type='button' label={t('Select from Exiting')} className='flex flex-col items-center justify-center w-1/2 lg:w-1/3 max-w-[230px] p-5 border border-solid border-border-primary rounded-xl aspect-square' title={`${t('Select from Exiting')}`} >
                    <span className='mb-4 text-4xl xl:text-xl-44 xl:mb-7'><ImportDoc /></span>
                </Button>
            </div>
        </div>
    )
}

export default ContractorAccount
