import Button from '@components/button/button'
import { ROUTES } from '@config/constant'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setCustomCreateNewAccountStep } from 'src/redux/courses-management-slice'

interface VendorUserProps {
    companyId: string | null,
    locationId: string | null,
}

function VendorUserAdd({companyId, locationId}: Readonly<VendorUserProps>) {
    const { t } = useTranslation()
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const addNewBtn = () => {
        dispatch(setCustomCreateNewAccountStep(1));
        navigate(`/${ROUTES.app}/${ROUTES.createNewAccount}/?company_uuid=${companyId}&branch_id=${locationId}&contractor-details-page=true`);
    }

    return (
        <>
            {/* Tenant User Add Component */}
            <div className='w-full lg:w-[calc(50%-10px)] h-full bg-border-secondary p-5 min-h-[227px] justify-center rounded-xl border border-solid border-border-light-blue-shade flex flex-col items-center'>
                <div className='mb-[30px]'>
                    <p className='font-bold text-center'>{t('No employees has been added yet.')}</p>
                    <p className='font-bold text-center'>{t('Please add employees by clicking Add new button.')}</p>
                </div>
                <Button className="btn btn-primary text-white whitespace-nowrap w-[160px]" label={t('Add New')} type="button" onClick={() => addNewBtn()}  title={`${t('Add New')}`} />
            </div>
        </>
    )
}

export default VendorUserAdd
